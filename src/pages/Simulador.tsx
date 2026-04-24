import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Activity, UserPlus, UserMinus, Users, Baby, Heart,
  AlertTriangle, CheckCircle2, XCircle, Shield, Scale,
  FileText, Search, Crown, Info, ArrowRight, DollarSign,
  User, Plus, Trash2, Download, Skull,
} from "lucide-react";
import { toast } from "sonner";
import { FichaDNAja } from "@/components/FichaDNAja";
import jsPDF from "jspdf";

interface FamilyMember {
  id: string;
  role: string;
  label: string;
  icon: React.ElementType;
  added: boolean;
  side: "investigante" | "investigado";
  weight: number;
  sex: "M" | "F";
  custom?: boolean;
}

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: "mae", role: "Mãe Biológica", label: "Mãe", icon: Heart, added: true, side: "investigante", weight: 25, sex: "F" },
  { id: "filho", role: "Filho(a) Investigante", label: "Filho(a)", icon: Baby, added: true, side: "investigante", weight: 0, sex: "M" },
  { id: "mae_sp", role: "Mãe do Suposto Pai", label: "Avó", icon: Heart, added: false, side: "investigado", weight: 20, sex: "F" },
  { id: "pai_sp", role: "Pai do Suposto Pai", label: "Avô", icon: Crown, added: false, side: "investigado", weight: 20, sex: "M" },
  { id: "irmao", role: "Irmão do Suposto Pai", label: "Irmão", icon: Users, added: false, side: "investigado", weight: 18, sex: "M" },
  { id: "irma", role: "Irmã do Suposto Pai", label: "Irmã", icon: Users, added: false, side: "investigado", weight: 16, sex: "F" },
  { id: "filho_leg", role: "Filho Legítimo do SP", label: "Filho Legítimo", icon: Baby, added: false, side: "investigado", weight: 17, sex: "M" },
  { id: "filha_leg", role: "Filha Legítima do SP", label: "Filha Legítima", icon: Baby, added: false, side: "investigado", weight: 15, sex: "F" },
];

type StatusLevel = "green" | "yellow" | "red";

const getStatusInfo = (v: number, hasSameSex: boolean, investigadosCount: number): { level: StatusLevel; label: string; desc: string; suggestion: string } => {
  if (investigadosCount === 0) {
    return { level: "red", label: "🔴 Inviável", desc: "Nenhum parente do Suposto Pai foi adicionado.", suggestion: "Adicione parentes de 1º grau do SP (avós, irmãos ou filhos legítimos). Sem nenhum parente, considere Investigação Post Mortem (IPM)." };
  }
  if (!hasSameSex) {
    return { level: "red", label: "🔴 Inviável", desc: "Sem parente do mesmo sexo do investigante.", suggestion: "Adicione um parente do mesmo sexo (irmão/irmã, filho/filha legítimo) do suposto pai para comparação cromossômica." };
  }
  if (v <= 40) return { level: "red", label: "🔴 Inviável", desc: "Configuração insuficiente — risco de resultado inconclusivo.", suggestion: "Adicione mais parentes de 1º grau (idealmente ambos os avós paternos). Caso não existam parentes vivos, prossiga com Investigação Post Mortem (IPM)." };
  if (v <= 70) return { level: "yellow", label: "🟡 Viável Parcialmente", desc: "Configuração aceitável, mas pode ser fortalecida.", suggestion: "Adicione mais 1 parente (irmão, avô ou avó) para elevar a robustez estatística." };
  return { level: "green", label: "🟢 Viável", desc: "Configuração robusta — alta probabilidade de resultado conclusivo.", suggestion: "Configuração ideal! Prossiga com a coleta." };
};

const levelColor = (l: string) => l === "green" ? "text-success" : l === "yellow" ? "text-warning" : "text-destructive";
const levelBg = (l: string) => l === "green" ? "bg-success/10" : l === "yellow" ? "bg-warning/10" : "bg-destructive/10";
const levelBorder = (l: string) => l === "green" ? "border-success" : l === "yellow" ? "border-warning" : "border-destructive";
const levelBgSolid = (l: string) => l === "green" ? "bg-success" : l === "yellow" ? "bg-warning" : "bg-destructive";

