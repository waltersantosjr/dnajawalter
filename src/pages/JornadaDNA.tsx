import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Scale, Building2, FlaskConical, Handshake, ChevronRight, CheckCircle2,
  Clock, MapPin, Phone, Mail, FileText, Users, CalendarDays, ArrowRight,
  CircleDot, Info, AlertTriangle, Landmark, ShieldCheck, DollarSign
} from "lucide-react";

/* ── Tipos ────────────────────────────────────────────────── */

type Via = "defensoria" | "forum" | "laboratorio" | "cejusc";

interface Etapa {
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  dica?: string;
  docs?: string[];
}

interface Agendamento {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
  via: Via;
  laboratorio: string;
  dataPreferida: string;
  participantes: number;
  observacoes: string;
}

/* ── Dados das Jornadas ──────────────────────────────────── */

const VIAS: { id: Via; titulo: string; subtitulo: string; icon: React.ElementType; cor: string }[] = [
  { id: "defensoria", titulo: "Via Defensoria Pública", subtitulo: "Gratuito para pessoas carentes — Art. 5°, LXXIV CF", icon: ShieldCheck, cor: "text-success" },
  { id: "forum", titulo: "Via Fórum / Comarca", subtitulo: "Ação judicial de investigação de paternidade", icon: Scale, cor: "text-primary" },
  { id: "laboratorio", titulo: "Via Laboratório Particular", subtitulo: "Contratação direta — resultado em até 4 dias úteis", icon: FlaskConical, cor: "text-chart-4" },
  { id: "cejusc", titulo: "Via CEJUSC", subtitulo: "Centro Judiciário de Solução de Conflitos — mediação extrajudicial", icon: Handshake, cor: "text-warning" },
];

