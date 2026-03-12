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
  User, PersonStanding,
} from "lucide-react";
import { toast } from "sonner";
import { FichaDNAja } from "@/components/FichaDNAja";

/* ───── Types ───── */
interface FamilyMember {
  id: string;
  role: string;
  label: string;
  icon: React.ElementType;
  added: boolean;
  side: "investigante" | "investigado";
  weight: number;
  sex: "M" | "F";
}

interface ProbRow {
  config: string;
  prob: string;
  obs: string;
  level: "green" | "yellow" | "red";
}

/* ───── Data ───── */
const INITIAL_MEMBERS: FamilyMember[] = [
  // Investigantes (quem busca a resposta)
  { id: "mae", role: "Mãe Biológica", label: "Mãe", icon: Heart, added: true, side: "investigante", weight: 25, sex: "F" },
  { id: "filho", role: "Filho(a) Investigante", label: "Filho(a)", icon: Baby, added: true, side: "investigante", weight: 0, sex: "M" },
  // Investigados (parentes do suposto pai falecido/ausente)
  { id: "mae_sp", role: "Mãe do Suposto Pai", label: "Mãe do SP", icon: Heart, added: false, side: "investigado", weight: 20, sex: "F" },
  { id: "pai_sp", role: "Pai do Suposto Pai", label: "Pai do SP", icon: Crown, added: false, side: "investigado", weight: 20, sex: "M" },
  { id: "irmao", role: "Irmão do Suposto Pai", label: "Irmão do SP", icon: Users, added: false, side: "investigado", weight: 18, sex: "M" },
  { id: "irma", role: "Irmã do Suposto Pai", label: "Irmã do SP", icon: Users, added: false, side: "investigado", weight: 16, sex: "F" },
  { id: "filho_leg", role: "Filho Legítimo do SP", label: "Filho Legítimo", icon: Baby, added: false, side: "investigado", weight: 17, sex: "M" },
  { id: "filha_leg", role: "Filha Legítima do SP", label: "Filha Legítima", icon: Baby, added: false, side: "investigado", weight: 15, sex: "F" },
];

const PROB_TABLE: ProbRow[] = [
  { config: "Mãe + Filho + Avós Paternos (Pai e Mãe do SP)", prob: "99% – 99,99%", obs: "Padrão Ouro (REC4A). Avós possuem carga genética completa do falecido.", level: "green" },
  { config: "Mãe + Filho + 3 ou mais Irmãos Germanos", prob: "95% – 99%", obs: "Alta robustez estatística; quanto mais irmãos, maior a precisão.", level: "green" },
  { config: "Mãe + Filho + Avó + 1 Irmão (mesmo sexo do filho)", prob: "95% – 99%", obs: "Cromossomo Y/X compartilhado entre irmão e filho reforça o vínculo.", level: "green" },
  { config: "Mãe + Filho + 2 Irmãos Germanos (um do mesmo sexo)", prob: "92% – 98%", obs: "Boa configuração. O irmão do mesmo sexo garante comparação X/Y.", level: "green" },
  { config: "Mãe + Filho + 1 Irmão do mesmo sexo", prob: "85% – 95%", obs: "Zona Cinzenta alta. Cromossomos sexuais auxiliam na conclusão.", level: "yellow" },
  { config: "Mãe + Filho + 1 Irmão do sexo oposto", prob: "75% – 88%", obs: "Zona Cinzenta. Sem cromossomo sexual compartilhado, risco de inconclusão.", level: "yellow" },
  { config: "Mãe + Filho + Apenas Filhos Legítimos", prob: "80% – 92%", obs: "Depende do sexo: filho legítimo do mesmo sexo do investigante melhora resultado.", level: "yellow" },
  { config: "Filho + Irmãos (SEM a Mãe)", prob: "Reduz ~15-20%", obs: "Ausência do DNA materno dificulta triagem. Risco elevado de inconclusão.", level: "red" },
  { config: "Apenas 1 Progenitor (só Avô ou só Avó)", prob: "60% – 75%", obs: "Risco Elevado. Falta metade da carga genética do suposto pai.", level: "red" },
  { config: "Nenhum parente do mesmo sexo do investigante", prob: "Reduz ~10-15%", obs: "Regra crítica: sem parente do mesmo sexo, cromossomos sexuais não confirmam linhagem.", level: "red" },
];

