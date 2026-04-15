import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DollarSign, Calculator, TrendingUp, Package, Receipt,
  Clock, AlertTriangle, Beaker, Skull, Baby, Users, Info, Scale,
  Pencil, Check, RotateCcw, Shield, Store, Globe, Building2, Truck,
  ChevronDown, CreditCard, BarChart3, Settings2, Target, Percent, Tag,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types & Data ─── */

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

/* ─── Channel Definitions for Comparison ─── */

interface CanalComparativo {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
}

const CANAIS_COMP: CanalComparativo[] = [
  { key: "b2b", label: "B2B", icon: Building2, color: "border-border", activeColor: "border-success text-success" },
  { key: "site", label: "Site", icon: Globe, color: "border-border", activeColor: "border-success text-success" },
  { key: "voucher", label: "Voucher", icon: Tag, color: "border-border", activeColor: "border-success text-success" },
];

/* ─── Component ─── */

const SimuladorPrecos = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("duo_4d");
  const [nfModality, setNfModality] = useState<NfModality>("servico");
  const [regime, setRegime] = useState<RegimeTrib>("lucro_presumido");
  const [faturamentoAnual, setFaturamentoAnual] = useState("360000");
  const [taxOverrides, setTaxOverrides] = useState<Record<string, number>>({});
  const [editingTax, setEditingTax] = useState<string | null>(null);
  const [editingTaxValue, setEditingTaxValue] = useState("");
  const [paramsOpen, setParamsOpen] = useState(true);

  // Parâmetros macro
  const [custoKit, setCustoKit] = useState("10");
  const [custoExame, setCustoExame] = useState("99.90");
  const [taxaPagamento, setTaxaPagamento] = useState("0");
  const [precoB2B, setPrecoB2B] = useState("179");
  const [precoSite, setPrecoSite] = useState("499");
  const [precoVoucher, setPrecoVoucher] = useState("99");
  const [precoPromo, setPrecoPromo] = useState("399");
  const [simplesRate, setSimplesRate] = useState("18");
  const [nfProd, setNfProd] = useState("0");
  const [nfServ, setNfServ] = useState("0");
  const [volumeMes, setVolumeMes] = useState("1");
  const [pctRetorno, setPctRetorno] = useState("85");
  const [pctAtivacao, setPctAtivacao] = useState("70");

  const p = (s: string) => parseFloat(s.replace(",", ".")) || 0;

  const exam = TABELA[modalidade];

  // ── Cálculos de custo fixo e precificação (ref imagens) ──
  const custoFixoMedio = 260000;
  const custoOperacionalMedio = 390000;
  const subtotalCustos = custoFixoMedio + custoOperacionalMedio;
  const receitaLiquidaMedia = 2387371.87;
  const cfMedio = (subtotalCustos / receitaLiquidaMedia) * 100; // ~27.23%

  const custoFixoPct = (custoFixoMedio / receitaLiquidaMedia) * 100; // ~10.89
  const custoOpPct = (custoOperacionalMedio / receitaLiquidaMedia) * 100; // ~16.34

  // Precificação breakdown
  const impostosPrecif = {
    pis: 0.65,
    cofins: 3.0,
    csll: 1.0,
    ir: 1.5,
    iss: 2.0,
  };
  const totalImpostosPrecif = Object.values(impostosPrecif).reduce((a, b) => a + b, 0); // 8.15%
  const custoOperacionalMedioPct = custoOpPct;
  const custoTotalVenda = custoFixoPct + custoOperacionalMedioPct + totalImpostosPrecif; // ~37.04
  const mkd = (100 - custoTotalVenda) / 100; // ~0.63
  const mkm = mkd > 0 ? 1 / mkd : 0; // ~1.59

  const custoUnitarioInsumo = p(custoExame);
  const precoMinimo = custoUnitarioInsumo * mkm;

  // ── Comparativo de Canais ──
  const vol = p(volumeMes);
  const kit = p(custoKit);
  const exameC = p(custoExame);
  const taxPag = p(taxaPagamento) / 100;
  const simples = p(simplesRate) / 100;
  const retorno = p(pctRetorno) / 100;
  const ativacao = p(pctAtivacao) / 100;

  const calcCanal = (preco: number) => {
    const receita = preco * vol;
    const custos = (kit + exameC) * vol;
    const impostos = receita * simples;
    const taxPagVal = receita * taxPag;
    const lucro = receita - custos - impostos - taxPagVal;
    const margem = receita > 0 ? (lucro / receita) * 100 : 0;
    return { receita, custos, impostos, lucro, margem };
  };

  const canaisCalc = [
    { ...CANAIS_COMP[0], ...calcCanal(p(precoB2B)), preco: p(precoB2B) },
    { ...CANAIS_COMP[1], ...calcCanal(p(precoSite)), preco: p(precoSite) },
    { ...CANAIS_COMP[2], ...calcCanal(p(precoVoucher)), preco: p(precoVoucher) },
  ];

  const melhorCanal = canaisCalc.reduce((best, c) => c.lucro > best.lucro ? c : best, canaisCalc[0]);

  // ── Breakdown do valor médio de venda (usando preço Site como ref) ──
  const valorVendaMedio = p(precoB2B);
  const breakdownItems = [
    { label: "Custo Indireto", pct: custoFixoPct, value: valorVendaMedio * custoFixoPct / 100 },
    { label: "Imposto", pct: totalImpostosPrecif, value: valorVendaMedio * totalImpostosPrecif / 100 },
    { label: "Operacional", pct: custoOperacionalMedioPct, value: valorVendaMedio * custoOperacionalMedioPct / 100 },
    { label: "Custo Exame", pct: (exameC / valorVendaMedio) * 100, value: exameC },
    { label: "Markup", pct: 100 - custoFixoPct - totalImpostosPrecif - custoOperacionalMedioPct - (exameC / valorVendaMedio) * 100, value: valorVendaMedio - (valorVendaMedio * custoFixoPct / 100) - (valorVendaMedio * totalImpostosPrecif / 100) - (valorVendaMedio * custoOperacionalMedioPct / 100) - exameC },
  ];

  // Tax info for detail section
  let taxInfo: TaxInfo;
  let totalTaxRate: number;

  const applyOverrides = (taxes: { name: string; rate: number; desc: string }[]) =>
    taxes.map(t => ({ ...t, rate: taxOverrides[t.name] !== undefined ? taxOverrides[t.name] : t.rate }));

  let simplesAliquotaEfetiva = 0;

  if (regime === "gralab") {
    const baseTaxes = [{ name: "GRALAB Unificado", rate: 18.0, desc: "Alíquota unificada GRALAB — todos os impostos consolidados em 18%" }];
    const adjustedTaxes = applyOverrides(baseTaxes);
    totalTaxRate = adjustedTaxes.reduce((acc, t) => acc + t.rate, 0);
    taxInfo = { label: "GRALAB — Imposto Unificado 18%", icon: Shield, taxes: adjustedTaxes };
  } else if (regime === "lucro_presumido") {
    taxInfo = TAX_INFO_LP[nfModality];
    taxInfo = { ...taxInfo, taxes: applyOverrides(taxInfo.taxes) };
    totalTaxRate = taxInfo.taxes.reduce((acc, t) => acc + t.rate, 0);
  } else {
    const fat = parseFloat(faturamentoAnual) || 360000;
    const faixa = SIMPLES_FAIXAS.find(f => fat <= f.ate) || SIMPLES_FAIXAS[SIMPLES_FAIXAS.length - 1];
    simplesAliquotaEfetiva = ((fat * (faixa.aliquota / 100)) - faixa.deducao) / fat * 100;
    const baseTaxes = [{ name: "DAS Unificado", rate: simplesAliquotaEfetiva, desc: `Alíquota efetiva (nominal ${faixa.aliquota}% - dedução ${fmt(faixa.deducao)})` }];
    const adjustedTaxes = applyOverrides(baseTaxes);
    totalTaxRate = adjustedTaxes.reduce((acc, t) => acc + t.rate, 0);
    taxInfo = { label: `Simples Nacional – ${TAX_SIMPLES[nfModality].label} (${faixa.label})`, icon: Receipt, taxes: adjustedTaxes };
  }

  const totalTaxValue = valorVendaMedio * (totalTaxRate / 100);
  const lucroLiquido = valorVendaMedio - totalTaxValue - kit - exameC;
  const margemLiquida = valorVendaMedio > 0 ? (lucroLiquido / valorVendaMedio) * 100 : 0;
  const aliquotaReforma = totalTaxRate * 0.4;
  const taxValueReforma = valorVendaMedio * (aliquotaReforma / 100);
  const lucroReforma = valorVendaMedio - taxValueReforma - kit - exameC;

  const grupos = Object.entries(TABELA).reduce((acc, [key, row]) => {
    if (!acc[row.grupo]) acc[row.grupo] = [];
    acc[row.grupo].push({ key: key as Modalidade, ...row });
    return acc;
  }, {} as Record<string, (ExamRow & { key: Modalidade })[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator className="h-7 w-7 text-success" /> Calculadora DNAjá</h1>
        <p className="text-muted-foreground">Planejamento estratégico · Precificação · Comparativo de canais</p>
      </div>

      {/* ═══ PARÂMETROS (Collapsible) ═══ */}
      <Collapsible open={paramsOpen} onOpenChange={setParamsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-muted-foreground" />
                  PARÂMETROS
                </CardTitle>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${paramsOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* CUSTOS */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-destructive flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> CUSTOS</p>
                  <div className="space-y-2">
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Custo Kit</Label><Input value={custoKit} onChange={e => setCustoKit(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Custo Exame</Label><Input value={custoExame} onChange={e => setCustoExame(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Taxa Pagamento (%)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <Input value={taxaPagamento} onChange={e => setTaxaPagamento(e.target.value)} className="font-mono bg-muted/30" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Cartão/Boleto</p>
                    </div>
                  </div>
                </div>

                {/* PRECIFICAÇÃO */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-primary flex items-center gap-1.5"><Tag className="h-4 w-4" /> PRECIFICAÇÃO</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">B2B</Label><Input value={precoB2B} onChange={e => setPrecoB2B(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Site</Label><Input value={precoSite} onChange={e => setPrecoSite(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Voucher</Label><Input value={precoVoucher} onChange={e => setPrecoVoucher(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Promo</Label><Input value={precoPromo} onChange={e => setPrecoPromo(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                  </div>
                </div>

                {/* FISCAL */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-warning flex items-center gap-1.5"><Receipt className="h-4 w-4" /> FISCAL</p>
                  <div className="space-y-2">
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Simples (%)</Label><Input value={simplesRate} onChange={e => setSimplesRate(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">NF Prod</Label><Input value={nfProd} onChange={e => setNfProd(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                      <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">NF Serv</Label><Input value={nfServ} onChange={e => setNfServ(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    </div>
                  </div>
                </div>

                {/* PREMISSAS */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-chart-4 flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> PREMISSAS</p>
                  <div className="space-y-2">
                    <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">Volume/Mês</Label><Input value={volumeMes} onChange={e => setVolumeMes(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">% Retorno</Label><Input value={pctRetorno} onChange={e => setPctRetorno(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                      <div><Label className="text-xs text-muted-foreground uppercase tracking-wide">% Ativação</Label><Input value={pctAtivacao} onChange={e => setPctAtivacao(e.target.value)} className="font-mono mt-1 bg-muted/30" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* ═══ COMPARATIVO DE CANAIS ═══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-success" />
            Comparativo de Canais
          </CardTitle>
          <CardDescription>Simulação de resultado para venda de <strong>{vol}</strong> unidades em cada canal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {canaisCalc.map(c => {
              const isBest = c.key === melhorCanal.key;
              const Icon = c.icon;
              return (
                <Card key={c.key} className={`transition-all ${isBest ? "border-2 border-success shadow-lg" : "border"}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${isBest ? "text-success" : "text-muted-foreground"}`} />
                        <span className="font-bold text-lg">{c.label}</span>
                      </div>
                      {isBest && <Badge className="bg-success/10 text-success border-success/30 text-xs font-bold">MELHOR OPÇÃO</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Lucro Mensal</p>
                    <p className={`text-3xl font-bold font-mono ${isBest ? "text-success" : "text-foreground"}`}>{fmt(c.lucro)}</p>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-sm">
                      <div><p className="text-xs text-muted-foreground">Receita</p><p className="font-mono font-semibold">{fmt(c.receita)}</p></div>
                      <div className="text-right"><p className="text-xs text-muted-foreground">Margem</p><p className="font-mono font-semibold">{c.margem.toFixed(1)}%</p></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ═══ VALOR VENDA MEDIO + PRECIFICAÇÃO ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" /> Valor Venda Médio</CardTitle>
            <CardDescription>Composição de custos sobre {fmt(valorVendaMedio)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between font-bold border-b pb-2">
                <span>VALOR VENDA MEDIO</span>
                <span className="font-mono">{fmt(valorVendaMedio)}</span>
              </div>
              {breakdownItems.map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-mono">{item.pct.toFixed(0)}%</span>
                    <span className="font-mono w-24 text-right">{fmt(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Markup / Preço Mínimo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Target className="h-5 w-5 text-warning" /> Precificação & Markup</CardTitle>
            <CardDescription>Indicadores de formação de preço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-bold text-muted-foreground">Custos sobre Receita</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground">CF% Médio</p>
                  <p className="text-xl font-bold font-mono text-primary">{custoFixoPct.toFixed(2)}%</p>
                </div>
                <div className="rounded-lg border p-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground">CO% Médio</p>
                  <p className="text-xl font-bold font-mono text-primary">{custoOperacionalMedioPct.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-bold text-muted-foreground">Impostos (Precificação)</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(impostosPrecif).map(([k, v]) => (
                  <div key={k} className="rounded-md border p-2 text-center">
                    <p className="text-muted-foreground uppercase">{k}</p>
                    <p className="font-bold font-mono">{v.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>CTV (Custo Total Venda)</span>
                <span className="font-mono">{custoTotalVenda.toFixed(2)}%</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">MKD (PV-CTV)/100</p>
                <p className="text-2xl font-bold font-mono text-primary">{mkd.toFixed(2)}</p>
              </div>
              <div className="rounded-lg border-2 border-warning/30 bg-warning/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">MKM (1/MKD)</p>
                <p className="text-2xl font-bold font-mono text-warning">{mkm.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-lg bg-warning/10 border border-warning/30 p-4">
              <p className="text-xs text-muted-foreground">PREÇO MÍNIMO (Custo Insumo × MKM)</p>
              <p className="text-2xl font-bold font-mono text-warning">{fmt(precoMinimo)}</p>
              <p className="text-xs text-muted-foreground mt-1">Custo insumo: {fmt(custoUnitarioInsumo)} × Markup: {mkm.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ TABELA DE EXAMES ═══ */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Tabela Comercial</h2>
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
                    onClick={() => setModalidade(ex.key)}
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

      {/* ═══ DETALHAMENTO FISCAL ═══ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2"><Receipt className="h-5 w-5 text-warning" /> Detalhamento Fiscal</CardTitle>
              <CardDescription>{exam.label} · {taxInfo.label}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={regime} onValueChange={v => { setRegime(v as RegimeTrib); setTaxOverrides({}); }}>
                <SelectTrigger className="h-8 w-auto text-xs gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                  <SelectItem value="gralab">
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3 w-3 text-chart-4" /> GRALAB 18%
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {Object.keys(taxOverrides).length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => { setTaxOverrides({}); toast.success("Alíquotas restauradas!"); }}>
                  <RotateCcw className="h-3 w-3" /> Restaurar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
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
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs font-semibold">Tipo de Nota Fiscal</Label>
                <Select value={nfModality} onValueChange={v => setNfModality(v as NfModality)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servico">NF Serviço (Saúde)</SelectItem>
                    <SelectItem value="produto">NF Produto (ICMS)</SelectItem>
                    <SelectItem value="ecommerce">NF E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {regime === "simples_nacional" && (
                <div className="flex-1">
                  <Label className="text-xs font-semibold">Faturamento Anual (R$)</Label>
                  <Input value={faturamentoAnual} onChange={e => setFaturamentoAnual(e.target.value)} className="font-mono mt-1" />
                  <p className="text-xs text-muted-foreground">Efetiva: {simplesAliquotaEfetiva.toFixed(2)}%</p>
                </div>
              )}
            </div>
          )}

          {/* Resultado resumo */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-primary/5 p-3 text-center"><p className="text-xs text-muted-foreground">Venda</p><p className="text-xl font-bold text-primary font-mono">{fmt(valorVendaMedio)}</p></div>
            <div className="rounded-xl border bg-warning/5 p-3 text-center"><p className="text-xs text-muted-foreground">Custo</p><p className="text-xl font-bold text-warning font-mono">{fmt(kit + exameC)}</p></div>
            <div className="rounded-xl border bg-destructive/5 p-3 text-center"><p className="text-xs text-muted-foreground">Impostos ({totalTaxRate.toFixed(1)}%)</p><p className="text-xl font-bold text-destructive font-mono">{fmt(totalTaxValue)}</p></div>
            <div className={`rounded-xl border p-3 text-center ${lucroLiquido >= 0 ? "bg-success/5" : "bg-destructive/5"}`}><p className="text-xs text-muted-foreground">Lucro Líquido</p><p className={`text-xl font-bold font-mono ${lucroLiquido >= 0 ? "text-success" : "text-destructive"}`}>{fmt(lucroLiquido)}</p><p className="text-xs text-muted-foreground">Margem: {margemLiquida.toFixed(1)}%</p></div>
          </div>

          {/* Composição bar */}
          {valorVendaMedio > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Composição</p>
              <div className="flex h-8 w-full overflow-hidden rounded-full">
                {(kit + exameC) > 0 && <div className="bg-warning flex items-center justify-center text-xs font-semibold text-white" style={{ width: `${((kit + exameC) / valorVendaMedio * 100).toFixed(1)}%` }}>Custo</div>}
                <div className="bg-destructive flex items-center justify-center text-xs font-semibold text-white" style={{ width: `${(totalTaxValue / valorVendaMedio * 100).toFixed(1)}%` }}>Impostos</div>
                <div className={`flex items-center justify-center text-xs font-semibold text-white ${lucroLiquido >= 0 ? "bg-success" : "bg-destructive/60"}`} style={{ width: `${Math.max((Math.max(lucroLiquido, 0) / valorVendaMedio) * 100, 0).toFixed(1)}%` }}>Lucro</div>
              </div>
            </div>
          )}

          <Separator />

          {/* Tax detail rows */}
          <div className="space-y-2">
            {taxInfo.taxes.map(tax => {
              const value = valorVendaMedio * (tax.rate / 100);
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

      {/* ═══ INFO TENDÊNCIAS ═══ */}
      <div className="rounded-lg border border-info/20 bg-info/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong className="text-info">Mercado DTC (2025-2031):</strong> Crescimento de ~15% CAGR. Kits de auto coleta dominam vendas online com preços entre US$ 69–199.</p>
            <p><strong className="text-info">Tendência B2B:</strong> Laboratórios credenciados operam com margens de 15-25%. Volume compensa margem menor.</p>
            <p><strong className="text-info">Reforma Tributária (LC 214/2025):</strong> Redução de 60% para exames laboratoriais de saúde.</p>
            <p><strong className="text-info">Estratégia de preço:</strong> Segmentação por canal + urgência. DTC premium (Site) subsidia canal B2B de volume.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPrecos;
