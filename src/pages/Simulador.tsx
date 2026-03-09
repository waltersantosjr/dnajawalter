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
} from "lucide-react";
import { toast } from "sonner";

/* ───── Types ───── */
interface FamilyMember {
  id: string;
  role: string;
  label: string;
  icon: React.ElementType;
  added: boolean;
  side: "investigante" | "investigado";
  weight: number;
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
  { id: "mae", role: "Mãe Biológica", label: "Mãe", icon: Heart, added: true, side: "investigante", weight: 25 },
  { id: "filho", role: "Filho(a)", label: "Filho(a)", icon: Baby, added: true, side: "investigante", weight: 0 },
  // Investigados (parentes do suposto pai)
  { id: "avo_p", role: "Avô Paterno", label: "Avô Paterno", icon: Crown, added: false, side: "investigado", weight: 20 },
  { id: "avo_m", role: "Avó Paterna", label: "Avó Paterna", icon: Crown, added: false, side: "investigado", weight: 20 },
  { id: "irmao1", role: "Irmão Germano do SP", label: "Irmão 1", icon: Users, added: false, side: "investigado", weight: 18 },
  { id: "irmao2", role: "Irmão Germano do SP", label: "Irmão 2", icon: Users, added: false, side: "investigado", weight: 15 },
  { id: "irmao3", role: "Irmão Germano do SP", label: "Irmão 3", icon: Users, added: false, side: "investigado", weight: 12 },
];

const PROB_TABLE: ProbRow[] = [
  { config: "Mãe + Filho + Avós Paternos", prob: "99% – 99,99%", obs: "Padrão Ouro (REC4A). Avós possuem carga genética completa do falecido.", level: "green" },
  { config: "Mãe + Filho + 3 Irmãos Germanos", prob: "95% – 99%", obs: "Alta robustez estatística; reduz drasticamente a chance de erro.", level: "green" },
  { config: "Mãe + Filho + 1 Irmão Germano", prob: "80% – 90%", obs: "Zona Cinzenta. Risco de inconclusão se irmão for geneticamente distante.", level: "yellow" },
  { config: "Filho + 2 Filhos do falecido", prob: "90% – 98%", obs: "Exige participação das mães para separar linhagens.", level: "yellow" },
  { config: "Apenas 1 Progenitor (Avô ou Avó)", prob: "60% – 75%", obs: "Risco Elevado. Falta metade da carga genética.", level: "red" },
  { config: "Reconstituição sem a Mãe", prob: "Reduz ~15%", obs: "Ausência do DNA materno dificulta triagem do que é herdado do pai.", level: "red" },
];

const LR_TABLE = [
  { w: "> 99,99%", interp: "Paternidade praticamente provada", status: "Aceite imediato em partilhas", level: "green" as const },
  { w: "95% – 99,9%", interp: "Paternidade muito provável", status: "Geralmente aceito, pode sofrer impugnação", level: "green" as const },
  { w: "80% – 95%", interp: "Indícios de paternidade", status: "Requer contraprova ou ampliação de painel", level: "yellow" as const },
  { w: "< 80%", interp: "Inconclusivo", status: "Não serve para presunção de vínculo", level: "red" as const },
];

const getViabilityInfo = (v: number) => {
  if (v <= 40) return { color: "text-destructive", bg: "bg-destructive", label: "Inviável", desc: "Não recomendado prosseguir. Risco de resultado inconclusivo.", prob: "< 80%" };
  if (v <= 70) return { color: "text-warning", bg: "bg-warning", label: "Zona Cinzenta", desc: "Adicione mais parentes de 1º grau para aumentar a viabilidade.", prob: "80% – 95%" };
  return { color: "text-success", bg: "bg-success", label: "Alta Viabilidade", desc: "Configuração suficiente para resultado conclusivo.", prob: "> 99%" };
};

const levelColor = (l: string) => l === "green" ? "text-success" : l === "yellow" ? "text-warning" : "text-destructive";
const levelBg = (l: string) => l === "green" ? "bg-success/10" : l === "yellow" ? "bg-warning/10" : "bg-destructive/10";