const LR_TABLE = [
  { w: "> 99,99%", interp: "Paternidade praticamente provada", status: "Aceite imediato — padrão judicial brasileiro", level: "green" as const },
  { w: "99% – 99,99%", interp: "Paternidade muito provável", status: "Geralmente aceito, alto poder probatório", level: "green" as const },
  { w: "95% – 99%", interp: "Paternidade provável", status: "Aceito com ressalvas; pode sofrer impugnação técnica", level: "yellow" as const },
  { w: "80% – 95%", interp: "Indícios de paternidade", status: "Zona Cinzenta — requer contraprova ou ampliação de painel (NGS 47+ marcadores)", level: "yellow" as const },
  { w: "< 80%", interp: "Inconclusivo", status: "Não serve para presunção de vínculo. Laboratório deve recusar ou exigir mais amostras.", level: "red" as const },
];

const getViabilityInfo = (v: number) => {
  if (v <= 40) return { color: "text-destructive", bg: "bg-destructive", label: "Inviável", desc: "Não recomendado prosseguir. Risco de resultado inconclusivo muito alto.", prob: "< 80%" };
  if (v <= 60) return { color: "text-warning", bg: "bg-warning", label: "Zona Cinzenta", desc: "Adicione mais parentes de 1º grau. Garanta pelo menos 1 parente do mesmo sexo do investigante.", prob: "80% – 95%" };
  if (v <= 80) return { color: "text-chart-4", bg: "bg-chart-4", label: "Viável com Ressalvas", desc: "Configuração aceitável, mas pode ser fortalecida com mais parentes.", prob: "95% – 99%" };
  return { color: "text-success", bg: "bg-success", label: "Alta Viabilidade", desc: "Configuração robusta para resultado conclusivo.", prob: "> 99%" };
};

const levelColor = (l: string) => l === "green" ? "text-success" : l === "yellow" ? "text-warning" : "text-destructive";
const levelBg = (l: string) => l === "green" ? "bg-success/10" : l === "yellow" ? "bg-warning/10" : "bg-destructive/10";

