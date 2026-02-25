import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Barcode, Calendar, AlertTriangle, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";

interface Sale {
  id: string;
  kit: string;
  date: string;
}

const DNAja = () => {
  const [kitCode, setKitCode] = useState("");
  const [sales, setSales] = useState<Sale[]>([
    { id: "1", kit: "DNA-2026-00041", date: "19/02/2026" },
    { id: "2", kit: "DNA-2026-00040", date: "19/02/2026" },
    { id: "3", kit: "DNA-2026-00039", date: "19/02/2026" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitCode.trim()) {
      toast.error("Digite ou bipe o código do kit");
      return;
    }
    const newSale: Sale = {
      id: Date.now().toString(),
      kit: kitCode,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    setSales([newSale, ...sales]);
    setKitCode("");
    toast.success("Venda registrada com sucesso!", {
      description: `Kit ${kitCode} registrado.`,
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
                      {sale.date}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Registrado</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DNAja;