const ETAPAS: Record<Via, Etapa[]> = {
  defensoria: [
    { titulo: "Procurar a Defensoria Pública", descricao: "Compareça à Defensoria Pública da sua cidade com documentos pessoais. O defensor avaliará se você tem direito à assistência judiciária gratuita.", icon: Building2, dica: "Leve RG, CPF, comprovante de renda e residência.", docs: ["RG / CNH", "CPF", "Comprovante de residência", "Comprovante de renda (ou declaração de hipossuficiência)"] },
    { titulo: "Petição Inicial", descricao: "O defensor público elaborará a petição de investigação de paternidade e protocolará junto ao Fórum competente.", icon: FileText, dica: "O processo pode tramitar na Vara de Família ou na Vara Cível." },
    { titulo: "Despacho do Juiz", descricao: "O juiz recebe a ação e despacha determinando a citação do suposto pai e a realização do exame de DNA.", icon: Scale, dica: "Caso o réu não compareça, pode haver presunção de paternidade (Súmula 301 STJ)." },
    { titulo: "Indicação do Laboratório", descricao: "O juiz ou a Defensoria indica um laboratório credenciado/perito judicial para realizar a coleta. O laboratório é notificado e agenda a perícia.", icon: FlaskConical, dica: "Com base no Provimento 797/2003, peritos cadastrados podem atuar na comarca." },
    { titulo: "Agendamento da Coleta", descricao: "O laboratório/perito auxiliar na cidade agenda dia e horário para coleta de material biológico de todos os participantes.", icon: CalendarDays, dica: "A coleta é indolor — feita por swab bucal (cotonete na bochecha)." },
    { titulo: "Coleta de Material", descricao: "Todos os participantes comparecem no local designado. O perito realiza a entrevista e coleta as amostras sob cadeia de custódia.", icon: Users, docs: ["RG de todos os participantes", "Certidão de nascimento da criança", "Ofício do Fórum"] },
    { titulo: "Análise Laboratorial", descricao: "As amostras são enviadas ao laboratório central para extração de DNA e análise genética. Prazo: 4 a 15 dias úteis.", icon: FlaskConical },
    { titulo: "Laudo Pericial", descricao: "O laudo com resultado (inclusão ou exclusão de paternidade) é enviado ao Fórum. O juiz homologa e determina o registro.", icon: CheckCircle2, dica: "Em caso de inclusão, o cartório faz a averbação no registro civil." },
  ],
  forum: [
    { titulo: "Contratar Advogado", descricao: "Constitua um advogado particular para propor a ação de investigação de paternidade junto ao Fórum da comarca.", icon: Scale, docs: ["RG / CPF", "Procuração", "Certidão de nascimento"] },
    { titulo: "Distribuição da Ação", descricao: "O advogado protocola a petição inicial. O processo é distribuído a uma Vara de Família.", icon: FileText },
    { titulo: "Citação do Réu", descricao: "O suposto pai é citado para comparecer e apresentar contestação. O juiz designa audiência e determina a perícia.", icon: Landmark },
    { titulo: "Nomeação de Perito", descricao: "O juiz nomeia perito judicial credenciado ou as partes indicam assistentes técnicos. O laboratório recebe o ofício.", icon: FlaskConical, dica: "Peritos cadastrados via Provimento CSM 1625/2009 e Portal Auxiliares da Justiça." },
    { titulo: "Agendamento e Coleta", descricao: "O perito auxiliar na comarca agenda a coleta. Todos os participantes comparecem com documentos para entrevista e coleta.", icon: CalendarDays },
    { titulo: "Análise e Laudo", descricao: "O laboratório processa as amostras e emite laudo técnico-científico. Prazo padrão: 4 dias úteis após quitação.", icon: CheckCircle2 },
    { titulo: "Sentença", descricao: "O juiz analisa o laudo, ouve as partes e profere sentença declarando (ou não) a paternidade.", icon: Scale },
  ],
  laboratorio: [
    { titulo: "Contato com o Laboratório", descricao: "Entre em contato diretamente com o laboratório por telefone, WhatsApp ou site. Informe a modalidade desejada (Duo, Trio, Reconstituição).", icon: Phone, dica: "Exame particular NÃO tem validade judicial — apenas informativo." },
    { titulo: "Escolha da Modalidade e Pagamento", descricao: "Selecione entre Duo (pai + filho), Trio (pai + mãe + filho) ou outras modalidades. Efetue o pagamento ou parcelamento.", icon: DollarSign, dica: "Trio a partir de R$180 | Duo a partir de R$180 | Resultado em 4 dias." },
    { titulo: "Agendamento da Coleta", descricao: "O laboratório agenda a coleta na unidade mais próxima ou envia kit de coleta domiciliar.", icon: CalendarDays },
    { titulo: "Coleta de Material", descricao: "Coleta de swab bucal (indolor) de todos os participantes. Em caso de kit domiciliar, siga as instruções e envie de volta.", icon: Users },
    { titulo: "Resultado", descricao: "O resultado é liberado em até 4 dias úteis (padrão) ou 24h/48h (urgente) via portal online ou e-mail.", icon: CheckCircle2, dica: "Para validade judicial, é necessário ordem do juiz com cadeia de custódia." },
  ],
  cejusc: [
    { titulo: "Procurar o CEJUSC", descricao: "Compareça ao Centro Judiciário de Solução de Conflitos e Cidadania (CEJUSC) da sua cidade. É um serviço gratuito do Poder Judiciário.", icon: Handshake, docs: ["RG / CPF de ambas as partes", "Certidão de nascimento da criança"] },
    { titulo: "Sessão de Mediação", descricao: "O mediador do CEJUSC convoca ambas as partes para uma sessão de conciliação. O objetivo é obter acordo sobre reconhecimento voluntário de paternidade.", icon: Users },
    { titulo: "Acordo para Exame de DNA", descricao: "Se não houver acordo imediato, o CEJUSC pode encaminhar as partes para realização de exame de DNA, indicando laboratório credenciado.", icon: FlaskConical, dica: "O CEJUSC pode indicar laboratórios com valores acessíveis ou gratuidade." },
    { titulo: "Agendamento via CEJUSC", descricao: "O CEJUSC agenda diretamente com o laboratório parceiro. Os participantes recebem data, horário e local da coleta.", icon: CalendarDays },
    { titulo: "Coleta e Análise", descricao: "Os participantes comparecem para coleta. O laboratório analisa e envia o laudo ao CEJUSC.", icon: FlaskConical },
    { titulo: "Homologação", descricao: "Com o resultado, o CEJUSC promove nova sessão. Havendo acordo, o termo é homologado pelo juiz coordenador e encaminhado ao cartório para registro.", icon: CheckCircle2 },
  ],
};