/* ───── Component ───── */
const Simulador = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showTRV, setShowTRV] = useState(false);
  const [showFicha, setShowFicha] = useState(false);
  const [custoExame, setCustoExame] = useState("");
  const [valorTerceirizado, setValorTerceirizado] = useState("");
  const [valorKit, setValorKit] = useState("");
  const [filhoSex, setFilhoSex] = useState<"M" | "F">("M");

  const toggle = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id && m.id !== "filho" ? { ...m, added: !m.added } : m))
    );
  };

  const updateFilhoSex = (sex: "M" | "F") => {
    setFilhoSex(sex);
    setMembers(prev => prev.map(m => m.id === "filho" ? { ...m, sex } : m));
  };

  const addInvestigado = (role: string, sex: "M" | "F") => {
    const id = `ivd_${Date.now()}`;
    setMembers(prev => [...prev, {
      id, role, label: role,
      icon: Users, added: true, side: "investigado" as const, weight: 14, sex,
    }]);
    toast.success(`${role} adicionado`);
  };

  const investigantes = members.filter(m => m.side === "investigante");
  const investigados = members.filter(m => m.side === "investigado");
  const addedInvestigantes = investigantes.filter(m => m.added);
  const addedInvestigados = investigados.filter(m => m.added);

  // Calculate viability
  const viability = members.filter((m) => m.added).reduce((acc, m) => acc + m.weight, 0);
  const capped = Math.min(viability, 100);
  const vInfo = getViabilityInfo(capped);

  // Same-sex rule check
  const filhoSexValue = members.find(m => m.id === "filho")?.sex || "M";
  const hasSameSexRelative = addedInvestigados.some(m => m.sex === filhoSexValue);
  const sameSexWarning = addedInvestigados.length > 0 && !hasSameSexRelative;

  // Ficha generation
  if (showFicha) {
    const fichaParticipants = [
      ...addedInvestigantes.map(m => ({ role: m.label, colorClass: "filho" })),
      ...addedInvestigados.map(m => ({ role: m.label, colorClass: "parente" })),
    ];
    return (
      <FichaDNAja
        examType="reconstituicao"
        modality="judicial"
        participants={fichaParticipants}
        onClose={() => setShowFicha(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-chart-4" /> Reconstituição Genética
        </h1>
        <p className="text-muted-foreground">Suposto Pai Falecido / Ausente — Parentes em 1º Grau</p>
      </div>

      {/* Brief explanation */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-primary text-sm">O que é Reconstituição Genética?</p>
            <p className="text-xs text-muted-foreground mt-1">
              É o processo de recompor o perfil genético de uma pessoa falecida ou ausente a partir do DNA 
              de seus parentes de 1º grau (pais, irmãos, filhos legítimos). O laboratório utiliza cálculos 
              bayesianos (W = LR / LR+1) para estimar a probabilidade de vínculo entre o investigante e o 
              suposto pai, cruzando os dados dos parentes disponíveis.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Regra fundamental:</strong> É necessário ao menos um parente do <strong>mesmo sexo</strong> do 
              filho(a) investigante para garantir a comparação dos cromossomos sexuais (X/Y), aumentando 
              significativamente a conclusividade do exame.
            </p>
          </div>
        </div>
      </div>

      {/* Filho sex selection */}
      <Card className="border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="font-semibold text-sm whitespace-nowrap">Sexo do Filho(a) Investigante:</Label>
            <div className="flex gap-2">
              <Button size="sm" variant={filhoSex === "M" ? "default" : "outline"} onClick={() => updateFilhoSex("M")}>
                👦 Masculino
              </Button>
              <Button size="sm" variant={filhoSex === "F" ? "default" : "outline"} onClick={() => updateFilhoSex("F")}>
                👧 Feminino
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Precisa de parente {filhoSex === "M" ? "masculino" : "feminino"} do SP
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ═══ Main layout: Investigante vs Investigado ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Investigantes */}
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" /> Investigantes
                </CardTitle>
                <CardDescription>Quem busca a resposta (Mãe + Filho)</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary/30">
                {addedInvestigantes.length} participante{addedInvestigantes.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {investigantes.map((m) => (
              <div
                key={m.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  m.added ? "bg-primary/5 border-primary/20 shadow-sm" : "opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.role} {m.id === "filho" ? `(${filhoSex === "M" ? "Masculino" : "Feminino"})` : ""}</p>
                  </div>
                </div>
                {m.id !== "filho" && (
                  <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                    {m.added ? <UserMinus className="h-4 w-4 text-destructive" /> : <UserPlus className="h-4 w-4 text-success" />}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RIGHT: Investigados */}
        <Card className="border-chart-4/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-chart-4" /> Investigados
                </CardTitle>
                <CardDescription>Parentes em 1º grau do Suposto Pai</CardDescription>
              </div>
              <Badge variant="outline" className="text-chart-4 border-chart-4/30">
                {addedInvestigados.length} participante{addedInvestigados.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Deceased father card */}
            <div className="rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-4 text-center">
              <XCircle className="mx-auto h-8 w-8 text-destructive/60" />
              <p className="mt-1 font-semibold text-destructive/80">Suposto Pai</p>
              <Badge variant="destructive" className="mt-1">Falecido / Ausente</Badge>
            </div>

            {/* Investigados members */}
            {investigados.map((m) => {
              const isSameSex = m.sex === filhoSexValue;
              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                    m.added
                      ? `bg-chart-4/5 border-chart-4/20 shadow-sm ${isSameSex ? "ring-1 ring-success/40" : ""}`
                      : "opacity-60 border-dashed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.added ? "bg-chart-4/10" : "bg-muted"}`}>
                      <m.icon className={`h-5 w-5 ${m.added ? "text-chart-4" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        {m.label}
                        {m.added && isSameSex && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 border-success text-success">mesmo sexo</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.role} ({m.sex === "M" ? "♂" : "♀"})</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                    {m.added ? <UserMinus className="h-4 w-4 text-destructive" /> : <UserPlus className="h-4 w-4 text-success" />}
                  </Button>
                </div>
              );
            })}

            {/* Add more */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => addInvestigado("Irmão Adicional do SP", "M")}>
                <UserPlus className="mr-1 h-3 w-3" /> + Irmão ♂
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => addInvestigado("Irmã Adicional do SP", "F")}>
                <UserPlus className="mr-1 h-3 w-3" /> + Irmã ♀
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Same-sex warning */}
      {sameSexWarning && (
        <div className="flex items-start gap-3 rounded-lg border-2 border-destructive bg-destructive/5 p-4">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-destructive">⚠️ ALERTA: Nenhum parente do mesmo sexo do investigante</p>
            <p className="text-sm text-muted-foreground mt-1">
              O filho(a) investigante é <strong>{filhoSex === "M" ? "masculino" : "feminino"}</strong>, mas nenhum 
              parente {filhoSex === "M" ? "masculino" : "feminino"} do Suposto Pai foi adicionado. Isso impede a 
              comparação dos cromossomos {filhoSex === "M" ? "Y (patrilinear)" : "X"}, reduzindo significativamente 
              a probabilidade de conclusão do exame em <strong>10-15%</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              Recomendação: Adicione pelo menos um {filhoSex === "M" ? "irmão, pai ou filho legítimo" : "irmã, mãe ou filha legítima"} do Suposto Pai.
            </p>
          </div>
        </div>
      )}

      {/* ═══ Custo do Exame ═══ */}
      <Card className="border-success/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" /> Custo do Exame
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Valor do Exame (venda)</Label>
              <Input type="text" placeholder="0,00" value={custoExame} onChange={(e) => setCustoExame(e.target.value)} className="text-lg font-bold font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Valor Terceirizado (lab)</Label>
              <Input type="text" placeholder="0,00" value={valorTerceirizado} onChange={(e) => setValorTerceirizado(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Valor do Kit</Label>
              <Input type="text" placeholder="0,00" value={valorKit} onChange={(e) => setValorKit(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Participantes</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3 text-sm">
                {members.filter(m => m.added).length} pessoa(s)
              </div>
            </div>
          </div>

          {custoExame && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Custo por Participante</p>
                <p className="text-lg font-bold font-mono text-primary">
                  {(() => {
                    const val = parseFloat(custoExame.replace(",", "."));
                    const count = Math.max(members.filter(m => m.added).length, 1);
                    return !isNaN(val) ? `R$ ${(val / count).toFixed(2)}` : "—";
                  })()}
                </p>
              </div>
              <div className="rounded-lg border bg-warning/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">Custo Total (lab + kit)</p>
                <p className="text-lg font-bold font-mono text-warning">
                  R$ {((parseFloat(valorTerceirizado.replace(",", ".")) || 0) + (parseFloat(valorKit.replace(",", ".")) || 0)).toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border bg-success/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">Margem Bruta</p>
                <p className="text-lg font-bold font-mono text-success">
                  R$ {((parseFloat(custoExame.replace(",", ".")) || 0) - (parseFloat(valorTerceirizado.replace(",", ".")) || 0) - (parseFloat(valorKit.replace(",", ".")) || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ Viability Gauge ═══ */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Viabilidade da Reconstituição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={capped <= 40 ? "hsl(var(--destructive))" : capped <= 60 ? "hsl(var(--warning))" : capped <= 80 ? "hsl(var(--chart-4))" : "hsl(var(--success))"}
                    strokeWidth="10"
                    strokeDasharray={`${(capped / 100) * 314} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className={`text-4xl font-bold ${vInfo.color}`}>{capped}%</p>
                  <p className="text-xs text-muted-foreground">Viabilidade</p>
                </div>
              </div>
              <div className="text-center">
                <Badge className={`${vInfo.bg} text-white text-sm px-4 py-1`}>{vInfo.label}</Badge>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">{vInfo.desc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-2 text-sm">
                <p><strong>Índice Mínimo Legal (Brasil):</strong> 99,99% (Resolução CFM)</p>
                <p><strong>Probabilidade estimada:</strong> {vInfo.prob}</p>
                <p><strong>Investigantes:</strong> {addedInvestigantes.map(m => m.label).join(", ")}</p>
                <p><strong>Investigados:</strong> {addedInvestigados.length > 0 ? addedInvestigados.map(m => `${m.label} (${m.sex === "M" ? "♂" : "♀"})`).join(", ") : "Nenhum"}</p>
                <p><strong>Parente do mesmo sexo:</strong> {hasSameSexRelative ? <span className="text-success font-bold">✓ Sim</span> : <span className="text-destructive font-bold">✗ Não</span>}</p>
              </div>

              {sameSexWarning && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Sem parente do mesmo sexo, os cromossomos {filhoSex === "M" ? "Y" : "X"} não podem ser comparados diretamente, 
                    reduzindo a conclusividade em até 15%.
                  </p>
                </div>
              )}

              {capped <= 60 && !sameSexWarning && (
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-warning shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Zona Cinzenta. Adicione mais parentes de 1º grau ou solicite painel de 47+ marcadores (NGS).
                  </p>
                </div>
              )}
              {capped > 60 && (
                <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-success shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Configuração {capped > 80 ? "robusta" : "aceitável"} para resultado conclusivo.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {capped <= 60 && (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setShowTRV(true); toast.info("Declaração TRV gerada abaixo"); }}>
                    <FileText className="mr-1 h-4 w-4" /> Gerar TRV
                  </Button>
                )}
                <Button size="sm" className="flex-1" onClick={() => setShowFicha(true)}>
                  <ArrowRight className="mr-1 h-4 w-4" /> Abrir Ficha de Cadastro
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ Probability Table ═══ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> Tabela de Probabilidade de Conclusividade
          </CardTitle>
          <CardDescription>Estimativa por configuração familiar — baseado em estudos de genética forense e cálculos bayesianos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Configuração</th>
                  <th className="py-2 pr-4 text-left font-semibold">Probabilidade</th>
                  <th className="py-2 text-left font-semibold">Observação</th>
                </tr>
              </thead>
              <tbody>
                {PROB_TABLE.map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${levelBg(row.level)}`}>
                    <td className="py-3 pr-4 font-medium">{row.config}</td>
                    <td className={`py-3 pr-4 font-bold whitespace-nowrap ${levelColor(row.level)}`}>{row.prob}</td>
                    <td className="py-3 text-muted-foreground text-xs">{row.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ═══ LR Table ═══ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-chart-4" /> Razão de Verossimilhança (LR) vs. Probabilidade (W)
          </CardTitle>
          <CardDescription>Interpretação pericial: W = LR / (LR + 1) — padrão utilizado na genética forense brasileira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-semibold">Valor de W</th>
                  <th className="py-2 pr-4 text-left font-semibold">Interpretação Pericial</th>
                  <th className="py-2 text-left font-semibold">Status Jurídico</th>
                </tr>
              </thead>
              <tbody>
                {LR_TABLE.map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${levelBg(row.level)}`}>
                    <td className={`py-3 pr-4 font-bold ${levelColor(row.level)}`}>{row.w}</td>
                    <td className="py-3 pr-4">{row.interp}</td>
                    <td className="py-3 text-muted-foreground text-xs">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ═══ TRV Declaration ═══ */}
      {showTRV && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" /> Termo de Reconstituição e Veracidade (TRV)
            </CardTitle>
            <CardDescription>Exclusivo para Reconstituição Genética — resultado na Zona Cinzenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-card p-4 space-y-4 text-sm">
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Identificação do Parente Colaborador</Label>
                <Input placeholder="Nome completo" />
                <Input placeholder="RG / CPF" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Declaração de Parentesco</Label>
                <p className="text-xs text-muted-foreground italic">
                  "Declaro sob as penas da lei que sou <strong>[Grau de Parentesco]</strong> do investigado 
                  falecido <strong>[Nome do Suposto Pai]</strong>."
                </p>
                <Input placeholder="Grau de parentesco" />
                <Input placeholder="Nome do Suposto Pai Falecido" />
              </div>
              <Separator />
              <div className="rounded-md bg-warning/10 p-3">
                <p className="text-xs font-semibold text-warning">Cláusula de Risco (Zona Cinzenta)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  "Estou ciente de que a omissão de outros parentes de 1º grau pode gerar resultado 
                  inconclusivo ou falso, isentando o laboratório de responsabilidade."
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Comprovação de Óbito</Label>
                <Input placeholder="Nº da Certidão de Óbito" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTRV(false)}>Fechar</Button>
              <Button onClick={() => toast.success("TRV gerado com sucesso! (simulação)")}>
                <FileText className="mr-1 h-4 w-4" /> Gerar PDF do TRV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ Strategic Notes ═══ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-info" /> Orientações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Regra do Mesmo Sexo</p>
            <p className="text-muted-foreground text-xs mt-1">
              É imprescindível que pelo menos um parente do suposto pai seja do mesmo sexo do filho(a) 
              investigante. Isso permite a comparação direta dos cromossomos sexuais (Y para masculino, 
              X para feminino), aumentando a conclusividade em até 15%.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Efeito Bayes & Painel NGS</p>
            <p className="text-muted-foreground text-xs mt-1">
              Painéis de 47+ marcadores (NGS) elevam o LR consideravelmente, mesmo com poucos parentes. 
              Quando na Zona Cinzenta (80-95%), solicitar ampliação antes de levar ao juízo.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Disputas Societárias / Herança</p>
            <p className="text-muted-foreground text-xs mt-1">
              Se W {"<"} 99%, não utilize o laudo para peticionar. O risco de exumação é alto. 
              Invista em painel expandido ou mais parentes de 1º grau.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Simulador;
