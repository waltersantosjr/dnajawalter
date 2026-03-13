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
  MessageCircle, HelpCircle,
} from "lucide-react";

/* ── Tipos ────────────────────────────────────────────────── */
type Via = "particular" | "dnaja" | "defensoria" | "forum" | "cejusc";

interface Etapa {
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  dica?: string;
  docs?: string[];
}

/* ── Dados das Jornadas ──────────────────────────────────── */
const VIAS: { id: Via; titulo: string; subtitulo: string; icon: React.ElementType; cor: string }[] = [
  { id: "particular", titulo: "Laboratório Particular", subtitulo: "Contratação direta — resultado em até 4 dias úteis", icon: FlaskConical, cor: "text-chart-4" },
  { id: "dnaja", titulo: "DNAjá — Coleta em Casa", subtitulo: "Kit de auto coleta — sem documentação obrigatória", icon: Home, cor: "text-success" },
  { id: "defensoria", titulo: "Defensoria Pública", subtitulo: "Gratuito para pessoas carentes — Art. 5°, LXXIV CF", icon: ShieldCheck, cor: "text-primary" },
  { id: "forum", titulo: "Fórum / Comarca", subtitulo: "Ação judicial de investigação de paternidade", icon: Scale, cor: "text-warning" },
  { id: "cejusc", titulo: "CEJUSC", subtitulo: "Centro Judiciário de Solução de Conflitos — mediação", icon: Handshake, cor: "text-chart-3" },
];

