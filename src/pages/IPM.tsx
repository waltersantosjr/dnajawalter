import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Skull, FileText, Scale, AlertTriangle, CheckCircle2, Info,
  Printer, Download, DollarSign, Users, ClipboardList, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const ETAPAS_IPM = [
  { titulo: "Autorização Judicial", desc: "É necessária ordem judicial para exumação. O juiz nomeia perito e define data.", icon: Scale },
  { titulo: "Comunicação ao IML", desc: "O Instituto Médico Legal (IML) é notificado e designa equipe para auxiliar na exumação.", icon: ClipboardList },
  { titulo: "Exumação do Corpo", desc: "Equipe pericial realiza a exumação sob supervisão judicial. Material coletado: fêmur ou 5 dentes sem restauração.", icon: Skull },
  { titulo: "Coleta de Material Genético", desc: "O perito extrai DNA do material ósseo ou dental. Processo de extração leva 5-10 dias.", icon: Users },
  { titulo: "Análise Laboratorial", desc: "DNA extraído é comparado com material dos investigantes. Prazo: 20-30 dias úteis.", icon: FileText },
  { titulo: "Laudo Pericial", desc: "Perito emite laudo e envia ao juízo competente com resultado da análise.", icon: CheckCircle2 },
];

const DOCUMENTOS_NECESSARIOS = [
  "Ordem judicial de exumação",
  "Certidão de óbito do falecido",
  "Certidão de nascimento do(s) investigante(s)",
  "RG/CPF de todos os participantes vivos",
  "Procuração do advogado",
  "Comprovante de sepultamento (cemitério)",
  "Laudo médico indicando causa mortis (quando disponível)",
];

const IPM = () => {
  const [showOrcamento, setShowOrcamento] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Skull className="h-7 w-7 text-destructive" /> IPM — Investigação Post Mortem
        </h1>
        <p className="text-muted-foreground">Para casos sem parentes em 1º grau do suposto pai</p>
      </div>

      {/* Explanation */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-destructive">Quando utilizar IPM?</p>
              <p className="text-sm text-muted-foreground mt-1">
                A Investigação Post Mortem (IPM) é utilizada quando o suposto pai é falecido e <strong>não existem parentes de 1º grau disponíveis</strong> 
                para reconstituição genética. O procedimento envolve a <strong>exumação do corpo</strong> para coleta de material genético 
                (preferencialmente fêmur ou dentes sem restauração).
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ⚖️ <strong>Base Legal:</strong> Art. 2º-A, §5º da Lei 8.560/92 — O juiz pode determinar a exumação para fins de investigação de paternidade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Timeline */}
        <div className="space-y-0">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-chart-4" /> Passo a Passo do Procedimento
          </h2>
          {ETAPAS_IPM.map((etapa, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10 text-destructive">
                  <etapa.icon className="h-5 w-5" />
                </div>
                {idx < ETAPAS_IPM.length - 1 && <div className="w-0.5 flex-1 min-h-[16px] bg-destructive/20" />}
              </div>
              <div className="mb-3 flex-1 rounded-lg border p-4">
                <h3 className="font-semibold text-sm">Etapa {idx + 1}: {etapa.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{etapa.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">📋 Documentos Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DOCUMENTOS_NECESSARIOS.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-warning/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-warning" /> Custos Estimados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Exame Post Mortem</span><span className="font-bold font-mono">R$ 7.900,00</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Acréscimo p/ filho</span><span className="font-mono">R$ 2.000,00</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Custos exumação (IML)</span><span className="font-mono">R$ 1.500 ~ 3.000</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Honorários periciais</span><span className="font-mono">A definir</span></div>
              <Separator />
              <div className="flex justify-between text-sm font-bold"><span>Estimativa total</span><span className="text-destructive font-mono">R$ 10.000 ~ 15.000</span></div>
              <p className="text-xs text-muted-foreground">* Valores podem variar conforme complexidade e localidade</p>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => setShowOrcamento(!showOrcamento)}>
            <FileText className="mr-2 h-4 w-4" /> {showOrcamento ? "Fechar Orçamento" : "Gerar Orçamento IPM"}
          </Button>

          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground text-sm flex items-center gap-2"><Info className="h-4 w-4 text-info" /> Informações Importantes</p>
              <p>• O prazo total do procedimento é de <strong>30 a 90 dias</strong> (depende do juízo).</p>
              <p>• O material ideal é o <strong>fêmur</strong> — osso longo com melhor preservação de DNA.</p>
              <p>• Alternativa: <strong>5 dentes livres de restauração</strong>.</p>
              <p>• A taxa de sucesso na extração depende do tempo e condições de sepultamento.</p>
              <p>• Cremação <strong>inviabiliza</strong> o procedimento.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Orçamento form */}
      {showOrcamento && (
        <Card className="border-chart-4/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-chart-4" /> Orçamento para IPM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1"><Label className="text-xs font-semibold">Nome do Requerente</Label><Input placeholder="Nome completo" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">CPF</Label><Input placeholder="000.000.000-00" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Nome do Falecido</Label><Input placeholder="Nome completo do suposto pai" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Data do Óbito</Label><Input type="date" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Cemitério</Label><Input placeholder="Nome e cidade do cemitério" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Nº do Processo (se houver)</Label><Input placeholder="Nº do processo judicial" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Advogado(a)</Label><Input placeholder="Nome do advogado" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">OAB</Label><Input placeholder="OAB/UF 000.000" /></div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => toast.success("Orçamento IPM gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar Orçamento</Button>
              <Button variant="outline" onClick={() => toast.success("Documento informativo gerado!")}><Download className="mr-1 h-4 w-4" /> Gerar Informativo</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IPM;