const LABORATORIOS = [
  { nome: "BioGenetics — Uberlândia/MG", cidade: "Uberlândia", estado: "MG" },
  { nome: "DNAjá — São Paulo/SP", cidade: "São Paulo", estado: "SP" },
  { nome: "DNAjá — Campinas/SP", cidade: "Campinas", estado: "SP" },
  { nome: "DNAjá — Ribeirão Preto/SP", cidade: "Ribeirão Preto", estado: "SP" },
  { nome: "DNAjá — Santos/SP", cidade: "Santos", estado: "SP" },
  { nome: "Perito Auxiliar — Sorocaba/SP", cidade: "Sorocaba", estado: "SP" },
  { nome: "Perito Auxiliar — Bauru/SP", cidade: "Bauru", estado: "SP" },
];

const ESTADOS_BR = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];

/* ── Componente ──────────────────────────────────────────── */

export default function JornadaDNA() {
  const { toast } = useToast();
  const [viaSelecionada, setViaSelecionada] = useState<Via>("defensoria");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [mostrarAgendamento, setMostrarAgendamento] = useState(false);
  const [agendamento, setAgendamento] = useState<Agendamento>({
    nome: "", cpf: "", telefone: "", email: "", cidade: "", estado: "SP",
    via: "defensoria", laboratorio: "", dataPreferida: "", participantes: 3, observacoes: "",
  });

  const etapas = ETAPAS[viaSelecionada];
  const viaInfo = VIAS.find(v => v.id === viaSelecionada)!;

  const handleAgendar = () => {
    if (!agendamento.nome || !agendamento.cpf || !agendamento.laboratorio) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, CPF e laboratório.", variant: "destructive" });
      return;
    }
    toast({ title: "Agendamento enviado!", description: `Solicitação para ${agendamento.nome} encaminhada ao laboratório ${agendamento.laboratorio}.` });
    setMostrarAgendamento(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jornada do DNA</h1>
        <p className="text-muted-foreground">Entenda o caminho completo para realizar um exame de DNA no Brasil</p>
      </div>

      <Tabs value={viaSelecionada} onValueChange={(v) => { setViaSelecionada(v as Via); setEtapaAtual(0); }}>
        <TabsList className="grid w-full grid-cols-4 h-auto">
          {VIAS.map(via => (
            <TabsTrigger key={via.id} value={via.id} className="flex flex-col gap-1 py-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <via.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{via.titulo.replace("Via ", "")}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {VIAS.map(via => (
          <TabsContent key={via.id} value={via.id} className="mt-4 space-y-4">
            {/* Banner */}
            <Card className="border-l-4" style={{ borderLeftColor: `hsl(var(--${via.id === "defensoria" ? "success" : via.id === "forum" ? "primary" : via.id === "cejusc" ? "warning" : "chart-4"}))` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <via.icon className={`h-8 w-8 ${via.cor}`} />
                  <div>
                    <CardTitle className="text-lg">{via.titulo}</CardTitle>
                    <CardDescription>{via.subtitulo}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{ETAPAS[via.id].length} etapas no processo</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Info className="h-4 w-4" />
                  <span>Clique em cada etapa para mais detalhes</span>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="grid gap-3 lg:grid-cols-[1fr_380px]">
              <div className="space-y-0">
                {ETAPAS[via.id].map((etapa, idx) => {
                  const isActive = idx === etapaAtual;
                  const isDone = idx < etapaAtual;
                  return (
                    <div key={idx} className="flex gap-3 cursor-pointer group" onClick={() => setEtapaAtual(idx)}>
                      {/* Linha vertical */}
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isActive ? "border-primary bg-primary text-primary-foreground" :
                          isDone ? "border-success bg-success text-success-foreground" :
                          "border-border bg-card text-muted-foreground"
                        }`}>
                          {isDone ? <CheckCircle2 className="h-5 w-5" /> : <etapa.icon className="h-5 w-5" />}
                        </div>
                        {idx < ETAPAS[via.id].length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[24px] ${isDone ? "bg-success" : "bg-border"}`} />
                        )}
                      </div>
                      {/* Card da etapa */}
                      <div className={`mb-3 flex-1 rounded-lg border p-4 transition-all ${
                        isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-muted-foreground/30"
                      }`}>
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                            Etapa {idx + 1}: {etapa.titulo}
                          </h3>
                          <Badge variant={isDone ? "default" : isActive ? "secondary" : "outline"} className="text-xs">
                            {isDone ? "Concluída" : isActive ? "Atual" : "Pendente"}
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
                            <span className="text-xs font-medium text-foreground">Documentos necessários:</span>
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

              {/* Painel lateral — Ação */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Agendar Coleta
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Defensoria, CEJUSC ou Fórum podem solicitar agendamento diretamente ao laboratório parceiro.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => { setMostrarAgendamento(!mostrarAgendamento); setAgendamento(prev => ({ ...prev, via: via.id })); }}>
                      {mostrarAgendamento ? "Fechar formulário" : "Solicitar Agendamento"}
                    </Button>
                  </CardContent>
                </Card>

                {mostrarAgendamento && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Formulário de Agendamento</CardTitle>
                      <CardDescription className="text-xs">Preencha os dados para encaminhamento ao laboratório</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Origem</Label>
                        <Select value={agendamento.via} onValueChange={v => setAgendamento(p => ({ ...p, via: v as Via }))}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {VIAS.map(v => <SelectItem key={v.id} value={v.id}>{v.titulo}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
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
                          <Label className="text-xs">E-mail</Label>
                          <Input className="h-8 text-xs" value={agendamento.email} onChange={e => setAgendamento(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Cidade</Label>
                          <Input className="h-8 text-xs" value={agendamento.cidade} onChange={e => setAgendamento(p => ({ ...p, cidade: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Estado</Label>
                          <Select value={agendamento.estado} onValueChange={v => setAgendamento(p => ({ ...p, estado: v }))}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {ESTADOS_BR.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                            </SelectContent>
                          </Select>
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
                      <div className="space-y-1.5">
                        <Label className="text-xs">Observações / Nº Processo</Label>
                        <Input className="h-8 text-xs" placeholder="Ex: Processo 1234567-89.2024.8.26.0000" value={agendamento.observacoes} onChange={e => setAgendamento(p => ({ ...p, observacoes: e.target.value }))} />
                      </div>
                      <Separator />
                      <Button className="w-full" onClick={handleAgendar}>
                        <CalendarDays className="mr-2 h-4 w-4" /> Enviar Solicitação
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Info rápida */}
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
                      <span>Para validade judicial, é obrigatória a <strong>cadeia de custódia</strong> e ordem do juiz.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 shrink-0 text-success mt-0.5" />
                      <span>Lei 1060/50, Art. 13°: mesmo em AJG, partes podem optar por <strong>perícia particular</strong> com rateio.</span>
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Navegação entre etapas */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={etapaAtual === 0} onClick={() => setEtapaAtual(e => e - 1)}>
          Etapa Anterior
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