/* ───── Component ───── */
const Simulador = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showTRV, setShowTRV] = useState(false);
  const [custoExame, setCustoExame] = useState("");

  const toggle = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id && m.id !== "filho" ? { ...m, added: !m.added } : m))
    );
  };

  const addInvestigante = () => {
    const id = `inv_${Date.now()}`;
    setMembers(prev => [...prev, {
      id, role: "Investigante Adicional", label: `Investigante ${prev.filter(m => m.side === "investigante").length + 1}`,
      icon: Search, added: true, side: "investigante", weight: 5,
    }]);
    toast.success("Investigante adicionado");
  };

  const addInvestigado = () => {
    const id = `ivd_${Date.now()}`;
    setMembers(prev => [...prev, {
      id, role: "Parente 1º Grau do SP", label: `Parente ${prev.filter(m => m.side === "investigado").length + 1}`,
      icon: Users, added: true, side: "investigado", weight: 15,
    }]);
    toast.success("Investigado adicionado");
  };

  const viability = members.filter((m) => m.added).reduce((acc, m) => acc + m.weight, 0);
  const capped = Math.min(viability, 100);
  const vInfo = getViabilityInfo(capped);

  const investigantes = members.filter(m => m.side === "investigante");
  const investigados = members.filter(m => m.side === "investigado");
  const addedInvestigantes = investigantes.filter(m => m.added);
  const addedInvestigados = investigados.filter(m => m.added);
  const availableInvestigados = investigados.filter(m => !m.added);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-chart-4" /> Simulador de Reconstituição Genética
        </h1>
        <p className="text-muted-foreground">Suposto Pai Falecido / Ausente — Parentes em 1º Grau</p>
      </div>

      {/* Terminology note */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-primary text-sm">Termo correto: Reconstituição Genética</p>
            <p className="text-xs text-muted-foreground mt-1">
              Descreve o ato de recompor um perfil alélico preexistente a partir de parentes.
              Referência: Dr. Ricardo Alberto Goulart (UFU) — Genética Forense.
            </p>
          </div>
        </div>
      </div>

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
                <CardDescription>Quem busca a resposta</CardDescription>
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
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                {m.id !== "filho" && (
                  <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                    {m.added ? <UserMinus className="h-4 w-4 text-destructive" /> : <UserPlus className="h-4 w-4 text-success" />}
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={addInvestigante}>
              <UserPlus className="mr-1 h-4 w-4 text-primary" /> Acrescentar Investigante
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT: Investigados + Suposto Pai */}
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
            {investigados.map((m) => (
              <div
                key={m.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  m.added ? "bg-chart-4/5 border-chart-4/20 shadow-sm" : "opacity-60 border-dashed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.added ? "bg-chart-4/10" : "bg-muted"}`}>
                    <m.icon className={`h-5 w-5 ${m.added ? "text-chart-4" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                  {m.added ? <UserMinus className="h-4 w-4 text-destructive" /> : <UserPlus className="h-4 w-4 text-success" />}
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={addInvestigado}>
              <UserPlus className="mr-1 h-4 w-4 text-chart-4" /> Acrescentar Investigado
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Viability Gauge ═══ */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Viabilidade da Reconstituição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gauge */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={capped <= 40 ? "hsl(var(--destructive))" : capped <= 70 ? "hsl(var(--warning))" : "hsl(var(--success))"}
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

            {/* Details */}
            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-2 text-sm">
                <p><strong>Índice Mínimo Legal:</strong> 99,99%</p>
                <p><strong>Probabilidade estimada:</strong> {vInfo.prob}</p>
                <p><strong>Investigantes:</strong> {addedInvestigantes.map(m => m.label).join(", ")}</p>
                <p><strong>Investigados:</strong> {addedInvestigados.length > 0 ? addedInvestigados.map(m => m.label).join(", ") : "Nenhum"}</p>
              </div>

              {capped <= 70 && (
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-warning shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-warning">Atenção: Zona Cinzenta</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Resultados entre 80-95% são juridicamente contestáveis. Adicione mais parentes de 1º grau 
                      ou solicite painel de 47+ marcadores (NGS) antes de levar ao juízo.
                    </p>
                  </div>
                </div>
              )}
              {capped > 70 && (
                <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-success shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">Configuração Robusta</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Combinação suficiente para resultado conclusivo com alta probabilidade de aceite judicial.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {capped <= 70 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setShowTRV(true); toast.info("Declaração TRV gerada abaixo"); }}
                  >
                    <FileText className="mr-1 h-4 w-4" /> Gerar Declaração TRV
                  </Button>
                )}
                <Button size="sm" className="flex-1" onClick={() => toast.success("Ficha de cadastro aberta")}>
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
          <CardDescription>Estimativa de eficácia por configuração familiar (Bayes)</CardDescription>
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
                    <td className={`py-3 pr-4 font-bold ${levelColor(row.level)}`}>{row.prob}</td>
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
          <CardDescription>Interpretação pericial: W = LR / (LR + 1)</CardDescription>
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
            <CardDescription>Exclusivo para Reconstituição Genética e Testes de Irmandade</CardDescription>
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
                  "Estou ciente de que a omissão de outros parentes de 1º grau (outros filhos ou irmãos do falecido) 
                  pode gerar um resultado inconclusivo ou falso, isentando o laboratório de responsabilidade caso 
                  não sejam fornecidas todas as amostras disponíveis."
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
            <p className="font-semibold">Efeito Bayes</p>
            <p className="text-muted-foreground text-xs mt-1">
              O cálculo W = LR / (LR + 1) define o sucesso. Painéis de 47 marcadores elevam 
              o LR consideravelmente, mesmo com poucos parentes disponíveis.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Gestão de Pendências (80–90%)</p>
            <p className="text-muted-foreground text-xs mt-1">
              Quando o resultado ficar na zona cinzenta, o laboratório deve solicitar a inclusão de um novo 
              parente (ex: sobrinho ou irmão) antes de liberar o laudo.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold">Disputas Societárias / Herança</p>
            <p className="text-muted-foreground text-xs mt-1">
              Se W {"<"} 99%, não utilize o laudo para peticionar. O risco de exumação é de quase 100%. 
              Invista em painel expandido (NGS) ou mais um parente de 1º grau antes de ir ao juízo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Simulador;
