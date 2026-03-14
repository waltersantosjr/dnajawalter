import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Scale, Building2, FlaskConical, Handshake, ChevronRight, CheckCircle2,
  Clock, MapPin, Phone, Mail, FileText, Users, CalendarDays, ArrowRight, ArrowLeft,
  CircleDot, Info, AlertTriangle, Landmark, ShieldCheck, DollarSign, Home, Package,
  GraduationCap,
} from "lucide-react";

type Via = "particular" | "dnaja" | "defensoria" | "forum" | "cejusc";

interface Etapa {
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  dica?: string;
  docs?: string[];
}

const VIAS: { id: Via; titulo: string; subtitulo: string; icon: React.ElementType; cor: string }[] = [
  { id: "particular", titulo: "Laboratório Particular", subtitulo: "Contratação direta — resultado em até 4 dias úteis", icon: FlaskConical, cor: "text-chart-4" },
  { id: "dnaja", titulo: "DNAjá — Coleta em Casa", subtitulo: "Kit de auto coleta — sem documentação obrigatória", icon: Home, cor: "text-success" },
  { id: "defensoria", titulo: "Defensoria Pública", subtitulo: "Gratuito para pessoas carentes — Art. 5°, LXXIV CF", icon: ShieldCheck, cor: "text-primary" },
  { id: "forum", titulo: "Fórum / Comarca", subtitulo: "Ação judicial de investigação de paternidade", icon: Scale, cor: "text-warning" },
  { id: "cejusc", titulo: "CEJUSC", subtitulo: "Centro Judiciário de Solução de Conflitos — mediação", icon: Handshake, cor: "text-chart-3" },
];

const ETAPAS: Record<Via, Etapa[]> = {
  particular: [
    { titulo: "Contato com o Laboratório", descricao: "Entre em contato diretamente com o laboratório por telefone, WhatsApp ou site.", icon: Phone, dica: "Exame particular TEM validade judicial quando feito com cadeia de custódia." },
    { titulo: "Escolha da Modalidade e Pagamento", descricao: "Selecione entre Duo, Trio ou outras modalidades. Efetue o pagamento.", icon: DollarSign, dica: "Trio a partir de R$180 | Resultado em 4 dias." },
    { titulo: "Agendamento da Coleta", descricao: "O laboratório agenda a coleta na unidade mais próxima.", icon: CalendarDays },
    { titulo: "Coleta de Material", descricao: "Coleta de swab bucal de todos os participantes.", icon: Users, docs: ["RG / CNH de todos", "Certidão de nascimento da criança"] },
    { titulo: "Resultado", descricao: "Resultado em até 4 dias úteis via portal online ou e-mail.", icon: CheckCircle2 },
  ],
  dnaja: [
    { titulo: "Adquira o Kit DNAjá", descricao: "Compre o kit em farmácia parceira ou pelo site. Não precisa de documentação!", icon: Package, dica: "NÃO tem validade judicial." },
    { titulo: "Faça a Coleta em Casa", descricao: "Passe o swab na bochecha de cada participante por 30 segundos.", icon: Home, dica: "Não coma, beba ou fume 30 min antes." },
    { titulo: "Envie as Amostras", descricao: "Coloque no envelope pré-pago e envie pelo correio.", icon: Mail },
    { titulo: "Receba o Resultado", descricao: "Resultado em até 5 dias úteis no portal online.", icon: CheckCircle2 },
  ],
  defensoria: [
    { titulo: "Procurar a Defensoria Pública", descricao: "Compareça com documentos pessoais. O defensor avaliará o direito à assistência gratuita.", icon: Building2, docs: ["RG / CNH", "CPF", "Comprovante de residência", "Comprovante de renda"] },
    { titulo: "Petição Inicial", descricao: "O defensor elaborará a petição e protocolará junto ao Fórum.", icon: FileText },
    { titulo: "Despacho do Juiz", descricao: "O juiz determina a citação e a realização do exame.", icon: Scale, dica: "Se o réu não comparecer: presunção de paternidade (Súmula 301 STJ)." },
    { titulo: "Indicação do Laboratório", descricao: "O juiz indica laboratório credenciado/perito judicial.", icon: FlaskConical },
    { titulo: "Coleta e Laudo", descricao: "Coleta sob cadeia de custódia. Laudo em 4 a 15 dias úteis.", icon: CheckCircle2 },
  ],
  forum: [
    { titulo: "Contratar Advogado", descricao: "Constitua advogado para propor a ação.", icon: Scale, docs: ["RG / CPF", "Procuração", "Certidão de nascimento"] },
    { titulo: "Distribuição da Ação", descricao: "O advogado protocola a petição. Processo distribuído a Vara de Família.", icon: FileText },
    { titulo: "Citação do Réu", descricao: "O suposto pai é citado.", icon: Landmark },
    { titulo: "Nomeação de Perito", descricao: "O juiz nomeia perito judicial credenciado.", icon: FlaskConical },
    { titulo: "Coleta e Análise", descricao: "Perito agenda coleta. Resultado em 4 dias úteis.", icon: CalendarDays },
    { titulo: "Sentença", descricao: "O juiz analisa o laudo e profere sentença.", icon: Scale },
  ],
  cejusc: [
    { titulo: "Procurar o CEJUSC", descricao: "Serviço gratuito do Poder Judiciário.", icon: Handshake, docs: ["RG / CPF de ambas as partes", "Certidão de nascimento"] },
    { titulo: "Sessão de Mediação", descricao: "Mediador convoca ambas as partes.", icon: Users },
    { titulo: "Encaminhamento para DNA", descricao: "CEJUSC encaminha para exame de DNA.", icon: FlaskConical },
    { titulo: "Coleta e Resultado", descricao: "Participantes comparecem para coleta.", icon: CheckCircle2 },
    { titulo: "Homologação", descricao: "Termo homologado pelo juiz.", icon: Scale },
  ],
};

