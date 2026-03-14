import { useState } from "react";
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
  User, Plus, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { FichaDNAja } from "@/components/FichaDNAja";

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
  if (!hasSameSex && investigadosCount > 0) {
    return { level: "red", label: "🔴 Configuração Inviável", desc: "Sem parente do mesmo sexo do investigante.", suggestion: "Adicione um parente do mesmo sexo (irmão/irmã, filho/filha legítimo) do suposto pai para comparação cromossômica." };
  }
  if (v <= 40) return { level: "red", label: "🔴 Configuração Fraca", desc: "Alto risco de resultado inconclusivo.", suggestion: "Adicione mais parentes de 1º grau. Ideal: ambos os avós paternos (Mãe + Pai do SP) para atingir Padrão Ouro." };
  if (v <= 60) return { level: "yellow", label: "🟡 Zona Cinzenta", desc: "Pode gerar resultado inconclusivo (80-95%).", suggestion: "Inclua a mãe biológica e mais 1 parente do mesmo sexo do investigante para fortalecer a configuração." };
  if (v <= 80) return { level: "yellow", label: "🟡 Viável com Ressalvas", desc: "Boa configuração, mas pode ser fortalecida.", suggestion: "Adicione mais 1 parente (irmão, avô ou avó) para elevar a robustez estatística e garantir resultado conclusivo." };
  return { level: "green", label: "🟢 Alta Viabilidade", desc: "Configuração robusta — alta probabilidade de resultado conclusivo.", suggestion: "Configuração ideal! Prossiga com a coleta." };
};

const levelColor = (l: string) => l === "green" ? "text-success" : l === "yellow" ? "text-warning" : "text-destructive";
const levelBg = (l: string) => l === "green" ? "bg-success/10" : l === "yellow" ? "bg-warning/10" : "bg-destructive/10";
const levelBorder = (l: string) => l === "green" ? "border-success" : l === "yellow" ? "border-warning" : "border-destructive";
const levelBgSolid = (l: string) => l === "green" ? "bg-success" : l === "yellow" ? "bg-warning" : "bg-destructive";

