import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign, Calculator, TrendingUp, Package, Receipt,
  Clock, AlertTriangle, Beaker, Skull, Baby, Users, Info, Scale,
  Pencil, Check, RotateCcw, Shield,
} from "lucide-react";
import { toast } from "sonner";

type Modalidade = "duo_4d" | "duo_48h" | "duo_24h" | "rec_mae_pai" | "rec_3par" | "rec_2par" | "rec_1par" | "post_mortem" | "dnaja";

interface ExamRow {
  label: string;
  grupo: string;
  entrega: string;
  valorBase: number;
  acrescimo: number;
  acrescimoLabel: string;
  icon: React.ElementType;
  obs?: string;
  color: string;
}

const TABELA: Record<Modalidade, ExamRow> = {
  duo_4d: { label: "Duo/Trio – 04 dias úteis", grupo: "Paternidade / Maternidade", entrega: "04 dias úteis", valorBase: 180, acrescimo: 80, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Baby, color: "border-success/40 bg-success/5 hover:bg-success/10" },
  duo_48h: { label: "Duo/Trio – 48h Urgência", grupo: "Paternidade / Maternidade", entrega: "48 horas (Urgência)", valorBase: 495, acrescimo: 160, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Clock, color: "border-warning/40 bg-warning/5 hover:bg-warning/10" },
  duo_24h: { label: "Duo/Trio – 24h Emergência", grupo: "Paternidade / Maternidade", entrega: "24 horas (Emergência)", valorBase: 895, acrescimo: 320, acrescimoLabel: "por filho investigante (mesma mãe)", icon: AlertTriangle, color: "border-destructive/40 bg-destructive/5 hover:bg-destructive/10" },
  rec_mae_pai: { label: "Reconstituição – Mãe e Pai (Avós)", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 600, acrescimo: 150, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, obs: "Padrão Ouro.", color: "border-primary/40 bg-primary/5 hover:bg-primary/10" },
  rec_3par: { label: "Reconstituição – 3 Parentes 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, color: "border-primary/40 bg-primary/5 hover:bg-primary/10" },
  rec_2par: { label: "Reconstituição – 2 Parentes 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, color: "border-primary/40 bg-primary/5 hover:bg-primary/10" },
  rec_1par: { label: "Reconstituição – 1 Parente 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, color: "border-primary/40 bg-primary/5 hover:bg-primary/10" },
  post_mortem: { label: "Investigação Post Mortem", grupo: "Post Mortem", entrega: "30 dias", valorBase: 7900, acrescimo: 2000, acrescimoLabel: "por filho investigante", icon: Skull, obs: "Fêmur ou 5 dentes. Requer autorização judicial.", color: "border-chart-4/40 bg-chart-4/5 hover:bg-chart-4/10" },
  dnaja: { label: "DNAjá – Kit Auto Coleta", grupo: "DNAjá", entrega: "5 dias úteis", valorBase: 299.9, acrescimo: 0, acrescimoLabel: "—", icon: Package, obs: "Apenas informativo.", color: "border-info/40 bg-info/5 hover:bg-info/10" },
};

type RegimeTrib = "lucro_presumido" | "simples_nacional" | "gralab";
type NfModality = "servico" | "produto" | "ecommerce";

interface TaxInfo {
  label: string;
  icon: React.ElementType;
  taxes: { name: string; rate: number; desc: string }[];
}

const TAX_INFO_LP: Record<NfModality, TaxInfo> = {
  servico: {
    label: "NF Serviço (Saúde – SP) · Lucro Presumido", icon: Receipt,
    taxes: [
      { name: "ISS", rate: 5.0, desc: "ISS SP – alíquota padrão (mínimo 2%)." },
      { name: "PIS", rate: 0.65, desc: "PIS cumulativo" },
      { name: "COFINS", rate: 3.0, desc: "COFINS cumulativo" },
      { name: "IRPJ", rate: 1.2, desc: "Base reduzida 8% × 15% = 1,2%" },
      { name: "CSLL", rate: 1.08, desc: "Base reduzida 12% × 9% = 1,08%" },
    ],
  },
  produto: {
    label: "NF Produto (ICMS – SP) · Lucro Presumido", icon: Package,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "ICMS SP" },
      { name: "PIS", rate: 1.65, desc: "PIS não-cumulativo" },
      { name: "COFINS", rate: 7.6, desc: "COFINS não-cumulativo" },
      { name: "IPI", rate: 0.0, desc: "IPI (isento)" },
    ],
  },
  ecommerce: {
    label: "NF E-commerce · Lucro Presumido", icon: TrendingUp,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "ICMS SP" },
      { name: "DIFAL", rate: 4.0, desc: "Diferencial de Alíquota" },
      { name: "PIS", rate: 1.65, desc: "PIS" },
      { name: "COFINS", rate: 7.6, desc: "COFINS" },
      { name: "Taxa Marketplace", rate: 12.0, desc: "Comissão média" },
    ],
  },
};

