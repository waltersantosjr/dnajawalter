import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, Calculator, TrendingUp, Package, Receipt,
  Clock, AlertTriangle, Beaker, Skull, Baby, Users, Info, Scale,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   TABELA COMERCIAL – VALORES REAIS
   ═══════════════════════════════════════════════ */

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
}

const TABELA: Record<Modalidade, ExamRow> = {
  duo_4d: { label: "Duo/Trio – 04 dias úteis", grupo: "Paternidade / Maternidade", entrega: "04 dias úteis", valorBase: 180, acrescimo: 80, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Baby },
  duo_48h: { label: "Duo/Trio – 48h Urgência", grupo: "Paternidade / Maternidade", entrega: "48 horas (Urgência)", valorBase: 495, acrescimo: 160, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Clock },
  duo_24h: { label: "Duo/Trio – 24h Emergência", grupo: "Paternidade / Maternidade", entrega: "24 horas (Emergência)", valorBase: 895, acrescimo: 320, acrescimoLabel: "por filho investigante (mesma mãe)", icon: AlertTriangle },
  rec_mae_pai: { label: "Reconstituição – Mãe e Pai (Avós)", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 600, acrescimo: 150, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, obs: "Com mãe do filho investigante. Padrão Ouro." },
  rec_3par: { label: "Reconstituição – 3 Parentes 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, obs: "Com mãe. Alta robustez estatística." },
  rec_2par: { label: "Reconstituição – 2 Parentes 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, obs: "Com mãe. Boa configuração." },
  rec_1par: { label: "Reconstituição – 1 Parente 1º Grau", grupo: "Reconstituição Genética", entrega: "10 dias úteis", valorBase: 999, acrescimo: 350, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Users, obs: "Com mãe obrigatória. Zona cinzenta possível." },
  post_mortem: { label: "Investigação Post Mortem", grupo: "Post Mortem", entrega: "30 dias", valorBase: 7900, acrescimo: 2000, acrescimoLabel: "por filho investigante (mesma mãe)", icon: Skull, obs: "Fêmur ou 5 dentes livres de restauração. Requer autorização judicial." },
  dnaja: { label: "DNAjá – Kit Auto Coleta", grupo: "DNAjá", entrega: "5 dias úteis", valorBase: 299.9, acrescimo: 0, acrescimoLabel: "—", icon: Package, obs: "Apenas informativo (Peace of Mind). Sem validade judicial." },
};

/* ═══════════════════════════════════════════════
   IMPOSTOS – LABORATÓRIOS – ESTADO DE SÃO PAULO
   Atualizado com índices reais 2025/2026
   ═══════════════════════════════════════════════ */

type RegimeTrib = "lucro_presumido" | "simples_nacional";
type NfModality = "servico" | "produto" | "ecommerce";

interface TaxInfo {
  label: string;
  icon: React.ElementType;
  taxes: { name: string; rate: number; desc: string }[];
}

const TAX_INFO_LP: Record<NfModality, TaxInfo> = {
  servico: {
    label: "NF Serviço (Saúde – SP) · Lucro Presumido",
    icon: Receipt,
    taxes: [
      { name: "ISS", rate: 5.0, desc: "ISS município de São Paulo – alíquota padrão (mínimo legal 2%). Recolhido no município de coleta do material (STJ)." },
      { name: "PIS", rate: 0.65, desc: "Programa de Integração Social (Lucro Presumido – cumulativo)" },
      { name: "COFINS", rate: 3.0, desc: "Contribuição para Financiamento da Seguridade Social (cumulativo)" },
      { name: "IRPJ", rate: 1.2, desc: "IR Pessoa Jurídica — base reduzida 8% (equiparação hospitalar ANVISA) × 15% = 1,2%" },
      { name: "CSLL", rate: 1.08, desc: "CSLL — base reduzida 12% (equiparação hospitalar) × 9% = 1,08%" },
    ],
  },
  produto: {
    label: "NF Produto (ICMS – SP) · Lucro Presumido",
    icon: Package,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "Imposto sobre Circulação de Mercadorias – SP" },
      { name: "PIS", rate: 1.65, desc: "PIS não-cumulativo" },
      { name: "COFINS", rate: 7.6, desc: "COFINS não-cumulativo" },
      { name: "IPI", rate: 0.0, desc: "IPI (isento para kits diagnóstico)" },
    ],
  },
  ecommerce: {
    label: "NF E-commerce (Marketplace – SP) · Lucro Presumido",
    icon: TrendingUp,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "ICMS padrão SP" },
      { name: "DIFAL", rate: 4.0, desc: "Diferencial de Alíquota (venda interestadual)" },
      { name: "PIS", rate: 1.65, desc: "PIS não-cumulativo" },
      { name: "COFINS", rate: 7.6, desc: "COFINS não-cumulativo" },
      { name: "Taxa Marketplace", rate: 12.0, desc: "Comissão média da plataforma (Mercado Livre, etc.)" },
    ],
  },
};