const Simulador = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showFicha, setShowFicha] = useState(false);
  const [filhoSex, setFilhoSex] = useState<"M" | "F">("M");

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

  if (showFicha) {
    const fichaParticipants = [
      ...addedInvestigantes.map(m => ({ role: m.label, colorClass: "filho" })),
      ...addedInvestigados.map(m => ({ role: m.label, colorClass: "parente" })),
    ];
    return <FichaDNAja examType="reconstituicao" modality="judicial" participants={fichaParticipants} onClose={() => setShowFicha(false)} />;
  }

  // Color map for tree nodes
  const nodeColor = (m: FamilyMember) => {
    if (m.id === "filho") return "border-success bg-success/10 text-success";
    if (m.id === "mae") return "border-pink-400 bg-pink-50 text-pink-600";
    if (m.side === "investigado") {
      if (m.id === "mae_sp" || m.id === "pai_sp") return "border-amber-400 bg-amber-50 text-amber-600";
      return "border-primary bg-primary/10 text-primary";
    }
    return "border-muted-foreground bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-chart-4" /> Reconstituição Genética
        </h1>
        <p className="text-muted-foreground">Suposto Pai Falecido / Ausente — Parentes em 1º Grau</p>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-primary text-sm">O que é Reconstituição Genética?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Processo de recompor o perfil genético de uma pessoa falecida/ausente a partir do DNA de seus parentes de 1º grau.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Regra fundamental:</strong> Ao menos um parente do <strong>mesmo sexo</strong> do filho(a) investigante.
            </p>
          </div>
        </div>
      </div>

      {/* Filho sex */}
      <Card className="border-success/20 overflow-hidden">
        <div className="bg-gradient-to-r from-success/10 to-transparent px-5 py-3">
          <div className="flex items-center gap-4 flex-wrap">
            <Label className="font-semibold text-sm whitespace-nowrap">Sexo do Filho(a) Investigante:</Label>
            <div className="flex gap-2">
              <Button size="sm" variant={filhoSex === "M" ? "default" : "outline"} onClick={() => updateFilhoSex("M")} className={filhoSex === "M" ? "bg-primary" : ""}>👦 Masculino</Button>
              <Button size="sm" variant={filhoSex === "F" ? "default" : "outline"} onClick={() => updateFilhoSex("F")} className={filhoSex === "F" ? "bg-[hsl(330,81%,60%)]" : ""}>👧 Feminino</Button>
            </div>
            <Badge variant="outline" className="text-xs">Precisa de parente {filhoSex === "M" ? "♂ masculino" : "♀ feminino"} do SP</Badge>
          </div>
        </div>
      </Card>

      {/* Two-column: Investigantes VS Investigados */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* INVESTIGANTES — quem busca a resposta */}
        <Card className="border-2 border-success/40 overflow-hidden">
          <div className="bg-success/10 px-4 py-3 border-b border-success/20">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-success" />
              <div>
                <p className="font-bold text-success text-sm">INVESTIGANTES</p>
                <p className="text-[10px] text-muted-foreground">Quem busca a resposta — Mãe + Filho(a)</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            {/* Mãe Biológica */}
            {investigantes.filter(m => m.id === "mae").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${m.added ? "border-pink-400 bg-pink-50 text-pink-700" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-2xl">💗</span>
                <div>
                  <p className="font-semibold text-sm">Mãe Biológica</p>
                  <p className="text-[10px] text-muted-foreground">{m.added ? "✓ Incluída na análise" : "Clique para incluir"}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-[10px] border-success text-success">Investigante</Badge>
              </button>
            ))}

            {/* Filho(a) Investigante principal */}
            {investigantes.filter(m => m.id === "filho").map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-success bg-success/10 p-4 flex items-center gap-3">
                <span className="text-2xl">{filhoSex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-semibold text-sm text-success">Filho(a) Investigante</p>
                  <p className="text-[10px] text-muted-foreground">Participante principal — {filhoSex === "M" ? "Masculino ♂" : "Feminino ♀"}</p>
                </div>
                <Badge className="ml-auto bg-success text-white text-[10px]">Principal</Badge>
              </div>
            ))}

            {/* Filhos investigantes adicionais */}
            {investigantes.filter(m => m.custom).map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-success/60 bg-success/5 p-3 flex items-center gap-3">
                <span className="text-xl">{m.sex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-semibold text-xs">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.sex === "M" ? "Masculino ♂" : "Feminino ♀"}</p>
                </div>
                <button onClick={() => removeMember(m.id)} className="ml-auto text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Add more investigante children */}
            <div className="pt-2 border-t border-dashed border-success/20">
              <p className="text-[10px] text-muted-foreground mb-2 font-semibold">➕ Adicionar filho(a) investigante:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-success/40 text-success hover:bg-success/10 flex-1" onClick={() => addInvestigante(`Filho ${investigantes.filter(m => m.custom).length + 2}`, "M")}>
                  <Plus className="mr-1 h-3 w-3" /> Filho ♂
                </Button>
                <Button variant="outline" size="sm" className="border-success/40 text-success hover:bg-success/10 flex-1" onClick={() => addInvestigante(`Filha ${investigantes.filter(m => m.custom).length + 2}`, "F")}>
                  <Plus className="mr-1 h-3 w-3" /> Filha ♀
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VS Divider */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-2">
          <div className="w-0.5 flex-1 bg-border" />
          <div className="rounded-full bg-muted border-2 border-border px-3 py-2">
            <span className="text-xs font-bold text-muted-foreground">VS</span>
          </div>
          <div className="w-0.5 flex-1 bg-border" />
        </div>
        <div className="lg:hidden flex items-center gap-2 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border">VS</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* INVESTIGADOS — parentes do suposto pai */}
        <Card className="border-2 border-primary/40 overflow-hidden">
          <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-primary text-sm">INVESTIGADOS</p>
                <p className="text-[10px] text-muted-foreground">Parentes em 1º grau do Suposto Pai (falecido/ausente)</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            {/* Suposto Pai (falecido) */}
            <div className="w-full rounded-xl border-2 border-dashed border-muted-foreground/40 bg-muted/30 p-4 flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Suposto Pai</p>
                <p className="text-[10px] text-muted-foreground">DNA será reconstituído pelos parentes abaixo</p>
              </div>
              <Badge variant="destructive" className="ml-auto text-[10px]">Falecido / Ausente</Badge>
            </div>

            <Separator className="my-1" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Avós Paternos</p>

            {/* Avós */}
            {investigados.filter(m => m.id === "pai_sp" || m.id === "mae_sp").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${m.added ? "border-amber-400 bg-amber-50 text-amber-700" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-xl">{m.sex === "M" ? "👴" : "👵"}</span>
                <div>
                  <p className="font-semibold text-xs">{m.role}</p>
                  <p className="text-[10px] text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-[10px] text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-2">Irmãos do Suposto Pai</p>

            {/* Irmãos */}
            {investigados.filter(m => m.id === "irmao" || m.id === "irma").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${m.added ? "border-primary bg-primary/10 text-primary" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-xl">{m.sex === "M" ? "👨" : "👩"}</span>
                <div>
                  <p className="font-semibold text-xs">{m.role}</p>
                  <p className="text-[10px] text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-[10px] text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            {/* Custom investigados */}
            {investigados.filter(m => m.custom).map(m => (
              <div key={m.id} className="w-full rounded-xl border-2 border-primary/60 bg-primary/5 p-3 flex items-center gap-3">
                <span className="text-xl">{m.sex === "M" ? "👨" : "👩"}</span>
                <div>
                  <p className="font-semibold text-xs">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.sex === "M" ? "♂" : "♀"} — Parente do SP</p>
                </div>
                <button onClick={() => removeMember(m.id)} className="ml-auto text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-2">Filhos Legítimos do SP</p>

            {/* Filhos legítimos */}
            {investigados.filter(m => m.id === "filho_leg" || m.id === "filha_leg").map(m => (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${m.added ? "border-primary bg-primary/10 text-primary" : "border-dashed border-muted-foreground/30 opacity-50"}`}>
                <span className="text-xl">{m.sex === "M" ? "👦" : "👧"}</span>
                <div>
                  <p className="font-semibold text-xs">{m.role}</p>
                  <p className="text-[10px] text-muted-foreground">{m.added ? "✓ Incluído" : "Clique para incluir"}</p>
                </div>
                {m.added && m.sex === filhoSexValue && <span className="ml-auto text-[10px] text-success font-bold">✓ mesmo sexo</span>}
              </button>
            ))}

            {/* Add more investigados */}
            <div className="pt-2 border-t border-dashed border-primary/20">
              <p className="text-[10px] text-muted-foreground mb-2 font-semibold">➕ Adicionar parente do SP:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 flex-1" onClick={() => addInvestigado("Irmão 2", "M")}>
                  <Plus className="mr-1 h-3 w-3" /> Irmão ♂
                </Button>
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 flex-1" onClick={() => addInvestigado("Irmã 2", "F")}>
                  <Plus className="mr-1 h-3 w-3" /> Irmã ♀
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status + Selected + Action row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Traffic Light Status */}
        <Card className={`border-2 ${levelBorder(statusInfo.level)} overflow-hidden`}>
          <div className={`${levelBg(statusInfo.level)} p-5 text-center`}>
            <span className="text-5xl">{statusInfo.level === "green" ? "🟢" : statusInfo.level === "yellow" ? "🟡" : "🔴"}</span>
            <p className={`mt-2 font-bold ${levelColor(statusInfo.level)}`}>{statusInfo.label}</p>
          </div>
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground">{statusInfo.desc}</p>
            {statusInfo.level !== "green" && (
              <div className="rounded-lg border border-success/30 bg-success/5 p-2">
                <p className="text-[10px] font-bold text-success mb-1">💡 Como tornar Verde:</p>
                <p className="text-[10px] text-muted-foreground">{statusInfo.suggestion}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected members summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Participantes Selecionados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {addedInvestigantes.length > 0 && (
              <p className="text-[10px] font-bold text-success uppercase tracking-wide">Investigantes</p>
            )}
            {addedInvestigantes.map(m => (
              <div key={m.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  {m.label} ({m.sex === "M" ? "♂" : "♀"})
                </span>
                <Badge variant="outline" className="text-[9px] border-success text-success px-1">Investigante</Badge>
              </div>
            ))}
            {addedInvestigados.length > 0 && (
              <p className="text-[10px] font-bold text-primary uppercase tracking-wide mt-2">Investigados</p>
            )}
            {addedInvestigados.map(m => (
              <div key={m.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${m.sex === filhoSexValue ? "bg-success" : "bg-primary"}`} />
                  {m.label} ({m.sex === "M" ? "♂" : "♀"})
                  {m.sex === filhoSexValue && <span className="text-[9px] text-success">✓</span>}
                </span>
                <Badge variant="outline" className="text-[9px] border-primary text-primary px-1">Investigado</Badge>
              </div>
            ))}
            {addedInvestigados.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-2">Selecione parentes do SP ao lado</p>}
          </CardContent>
        </Card>

        {/* Action */}
        <div className="flex flex-col justify-between gap-3">
          <Card className="flex-1">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold">Resumo</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Investigantes:</span>
                <span className="font-bold text-success">{addedInvestigantes.length}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Investigados:</span>
                <span className="font-bold text-primary">{addedInvestigados.length}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total participantes:</span>
                <span className="font-bold">{addedInvestigantes.length + addedInvestigados.length}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full bg-success hover:bg-success/90 text-white" onClick={() => setShowFicha(true)}>
            <ArrowRight className="mr-2 h-4 w-4" /> Abrir Ficha de Cadastro
          </Button>
        </div>
      </div>

      {/* Same-sex warning */}
      {addedInvestigados.length > 0 && !hasSameSexRelative && (
        <div className="flex items-start gap-3 rounded-lg border-2 border-destructive bg-destructive/5 p-4">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-destructive">⚠️ ALERTA: Nenhum parente do mesmo sexo</p>
            <p className="text-sm text-muted-foreground mt-1">
              O investigante é <strong>{filhoSex === "M" ? "masculino" : "feminino"}</strong>. Adicione um parente <strong>{filhoSex === "M" ? "♂ masculino" : "♀ feminino"}</strong> do suposto pai.
            </p>
          </div>
        </div>
      )}

      {/* Reference Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Tabela de Configurações</CardTitle>
          <CardDescription>Estimativa por cenário familiar — sem percentuais, apenas status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Configuração</th>
                  <th className="py-2 pr-4 text-left font-semibold">Status</th>
                  <th className="py-2 text-left font-semibold">Observação</th>
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
                    <td className="py-3 text-muted-foreground text-xs">{row.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Notes */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-info" /> Orientações Estratégicas</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Regra do Mesmo Sexo</p>
            <p className="text-muted-foreground text-xs mt-1">Pelo menos um parente do suposto pai deve ser do mesmo sexo do filho(a) investigante para comparação dos cromossomos sexuais (X/Y).</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Efeito Bayes & Painel NGS</p>
            <p className="text-muted-foreground text-xs mt-1">Painéis de 47+ marcadores (NGS) elevam o LR. Quando na Zona Cinzenta, solicitar ampliação.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Simulador;
