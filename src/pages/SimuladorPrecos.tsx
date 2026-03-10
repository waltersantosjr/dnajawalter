import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign, Calculator, TrendingUp, Package, Receipt,
  Clock, AlertTriangle, Beaker, Skull, Baby, Users,
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
  duo_4d: {
    label: "Duo/Trio – 04 dias úteis",
    grupo: "Paternidade / Maternidade",
    entrega: "04 dias úteis",
    valorBase: 180,
    acrescimo: 80,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Baby,
  },
  duo_48h: {
    label: "Duo/Trio – 48h Urgência",
    grupo: "Paternidade / Maternidade",
    entrega: "48 horas (Urgência)",
    valorBase: 495,
    acrescimo: 160,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Clock,
  },
  duo_24h: {
    label: "Duo/Trio – 24h Emergência",
    grupo: "Paternidade / Maternidade",
    entrega: "24 horas (Emergência)",
    valorBase: 895,
    acrescimo: 320,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: AlertTriangle,
  },
  rec_mae_pai: {
    label: "Reconstituição – Mãe e Pai (Avós)",
    grupo: "Reconstituição Genética",
    entrega: "10 dias úteis",
    valorBase: 600,
    acrescimo: 150,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Users,
    obs: "Com mãe do filho investigante. Padrão Ouro.",
  },
  rec_3par: {
    label: "Reconstituição – 3 Parentes 1º Grau",
    grupo: "Reconstituição Genética",
    entrega: "10 dias úteis",
    valorBase: 999,
    acrescimo: 350,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Users,
    obs: "Com mãe. Alta robustez estatística.",
  },
  rec_2par: {
    label: "Reconstituição – 2 Parentes 1º Grau",
    grupo: "Reconstituição Genética",
    entrega: "10 dias úteis",
    valorBase: 999,
    acrescimo: 350,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Users,
    obs: "Com mãe. Boa configuração.",
  },
  rec_1par: {
    label: "Reconstituição – 1 Parente 1º Grau",
    grupo: "Reconstituição Genética",
    entrega: "10 dias úteis",
    valorBase: 999,
    acrescimo: 350,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Users,
    obs: "Com mãe obrigatória. Zona cinzenta possível.",
  },
  post_mortem: {
    label: "Investigação Post Mortem",
    grupo: "Post Mortem",
    entrega: "30 dias",
    valorBase: 7900,
    acrescimo: 2000,
    acrescimoLabel: "por filho investigante (mesma mãe)",
    icon: Skull,
    obs: "Fêmur ou 5 dentes livres de restauração. Requer autorização judicial.",
  },
  dnaja: {
    label: "DNAjá – Kit Auto Coleta",
    grupo: "DNAjá",
    entrega: "5 dias úteis",
    valorBase: 299.9,
    acrescimo: 0,
    acrescimoLabel: "—",
    icon: Package,
    obs: "Apenas informativo (Peace of Mind). Sem validade judicial.",
  },
};

/* ═══════════════════════════════════════════════
   IMPOSTOS – ÁREA SAÚDE – ESTADO DE SÃO PAULO
   ═══════════════════════════════════════════════ */

type NfModality = "servico" | "produto" | "ecommerce";

interface TaxInfo {
  label: string;
  icon: React.ElementType;
  taxes: { name: string; rate: number; desc: string }[];
}

