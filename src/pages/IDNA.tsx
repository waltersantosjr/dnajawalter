import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, FileText, ShieldCheck, Scale, BookOpen, AlertTriangle,
  CheckCircle2, XCircle, Info, Dna, Eye, HelpCircle, Lightbulb,
} from "lucide-react";
import { toast } from "sonner";

type AnalysisStatus = "idle" | "uploading" | "analyzing" | "done";

interface AnalysisResult {
  status: "ok" | "warning" | "error";
  title: string;
  description: string;
}

const MOCK_RESULTS: AnalysisResult[] = [
  { status: "ok", title: "Identificação das Partes", description: "Nomes e documentos dos participantes estão corretamente identificados no laudo." },
  { status: "ok", title: "Metodologia (STR)", description: "O exame utilizou 21 marcadores genéticos (STR), atendendo ao mínimo recomendado de 13 pelo FBI/CODIS." },
  { status: "ok", title: "Índice de Paternidade (IP)", description: "IP combinado: 1.250.000 — acima do limiar mínimo de 10.000 para conclusão positiva." },
  { status: "ok", title: "Probabilidade de Paternidade", description: "99,9999% — resultado conclusivo conforme normas técnicas vigentes." },
  { status: "warning", title: "Cadeia de Custódia", description: "Não há menção explícita ao procedimento de cadeia de custódia. Recomenda-se verificar se houve identificação com foto e digital." },
  { status: "ok", title: "Laboratório Acreditado", description: "Laboratório consta como acreditado pela ANVISA/INMETRO e certificação ISO 17025." },
  { status: "warning", title: "Assinatura do Perito", description: "Verificar se o perito responsável possui CRBio ativo e inscrição no conselho regional competente." },
];

const LEGAL_TIPS = [
  { icon: Scale, title: "Validade Jurídica", text: "Para uso judicial, o exame deve ter cadeia de custódia documentada. Laudos sem cadeia de custódia servem apenas como prova informativa." },
  { icon: ShieldCheck, title: "Quem Pode Solicitar", text: "O exame pode ser solicitado por qualquer parte interessada. Para processos judiciais, o juiz pode determinar a realização compulsória (Art. 2° da Lei 12.004/2009)." },
  { icon: BookOpen, title: "Presunção de Paternidade", text: "A recusa injustificada ao exame de DNA gera presunção relativa de paternidade (Súmula 301 do STJ)." },
  { icon: AlertTriangle, title: "Contestação de Laudo", text: "Um laudo pode ser contestado judicialmente solicitando nova perícia. O prazo para contestação depende do tipo de ação." },
];

const DIDACTIC_SECTIONS = [
  { title: "O que é um Exame de DNA?", content: "O exame de DNA compara o material genético de duas ou mais pessoas para determinar se existe vínculo biológico entre elas. Cada pessoa herda 50% do DNA da mãe e 50% do pai." },
  { title: "O que são Marcadores STR?", content: "STR (Short Tandem Repeats) são sequências curtas de DNA que se repetem. Analisando vários marcadores, é possível calcular a probabilidade de parentesco com alta precisão." },
  { title: "O que é Índice de Paternidade?", content: "O IP combina as chances de cada marcador genético analisado. Quanto maior o IP, maior a certeza do vínculo. Valores acima de 10.000 são considerados conclusivos." },
  { title: "Inclusão vs Exclusão", content: "Inclusão: o suposto pai NÃO pode ser excluído como pai biológico (probabilidade ≥99,99%). Exclusão: há incompatibilidade em 3+ marcadores, descartando o vínculo." },
  { title: "Trio vs Duo", content: "Trio (mãe + filho + suposto pai) oferece maior precisão. Duo (filho + suposto pai) é viável mas pode exigir mais marcadores para resultado conclusivo." },
];

export default function IDNA() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [tab, setTab] = useState("upload");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("uploading");
    setTimeout(() => {
      setStatus("analyzing");
      setTimeout(() => {
        setStatus("done");
        setTab("resultado");
        toast.success("Análise concluída!");
      }, 2000);
    }, 1500);
  };

  const resetUpload = () => {
    setStatus("idle");
    setFileName("");
    setTab("upload");
  };

  const statusIcon = (s: AnalysisResult["status"]) => {
    if (s === "ok") return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (s === "warning") return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Dna className="h-8 w-8 text-primary" /> 1DNA
        </h1>
        <p className="text-muted-foreground mt-1">
          Verificação inteligente de laudos de vínculo genético
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <Upload className="h-4 w-4" /> Upload
          </TabsTrigger>
          <TabsTrigger value="resultado" disabled={status !== "done"} className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> Resultado
          </TabsTrigger>
          <TabsTrigger value="juridico" className="flex items-center gap-1">
            <Scale className="h-4 w-4" /> Jurídico
          </TabsTrigger>
          <TabsTrigger value="didatico" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" /> Entenda o Laudo
          </TabsTrigger>
        </TabsList>

        {/* Upload */}
        <TabsContent value="upload" className="mt-6">
          <Card className="border-dashed border-2 border-primary/30">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              {status === "idle" && (
                <>
                  <Upload className="h-16 w-16 text-primary/40" />
                  <h3 className="text-xl font-semibold">Envie seu laudo de DNA</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Faça o upload do resultado do seu exame de vínculo genético (PDF ou imagem).
                    Vamos verificar se foi feito corretamente e explicar os resultados.
                  </p>
                  <Label htmlFor="laudo-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Selecionar Arquivo
                    </div>
                    <Input
                      id="laudo-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </Label>
                </>
              )}
              {status === "uploading" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
                  <p className="text-lg font-medium">Enviando {fileName}...</p>
                </div>
              )}
              {status === "analyzing" && (
                <div className="flex flex-col items-center gap-3">
                  <Dna className="h-12 w-12 text-primary animate-pulse" />
                  <p className="text-lg font-medium">Analisando laudo...</p>
                  <p className="text-muted-foreground text-sm">Verificando dados, metodologia e conformidade</p>
                </div>
              )}
              {status === "done" && (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                  <p className="text-lg font-medium">Análise Concluída!</p>
                  <p className="text-muted-foreground text-sm">{fileName}</p>
                  <Button variant="outline" onClick={resetUpload}>Enviar novo laudo</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resultado */}
        <TabsContent value="resultado" className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-success/10 border-success/30">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-success">5</p>
                <p className="text-sm text-muted-foreground">Aprovados</p>
              </CardContent>
            </Card>
            <Card className="bg-warning/10 border-warning/30">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-warning">2</p>
                <p className="text-sm text-muted-foreground">Atenção</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-destructive">0</p>
                <p className="text-sm text-muted-foreground">Problemas</p>
              </CardContent>
            </Card>
          </div>

          {MOCK_RESULTS.map((r, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                {statusIcon(r.status)}
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Jurídico */}
        <TabsContent value="juridico" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {LEGAL_TIPS.map((tip, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <tip.icon className="h-5 w-5 text-primary" /> {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Didático */}
        <TabsContent value="didatico" className="mt-6 space-y-4">
          {DIDACTIC_SECTIONS.map((sec, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-info" /> {sec.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{sec.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
