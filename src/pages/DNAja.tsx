import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Barcode, Calendar, AlertTriangle, CheckCircle2, Package, Receipt, DollarSign } from "lucide-react";
import { toast } from "sonner";

type NfType = "produto" | "servico" | "ecommerce" | "";

interface Sale {
  id: string;
  kit: string;
  date: string;
  kitPrice: string;
  salePrice: string;
  nfType: NfType;
}

const NF_LABELS: Record<string, string> = {
  produto: "NF Produto",
  servico: "NF Serviço",
  ecommerce: "NF E-commerce",
};

const DNAja = () => {
  const [kitCode, setKitCode] = useState("");
  const [kitPrice, setKitPrice] = useState("299,90");
  const [salePrice, setSalePrice] = useState("499,90");
  const [nfType, setNfType] = useState<NfType>("");
  const [sales, setSales] = useState<Sale[]>([
    { id: "1", kit: "DNA-2026-00041", date: "19/02/2026", kitPrice: "299,90", salePrice: "499,90", nfType: "produto" },
    { id: "2", kit: "DNA-2026-00040", date: "19/02/2026", kitPrice: "299,90", salePrice: "449,90", nfType: "servico" },
    { id: "3", kit: "DNA-2026-00039", date: "19/02/2026", kitPrice: "299,90", salePrice: "499,90", nfType: "ecommerce" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitCode.trim()) {
      toast.error("Digite ou bipe o código do kit");
      return;
    }
    if (!nfType) {
      toast.error("Selecione o tipo de nota fiscal");
      return;
    }
    const newSale: Sale = {
      id: Date.now().toString(),
      kit: kitCode,
      date: new Date().toLocaleDateString("pt-BR"),
      kitPrice,
      salePrice,
      nfType,
    };
    setSales([newSale, ...sales]);
    setKitCode("");
    toast.success("Venda registrada com sucesso!", {
      description: `Kit ${kitCode} · R$ ${salePrice} · ${NF_LABELS[nfType]}`,
    });
  };

  const generateNf = (sale: Sale) => {
    toast.success(`${NF_LABELS[sale.nfType]} gerada!`, {
      description: `Kit ${sale.kit} · R$ ${sale.salePrice}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-7 w-7 text-warning" />
          DNAjá - Venda Rápida
        </h1>
        <p className="text-muted-foreground">Registro de venda de kits de auto coleta</p>
      </div>

      <div className="rounded-lg border-2 border-warning/30 bg-warning/5 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <p className="font-semibold text-warning">SEM VALIDADE JUDICIAL</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Kit apenas informativo (Peace of Mind). Resultado sem validade judicial.
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Registrar Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kit" className="text-base font-semibold">Código do Kit</Label>
              <div className="relative">
                <Barcode className="absolute left-3 top-3 h-5 w-5 text-warning" />
                <Input
                  id="kit"
                  value={kitCode}
                  onChange={(e) => setKitCode(e.target.value)}
                  className="h-12 pl-11 text-lg font-mono"
                  placeholder="DNA-2026-XXXXX"
                  autoFocus
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" /> Valor do Kit (custo)
                </Label>
                <Input
                  value={kitPrice}
                  onChange={(e) => setKitPrice(e.target.value)}
                  placeholder="0,00"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-success" /> Valor da Venda (cliente)
                </Label>
                <Input
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0,00"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1">
                <Receipt className="h-4 w-4 text-primary" /> Tipo de Nota Fiscal
              </Label>
              <Select value={nfType} onValueChange={(v) => setNfType(v as NfType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de NF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">NF Produto</SelectItem>
                  <SelectItem value="servico">NF Serviço</SelectItem>
                  <SelectItem value="ecommerce">NF E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Data de venda: <strong>{new Date().toLocaleDateString("pt-BR")}</strong> (automática)
              </span>
            </div>

            <Button type="submit" size="lg" className="w-full text-base">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Registrar Venda
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendas do Dia ({sales.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Barcode className="h-4 w-4 text-warning" />
                  <div>
                    <p className="font-mono font-medium">{sale.kit}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.date} · Custo: R$ {sale.kitPrice} · Venda: R$ {sale.salePrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{NF_LABELS[sale.nfType] || "—"}</Badge>
                  <Button size="sm" variant="outline" onClick={() => generateNf(sale)}>
                    <Receipt className="mr-1 h-3 w-3" /> Gerar NF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DNAja;