const TAX_SIMPLES: Record<NfModality, { label: string }> = {
  servico: { label: "Anexo V – Serviços de Saúde" },
  produto: { label: "Anexo II – Indústria / Comércio" },
  ecommerce: { label: "Anexo I – Comércio (e-commerce)" },
};

const SIMPLES_FAIXAS = [
  { ate: 180000, aliquota: 15.5, deducao: 0, label: "Até R$ 180 mil" },
  { ate: 360000, aliquota: 18.0, deducao: 4500, label: "R$ 180 mil – R$ 360 mil" },
  { ate: 720000, aliquota: 19.5, deducao: 9900, label: "R$ 360 mil – R$ 720 mil" },
  { ate: 1800000, aliquota: 20.5, deducao: 17100, label: "R$ 720 mil – R$ 1,8 mi" },
  { ate: 3600000, aliquota: 23.0, deducao: 62100, label: "R$ 1,8 mi – R$ 3,6 mi" },
  { ate: 4800000, aliquota: 30.5, deducao: 540000, label: "R$ 3,6 mi – R$ 4,8 mi" },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SimuladorPrecos = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("duo_4d");
  const [nfModality, setNfModality] = useState<NfModality>("servico");
  const [regime, setRegime] = useState<RegimeTrib>("lucro_presumido");
  const [qtdFilhos, setQtdFilhos] = useState("1");
  const [valorTerceirizado, setValorTerceirizado] = useState("");
  const [valorKit, setValorKit] = useState("");
  const [valorVendaCustom, setValorVendaCustom] = useState("");
  const [faturamentoAnual, setFaturamentoAnual] = useState("360000");
  const [comissao, setComissao] = useState("");
  const [taxOverrides, setTaxOverrides] = useState<Record<string, number>>({});
  const [editingTax, setEditingTax] = useState<string | null>(null);
  const [editingTaxValue, setEditingTaxValue] = useState("");

  const exam = TABELA[modalidade];
  const filhos = Math.max(parseInt(qtdFilhos) || 1, 1);
  const acrescimoTotal = exam.acrescimo * Math.max(filhos - 1, 0);
  const valorTabela = exam.valorBase + acrescimoTotal;
  const valorVenda = valorVendaCustom ? parseFloat(valorVendaCustom.replace(",", ".")) || valorTabela : valorTabela;
  const custoTerc = valorTerceirizado ? parseFloat(valorTerceirizado.replace(",", ".")) || 0 : 0;
  const custoKit = valorKit ? parseFloat(valorKit.replace(",", ".")) || 0 : 0;
  const comissaoVal = comissao ? parseFloat(comissao.replace(",", ".")) || 0 : 0;
  const custoTotal = custoTerc + custoKit + comissaoVal;

  let taxInfo: TaxInfo;
  let totalTaxRate: number;
  let totalTaxValue: number;
  let simplesAliquotaEfetiva = 0;

  const applyOverrides = (taxes: { name: string; rate: number; desc: string }[]) =>
    taxes.map(t => ({ ...t, rate: taxOverrides[t.name] !== undefined ? taxOverrides[t.name] : t.rate }));

  if (regime === "gralab") {
    const baseTaxes = [{ name: "GRALAB Unificado", rate: 18.0, desc: "Alíquota unificada GRALAB — todos os impostos consolidados em 18%" }];
    const adjustedTaxes = applyOverrides(baseTaxes);
    totalTaxRate = adjustedTaxes.reduce((acc, t) => acc + t.rate, 0);
    totalTaxValue = valorVenda * (totalTaxRate / 100);
    taxInfo = {
      label: "GRALAB — Imposto Unificado 18%",
      icon: Shield,
      taxes: adjustedTaxes,
    };
  } else if (regime === "lucro_presumido") {
    taxInfo = TAX_INFO_LP[nfModality];
    taxInfo = { ...taxInfo, taxes: applyOverrides(taxInfo.taxes) };
    totalTaxRate = taxInfo.taxes.reduce((acc, t) => acc + t.rate, 0);
    totalTaxValue = valorVenda * (totalTaxRate / 100);
  } else {
    const fat = parseFloat(faturamentoAnual) || 360000;
    const faixa = SIMPLES_FAIXAS.find(f => fat <= f.ate) || SIMPLES_FAIXAS[SIMPLES_FAIXAS.length - 1];
    simplesAliquotaEfetiva = ((fat * (faixa.aliquota / 100)) - faixa.deducao) / fat * 100;
    const baseTaxes = [{ name: "DAS Unificado", rate: simplesAliquotaEfetiva, desc: `Alíquota efetiva (nominal ${faixa.aliquota}% - dedução ${fmt(faixa.deducao)})` }];
    const adjustedTaxes = applyOverrides(baseTaxes);
    totalTaxRate = adjustedTaxes.reduce((acc, t) => acc + t.rate, 0);
    totalTaxValue = valorVenda * (totalTaxRate / 100);
    taxInfo = {
      label: `Simples Nacional – ${TAX_SIMPLES[nfModality].label} (${faixa.label})`,
      icon: Receipt,
      taxes: adjustedTaxes,
    };
  }

  const lucroLiquido = valorVenda - totalTaxValue - custoTotal;
  const margemLiquida = valorVenda > 0 ? (lucroLiquido / valorVenda) * 100 : 0;
  const aliquotaReforma = totalTaxRate * 0.4;
  const taxValueReforma = valorVenda * (aliquotaReforma / 100);
  const lucroReforma = valorVenda - taxValueReforma - custoTotal;

  // Group exams by grupo
  const grupos = Object.entries(TABELA).reduce((acc, [key, row]) => {
    if (!acc[row.grupo]) acc[row.grupo] = [];
    acc[row.grupo].push({ key: key as Modalidade, ...row });
    return acc;
  }, {} as Record<string, (ExamRow & { key: Modalidade })[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator className="h-7 w-7 text-success" /> Calculadora DNAjá</h1>
        <p className="text-muted-foreground">Tabela comercial · Custos · Impostos</p>
      </div>

      <div className="rounded-lg border border-info/20 bg-info/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong className="text-info">ISS SP:</strong> 5% (mínimo 2%). Recolhido no município de coleta (STJ).</p>
            <p><strong className="text-info">Equiparação Hospitalar:</strong> Base IRPJ 8%, CSLL 12% (ANVISA).</p>
            <p><strong className="text-info">Reforma Tributária (LC 214/2025):</strong> Redução de 60% para exames laboratoriais.</p>
          </div>
        </div>
      </div>

      {/* Exam Cards Selection */}
      <div className="space-y-4">
        {Object.entries(grupos).map(([grupo, exams]) => (
          <div key={grupo}>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">{grupo}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map(ex => {
                const isActive = ex.key === modalidade;
                const Icon = ex.icon;
                return (
                  <button
                    key={ex.key}
                    onClick={() => { setModalidade(ex.key); setValorVendaCustom(""); }}
                    className={`rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.01] ${isActive ? `${ex.color} border-2 shadow-md ring-2 ring-primary/20` : "border-border bg-card hover:bg-muted/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${isActive ? "text-primary" : ""}`}>{ex.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ex.entrega}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-bold font-mono text-base">{fmt(ex.valorBase)}</span>
                          {ex.acrescimo > 0 && <span className="text-[10px] text-muted-foreground">+{fmt(ex.acrescimo)}/filho</span>}
                        </div>
                      </div>
                    </div>
                    {ex.obs && <p className="text-[10px] text-muted-foreground mt-2 bg-muted/50 rounded px-2 py-1">{ex.obs}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Config */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Configuração</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Qtd. Filhos Investigantes</Label>
                <Input type="number" min="1" value={qtdFilhos} onChange={e => setQtdFilhos(e.target.value)} className="font-mono" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Beaker className="h-4 w-4 text-warning" /> Custos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><Label className="text-xs font-semibold">Valor Terceirizado</Label><Input value={valorTerceirizado} onChange={e => setValorTerceirizado(e.target.value)} placeholder="0,00" className="font-mono" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold">Valor do Kit</Label><Input value={valorKit} onChange={e => setValorKit(e.target.value)} placeholder="0,00" className="font-mono" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold">Comissão</Label><Input value={comissao} onChange={e => setComissao(e.target.value)} placeholder="0,00" className="font-mono" /></div>
              <Separator />
              <div className="flex justify-between text-sm font-semibold"><span>Custo Total</span><span className="font-mono text-warning">{fmt(custoTotal)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Scale className="h-4 w-4 text-primary" /> Regime Tributário</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={regime} onValueChange={v => { setRegime(v as RegimeTrib); setTaxOverrides({}); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                  <SelectItem value="gralab">
                    <span className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-chart-4" /> GRALAB — Unificado 18%
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {regime === "gralab" && (
                <div className="rounded-lg border border-chart-4/30 bg-chart-4/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-chart-4" />
                    <p className="text-sm font-bold text-chart-4">GRALAB</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Todos os impostos consolidados em uma única alíquota de <strong>18%</strong>.</p>
                </div>
              )}

              {regime !== "gralab" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tipo de Nota Fiscal</Label>
                  <Select value={nfModality} onValueChange={v => setNfModality(v as NfModality)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servico">NF Serviço (Saúde)</SelectItem>
                      <SelectItem value="produto">NF Produto (ICMS)</SelectItem>
                      <SelectItem value="ecommerce">NF E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {regime === "simples_nacional" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Faturamento Anual (R$)</Label>
                  <Input value={faturamentoAnual} onChange={e => setFaturamentoAnual(e.target.value)} className="font-mono" />
                  <p className="text-xs text-muted-foreground">Alíquota efetiva: {simplesAliquotaEfetiva.toFixed(2)}%</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor de Venda (opcional)</Label>
                <Input value={valorVendaCustom} onChange={e => setValorVendaCustom(e.target.value)} placeholder={valorTabela.toFixed(2).replace(".", ",")} className="font-mono" />
                <p className="text-xs text-muted-foreground">Tabela: {fmt(valorTabela)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-success" /> Resultado</CardTitle>
              <CardDescription>{exam.label} · {taxInfo.label}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-primary/5 p-3 text-center"><p className="text-xs text-muted-foreground">Venda</p><p className="text-xl font-bold text-primary font-mono">{fmt(valorVenda)}</p></div>
                <div className="rounded-xl border bg-warning/5 p-3 text-center"><p className="text-xs text-muted-foreground">Custo</p><p className="text-xl font-bold text-warning font-mono">{fmt(custoTotal)}</p></div>
                <div className="rounded-xl border bg-destructive/5 p-3 text-center"><p className="text-xs text-muted-foreground">Impostos ({totalTaxRate.toFixed(1)}%)</p><p className="text-xl font-bold text-destructive font-mono">{fmt(totalTaxValue)}</p></div>
                <div className={`rounded-xl border p-3 text-center ${lucroLiquido >= 0 ? "bg-success/5" : "bg-destructive/5"}`}><p className="text-xs text-muted-foreground">Lucro Líquido</p><p className={`text-xl font-bold font-mono ${lucroLiquido >= 0 ? "text-success" : "text-destructive"}`}>{fmt(lucroLiquido)}</p><p className="text-xs text-muted-foreground">Margem: {margemLiquida.toFixed(1)}%</p></div>
              </div>

              {valorVenda > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Composição</p>
                  <div className="flex h-8 w-full overflow-hidden rounded-full">
                    {custoTotal > 0 && <div className="bg-warning flex items-center justify-center text-xs font-semibold text-white" style={{ width: `${(custoTotal / valorVenda * 100).toFixed(1)}%` }}>Custo</div>}
                    <div className="bg-destructive flex items-center justify-center text-xs font-semibold text-white" style={{ width: `${(totalTaxValue / valorVenda * 100).toFixed(1)}%` }}>Impostos</div>
                    <div className={`flex items-center justify-center text-xs font-semibold text-white ${lucroLiquido >= 0 ? "bg-success" : "bg-destructive/60"}`} style={{ width: `${Math.max((Math.max(lucroLiquido, 0) / valorVenda) * 100, 0).toFixed(1)}%` }}>Lucro</div>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Detalhamento — {taxInfo.label}</p>
                  {Object.keys(taxOverrides).length > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => { setTaxOverrides({}); toast.success("Alíquotas restauradas!"); }}>
                      <RotateCcw className="h-3 w-3" /> Restaurar
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {taxInfo.taxes.map(tax => {
                    const value = valorVenda * (tax.rate / 100);
                    const isEditing = editingTax === tax.name;
                    const isOverridden = taxOverrides[tax.name] !== undefined;
                    return (
                      <div key={tax.name} className={`flex items-center justify-between rounded-lg border p-3 ${isOverridden ? "border-primary/30 bg-primary/5" : ""}`}>
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={editingTaxValue}
                                onChange={e => setEditingTaxValue(e.target.value)}
                                className="font-mono w-20 h-7 text-xs"
                                autoFocus
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    const val = parseFloat(editingTaxValue.replace(",", "."));
                                    if (!isNaN(val) && val >= 0) {
                                      setTaxOverrides(prev => ({ ...prev, [tax.name]: val }));
                                      toast.success(`${tax.name} alterado para ${val.toFixed(2)}%`);
                                    }
                                    setEditingTax(null);
                                  } else if (e.key === "Escape") {
                                    setEditingTax(null);
                                  }
                                }}
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                const val = parseFloat(editingTaxValue.replace(",", "."));
                                if (!isNaN(val) && val >= 0) {
                                  setTaxOverrides(prev => ({ ...prev, [tax.name]: val }));
                                  toast.success(`${tax.name} alterado para ${val.toFixed(2)}%`);
                                }
                                setEditingTax(null);
                              }}>
                                <Check className="h-3 w-3 text-success" />
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className={`font-mono w-16 justify-center cursor-pointer hover:bg-primary/10 transition-colors ${isOverridden ? "border-primary text-primary" : ""}`}
                              onClick={() => { setEditingTax(tax.name); setEditingTaxValue(tax.rate.toFixed(2).replace(".", ",")); }}
                            >
                              {tax.rate.toFixed(2)}%
                            </Badge>
                          )}
                          <div>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              {tax.name}
                              {!isEditing && (
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-40 hover:opacity-100" onClick={() => { setEditingTax(tax.name); setEditingTaxValue(tax.rate.toFixed(2).replace(".", ",")); }}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{tax.desc}</p>
                          </div>
                        </div>
                        <p className="font-mono font-semibold text-destructive">{fmt(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {nfModality === "servico" && regime !== "gralab" && (
                <>
                  <Separator />
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4 space-y-2">
                    <p className="text-sm font-semibold text-success flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Reforma Tributária (LC 214/2025)</p>
                    <p className="text-xs text-muted-foreground">Redução 60% para exames laboratoriais</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-md bg-card p-2"><p className="text-xs text-muted-foreground">Alíq. Reformada</p><p className="font-bold text-success font-mono">{aliquotaReforma.toFixed(1)}%</p></div>
                      <div className="rounded-md bg-card p-2"><p className="text-xs text-muted-foreground">Impostos</p><p className="font-bold text-success font-mono">{fmt(taxValueReforma)}</p></div>
                      <div className="rounded-md bg-card p-2"><p className="text-xs text-muted-foreground">Lucro</p><p className="font-bold text-success font-mono">{fmt(lucroReforma)}</p></div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPrecos;
