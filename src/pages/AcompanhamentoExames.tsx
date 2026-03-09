import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search, Filter, FileText, Users, Calendar, Clock,
  AlertTriangle, CheckCircle2, ArrowRight, Eye, Microscope,
  Package, Truck, DollarSign, Bell, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

/* ───── Types ───── */
interface Exame {
  id: string;
  codigo: string;
  tipo: "duo" | "trio" | "reconstituicao" | "irmandade";
  finalidade: "judicial" | "particular";
  status: "entrevista" | "coleta" | "cadastro" | "analise" | "laudo" | "entregue";
  andamento: number;
  setor: string;
  participantes: string[];
  quantParticipantes: number;
  dataEntrevista: string;
  dataRecAmostra: string;
  dataColeta: string;
  dataCadastro: string;
  dataPrevisao: string;
  dataFinalizacao: string;
  dataEntrega: string;
  laudoFisico: boolean;
  laudoEletronico: boolean;
  valorTotal: string;
  statusFinanceiro: "pago" | "pendente" | "parcial";
  tipoPagamento: string;
  parcelas: number;
  alertas: string[];
  conveniado: string;
}

/* ───── Mock Data ───── */
const MOCK_EXAMES: Exame[] = [
  {
    id: "1", codigo: "EX-2026-0341", tipo: "trio", finalidade: "judicial",
    status: "analise", andamento: 65, setor: "Laboratório PCR",
    participantes: ["Maria Silva (Mãe)", "João Silva (Filho)", "Carlos Souza (SP)"],
    quantParticipantes: 3, dataEntrevista: "2026-02-15", dataRecAmostra: "2026-02-16",
    dataColeta: "2026-02-15", dataCadastro: "2026-02-16", dataPrevisao: "2026-03-15",
    dataFinalizacao: "", dataEntrega: "", laudoFisico: true, laudoEletronico: true,
    valorTotal: "R$ 1.200,00", statusFinanceiro: "pago", tipoPagamento: "Boleto", parcelas: 3,
    alertas: [], conveniado: "Defensoria Pública SP",
  },
  {
    id: "2", codigo: "EX-2026-0342", tipo: "reconstituicao", finalidade: "judicial",
    status: "coleta", andamento: 25, setor: "Recepção",
    participantes: ["Ana Costa (Mãe)", "Pedro Costa (Filho)", "José Almeida (Avô Paterno)", "Rosa Almeida (Avó Paterna)"],
    quantParticipantes: 4, dataEntrevista: "2026-03-01", dataRecAmostra: "",
    dataColeta: "2026-03-02", dataCadastro: "2026-03-02", dataPrevisao: "2026-03-25",
    dataFinalizacao: "", dataEntrega: "", laudoFisico: false, laudoEletronico: true,
    valorTotal: "R$ 2.800,00", statusFinanceiro: "parcial", tipoPagamento: "Cartão", parcelas: 6,
    alertas: ["Falta documentação do Avô Paterno"], conveniado: "Lab MedGen",
  },
  {
    id: "3", codigo: "EX-2026-0340", tipo: "duo", finalidade: "particular",
    status: "laudo", andamento: 90, setor: "Conferência",
    participantes: ["Lucia Santos (Mãe)", "Marcos Santos (Filho)"],
    quantParticipantes: 2, dataEntrevista: "2026-02-10", dataRecAmostra: "2026-02-11",
    dataColeta: "2026-02-10", dataCadastro: "2026-02-11", dataPrevisao: "2026-03-05",
    dataFinalizacao: "2026-03-04", dataEntrega: "", laudoFisico: true, laudoEletronico: true,
    valorTotal: "R$ 800,00", statusFinanceiro: "pago", tipoPagamento: "PIX", parcelas: 1,
    alertas: [], conveniado: "Particular",
  },
  {
    id: "4", codigo: "EX-2026-0339", tipo: "trio", finalidade: "judicial",
    status: "entregue", andamento: 100, setor: "Finalizado",
    participantes: ["Carla Oliveira (Mãe)", "Bruno Oliveira (Filho)", "Ricardo Mendes (SP)"],
    quantParticipantes: 3, dataEntrevista: "2026-01-20", dataRecAmostra: "2026-01-21",
    dataColeta: "2026-01-20", dataCadastro: "2026-01-21", dataPrevisao: "2026-02-15",
    dataFinalizacao: "2026-02-14", dataEntrega: "2026-02-18", laudoFisico: true, laudoEletronico: true,
    valorTotal: "R$ 1.200,00", statusFinanceiro: "pago", tipoPagamento: "Boleto", parcelas: 2,
    alertas: [], conveniado: "Fórum Central BH",
  },
];