// Simples Nacional - Anexo V (serviços de saúde)
const SIMPLES_FAIXAS = [
  { ate: 180000, aliquota: 15.5, deducao: 0, label: "Até R$ 180 mil" },
  { ate: 360000, aliquota: 18.0, deducao: 4500, label: "R$ 180 mil – R$ 360 mil" },
  { ate: 720000, aliquota: 19.5, deducao: 9900, label: "R$ 360 mil – R$ 720 mil" },
  { ate: 1800000, aliquota: 20.5, deducao: 17100, label: "R$ 720 mil – R$ 1,8 mi" },
  { ate: 3600000, aliquota: 23.0, deducao: 62100, label: "R$ 1,8 mi – R$ 3,6 mi" },
  { ate: 4800000, aliquota: 30.5, deducao: 540000, label: "R$ 3,6 mi – R$ 4,8 mi" },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

const SimuladorPrecos = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("duo_4d");
  const [nfModality, setNfModality] = useState<NfModality>("servico");
  const [regime, setRegime] = useState<RegimeTrib>("lucro_presumido");
  const [qtdFilhos, setQtdFilhos] = useState("1");
  const [valorTerceirizado, setValorTerceirizado] = useState("");
  const [valorKit, setValorKit] = useState("");
  const [valorVendaCustom, setValorVendaCustom] = useState("");
  const [faturamentoAnual, setFaturamentoAnual] = useState("360000");

  const exam = TABELA[modalidade];
  const filhos = Math.max(parseInt(qtdFilhos) || 1, 1);
  const acrescimoTotal = exam.acrescimo * Math.max(filhos - 1, 0);
  const valorTabela = exam.valorBase + acrescimoTotal;

  const valorVenda = valorVendaCustom
    ? parseFloat(valorVendaCustom.replace(",", ".")) || valorTabela
    : valorTabela;

  const custoTerc = valorTerceirizado ? parseFloat(valorTerceirizado.replace(",", ".")) || 0 : 0;
  const custoKit = valorKit ? parseFloat(valorKit.replace(",", ".")) || 0 : 0;
  const custoTotal = custoTerc + custoKit;

  // Tax calc based on regime
  let taxInfo: TaxInfo;
  let totalTaxRate: number;
  let totalTaxValue: number;
  let simplesAliquotaEfetiva = 0;

  if (regime === "lucro_presumido") {
    taxInfo = TAX_INFO_LP[nfModality];
    totalTaxRate = taxInfo.taxes.reduce((acc, t) => acc + t.rate, 0);
    totalTaxValue = valorVenda * (totalTaxRate / 100);
  } else {
    // Simples Nacional
    const fat = parseFloat(faturamentoAnual) || 360000;
    const faixa = SIMPLES_FAIXAS.find(f => fat <= f.ate) || SIMPLES_FAIXAS[SIMPLES_FAIXAS.length - 1];
    simplesAliquotaEfetiva = ((fat * (faixa.aliquota / 100)) - faixa.deducao) / fat * 100;
    totalTaxRate = simplesAliquotaEfetiva;
    totalTaxValue = valorVenda * (totalTaxRate / 100);
    taxInfo = {
      label: `Simples Nacional – Anexo V (${faixa.label})`,
      icon: Receipt,
      taxes: [
        { name: "DAS Unificado", rate: simplesAliquotaEfetiva, desc: `Alíquota efetiva Simples Nacional (nominal ${faixa.aliquota}% - dedução ${fmt(faixa.deducao)})` },
      ],
    };
  }

  const lucroLiquido = valorVenda - totalTaxValue - custoTotal;
  const margemLiquida = valorVenda > 0 ? (lucroLiquido / valorVenda) * 100 : 0;

  // Reforma tributária calc
  const aliquotaReforma = totalTaxRate * 0.4; // 60% reduction
  const taxValueReforma = valorVenda * (aliquotaReforma / 100);
  const lucroReforma = valorVenda - taxValueReforma - custoTotal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-7 w-7 text-success" /> Calculadora DNAjá
        </h1>
        <p className="text-muted-foreground">Tabela comercial · Custos · Impostos laboratórios SP · Índices atualizados 2025/2026</p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-info/20 bg-info/5 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong className="text-info">ISS SP:</strong> 5% na cidade de São Paulo. O ISS deve ser pago ao município onde a coleta do material ocorre (STJ). Mínimo legal: 2%.</p>
            <p><strong className="text-info">Equiparação Hospitalar:</strong> Laboratórios organizados como sociedade empresária (ANVISA) reduzem base IRPJ p/ 8% e CSLL p/ 12%.</p>
            <p><strong className="text-info">Reforma Tributária (LC 214/2025):</strong> Prevê redução de 60% na alíquota padrão para exames laboratoriais e de imagem.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Config Column */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Modalidade do Exame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={modalidade} onValueChange={(v) => { setModalidade(v as Modalidade); setValorVendaCustom(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="duo_4d">Duo/Trio – 04 dias úteis</SelectItem>
                  <SelectItem value="duo_48h">Duo/Trio – 48h Urgência</SelectItem>
                  <SelectItem value="duo_24h">Duo/Trio – 24h Emergência</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="rec_mae_pai">Reconstituição – Avós + Mãe</SelectItem>
                  <SelectItem value="rec_3par">Reconstituição – 3 Parentes</SelectItem>
                  <SelectItem value="rec_2par">Reconstituição – 2 Parentes</SelectItem>
                  <SelectItem value="rec_1par">Reconstituição – 1 Parente</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="post_mortem">Post Mortem (Exumação)</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="dnaja">DNAjá – Kit Auto Coleta</SelectItem>
                </SelectContent>
              </Select>
              {exam.obs && <p className="text-xs text-muted-foreground rounded-md bg-muted/50 p-2">{exam.obs}</p>}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Qtd. Filhos Investigantes</Label>
                <Input type="number" min="1" value={qtdFilhos} onChange={(e) => setQtdFilhos(e.target.value)} className="font-mono" />
                <p className="text-xs text-muted-foreground">Acréscimo: {fmt(exam.acrescimo)} {exam.acrescimoLabel}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Beaker className="h-4 w-4 text-warning" /> Custos do Exame
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor Terceirizado (laboratório)</Label>
                <Input value={valorTerceirizado} onChange={(e) => setValorTerceirizado(e.target.value)} placeholder="0,00" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor do Kit</Label>
                <Input value={valorKit} onChange={(e) => setValorKit(e.target.value)} placeholder="0,00" className="font-mono" />
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Custo Total</span>
                <span className="font-mono text-warning">{fmt(custoTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Regime Tributário */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> Regime Tributário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={regime} onValueChange={(v) => setRegime(v as RegimeTrib)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="simples_nacional">Simples Nacional (Anexo V)</SelectItem>
                </SelectContent>
              </Select>

              {regime === "lucro_presumido" && (
                <Select value={nfModality} onValueChange={(v) => setNfModality(v as NfModality)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servico">NF Serviço (Saúde – SP)</SelectItem>
                    <SelectItem value="produto">NF Produto (ICMS – SP)</SelectItem>
                    <SelectItem value="ecommerce">NF E-commerce (Marketplace)</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {regime === "simples_nacional" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Faturamento Anual (R$)</Label>
                  <Input value={faturamentoAnual} onChange={(e) => setFaturamentoAnual(e.target.value)} className="font-mono" placeholder="360000" />
                  <p className="text-xs text-muted-foreground">Alíquota efetiva: {simplesAliquotaEfetiva.toFixed(2)}%</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor de Venda (opcional)</Label>
                <Input value={valorVendaCustom} onChange={(e) => setValorVendaCustom(e.target.value)} placeholder={valorTabela.toFixed(2).replace(".", ",")} className="font-mono" />
                <p className="text-xs text-muted-foreground">Valor da tabela: {fmt(valorTabela)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" /> Resultado da Simulação
              </CardTitle>
              <CardDescription>
                {exam.label} · {taxInfo.label} · {filhos} filho(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Valor Venda</p>
                  <p className="text-xl font-bold text-primary font-mono">{fmt(valorVenda)}</p>
                </div>
                <div className="rounded-xl border bg-warning/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Custo Total</p>
                  <p className="text-xl font-bold text-warning font-mono">{fmt(custoTotal)}</p>
                </div>
                <div className="rounded-xl border bg-destructive/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Impostos ({totalTaxRate.toFixed(1)}%)</p>
                  <p className="text-xl font-bold text-destructive font-mono">{fmt(totalTaxValue)}</p>
                </div>
                <div className={`rounded-xl border p-3 text-center ${lucroLiquido >= 0 ? "bg-success/5" : "bg-destructive/5"}`}>
                  <p className="text-xs text-muted-foreground">Lucro Líquido</p>
                  <p className={`text-xl font-bold font-mono ${lucroLiquido >= 0 ? "text-success" : "text-destructive"}`}>{fmt(lucroLiquido)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Margem: {margemLiquida.toFixed(1)}%</p>
                </div>
              </div>

              {/* Composition bar */}
              {valorVenda > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Composição do Valor de Venda</p>
                  <div className="flex h-8 w-full overflow-hidden rounded-full">
                    {custoTotal > 0 && (
                      <div className="bg-warning flex items-center justify-center text-xs font-semibold text-white transition-all" style={{ width: `${(custoTotal / valorVenda * 100).toFixed(1)}%` }}>Custo</div>
                    )}
                    <div className="bg-destructive flex items-center justify-center text-xs font-semibold text-white transition-all" style={{ width: `${(totalTaxValue / valorVenda * 100).toFixed(1)}%` }}>Impostos</div>
                    <div className={`flex items-center justify-center text-xs font-semibold text-white transition-all ${lucroLiquido >= 0 ? "bg-success" : "bg-destructive/60"}`} style={{ width: `${Math.max((Math.max(lucroLiquido, 0) / valorVenda) * 100, 0).toFixed(1)}%` }}>Lucro</div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Tax breakdown */}
              <div>
                <p className="text-sm font-semibold mb-3">Detalhamento Tributário — {taxInfo.label}</p>
                <div className="space-y-2">
                  {taxInfo.taxes.map((tax) => {
                    const value = valorVenda * (tax.rate / 100);
                    return (
                      <div key={tax.name} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono w-16 justify-center">{tax.rate.toFixed(2)}%</Badge>
                          <div>
                            <p className="text-sm font-semibold">{tax.name}</p>
                            <p className="text-xs text-muted-foreground">{tax.desc}</p>
                          </div>
                        </div>
                        <p className="font-mono font-semibold text-destructive">{fmt(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reforma Tributária preview */}
              {regime === "lucro_presumido" && nfModality === "servico" && (
                <>
                  <Separator />
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4 space-y-2">
                    <p className="text-sm font-semibold text-success flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Projeção Reforma Tributária (LC 214/2025)
                    </p>
                    <p className="text-xs text-muted-foreground">Redução de 60% na alíquota para exames laboratoriais e de imagem</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-md bg-card p-2">
                        <p className="text-xs text-muted-foreground">Alíquota Reformada</p>
                        <p className="font-bold text-success font-mono">{aliquotaReforma.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-md bg-card p-2">
                        <p className="text-xs text-muted-foreground">Impostos c/ Reforma</p>
                        <p className="font-bold text-success font-mono">{fmt(taxValueReforma)}</p>
                      </div>
                      <div className="rounded-md bg-card p-2">
                        <p className="text-xs text-muted-foreground">Lucro c/ Reforma</p>
                        <p className="font-bold text-success font-mono">{fmt(lucroReforma)}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Commercial table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-chart-4" /> Tabela Comercial Completa
              </CardTitle>
              <CardDescription>Valores base por modalidade + acréscimo por filho investigante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-3 text-left font-semibold">Modalidade</th>
                      <th className="py-2 pr-3 text-left font-semibold">Entrega</th>
                      <th className="py-2 pr-3 text-right font-semibold">Valor Base</th>
                      <th className="py-2 text-right font-semibold">Acréscimo/Filho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(TABELA).map(([key, row]) => {
                      const isActive = key === modalidade;
                      return (
                        <tr key={key} className={`border-b last:border-0 cursor-pointer transition-colors ${isActive ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"}`} onClick={() => { setModalidade(key as Modalidade); setValorVendaCustom(""); }}>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2">
                              {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
                              <span className={isActive ? "text-primary" : ""}>{row.label}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-muted-foreground">{row.entrega}</td>
                          <td className="py-2.5 pr-3 text-right font-mono">{fmt(row.valorBase)}</td>
                          <td className="py-2.5 text-right font-mono">{row.acrescimo > 0 ? fmt(row.acrescimo) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pontos Chave */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-info" /> Pontos Chave — Impostos Laboratórios SP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="font-semibold text-foreground text-sm">ISS (Imposto Sobre Serviços)</p>
                <p>Alíquota de 5% na cidade de São Paulo. O ISS deve ser pago ao município onde a coleta do material ocorre, e não onde o exame é processado (decisões STJ). Mínimo legal: 2%.</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="font-semibold text-foreground text-sm">Equiparação Hospitalar (IRPJ/CSLL)</p>
                <p>Laboratórios podem reduzir a base de cálculo para IRPJ (8%) e CSLL (12%) se organizados como sociedade empresária e atendendo normas ANVISA, resultando em menor carga tributária federal.</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="font-semibold text-foreground text-sm">Simples Nacional</p>
                <p>Laboratórios podem optar pelo Simples Nacional, pagando alíquotas progressivas (a partir de 15,5%) baseadas no faturamento, conforme o Anexo V.</p>
              </div>
              <div className="rounded-lg bg-success/5 border border-success/20 p-3 space-y-1">
                <p className="font-semibold text-success text-sm">Reforma Tributária (LC 214/2025)</p>
                <p>Prevê uma redução de 60% na alíquota padrão para exames laboratoriais e de imagem, reconhecendo a essencialidade dos serviços de saúde.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPrecos;
