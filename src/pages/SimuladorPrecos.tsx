import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign, Calculator, TrendingUp, CreditCard, Package,
  ShoppingCart, Gift, Receipt,
} from "lucide-react";

type Modalidade = "duo" | "trio" | "reconstituicao" | "perfil" | "dnaja";
type NfModality = "servico" | "produto" | "ecommerce" | "giftcard";

interface ExamPrice {
  label: string;
  base: number;
  icon: React.ElementType;
  color: string;
}

const EXAM_PRICES: Record<Modalidade, ExamPrice> = {
  duo: { label: "Duo (2 participantes)", base: 850, icon: Package, color: "text-primary" },
  trio: { label: "Trio (3 participantes)", base: 1200, icon: Package, color: "text-success" },
  reconstituicao: { label: "Reconstituição Genética", base: 2500, icon: Package, color: "text-chart-4" },
  perfil: { label: "Perfil Genético Individual", base: 600, icon: Package, color: "text-warning" },
  dnaja: { label: "DNAjá (Kit Auto Coleta)", base: 299.9, icon: Package, color: "text-info" },
};

interface TaxInfo {
  label: string;
  icon: React.ElementType;
  taxes: { name: string; rate: number; desc: string }[];
}

const TAX_INFO: Record<NfModality, TaxInfo> = {
  servico: {
    label: "NF Serviço",
    icon: Receipt,
    taxes: [
      { name: "ISS", rate: 5.0, desc: "Imposto Sobre Serviços" },
      { name: "PIS", rate: 0.65, desc: "Programa de Integração Social" },
      { name: "COFINS", rate: 3.0, desc: "Contribuição para Financiamento da Seguridade Social" },
      { name: "IRPJ", rate: 4.8, desc: "Imposto de Renda Pessoa Jurídica (presumido)" },
      { name: "CSLL", rate: 2.88, desc: "Contribuição Social sobre o Lucro Líquido" },
    ],
  },
  produto: {
    label: "NF Produto",
    icon: ShoppingCart,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "Imposto sobre Circulação de Mercadorias (SP)" },
      { name: "PIS", rate: 1.65, desc: "Programa de Integração Social" },
      { name: "COFINS", rate: 7.6, desc: "Contribuição para Financiamento da Seguridade Social" },
      { name: "IPI", rate: 0.0, desc: "Imposto sobre Produtos Industrializados (isento)" },
    ],
  },
  ecommerce: {
    label: "NF E-commerce",
    icon: CreditCard,
    taxes: [
      { name: "ICMS", rate: 18.0, desc: "ICMS padrão (pode variar por estado)" },
      { name: "DIFAL", rate: 4.0, desc: "Diferencial de Alíquota (interestadual)" },
      { name: "PIS", rate: 1.65, desc: "Programa de Integração Social" },
      { name: "COFINS", rate: 7.6, desc: "Contribuição para Financiamento da Seguridade Social" },
      { name: "Taxa Marketplace", rate: 12.0, desc: "Comissão média de plataformas" },
    ],
  },
  giftcard: {
    label: "Gift Card",
    icon: Gift,
    taxes: [
      { name: "ISS", rate: 5.0, desc: "Imposto Sobre Serviços (sobre ativação)" },
      { name: "PIS", rate: 0.65, desc: "Programa de Integração Social" },
      { name: "COFINS", rate: 3.0, desc: "Contribuição para Financiamento da Seguridade Social" },
      { name: "IOF", rate: 0.38, desc: "Imposto sobre Operações Financeiras" },
    ],
  },
};

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SimuladorPrecos = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("duo");
  const [nfModality, setNfModality] = useState<NfModality>("servico");
  const [customPrice, setCustomPrice] = useState("");

  const exam = EXAM_PRICES[modalidade];
  const basePrice = customPrice ? parseFloat(customPrice.replace(",", ".")) || exam.base : exam.base;
  const taxInfo = TAX_INFO[nfModality];
  const totalTaxRate = taxInfo.taxes.reduce((acc, t) => acc + t.rate, 0);
  const totalTaxValue = basePrice * (totalTaxRate / 100);
  const netValue = basePrice - totalTaxValue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-7 w-7 text-success" /> Simulador de Valores e Impostos
        </h1>
        <p className="text-muted-foreground">Calcule custos por modalidade e carga tributária brasileira</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Config */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Configuração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Modalidade do Exame</Label>
              <Select value={modalidade} onValueChange={(v) => setModalidade(v as Modalidade)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(EXAM_PRICES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tipo de Nota Fiscal</Label>
              <Select value={nfModality} onValueChange={(v) => setNfModality(v as NfModality)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TAX_INFO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Valor de Venda (opcional)</Label>
              <Input
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder={exam.base.toFixed(2).replace(".", ",")}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Deixe vazio para usar o preço base: {fmt(exam.base)}
              </p>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-xs text-muted-foreground">Preço Base por Modalidade</p>
              {Object.entries(EXAM_PRICES).map(([, v]) => (
                <div key={v.label} className="flex justify-between text-sm">
                  <span>{v.label}</span>
                  <span className="font-mono font-semibold">{fmt(v.base)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" /> Resultado da Simulação
            </CardTitle>
            <CardDescription>
              {exam.label} · {taxInfo.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">Valor Bruto</p>
                <p className="text-2xl font-bold text-primary font-mono">{fmt(basePrice)}</p>
              </div>
              <div className="rounded-xl border bg-destructive/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Impostos ({totalTaxRate.toFixed(2)}%)</p>
                <p className="text-2xl font-bold text-destructive font-mono">{fmt(totalTaxValue)}</p>
              </div>
              <div className="rounded-xl border bg-success/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">Valor Líquido</p>
                <p className="text-2xl font-bold text-success font-mono">{fmt(netValue)}</p>
              </div>
            </div>

            {/* Tax breakdown */}
            <div>
              <p className="text-sm font-semibold mb-3">Detalhamento Tributário — {taxInfo.label}</p>
              <div className="space-y-2">
                {taxInfo.taxes.map((tax) => {
                  const value = basePrice * (tax.rate / 100);
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

            {/* Visual bar */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Composição do Valor</p>
              <div className="flex h-8 w-full overflow-hidden rounded-full">
                <div
                  className="bg-success flex items-center justify-center text-xs font-semibold text-white transition-all"
                  style={{ width: `${((netValue / basePrice) * 100).toFixed(1)}%` }}
                >
                  Líquido
                </div>
                <div
                  className="bg-destructive flex items-center justify-center text-xs font-semibold text-white transition-all"
                  style={{ width: `${((totalTaxValue / basePrice) * 100).toFixed(1)}%` }}
                >
                  Impostos
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Líquido: {((netValue / basePrice) * 100).toFixed(1)}%</span>
                <span>Impostos: {((totalTaxValue / basePrice) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimuladorPrecos;