const STATUS_STEPS = ["entrevista", "coleta", "cadastro", "analise", "laudo", "entregue"];
const STATUS_LABELS: Record<string, string> = { entrevista: "Entrevista", coleta: "Coleta", cadastro: "Cadastro", analise: "Análise", laudo: "Laudo", entregue: "Entregue" };
const TIPO_LABELS: Record<string, string> = { duo: "Duo", trio: "Trio", reconstituicao: "Reconstituição", irmandade: "Irmandade" };
const FIN_BADGE: Record<string, { label: string; variant: "default" | "destructive" | "secondary" }> = {
  pago: { label: "Pago", variant: "default" },
  pendente: { label: "Pendente", variant: "destructive" },
  parcial: { label: "Parcial", variant: "secondary" },
};

/* ───── Component ───── */
const AcompanhamentoExames = () => {
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [exameSelecionado, setExameSelecionado] = useState<string | null>(null);

  const examesFiltrados = MOCK_EXAMES.filter(e => {
    const matchSearch = e.codigo.toLowerCase().includes(search.toLowerCase()) || e.participantes.some(p => p.toLowerCase().includes(search.toLowerCase())) || e.conveniado.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filtroStatus === "todos" || e.status === filtroStatus;
    const matchTipo = filtroTipo === "todos" || e.tipo === filtroTipo;
    return matchSearch && matchStatus && matchTipo;
  });

  const exameAtual = MOCK_EXAMES.find(e => e.id === exameSelecionado);

  const statusColor = (s: string) => {
    if (s === "entregue") return "text-success";
    if (s === "laudo") return "text-info";
    if (s === "analise") return "text-primary";
    return "text-warning";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Microscope className="h-7 w-7 text-info" /> Acompanhamento de Exames
        </h1>
        <p className="text-muted-foreground">Controle detalhado do andamento, dados e financeiro de cada exame</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por código, participante ou conveniado..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                {STATUS_STEPS.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Tipos</SelectItem>
                <SelectItem value="duo">Duo</SelectItem>
                <SelectItem value="trio">Trio</SelectItem>
                <SelectItem value="reconstituicao">Reconstituição</SelectItem>
                <SelectItem value="irmandade">Irmandade</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.info("Filtros aplicados")}>
              <Filter className="mr-1 h-4 w-4" /> Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Exam List */}
        <div className="lg:col-span-2 space-y-2">
          {examesFiltrados.map(e => (
            <Card
              key={e.id}
              onClick={() => setExameSelecionado(e.id)}
              className={`cursor-pointer transition-all hover:shadow-sm ${exameSelecionado === e.id ? "border-primary/30 bg-primary/5 shadow-sm" : "hover:bg-muted/50"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold">{e.codigo}</span>
                  <Badge variant="outline" className={`text-[10px] ${statusColor(e.status)}`}>
                    {STATUS_LABELS[e.status]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{TIPO_LABELS[e.tipo]} • {e.finalidade.toUpperCase()}</span>
                  <span>{e.quantParticipantes} participantes</span>
                </div>
                <Progress value={e.andamento} className="h-1.5" />
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{e.andamento}% concluído</span>
                  <span>{e.conveniado}</span>
                </div>
                {e.alertas.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-warning">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-[10px]">{e.alertas.length} pendência(s)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: Detail */}
        <div className="lg:col-span-3">
          {exameAtual ? (
            <div className="space-y-4">
              {/* Header */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> {exameAtual.codigo}
                      </CardTitle>
                      <CardDescription>
                        {TIPO_LABELS[exameAtual.tipo]} • {exameAtual.finalidade.toUpperCase()} • {exameAtual.conveniado}
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.info("Atualizando exame...")}>
                      <RefreshCw className="mr-1 h-3.5 w-3.5" /> Atualizar
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="geral" className="space-y-3">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                  <TabsTrigger value="geral" className="text-xs">Geral</TabsTrigger>
                  <TabsTrigger value="dados" className="text-xs">Dados</TabsTrigger>
                  <TabsTrigger value="participantes" className="text-xs">Participantes</TabsTrigger>
                  <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
                  <TabsTrigger value="pendencias" className="text-xs">Pendências</TabsTrigger>
                </TabsList>

                {/* Geral */}
                <TabsContent value="geral">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      {/* Progress steps */}
                      <div>
                        <p className="text-sm font-semibold mb-3">Andamento</p>
                        <div className="flex items-center gap-1">
                          {STATUS_STEPS.map((s, i) => {
                            const currentIdx = STATUS_STEPS.indexOf(exameAtual.status);
                            const done = i <= currentIdx;
                            return (
                              <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
                                <p className={`text-[10px] mt-1 text-center ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                  {STATUS_LABELS[s]}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-sm mt-2"><strong>Setor:</strong> {exameAtual.setor} — <strong>{exameAtual.andamento}%</strong></p>
                      </div>

                      {/* Dates grid */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border p-3 space-y-1.5 text-sm">
                          <p className="font-semibold text-xs text-primary flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Datas</p>
                          <p><strong>Entrevista:</strong> {exameAtual.dataEntrevista || "—"}</p>
                          <p><strong>Rec. Amostra:</strong> {exameAtual.dataRecAmostra || "—"}</p>
                          <p><strong>Coleta:</strong> {exameAtual.dataColeta || "—"}</p>
                          <p><strong>Cadastro:</strong> {exameAtual.dataCadastro || "—"}</p>
                        </div>
                        <div className="rounded-lg border p-3 space-y-1.5 text-sm">
                          <p className="font-semibold text-xs text-info flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Previsão / Entrega</p>
                          <p><strong>Previsão:</strong> {exameAtual.dataPrevisao || "—"}</p>
                          <p><strong>Finalização:</strong> {exameAtual.dataFinalizacao || "—"}</p>
                          <p><strong>Entrega:</strong> {exameAtual.dataEntrega || "—"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {exameAtual.laudoFisico && <Badge variant="outline" className="text-[10px]">Laudo Físico</Badge>}
                            {exameAtual.laudoEletronico && <Badge variant="outline" className="text-[10px]">Laudo Eletrônico</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Participantes */}
                <TabsContent value="participantes">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-primary" />
                        <p className="font-semibold text-sm">Participantes ({exameAtual.quantParticipantes})</p>
                      </div>
                      <div className="space-y-2">
                        {exameAtual.participantes.map((p, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <span className="text-sm">{p}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Dados */}
                <TabsContent value="dados">
                  <Card>
                    <CardContent className="p-4 space-y-3 text-sm">
                      <p><strong>Tipo:</strong> {TIPO_LABELS[exameAtual.tipo]}</p>
                      <p><strong>Finalidade:</strong> {exameAtual.finalidade === "judicial" ? "JUD / PART" : "PARTICULAR"}</p>
                      <p><strong>Conveniado:</strong> {exameAtual.conveniado}</p>
                      <p><strong>Exame:</strong> {exameAtual.codigo}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financeiro */}
                <TabsContent value="financeiro">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-success" />
                        <p className="font-semibold text-sm">Financeiro</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border p-3 space-y-1.5 text-sm">
                          <p><strong>Valor:</strong> {exameAtual.valorTotal}</p>
                          <p><strong>Tipo:</strong> {exameAtual.tipoPagamento}</p>
                          <p><strong>Parcelas:</strong> {exameAtual.parcelas}x</p>
                        </div>
                        <div className="rounded-lg border p-3 flex items-center justify-center">
                          <Badge variant={FIN_BADGE[exameAtual.statusFinanceiro].variant} className="text-sm px-4 py-1">
                            {FIN_BADGE[exameAtual.statusFinanceiro].label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pendências */}
                <TabsContent value="pendencias">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="h-4 w-4 text-warning" />
                        <p className="font-semibold text-sm">Alertas e Pendências</p>
                      </div>
                      {exameAtual.alertas.length === 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-success/10 p-4">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <p className="text-sm text-success font-medium">Nenhuma pendência</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {exameAtual.alertas.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
                              <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                              <p className="text-sm">{a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <Microscope className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">Selecione um exame</p>
                <p className="text-xs mt-1">Clique em um exame na lista para ver os detalhes completos</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcompanhamentoExames;