const LABORATORIOS = [
  { nome: "BioGenetics — Uberlândia/MG", cidade: "Uberlândia", estado: "MG" },
  { nome: "DNAjá — São Paulo/SP", cidade: "São Paulo", estado: "SP" },
  { nome: "DNAjá — Campinas/SP", cidade: "Campinas", estado: "SP" },
  { nome: "DNAjá — Ribeirão Preto/SP", cidade: "Ribeirão Preto", estado: "SP" },
];

export default function JornadaDNA() {
  const { toast } = useToast();
  const [viaSelecionada, setViaSelecionada] = useState<Via>("particular");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [mostrarAgendamento, setMostrarAgendamento] = useState(false);
  const [agendamento, setAgendamento] = useState({
    nome: "", cpf: "", telefone: "", email: "", cidade: "", estado: "SP",
    via: "particular" as Via, laboratorio: "", dataPreferida: "", participantes: 3, observacoes: "",
  });

  const etapas = ETAPAS[viaSelecionada];
  const viaInfo = VIAS.find(v => v.id === viaSelecionada)!;

  const handleAgendar = () => {
    if (!agendamento.nome || !agendamento.cpf || !agendamento.laboratorio) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, CPF e laboratório.", variant: "destructive" });
      return;
    }
    toast({ title: "Agendamento enviado!", description: `Solicitação para ${agendamento.nome} encaminhada.` });
    setMostrarAgendamento(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-chart-3" /> 🧑‍🏫 Dr. DNAW responde!
        </h1>
        <p className="text-muted-foreground">Jornada do DNA — Quero fazer um exame de DNA. Como proceder?</p>
      </div>

      {/* Professor Card */}
      <Card className="border-chart-3/30 bg-gradient-to-r from-chart-3/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-chart-3/20 flex items-center justify-center text-3xl shrink-0">
              🧑‍🏫
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Dr. DNAW</p>
              <p className="text-sm text-muted-foreground mt-1">
                Olá! Eu sou o Dr. DNAW e vou te guiar em todas as alternativas para realizar um exame de DNA no Brasil. 
                Selecione abaixo a via que mais se adequa à sua situação — cada uma possui etapas, documentos e prazos específicos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Via selection */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {VIAS.map(via => {
          const isActive = viaSelecionada === via.id;
          return (
            <button
              key={via.id}
              onClick={() => { setViaSelecionada(via.id); setEtapaAtual(0); }}
              className={`rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                isActive ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <via.icon className={`h-7 w-7 mb-2 ${isActive ? "text-primary" : via.cor}`} />
              <p className={`font-bold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>{via.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{via.subtitulo}</p>
              {via.id === "dnaja" && <Badge variant="outline" className="mt-2 text-[10px] border-warning text-warning">Sem documentação</Badge>}
            </button>
          );
        })}
      </div>

      {/* Banner */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <viaInfo.icon className={`h-8 w-8 ${viaInfo.cor}`} />
            <div>
              <CardTitle className="text-lg">{viaInfo.titulo}</CardTitle>
              <CardDescription>{viaInfo.subtitulo}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /><span>{etapas.length} etapas</span>
            <Separator orientation="vertical" className="h-4" />
            <Info className="h-4 w-4" /><span>Clique em cada etapa para detalhes</span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="grid gap-3 lg:grid-cols-[1fr_380px]">
        <div className="space-y-0">
          {etapas.map((etapa, idx) => {
            const isActive = idx === etapaAtual;
            const isDone = idx < etapaAtual;
            return (
              <div key={idx} className="flex gap-3 cursor-pointer group" onClick={() => setEtapaAtual(idx)}>
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive ? "border-primary bg-primary text-primary-foreground scale-110" :
                    isDone ? "border-success bg-success text-white" : "border-border bg-card text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : <etapa.icon className="h-5 w-5" />}
                  </div>
                  {idx < etapas.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] transition-colors ${isDone ? "bg-success" : "bg-border"}`} />}
                </div>
                <div className={`mb-3 flex-1 rounded-lg border p-4 transition-all duration-200 ${
                  isActive ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-muted-foreground/30"
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${isActive ? "text-primary" : ""}`}>Etapa {idx + 1}: {etapa.titulo}</h3>
                    <Badge variant={isDone ? "default" : isActive ? "secondary" : "outline"} className="text-xs">{isDone ? "✓" : isActive ? "Atual" : `${idx + 1}`}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{etapa.descricao}</p>
                  {isActive && etapa.dica && (
                    <div className="mt-2 flex items-start gap-2 rounded-md bg-warning/10 p-2 text-xs text-warning">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /><span>{etapa.dica}</span>
                    </div>
                  )}
                  {isActive && etapa.docs && (
                    <div className="mt-2 space-y-1">
                      <span className="text-xs font-medium">📋 Documentos necessários:</span>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5">
                        {etapa.docs.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {viaSelecionada !== "dnaja" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Agendar Coleta</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => { setMostrarAgendamento(!mostrarAgendamento); setAgendamento(prev => ({ ...prev, via: viaSelecionada })); }}>
                  {mostrarAgendamento ? "Fechar formulário" : "Solicitar Agendamento"}
                </Button>
              </CardContent>
            </Card>
          )}

          {mostrarAgendamento && viaSelecionada !== "dnaja" && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Formulário de Agendamento</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5"><Label className="text-xs">Nome *</Label><Input className="h-8 text-xs" value={agendamento.nome} onChange={e => setAgendamento(p => ({ ...p, nome: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">CPF *</Label><Input className="h-8 text-xs" value={agendamento.cpf} onChange={e => setAgendamento(p => ({ ...p, cpf: e.target.value }))} /></div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Laboratório *</Label>
                  <Select value={agendamento.laboratorio} onValueChange={v => setAgendamento(p => ({ ...p, laboratorio: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {LABORATORIOS.map(lab => (<SelectItem key={lab.nome} value={lab.nome}><div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" /> {lab.nome}</div></SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5"><Label className="text-xs">Data Preferida</Label><Input type="date" className="h-8 text-xs" value={agendamento.dataPreferida} onChange={e => setAgendamento(p => ({ ...p, dataPreferida: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Participantes</Label><Input type="number" min={2} className="h-8 text-xs" value={agendamento.participantes} onChange={e => setAgendamento(p => ({ ...p, participantes: Number(e.target.value) }))} /></div>
                </div>
                <Button className="w-full" onClick={handleAgendar}><CalendarDays className="mr-2 h-4 w-4" /> Enviar Solicitação</Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">🧑‍🏫 Dr. DNAW informa</h4>
              <div className="flex items-start gap-2"><Info className="h-4 w-4 shrink-0 text-info mt-0.5" /><span>O exame por swab bucal é <strong>indolor</strong> e leva menos de 5 minutos.</span></div>
              <div className="flex items-start gap-2"><Info className="h-4 w-4 shrink-0 text-info mt-0.5" /><span>Resultados com <strong>99,99% de precisão</strong> para inclusão.</span></div>
              <div className="flex items-start gap-2"><Scale className="h-4 w-4 shrink-0 text-primary mt-0.5" /><span>Validade judicial requer <strong>cadeia de custódia</strong>.</span></div>
              <Separator />
              <div className="space-y-1">
                <h5 className="font-medium text-foreground">Contato Pericial</h5>
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> (34) 3253-4100</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> periciatecnica@biogenetics.com.br</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={etapaAtual === 0} onClick={() => setEtapaAtual(e => e - 1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Etapa Anterior
        </Button>
        <span className="text-sm text-muted-foreground">Etapa {etapaAtual + 1} de {etapas.length}</span>
        <Button disabled={etapaAtual >= etapas.length - 1} onClick={() => setEtapaAtual(e => e + 1)}>
          Próxima Etapa <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