const ETAPAS: Record<Via, Etapa[]> = {
  particular: [
    { titulo: "Contato com o Laboratório", descricao: "Entre em contato diretamente com o laboratório por telefone, WhatsApp ou site. Informe a modalidade desejada (Duo, Trio, Reconstituição).", icon: Phone, dica: "Exame particular TEM validade judicial quando feito com cadeia de custódia." },
    { titulo: "Escolha da Modalidade e Pagamento", descricao: "Selecione entre Duo (pai + filho), Trio (pai + mãe + filho) ou outras modalidades. Efetue o pagamento.", icon: DollarSign, dica: "Trio a partir de R$180 | Duo a partir de R$180 | Resultado em 4 dias." },
    { titulo: "Agendamento da Coleta", descricao: "O laboratório agenda a coleta na unidade mais próxima. Todos os participantes devem comparecer com documento com foto.", icon: CalendarDays },
    { titulo: "Coleta de Material", descricao: "Coleta de swab bucal (indolor) de todos os participantes. Em caso de exame judicial, há cadeia de custódia.", icon: Users, docs: ["RG / CNH de todos", "Certidão de nascimento da criança"] },
    { titulo: "Resultado", descricao: "O resultado é liberado em até 4 dias úteis (padrão) ou 24h/48h (urgente) via portal online ou e-mail.", icon: CheckCircle2, dica: "Para validade judicial, é necessário ordem do juiz com cadeia de custódia." },
  ],
  dnaja: [
    { titulo: "Adquira o Kit DNAjá", descricao: "Compre o kit de auto coleta DNAjá em uma farmácia parceira, laboratório credenciado ou pelo site. Não precisa de documentação!", icon: Package, dica: "O kit DNAjá é apenas informativo (Peace of Mind). NÃO tem validade judicial." },
    { titulo: "Faça a Coleta em Casa", descricao: "Siga as instruções do kit: passe o swab (cotonete) na bochecha de cada participante por 30 segundos. Identifique cada amostra.", icon: Home, dica: "Não coma, beba ou fume 30 minutos antes da coleta." },
    { titulo: "Envie as Amostras", descricao: "Coloque as amostras no envelope pré-pago incluso no kit e envie pelo correio. Ou entregue em um laboratório credenciado.", icon: Mail },
    { titulo: "Receba o Resultado", descricao: "O resultado é disponibilizado em até 5 dias úteis no portal online com o código do kit.", icon: CheckCircle2, dica: "Resultado 100% confidencial. Acesso apenas com código do kit." },
  ],
  defensoria: [
    { titulo: "Procurar a Defensoria Pública", descricao: "Compareça à Defensoria Pública da sua cidade com documentos pessoais. O defensor avaliará se você tem direito à assistência judiciária gratuita.", icon: Building2, dica: "Leve RG, CPF, comprovante de renda e residência.", docs: ["RG / CNH", "CPF", "Comprovante de residência", "Comprovante de renda (ou declaração de hipossuficiência)"] },
    { titulo: "Petição Inicial", descricao: "O defensor público elaborará a petição de investigação de paternidade e protocolará junto ao Fórum competente.", icon: FileText },
    { titulo: "Despacho do Juiz", descricao: "O juiz recebe a ação e despacha determinando a citação do suposto pai e a realização do exame de DNA.", icon: Scale, dica: "Caso o réu não compareça, pode haver presunção de paternidade (Súmula 301 STJ)." },
    { titulo: "Indicação do Laboratório", descricao: "O juiz ou a Defensoria indica um laboratório credenciado/perito judicial para realizar a coleta.", icon: FlaskConical },
    { titulo: "Coleta de Material", descricao: "Todos os participantes comparecem no local designado. O perito realiza a entrevista e coleta as amostras sob cadeia de custódia.", icon: Users, docs: ["RG de todos os participantes", "Certidão de nascimento da criança", "Ofício do Fórum"] },
    { titulo: "Análise e Laudo", descricao: "As amostras são enviadas ao laboratório. Prazo: 4 a 15 dias úteis. O laudo é enviado ao Fórum.", icon: CheckCircle2 },
  ],
  forum: [
    { titulo: "Contratar Advogado", descricao: "Constitua um advogado particular para propor a ação de investigação de paternidade.", icon: Scale, docs: ["RG / CPF", "Procuração", "Certidão de nascimento"] },
    { titulo: "Distribuição da Ação", descricao: "O advogado protocola a petição inicial. O processo é distribuído a uma Vara de Família.", icon: FileText },
    { titulo: "Citação do Réu", descricao: "O suposto pai é citado para comparecer e apresentar contestação.", icon: Landmark },
    { titulo: "Nomeação de Perito", descricao: "O juiz nomeia perito judicial credenciado. O laboratório recebe o ofício.", icon: FlaskConical, dica: "Peritos cadastrados via Provimento CSM 1625/2009." },
    { titulo: "Coleta e Análise", descricao: "Perito agenda a coleta. Todos comparecem com documentos. Resultado em 4 dias úteis.", icon: CalendarDays },
    { titulo: "Sentença", descricao: "O juiz analisa o laudo e profere sentença declarando (ou não) a paternidade.", icon: Scale },
  ],
  cejusc: [
    { titulo: "Procurar o CEJUSC", descricao: "Compareça ao Centro Judiciário de Solução de Conflitos (CEJUSC). Serviço gratuito do Poder Judiciário.", icon: Handshake, docs: ["RG / CPF de ambas as partes", "Certidão de nascimento da criança"] },
    { titulo: "Sessão de Mediação", descricao: "O mediador convoca ambas as partes para conciliação sobre reconhecimento voluntário de paternidade.", icon: Users },
    { titulo: "Encaminhamento para DNA", descricao: "Se não houver acordo, o CEJUSC encaminha para exame de DNA, indicando laboratório credenciado.", icon: FlaskConical, dica: "O CEJUSC pode indicar laboratórios com valores acessíveis ou gratuidade." },
    { titulo: "Coleta e Resultado", descricao: "Os participantes comparecem para coleta. O laudo é enviado ao CEJUSC.", icon: CheckCircle2 },
    { titulo: "Homologação", descricao: "Com o resultado, o CEJUSC promove nova sessão. O termo é homologado pelo juiz e encaminhado ao cartório.", icon: Scale },
  ],
};

const LABORATORIOS = [
  { nome: "BioGenetics — Uberlândia/MG", cidade: "Uberlândia", estado: "MG" },
  { nome: "DNAjá — São Paulo/SP", cidade: "São Paulo", estado: "SP" },
  { nome: "DNAjá — Campinas/SP", cidade: "Campinas", estado: "SP" },
  { nome: "DNAjá — Ribeirão Preto/SP", cidade: "Ribeirão Preto", estado: "SP" },
  { nome: "Perito Auxiliar — Sorocaba/SP", cidade: "Sorocaba", estado: "SP" },
];

const ESTADOS_BR = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];

