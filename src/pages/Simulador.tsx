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

      {/* Family Tree + Status */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Family Tree Visual */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-4" /> Árvore Genealógica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[400px] bg-muted/20 rounded-xl p-6">
              {/* Avós row */}
              <div className="flex justify-center gap-6 mb-2">
                {investigados.filter(m => m.id === "pai_sp" || m.id === "mae_sp").map(m => (
                  <button key={m.id} onClick={() => toggle(m.id)} className={`rounded-xl border-2 p-3 w-24 text-center transition-all hover:scale-105 ${m.added ? nodeColor(m) : "border-dashed border-muted-foreground/30 bg-muted/30 text-muted-foreground opacity-60"}`}>
                    <div className="text-2xl mb-1">{m.sex === "M" ? "👤" : "👤"}</div>
                    <p className="text-xs font-semibold">{m.label}</p>
                    {!m.added && <p className="text-[10px] text-muted-foreground mt-1">Clique p/ incluir</p>}
                  </button>
                ))}
              </div>

              {/* Connector line */}
              <div className="flex justify-center"><div className="w-0.5 h-6 bg-border" /></div>

              {/* Sup. Pai row */}
              <div className="flex justify-center gap-4 mb-2">
                {/* Siblings left */}
                <div className="flex gap-2">
                  {investigados.filter(m => m.id === "irmao" || (m.custom && m.side === "investigado" && m.sex === "M")).map(m => (
                    <button key={m.id} onClick={() => m.custom ? removeMember(m.id) : toggle(m.id)} className={`rounded-xl border-2 p-2 w-20 text-center transition-all hover:scale-105 ${m.added ? nodeColor(m) : "border-dashed border-muted-foreground/30 opacity-60"}`}>
                      <div className="text-lg">👤</div>
                      <p className="text-[10px] font-semibold truncate">{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Deceased father */}
                <div className="rounded-xl border-2 border-dashed border-muted-foreground/40 bg-muted/40 p-3 w-28 text-center">
                  <div className="text-2xl">👤</div>
                  <p className="text-xs font-semibold text-muted-foreground">Sup. Pai</p>
                  <Badge variant="destructive" className="text-[10px] mt-1">Falecido</Badge>
                </div>

                {/* Siblings right */}
                <div className="flex gap-2">
                  {investigados.filter(m => m.id === "irma" || (m.custom && m.side === "investigado" && m.sex === "F")).map(m => (
                    <button key={m.id} onClick={() => m.custom ? removeMember(m.id) : toggle(m.id)} className={`rounded-xl border-2 p-2 w-20 text-center transition-all hover:scale-105 ${m.added ? nodeColor(m) : "border-dashed border-muted-foreground/30 opacity-60"}`}>
                      <div className="text-lg">👤</div>
                      <p className="text-[10px] font-semibold truncate">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filhos legítimos */}
              <div className="flex justify-center gap-3 mb-2">
                {investigados.filter(m => m.id === "filho_leg" || m.id === "filha_leg").map(m => (
                  <button key={m.id} onClick={() => toggle(m.id)} className={`rounded-xl border-2 p-2 w-20 text-center transition-all hover:scale-105 ${m.added ? nodeColor(m) : "border-dashed border-muted-foreground/30 opacity-60"}`}>
                    <div className="text-lg">{m.sex === "M" ? "👦" : "👧"}</div>
                    <p className="text-[10px] font-semibold truncate">{m.label}</p>
                  </button>
                ))}
              </div>

              {/* Connector */}
              <div className="flex justify-center"><div className="w-0.5 h-6 bg-border" /></div>

              {/* Investigantes row */}
              <div className="flex justify-center gap-6">
                {investigantes.filter(m => m.id === "mae").map(m => (
                  <button key={m.id} onClick={() => toggle(m.id)} className={`rounded-xl border-2 p-3 w-24 text-center transition-all hover:scale-105 ${m.added ? nodeColor(m) : "border-dashed opacity-60"}`}>
                    <div className="text-2xl">💗</div>
                    <p className="text-xs font-semibold">Mãe Bio</p>
                  </button>
                ))}
                {investigantes.filter(m => m.id === "filho").map(m => (
                  <div key={m.id} className={`rounded-xl border-2 p-3 w-24 text-center ${nodeColor(m)}`}>
                    <div className="text-2xl">{filhoSex === "M" ? "👦" : "👧"}</div>
                    <p className="text-xs font-semibold">Filho(a)</p>
                  </div>
                ))}
                {investigantes.filter(m => m.custom).map(m => (
                  <button key={m.id} onClick={() => removeMember(m.id)} className={`rounded-xl border-2 p-2 w-20 text-center transition-all hover:scale-105 ${nodeColor(m)}`}>
                    <div className="text-lg">{m.sex === "M" ? "👦" : "👧"}</div>
                    <p className="text-[10px] font-semibold truncate">{m.label}</p>
                  </button>
                ))}
              </div>

              {/* Add buttons */}
              <div className="mt-4 pt-4 border-t border-dashed">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">Adicionar participantes:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => addInvestigado("Irmão 2", "M")}><Plus className="mr-1 h-3 w-3" /> + Irmão ♂</Button>
                  <Button variant="outline" size="sm" onClick={() => addInvestigado("Irmã 2", "F")}><Plus className="mr-1 h-3 w-3" /> + Irmã ♀</Button>
                  <Button variant="outline" size="sm" onClick={() => addInvestigante("Filho(a) 2", filhoSex)}><Plus className="mr-1 h-3 w-3" /> + Filho(a)</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status panel */}
        <div className="space-y-4">
          {/* Traffic Light Status */}
          <Card className={`border-2 ${levelBorder(statusInfo.level)} overflow-hidden`}>
            <div className={`${levelBg(statusInfo.level)} p-6 text-center`}>
              <div className={`inline-flex h-24 w-24 items-center justify-center rounded-full ${levelBg(statusInfo.level)} border-4 ${levelBorder(statusInfo.level)}`}>
                <span className="text-5xl">{statusInfo.level === "green" ? "🟢" : statusInfo.level === "yellow" ? "🟡" : "🔴"}</span>
              </div>
              <p className={`mt-3 font-bold text-lg ${levelColor(statusInfo.level)}`}>{statusInfo.label}</p>
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">{statusInfo.desc}</p>
              
              {/* Suggestion to go green */}
              {statusInfo.level !== "green" && (
                <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                  <p className="text-xs font-bold text-success mb-1">💡 Como tornar Verde:</p>
                  <p className="text-xs text-muted-foreground">{statusInfo.suggestion}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected members */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Parentes Selecionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {addedInvestigantes.map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    {m.label} ({m.sex === "M" ? "♂" : "♀"})
                  </span>
                  <Badge variant="outline" className="text-[10px] border-success text-success">Investigante</Badge>
                </div>
              ))}
              {addedInvestigados.map(m => {
                const isSameSex = m.sex === filhoSexValue;
                return (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${isSameSex ? "bg-success" : "bg-primary"}`} />
                      {m.label} ({m.sex === "M" ? "♂" : "♀"})
                      {isSameSex && <span className="text-[10px] text-success">✓ mesmo sexo</span>}
                    </span>
                    <span className="text-xs text-chart-4 font-mono">+{m.weight}%</span>
                  </div>
                );
              })}
              {addedInvestigados.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Clique nos nós da árvore para incluir</p>}
            </CardContent>
          </Card>

          {/* Open Ficha */}
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
