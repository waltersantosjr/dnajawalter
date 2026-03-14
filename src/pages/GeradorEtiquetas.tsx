import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, Key, Copy, Download, Barcode } from "lucide-react";
import { toast } from "sonner";

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const GeradorEtiquetas = () => {
  const [prefix, setPrefix] = useState("DNA");
  const [start, setStart] = useState("1");
  const [qtd, setQtd] = useState("10");
  const [labels, setLabels] = useState<{ etiqueta: string; login: string; senha: string }[]>([]);

  const gerar = () => {
    const s = parseInt(start) || 1;
    const q = Math.min(parseInt(qtd) || 10, 200);
    const result = Array.from({ length: q }, (_, i) => ({
      etiqueta: `${prefix}${String(s + i).padStart(4, "0")}`,
      login: `${prefix.toLowerCase()}${String(s + i).padStart(4, "0")}`,
      senha: generatePassword(),
    }));
    setLabels(result);
    toast.success(`${q} etiquetas geradas!`);
  };

  const exportCSV = () => {
    const csv = "Etiqueta;Login;Senha\n" + labels.map(l => `${l.etiqueta};${l.login};${l.senha}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "etiquetas_dnaja.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Barcode className="h-7 w-7 text-chart-4" /> Gerador de Etiquetas DNAjá
        </h1>
        <p className="text-muted-foreground">Gere etiquetas vinculadas a login e senha de acesso ao resultado</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Tag className="h-5 w-5 text-chart-4" /> Configuração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Prefixo</Label>
              <Input value={prefix} onChange={e => setPrefix(e.target.value)} className="font-mono" placeholder="DNA" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nº Inicial</Label>
                <Input type="number" value={start} onChange={e => setStart(e.target.value)} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Quantidade</Label>
                <Input type="number" min="1" max="200" value={qtd} onChange={e => setQtd(e.target.value)} className="font-mono" />
              </div>
            </div>
            <Button onClick={gerar} className="w-full"><Key className="mr-2 h-4 w-4" /> Gerar Etiquetas</Button>
            {labels.length > 0 && (
              <Button variant="outline" onClick={exportCSV} className="w-full"><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Etiquetas Geradas</CardTitle>
            <CardDescription>{labels.length > 0 ? `${labels.length} etiquetas` : "Nenhuma etiqueta gerada"}</CardDescription>
          </CardHeader>
          <CardContent>
            {labels.length > 0 ? (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2 sticky top-0 bg-card">
                  <span>Etiqueta</span><span>Login</span><span>Senha</span>
                </div>
                {labels.map((l, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 text-sm rounded-md border p-2 hover:bg-muted/30 transition-colors">
                    <span className="font-mono font-bold text-chart-4">{l.etiqueta}</span>
                    <span className="font-mono text-muted-foreground">{l.login}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{l.senha}</span>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => { navigator.clipboard.writeText(l.senha); toast.success("Copiado!"); }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Tag className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Configure e clique em "Gerar Etiquetas"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeradorEtiquetas;