const TAX_INFO: Record<NfModality, TaxInfo> = {
  servico: {
    label: "NF Serviço (Área Saúde – SP)",
    icon: Receipt,
    taxes: [
      { name: "ISS", rate: 2.0, desc: "Imposto Sobre Serviços – Saúde (alíquota reduzida SP)" },
      { name: "PIS", rate: 0.65, desc: "Programa de Integração Social (Lucro Presumido)" },
      { name: "COFINS", rate: 3.0, desc: "Contribuição para Financiamento da Seguridade Social" },
      { name: "IRPJ", rate: 1.2, desc: "IR Pessoa Jurídica (8% presunção × 15% alíquota = 1,2%)" },
      { name: "CSLL", rate: 1.08, desc: "CSLL (12% presunção saúde × 9% alíquota = 1,08%)" },
    ],
  },
  produto: {
    label: "NF Produto (ICMS – SP)",
    icon: Package,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "Imposto sobre Circulação de Mercadorias – SP" },
      { name: "PIS", rate: 1.65, desc: "PIS não-cumulativo" },
      { name: "COFINS", rate: 7.6, desc: "COFINS não-cumulativo" },
      { name: "IPI", rate: 0.0, desc: "IPI (isento para kits diagnóstico)" },
    ],
  },
  ecommerce: {
    label: "NF E-commerce (Marketplace – SP)",
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

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

const SimuladorPrecos = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("duo_4d");
  const [nfModality, setNfModality] = useState<NfModality>("servico");
  const [qtdFilhos, setQtdFilhos] = useState("1");
  const [valorTerceirizado, setValorTerceirizado] = useState("");
  const [valorKit, setValorKit] = useState("");
  const [valorVendaCustom, setValorVendaCustom] = useState("");

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

  const taxInfo = TAX_INFO[nfModality];
  const totalTaxRate = taxInfo.taxes.reduce((acc, t) => acc + t.rate, 0);
  const totalTaxValue = valorVenda * (totalTaxRate / 100);
  const lucroLiquido = valorVenda - totalTaxValue - custoTotal;
  const margemLiquida = valorVenda > 0 ? (lucroLiquido / valorVenda) * 100 : 0;

  const grupoAtual = exam.grupo;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-7 w-7 text-success" /> Simulador de Valores e Impostos
        </h1>
        <p className="text-muted-foreground">Tabela comercial real · Custos · Impostos área saúde SP</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ═══ Config Column ═══ */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Modalidade do Exame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={modalidade} onValueChange={(v) => { setModalidade(v as Modalidade); setValorVendaCustom(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="duo_4d" className="font-medium">Duo/Trio – 04 dias úteis</SelectItem>
                  <SelectItem value="duo_48h" className="font-medium">Duo/Trio – 48h Urgência</SelectItem>
                  <SelectItem value="duo_24h" className="font-medium">Duo/Trio – 24h Emergência</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="rec_mae_pai" className="font-medium">Reconstituição – Avós + Mãe</SelectItem>
                  <SelectItem value="rec_3par" className="font-medium">Reconstituição – 3 Parentes</SelectItem>
                  <SelectItem value="rec_2par" className="font-medium">Reconstituição – 2 Parentes</SelectItem>
                  <SelectItem value="rec_1par" className="font-medium">Reconstituição – 1 Parente</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="post_mortem" className="font-medium">Post Mortem (Exumação)</SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="dnaja" className="font-medium">DNAjá – Kit Auto Coleta</SelectItem>
                </SelectContent>
              </Select>

              {exam.obs && (
                <p className="text-xs text-muted-foreground rounded-md bg-muted/50 p-2">{exam.obs}</p>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Qtd. Filhos Investigantes</Label>
                <Input
                  type="number"
                  min="1"
                  value={qtdFilhos}
                  onChange={(e) => setQtdFilhos(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Acréscimo: {fmt(exam.acrescimo)} {exam.acrescimoLabel}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custos */}
          <Card className="border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Beaker className="h-4 w-4 text-warning" /> Custos do Exame
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor Terceirizado (laboratório)</Label>
                <Input
                  value={valorTerceirizado}
                  onChange={(e) => setValorTerceirizado(e.target.value)}
                  placeholder="0,00"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">Custo pago ao laboratório parceiro</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor do Kit</Label>
                <Input
                  value={valorKit}
                  onChange={(e) => setValorKit(e.target.value)}
                  placeholder="0,00"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">Custo do kit de coleta / material</p>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>Custo Total</span>
                <span className="font-mono text-warning">{fmt(custoTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* NF */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" /> Nota Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={nfModality} onValueChange={(v) => setNfModality(v as NfModality)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="servico">NF Serviço (Saúde – SP)</SelectItem>
                  <SelectItem value="produto">NF Produto (ICMS – SP)</SelectItem>
                  <SelectItem value="ecommerce">NF E-commerce (Marketplace)</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Valor de Venda (opcional)</Label>
                <Input
                  value={valorVendaCustom}
                  onChange={(e) => setValorVendaCustom(e.target.value)}
                  placeholder={valorTabela.toFixed(2).replace(".", ",")}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Valor da tabela: {fmt(valorTabela)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Results Column ═══ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary */}
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
              {/* KPI Cards */}
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
                  <p className={`text-xl font-bold font-mono ${lucroLiquido >= 0 ? "text-success" : "text-destructive"}`}>
                    {fmt(lucroLiquido)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Margem: {margemLiquida.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Composition bar */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Composição do Valor de Venda</p>
                {valorVenda > 0 && (
                  <>
                    <div className="flex h-8 w-full overflow-hidden rounded-full">
                      {custoTotal > 0 && (
                        <div
                          className="bg-warning flex items-center justify-center text-xs font-semibold text-white transition-all"
                          style={{ width: `${Math.max((custoTotal / valorVenda) * 100, 0).toFixed(1)}%` }}
                        >
                          Custo
                        </div>
                      )}
                      <div
                        className="bg-destructive flex items-center justify-center text-xs font-semibold text-white transition-all"
                        style={{ width: `${Math.max((totalTaxValue / valorVenda) * 100, 0).toFixed(1)}%` }}
                      >
                        Impostos
                      </div>
                      <div
                        className={`flex items-center justify-center text-xs font-semibold text-white transition-all ${lucroLiquido >= 0 ? "bg-success" : "bg-destructive/60"}`}
                        style={{ width: `${Math.max((Math.max(lucroLiquido, 0) / valorVenda) * 100, 0).toFixed(1)}%` }}
                      >
                        Lucro
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Custo: {((custoTotal / valorVenda) * 100).toFixed(1)}%</span>
                      <span>Impostos: {((totalTaxValue / valorVenda) * 100).toFixed(1)}%</span>
                      <span>Lucro: {margemLiquida.toFixed(1)}%</span>
                    </div>
                  </>
                )}
              </div>

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
                          <Badge variant="outline" className="font-mono w-16 justify-center">
                            {tax.rate.toFixed(2)}%
                          </Badge>
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
            </CardContent>
          </Card>

          {/* Tabela Comercial Completa */}
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
                        <tr
                          key={key}
                          className={`border-b last:border-0 cursor-pointer transition-colors ${
                            isActive ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"
                          }`}
                          onClick={() => { setModalidade(key as Modalidade); setValorVendaCustom(""); }}
                        >
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
        </div>
      </div>
    </div>
  );
};

export default SimuladorPrecos;