const Simulador = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [exporting, setExporting] = useState(false);
  const [showFicha, setShowFicha] = useState(false);
  const [filhoSex, setFilhoSex] = useState<"M" | "F">("M");
  const [modalidade, setModalidade] = useState<"judicial" | "particular">("judicial");

  const toggle = (id: string) => setMembers(prev => prev.map(m => (m.id === id && m.id !== "filho" ? { ...m, added: !m.added } : m)));
  const removeMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));
  const updateFilhoSex = (sex: "M" | "F") => { setFilhoSex(sex); setMembers(prev => prev.map(m => m.id === "filho" ? { ...m, sex } : m)); };

  const addInvestigante = (role: string, sex: "M" | "F") => {
    setMembers(prev => [...prev, { id: `ivt_${Date.now()}`, role, label: role, icon: Baby, added: true, side: "investigante", weight: 0, sex, custom: true }]);
    toast.success(`${role} adicionado`);
  };
  const addInvestigado = (role: string, sex: "M" | "F") => {
    setMembers(prev => [...prev, { id: `ivd_${Date.now()}`, role, label: role, icon: Users, added: true, side: "investigado", weight: 14, sex, custom: true }]);
    toast.success(`${role} adicionado`);
  };

  const investigantes = members.filter(m => m.side === "investigante");
  const investigados = members.filter(m => m.side === "investigado");
  const addedInvestigantes = investigantes.filter(m => m.added);
  const addedInvestigados = investigados.filter(m => m.added);

  const viability = members.filter(m => m.added).reduce((acc, m) => acc + m.weight, 0);
  const capped = Math.min(viability, 100);
  const filhoSexValue = members.find(m => m.id === "filho")?.sex || "M";
  const hasSameSexRelative = addedInvestigados.some(m => m.sex === filhoSexValue);
  const statusInfo = getStatusInfo(capped, hasSameSexRelative, addedInvestigados.length);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = doc.internal.pageSize.getWidth();
      let y = 15;

      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, w, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("RECONSTITUIÇÃO GENÉTICA", w / 2, 14, { align: "center" });
      doc.setFontSize(10);
      doc.text(`GRALAB BIOMOL - DNAJA® | Modalidade: ${modalidade === "judicial" ? "JUDICIAL" : "PARTICULAR"} | Suposto Pai Falecido/Ausente`, w / 2, 22, { align: "center" });
      y = 38;

      const statusColor = statusInfo.level === "green" ? [22, 163, 74] : statusInfo.level === "yellow" ? [234, 179, 8] : [220, 38, 38];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(14, y, w - 28, 18, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text(statusInfo.label.replace(/[🟢🟡🔴]\s*/, ""), w / 2, y + 8, { align: "center" });
      doc.setFontSize(9);
      doc.text(statusInfo.desc, w / 2, y + 14, { align: "center" });
      y += 25;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.text(`Sexo do Filho(a) Investigante: ${filhoSex === "M" ? "Masculino" : "Feminino"}`, 14, y);
      y += 5;
      doc.text(`Parente do mesmo sexo presente: ${hasSameSexRelative ? "Sim" : "NÃO"}`, 14, y);
      y += 10;

      doc.setFillColor(22, 163, 74);
      doc.roundedRect(14, y, w - 28, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("INVESTIGANTES — Quem busca a resposta", 18, y + 6);
      y += 13;

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      addedInvestigantes.forEach(m => {
        doc.text(`• ${m.label} (${m.sex === "M" ? "♂ Masculino" : "♀ Feminino"})`, 18, y);
        y += 6;
      });
      y += 4;

      doc.setFillColor(37, 99, 235);
      doc.roundedRect(14, y, w - 28, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("INVESTIGADOS — Parentes de 1º grau do Suposto Pai", 18, y + 6);
      y += 13;

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      if (addedInvestigados.length === 0) {
        doc.setTextColor(150, 150, 150);
        doc.text("Nenhum parente selecionado", 18, y);
        y += 6;
      } else {
        addedInvestigados.forEach(m => {
          const sameSex = m.sex === filhoSexValue ? " ✓ mesmo sexo" : "";
          doc.text(`• ${m.label} (${m.sex === "M" ? "♂ Masculino" : "♀ Feminino"})${sameSex}`, 18, y);
          y += 6;
        });
      }
      y += 6;

      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(14, y, w - 28, 24, 2, 2, "FD");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text(`Total Investigantes: ${addedInvestigantes.length}`, 18, y + 7);
      doc.text(`Total Investigados: ${addedInvestigados.length}`, 18, y + 14);
      doc.text(`Total de Participantes: ${addedInvestigantes.length + addedInvestigados.length}`, 18, y + 21);
      y += 32;

      if (statusInfo.level !== "green") {
        doc.setFillColor(254, 249, 195);
        doc.roundedRect(14, y, w - 28, 16, 2, 2, "F");
        doc.setTextColor(120, 90, 0);
        doc.setFontSize(9);
        doc.text("Sugestão: " + statusInfo.suggestion, 18, y + 6, { maxWidth: w - 36 });
        y += 22;
      }

      const footerY = doc.internal.pageSize.getHeight() - 12;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, w / 2, footerY, { align: "center" });
      doc.text("GRALAB BIOMOL - DNAJA® | Documento informativo", w / 2, footerY + 4, { align: "center" });

      doc.save("reconstituicao-genetica.pdf");
      toast.success("PDF exportado com sucesso!");
    } catch (err) {
      toast.error("Erro ao gerar PDF");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (showFicha) {
    const fichaParticipants = [
      ...addedInvestigantes.map(m => ({ role: m.label, colorClass: "filho" })),
      ...addedInvestigados.map(m => ({ role: m.label, colorClass: "parente" })),
    ];
    return <FichaDNAja examType="reconstituicao" modality={modalidade} participants={fichaParticipants} onClose={() => setShowFicha(false)} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="h-9 w-9 text-chart-4" /> Reconstituição Genética
        </h1>
        <p className="text-lg text-muted-foreground mt-1">Suposto Pai Falecido / Ausente — Parentes em 1º Grau</p>
      </div>

      {/* Info */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-6 w-6 text-primary shrink-0" />
          <div>
            <p className="font-bold text-primary text-base">O que é Reconstituição Genética?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Processo de recompor o perfil genético de uma pessoa falecida/ausente a partir do DNA de seus parentes de 1º grau.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Regra fundamental:</strong> Ao menos um parente do <strong>mesmo sexo</strong> do filho(a) investigante.
            </p>
          </div>
        </div>
      </div>

      {/* Filho sex */}
      <Card className="border-2 border-success/30 overflow-hidden">
        <div className="bg-gradient-to-r from-success/10 to-transparent px-6 py-5">
          <div className="flex items-center gap-5 flex-wrap">
            <Label className="font-bold text-base whitespace-nowrap">Sexo do Filho(a) Investigante:</Label>
            <div className="flex gap-3">
              <Button size="lg" variant={filhoSex === "M" ? "default" : "outline"} onClick={() => updateFilhoSex("M")} className={`text-base px-6 ${filhoSex === "M" ? "bg-primary" : ""}`}>👦 Masculino</Button>
              <Button size="lg" variant={filhoSex === "F" ? "default" : "outline"} onClick={() => updateFilhoSex("F")} className={`text-base px-6 ${filhoSex === "F" ? "bg-[hsl(330,81%,60%)]" : ""}`}>👧 Feminino</Button>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">Precisa de parente {filhoSex === "M" ? "♂ masculino" : "♀ feminino"} do SP</Badge>
          </div>
        </div>
      </Card>

      {/* Two-column: Investigantes VS Investigados */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* INVESTIGANTES */}
        <Card className="border-2 border-success/40 overflow-hidden">
          <div className="bg-success/10 px-5 py-4 border-b border-success/20">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-success" />
              <div>
                <p className="font-bold text-success text-lg">INVESTIGANTES</p>
                <p className="text-sm text-muted-foreground">Quem busca a resposta — Mãe + Filho(a)</p>
              </div>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            {/* Mãe Biológica */}
            {investigantes.filter(m => m.id === "mae").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${m.added ? "border-pink-400 bg-pink-50 text-pink-700" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-4xl">💗</span>
                <div>
                  <p className="font-bold text-base">Mãe Biológica</p>
                  <p className="text-sm text-muted-foreground">{m.added ? "✓ Incluída na análise" : "Clique para incluir"}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-sm border-success text-success px-3 py-1">Investigante</Badge>
              </button>
            ))}

            {/* Filho(a) principal */}
            {investigantes.filter(m => m.id === "filho").map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-success bg-success/10 p-5 flex items-center gap-4">
                <span className="text-4xl">{filhoSex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-bold text-base text-success">Filho(a) Investigante</p>
                  <p className="text-sm text-muted-foreground">Participante principal — {filhoSex === "M" ? "Masculino ♂" : "Feminino ♀"}</p>
                </div>
                <Badge className="ml-auto bg-success text-white text-sm px-3 py-1">Principal</Badge>
              </div>
            ))}

            {/* Filhos adicionais */}
            {investigantes.filter(m => m.custom).map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-success/60 bg-success/5 p-4 flex items-center gap-4">
                <span className="text-3xl">{m.sex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-bold text-sm">{m.label}</p>
                  <p className="text-sm text-muted-foreground">{m.sex === "M" ? "Masculino ♂" : "Feminino ♀"}</p>
                </div>
                <button onClick={() => removeMember(m.id)} className="ml-auto text-destructive hover:text-destructive/80">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            {/* Add more */}
            <div className="pt-3 border-t border-dashed border-success/20">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">➕ Adicionar filho(a) investigante:</p>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="border-success/40 text-success hover:bg-success/10 flex-1 text-base" onClick={() => addInvestigante(`Filho ${investigantes.filter(m => m.custom).length + 2}`, "M")}>
                  <Plus className="mr-2 h-5 w-5" /> Filho ♂
                </Button>
                <Button variant="outline" size="lg" className="border-success/40 text-success hover:bg-success/10 flex-1 text-base" onClick={() => addInvestigante(`Filha ${investigantes.filter(m => m.custom).length + 2}`, "F")}>
                  <Plus className="mr-2 h-5 w-5" /> Filha ♀
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VS Divider */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-2">
          <div className="w-0.5 flex-1 bg-border" />
          <div className="rounded-full bg-muted border-2 border-border px-4 py-3">
            <span className="text-sm font-bold text-muted-foreground">VS</span>
          </div>
          <div className="w-0.5 flex-1 bg-border" />
        </div>
        <div className="lg:hidden flex items-center gap-2 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border">VS</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* INVESTIGADOS */}
        <Card className="border-2 border-primary/40 overflow-hidden">
          <div className="bg-primary/10 px-5 py-4 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="font-bold text-primary text-lg">INVESTIGADOS</p>
                <p className="text-sm text-muted-foreground">Parentes em 1º grau do Suposto Pai (falecido/ausente)</p>
              </div>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            {/* Suposto Pai */}
            <div className="w-full rounded-xl border-2 border-dashed border-muted-foreground/40 bg-muted/30 p-5 flex items-center gap-4">
              <span className="text-4xl">👤</span>
              <div>
                <p className="font-bold text-base text-muted-foreground">Suposto Pai</p>
                <p className="text-sm text-muted-foreground">DNA será reconstituído pelos parentes abaixo</p>
              </div>
              <Badge variant="destructive" className="ml-auto text-sm px-3 py-1">Falecido / Ausente</Badge>
            </div>

            <Separator className="my-2" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Avós Paternos</p>

            {investigados.filter(m => m.id === "pai_sp" || m.id === "mae_sp").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${m.added ? "border-amber-400 bg-amber-50 text-amber-700" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-3xl">{m.sex === "M" ? "👴" : "👵"}</span>
                <div>
                  <p className="font-bold text-sm">{m.role}</p>
                  <p className="text-sm text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-sm text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mt-3">Irmãos do Suposto Pai</p>

            {investigados.filter(m => m.id === "irmao" || m.id === "irma").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${m.added ? "border-primary bg-primary/10 text-primary" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-3xl">{m.sex === "M" ? "👨" : "👩"}</span>
                <div>
                  <p className="font-bold text-sm">{m.role}</p>
                  <p className="text-sm text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-sm text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            {/* Custom investigados */}
            {investigados.filter(m => m.custom).map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-primary/60 bg-primary/5 p-4 flex items-center gap-4">
                <span className="text-3xl">{m.sex === "M" ? "👨" : "👩"}</span>
                <div>
                  <p className="font-bold text-sm">{m.label}</p>
                  <p className="text-sm text-muted-foreground">{m.sex === "M" ? "♂" : "♀"} — Parente do SP</p>
                </div>
                <button onClick={() => removeMember(m.id)} className="ml-auto text-destructive hover:text-destructive/80">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mt-3">Filhos Legítimos do SP</p>

            {investigados.filter(m => m.id === "filho_leg" || m.id === "filha_leg").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] flex items-center gap-4 ${m.added ? "border-primary bg-primary/10 text-primary" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-3xl">{m.sex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-bold text-sm">{m.role}</p>
                  <p className="text-sm text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-sm text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            {/* Add more */}
            <div className="pt-3 border-t border-dashed border-primary/20 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-semibold">➕ Adicionar Irmão/Irmã do Suposto Pai:</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 flex-1 text-base" onClick={() => addInvestigado(`Irmão ${investigados.filter(m => m.custom && m.label.startsWith("Irmão")).length + 2}`, "M")}>
                    <Plus className="mr-2 h-5 w-5" /> Irmão ♂
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10 flex-1 text-base" onClick={() => addInvestigado(`Irmã ${investigados.filter(m => m.custom && m.label.startsWith("Irmã")).length + 2}`, "F")}>
                    <Plus className="mr-2 h-5 w-5" /> Irmã ♀
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-semibold">➕ Adicionar Filho(a) Legítimo do Suposto Pai:</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="border-amber-500/40 text-amber-600 hover:bg-amber-50 flex-1 text-base" onClick={() => addInvestigado(`Filho Legítimo ${investigados.filter(m => m.custom && m.label.startsWith("Filho Legítimo")).length + 2}`, "M")}>
                    <Plus className="mr-2 h-5 w-5" /> Filho Legítimo ♂
                  </Button>
                  <Button variant="outline" size="lg" className="border-amber-500/40 text-amber-600 hover:bg-amber-50 flex-1 text-base" onClick={() => addInvestigado(`Filha Legítima ${investigados.filter(m => m.custom && m.label.startsWith("Filha Legítima")).length + 2}`, "F")}>
                    <Plus className="mr-2 h-5 w-5" /> Filha Legítima ♀
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status + Selected + Action */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Traffic Light */}
        <Card className={`border-2 ${levelBorder(statusInfo.level)} overflow-hidden`}>
          <div className={`${levelBg(statusInfo.level)} p-6 text-center`}>
            <span className="text-6xl">{statusInfo.level === "green" ? "🟢" : statusInfo.level === "yellow" ? "🟡" : "🔴"}</span>
            <p className={`mt-3 font-bold text-lg ${levelColor(statusInfo.level)}`}>{statusInfo.label}</p>
          </div>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground">{statusInfo.desc}</p>
            {statusInfo.level !== "green" && (
              <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                <p className="text-sm font-bold text-success mb-1">💡 Como tornar Verde:</p>
                <p className="text-sm text-muted-foreground">{statusInfo.suggestion}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Participantes Selecionados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {addedInvestigantes.length > 0 && (
              <p className="text-sm font-bold text-success uppercase tracking-wide">Investigantes</p>
            )}
            {addedInvestigantes.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-success" />
                  {m.label} ({m.sex === "M" ? "♂" : "♀"})
                </span>
                <Badge variant="outline" className="text-xs border-success text-success">Investigante</Badge>
              </div>
            ))}
            {addedInvestigados.length > 0 && (
              <p className="text-sm font-bold text-primary uppercase tracking-wide mt-3">Investigados</p>
            )}
            {addedInvestigados.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${m.sex === filhoSexValue ? "bg-success" : "bg-primary"}`} />
                  {m.label} ({m.sex === "M" ? "♂" : "♀"})
                  {m.sex === filhoSexValue && <span className="text-xs text-success">✓</span>}
                </span>
                <Badge variant="outline" className="text-xs border-primary text-primary">Investigado</Badge>
              </div>
            ))}
            {addedInvestigados.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">Selecione parentes do SP ao lado</p>}
          </CardContent>
        </Card>

        {/* Action */}
        <div className="flex flex-col justify-between gap-4">
          <Card className="flex-1">
            <CardContent className="p-5 space-y-4">
              <p className="text-base font-bold">Resumo</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Investigantes:</span>
                <span className="font-bold text-success text-base">{addedInvestigantes.length}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Investigados:</span>
                <span className="font-bold text-primary text-base">{addedInvestigados.length}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total participantes:</span>
                <span className="font-bold text-base">{addedInvestigantes.length + addedInvestigados.length}</span>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" /> Modalidade do Exame
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModalidade("judicial")}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                      modalidade === "judicial"
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    ⚖️ Judicial
                  </button>
                  <button
                    onClick={() => setModalidade("particular")}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                      modalidade === "particular"
                        ? "border-amber-500 bg-amber-500 text-white shadow-md"
                        : "border-border bg-background text-muted-foreground hover:border-amber-400/40 hover:bg-amber-50"
                    }`}
                  >
                    📋 Particular
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full bg-success hover:bg-success/90 text-white text-base" onClick={() => setShowFicha(true)}>
            <ArrowRight className="mr-2 h-5 w-5" /> Abrir Ficha ({modalidade === "judicial" ? "Judicial" : "Particular"})
          </Button>
          <Button variant="outline" size="lg" className="w-full text-base" onClick={exportPDF} disabled={exporting}>
            <Download className="mr-2 h-5 w-5" /> {exporting ? "Gerando PDF..." : "Exportar PDF"}
          </Button>
        </div>
      </div>

      {/* Same-sex warning */}
      {addedInvestigados.length > 0 && !hasSameSexRelative && (
        <div className="flex items-start gap-4 rounded-xl border-2 border-destructive bg-destructive/5 p-5">
          <AlertTriangle className="h-8 w-8 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-destructive text-lg">⚠️ ALERTA: Nenhum parente do mesmo sexo</p>
            <p className="text-base text-muted-foreground mt-1">
              O investigante é <strong>{filhoSex === "M" ? "masculino" : "feminino"}</strong>. Adicione um parente <strong>{filhoSex === "M" ? "♂ masculino" : "♀ feminino"}</strong> do suposto pai.
            </p>
          </div>
        </div>
      )}

      {/* Reference Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3"><Scale className="h-6 w-6 text-primary" /> Tabela de Configurações</CardTitle>
          <CardDescription className="text-sm">Estimativa por cenário familiar — sem percentuais, apenas status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 pr-4 text-left font-bold text-base">Configuração</th>
                  <th className="py-3 pr-4 text-left font-bold text-base">Status</th>
                  <th className="py-3 text-left font-bold text-base">Observação</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { config: "Mãe + Filho + Avós Paternos (Pai e Mãe do SP)", level: "green" as const, obs: "Padrão Ouro. Avós possuem carga genética completa." },
                  { config: "Mãe + Filho + 3+ Irmãos Germanos", level: "green" as const, obs: "Alta robustez estatística." },
                  { config: "Mãe + Filho + Avó + 1 Irmão (mesmo sexo)", level: "green" as const, obs: "Cromossomo X/Y compartilhado reforça vínculo." },
                  { config: "Mãe + Filho + 2 Irmãos (um do mesmo sexo)", level: "green" as const, obs: "Boa configuração." },
                  { config: "Mãe + Filho + 1 Irmão do mesmo sexo", level: "yellow" as const, obs: "Zona Cinzenta alta. Pode necessitar ampliação." },
                  { config: "Mãe + Filho + 1 Irmão do sexo oposto", level: "yellow" as const, obs: "Sem cromossomo sexual compartilhado." },
                  { config: "Mãe + Filho + Apenas Filhos Legítimos", level: "yellow" as const, obs: "Depende do sexo do filho legítimo." },
                  { config: "Filho + Irmãos (SEM a Mãe)", level: "red" as const, obs: "Ausência do DNA materno dificulta triagem." },
                  { config: "Apenas 1 Progenitor (só Avô ou só Avó)", level: "red" as const, obs: "Falta metade da carga genética do SP." },
                  { config: "Nenhum parente do mesmo sexo", level: "red" as const, obs: "Regra crítica: cromossomos sexuais não confirmam." },
                ].map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${levelBg(row.level)}`}>
                    <td className="py-3 pr-4 font-medium">{row.config}</td>
                    <td className="py-3 pr-4">
                      <Badge className={`${levelBgSolid(row.level)} text-white`}>
                        {row.level === "green" ? "🟢 Viável" : row.level === "yellow" ? "🟡 Cinzenta" : "🔴 Inviável"}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground text-sm">{row.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Notes */}
      <Card>
        <CardHeader><CardTitle className="text-xl flex items-center gap-3"><Info className="h-6 w-6 text-info" /> Orientações Estratégicas</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-base">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-bold text-base">Regra do Mesmo Sexo</p>
            <p className="text-muted-foreground text-sm mt-1">Pelo menos um parente do suposto pai deve ser do mesmo sexo do filho(a) investigante para comparação dos cromossomos sexuais (X/Y).</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-bold text-base">Efeito Bayes & Painel NGS</p>
            <p className="text-muted-foreground text-sm mt-1">Painéis de 47+ marcadores (NGS) elevam o LR. Quando na Zona Cinzenta, solicitar ampliação.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Simulador;