/* ── Componente ──────────────────────────────────────────── */
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
          <HelpCircle className="h-7 w-7 text-chart-4" /> Jornada do DNA
        </h1>
        <p className="text-muted-foreground">Quero fazer um exame de DNA. Como proceder?</p>
      </div>

      {/* Interactive question */}
      <Card className="border-chart-4/30 bg-gradient-to-r from-chart-4/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-6 w-6 text-chart-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Qual é a sua situação?</p>
              <p className="text-sm text-muted-foreground mt-1">Selecione abaixo a alternativa que melhor se aplica ao seu caso. Cada via possui etapas específicas e requisitos diferentes.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Via selection as interactive cards */}
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
              <p className={`font-bold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>{via.titulo.replace("Via ", "")}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{via.subtitulo}</p>
              {via.id === "dnaja" && (
                <Badge variant="outline" className="mt-2 text-[10px] border-warning text-warning">Sem documentação</Badge>
              )}
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
            <Clock className="h-4 w-4" />
            <span>{etapas.length} etapas no processo</span>
            <Separator orientation="vertical" className="h-4" />
            <Info className="h-4 w-4" />
            <span>Clique em cada etapa para mais detalhes</span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline + Sidebar */}
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
                    isDone ? "border-success bg-success text-white" :
                    "border-border bg-card text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : <etapa.icon className="h-5 w-5" />}
                  </div>
                  {idx < etapas.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[24px] transition-colors ${isDone ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
                <div className={`mb-3 flex-1 rounded-lg border p-4 transition-all duration-200 ${
                  isActive ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                      Etapa {idx + 1}: {etapa.titulo}
                    </h3>
                    <Badge variant={isDone ? "default" : isActive ? "secondary" : "outline"} className="text-xs">
                      {isDone ? "✓" : isActive ? "Atual" : `${idx + 1}`}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{etapa.descricao}</p>
                  {isActive && etapa.dica && (
                    <div className="mt-2 flex items-start gap-2 rounded-md bg-warning/10 p-2 text-xs text-warning">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{etapa.dica}</span>
                    </div>
                  )}
                  {isActive && etapa.docs && (
                    <div className="mt-2 space-y-1">
                      <span className="text-xs font-medium text-foreground">📋 Documentos necessários:</span>
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
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Agendar Coleta
                </CardTitle>
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
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Formulário de Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome Completo *</Label>
                    <Input className="h-8 text-xs" value={agendamento.nome} onChange={e => setAgendamento(p => ({ ...p, nome: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">CPF *</Label>
                    <Input className="h-8 text-xs" value={agendamento.cpf} onChange={e => setAgendamento(p => ({ ...p, cpf: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Telefone</Label>
                    <Input className="h-8 text-xs" value={agendamento.telefone} onChange={e => setAgendamento(p => ({ ...p, telefone: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Cidade</Label>
                    <Input className="h-8 text-xs" value={agendamento.cidade} onChange={e => setAgendamento(p => ({ ...p, cidade: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Laboratório / Ponto de Coleta *</Label>
                  <Select value={agendamento.laboratorio} onValueChange={v => setAgendamento(p => ({ ...p, laboratorio: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {LABORATORIOS.map(lab => (
                        <SelectItem key={lab.nome} value={lab.nome}>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-muted-foreground" /> {lab.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Data Preferida</Label>
                    <Input type="date" className="h-8 text-xs" value={agendamento.dataPreferida} onChange={e => setAgendamento(p => ({ ...p, dataPreferida: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nº Participantes</Label>
                    <Input type="number" min={2} max={10} className="h-8 text-xs" value={agendamento.participantes} onChange={e => setAgendamento(p => ({ ...p, participantes: Number(e.target.value) }))} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAgendar}>
                  <CalendarDays className="mr-2 h-4 w-4" /> Enviar Solicitação
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground text-sm">Informações Úteis</h4>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-info mt-0.5" />
                <span>O exame de DNA por swab bucal é <strong>indolor</strong> e leva menos de 5 minutos.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-info mt-0.5" />
                <span>Resultados com <strong>99,99% de precisão</strong> para inclusão de paternidade.</span>
              </div>
              <div className="flex items-start gap-2">
                <Scale className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Para validade judicial, é obrigatória a <strong>cadeia de custódia</strong>.</span>
              </div>
              <Separator />
              <div className="space-y-1">
                <h5 className="font-medium text-foreground">Contato Pericial</h5>
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> (34) 3253-4100 / 0800 34 9970</div>
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
        <span className="text-sm text-muted-foreground">
          Etapa {etapaAtual + 1} de {etapas.length}
        </span>
        <Button disabled={etapaAtual >= etapas.length - 1} onClick={() => setEtapaAtual(e => e + 1)}>
          Próxima Etapa <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
