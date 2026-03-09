import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, UserPlus, Search, Building2, Phone, Mail, MapPin,
  Calendar, MessageSquare, Plus, Edit, Trash2, Eye,
  TrendingUp, Target, Briefcase, Clock, Star, Filter,
} from "lucide-react";
import { toast } from "sonner";

/* ───── Types ───── */
interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  tipo: "conveniado" | "particular" | "defensoria" | "forum";
  status: "ativo" | "inativo" | "prospeccao";
  vendedor: string;
  ultimoContato: string;
  valor: string;
}

interface Memorial {
  id: string;
  clienteId: string;
  data: string;
  tipo: "visita" | "ligacao" | "email" | "reuniao";
  motivo: "informacao" | "venda" | "pos-venda" | "reclamacao" | "cobranca" | "agendamento";
  descricao: string;
  vendedor: string;
}

/* ───── Mock Data ───── */
const MOCK_CLIENTES: Cliente[] = [
  { id: "1", nome: "Lab MedGen", empresa: "MedGen Diagnósticos", cidade: "São Paulo", estado: "SP", telefone: "(11) 3456-7890", email: "contato@medgen.com.br", tipo: "conveniado", status: "ativo", vendedor: "Carlos Silva", ultimoContato: "2026-03-08", valor: "R$ 45.000" },
  { id: "2", nome: "Clínica Genoma", empresa: "Genoma Center", cidade: "Rio de Janeiro", estado: "RJ", telefone: "(21) 2345-6789", email: "admin@genoma.com.br", tipo: "conveniado", status: "ativo", vendedor: "Ana Souza", ultimoContato: "2026-03-05", valor: "R$ 32.000" },
  { id: "3", nome: "Defensoria Pública SP", empresa: "Defensoria Pública", cidade: "São Paulo", estado: "SP", telefone: "(11) 3456-0000", email: "dna@defensoria.sp.gov.br", tipo: "defensoria", status: "ativo", vendedor: "Carlos Silva", ultimoContato: "2026-03-01", valor: "R$ 120.000" },
  { id: "4", nome: "Fórum Central BH", empresa: "TJMG", cidade: "Belo Horizonte", estado: "MG", telefone: "(31) 3222-1111", email: "vara.familia@tjmg.jus.br", tipo: "forum", status: "ativo", vendedor: "Roberto Lima", ultimoContato: "2026-02-28", valor: "R$ 78.000" },
  { id: "5", nome: "DNA Express", empresa: "DNA Express Ltda", cidade: "Curitiba", estado: "PR", telefone: "(41) 3333-4444", email: "vendas@dnaexpress.com.br", tipo: "conveniado", status: "prospeccao", vendedor: "Ana Souza", ultimoContato: "2026-03-07", valor: "R$ 0" },
];

const MOCK_MEMORIAIS: Memorial[] = [
  { id: "1", clienteId: "1", data: "2026-03-08", tipo: "visita", motivo: "venda", descricao: "Visita realizada. Cliente trabalha com MedGen com preço de R$ 180,00 por kit. Interesse em aumentar volume para 200 kits/mês. Solicitou proposta com desconto progressivo.", vendedor: "Carlos Silva" },
  { id: "2", clienteId: "1", data: "2026-03-01", tipo: "ligacao", motivo: "pos-venda", descricao: "Cliente satisfeito com prazo de entrega de laudos. Pediu inclusão de painel NGS no catálogo.", vendedor: "Carlos Silva" },
  { id: "3", clienteId: "2", data: "2026-03-05", tipo: "reuniao", motivo: "informacao", descricao: "Reunião online para apresentar novo simulador de reconstituição. Cliente demonstrou interesse em teste piloto.", vendedor: "Ana Souza" },
  { id: "4", clienteId: "3", data: "2026-03-01", tipo: "visita", motivo: "venda", descricao: "Reunião com coordenação da defensoria. Renovação do contrato anual com aumento de 15% no volume. Preço negociado: R$ 150/exame.", vendedor: "Carlos Silva" },
  { id: "5", clienteId: "4", data: "2026-02-28", tipo: "email", motivo: "agendamento", descricao: "Enviado calendário de coletas para março. Aguardando confirmação das datas pela vara de família.", vendedor: "Roberto Lima" },
];

const VENDEDORES = ["Carlos Silva", "Ana Souza", "Roberto Lima"];

const tipoLabel: Record<string, string> = { conveniado: "Conveniado", particular: "Particular", defensoria: "Defensoria", forum: "Fórum/Comarca" };
const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  ativo: { label: "Ativo", variant: "default" },
  inativo: { label: "Inativo", variant: "secondary" },
  prospeccao: { label: "Prospecção", variant: "outline" },
};
const motivoLabel: Record<string, string> = { informacao: "Informação", venda: "Venda", "pos-venda": "Pós Venda / CQ", reclamacao: "Reclamação", cobranca: "Cobrança", agendamento: "Agendamento" };
const tipoContatoIcon: Record<string, React.ElementType> = { visita: MapPin, ligacao: Phone, email: Mail, reuniao: Users };

/* ───── Component ───── */
const CRM = () => {
  const [search, setSearch] = useState("");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [novoMemorial, setNovoMemorial] = useState("");
  const [novoMemorialTipo, setNovoMemorialTipo] = useState("visita");
  const [novoMemorialMotivo, setNovoMemorialMotivo] = useState("informacao");
  const [memoriais, setMemoriais] = useState(MOCK_MEMORIAIS);

  const clientesFiltrados = MOCK_CLIENTES.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) || c.empresa.toLowerCase().includes(search.toLowerCase()) || c.cidade.toLowerCase().includes(search.toLowerCase());
    const matchVendedor = filtroVendedor === "todos" || c.vendedor === filtroVendedor;
    const matchTipo = filtroTipo === "todos" || c.tipo === filtroTipo;
    return matchSearch && matchVendedor && matchTipo;
  });

  const clienteAtual = MOCK_CLIENTES.find(c => c.id === clienteSelecionado);
  const memoriaisCliente = memoriais.filter(m => m.clienteId === clienteSelecionado).sort((a, b) => b.data.localeCompare(a.data));

  const addMemorial = () => {
    if (!novoMemorial.trim() || !clienteSelecionado) return;
    setMemoriais(prev => [{
      id: `m_${Date.now()}`, clienteId: clienteSelecionado, data: new Date().toISOString().slice(0, 10),
      tipo: novoMemorialTipo as Memorial["tipo"], motivo: novoMemorialMotivo as Memorial["motivo"],
      descricao: novoMemorial, vendedor: "Carlos Silva",
    }, ...prev]);
    setNovoMemorial("");
    toast.success("Memorial registrado com sucesso");
  };

  // Dashboard stats
  const totalAtivos = MOCK_CLIENTES.filter(c => c.status === "ativo").length;
  const totalProspeccao = MOCK_CLIENTES.filter(c => c.status === "prospeccao").length;
  const contatosHoje = memoriais.filter(m => m.data === "2026-03-08").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-primary" /> CRM — Gestão Comercial
        </h1>
        <p className="text-muted-foreground">Carteira de clientes, memoriais de visita e acompanhamento comercial</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_CLIENTES.length}</p>
              <p className="text-xs text-muted-foreground">Clientes Cadastrados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAtivos}</p>
              <p className="text-xs text-muted-foreground">Clientes Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProspeccao}</p>
              <p className="text-xs text-muted-foreground">Em Prospecção</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <MessageSquare className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{contatosHoje}</p>
              <p className="text-xs text-muted-foreground">Contatos Hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="carteira" className="space-y-4">
        <TabsList>
          <TabsTrigger value="carteira">Carteira de Clientes</TabsTrigger>
          <TabsTrigger value="equipe">Equipe Comercial</TabsTrigger>
        </TabsList>

        {/* ═══ TAB: Carteira ═══ */}
        <TabsContent value="carteira">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Client List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Clientes
                  </CardTitle>
                  <div className="space-y-2 pt-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                      <Select value={filtroVendedor} onValueChange={setFiltroVendedor}>
                        <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder="Vendedor" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos vendedores</SelectItem>
                          {VENDEDORES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                        <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos tipos</SelectItem>
                          <SelectItem value="conveniado">Conveniado</SelectItem>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="defensoria">Defensoria</SelectItem>
                          <SelectItem value="forum">Fórum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                  {clientesFiltrados.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setClienteSelecionado(c.id)}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all hover:shadow-sm ${
                        clienteSelecionado === c.id ? "bg-primary/5 border-primary/30 shadow-sm" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{c.nome}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.empresa}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={statusLabel[c.status].variant} className="text-[10px] px-1.5 py-0">
                            {statusLabel[c.status].label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{c.cidade}/{c.estado}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-semibold text-success">{c.valor}</p>
                        <p className="text-[10px] text-muted-foreground">{c.vendedor}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => toast.info("Novo cliente (mock)")}>
                    <UserPlus className="mr-1 h-4 w-4" /> Novo Cliente
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Client Detail + Memorial */}
            <div className="lg:col-span-3 space-y-4">
              {clienteAtual ? (
                <>
                  {/* Client Info Panel */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" /> {clienteAtual.nome}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost"><Edit className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /> {clienteAtual.empresa}</div>
                          <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {clienteAtual.cidade} / {clienteAtual.estado}</div>
                          <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {clienteAtual.telefone}</div>
                          <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {clienteAtual.email}</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Tipo:</strong> {tipoLabel[clienteAtual.tipo]}</p>
                          <p><strong>Vendedor:</strong> {clienteAtual.vendedor}</p>
                          <p><strong>Último contato:</strong> {clienteAtual.ultimoContato}</p>
                          <p><strong>Faturamento:</strong> <span className="text-success font-semibold">{clienteAtual.valor}</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Memorial */}
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> Registrar Contato / Memorial
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Select value={novoMemorialTipo} onValueChange={setNovoMemorialTipo}>
                          <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visita">Visita</SelectItem>
                            <SelectItem value="ligacao">Ligação</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="reuniao">Reunião</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={novoMemorialMotivo} onValueChange={setNovoMemorialMotivo}>
                          <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="informacao">Informação</SelectItem>
                            <SelectItem value="venda">Venda</SelectItem>
                            <SelectItem value="pos-venda">Pós Venda / CQ</SelectItem>
                            <SelectItem value="reclamacao">Reclamação / Sugestão</SelectItem>
                            <SelectItem value="cobranca">Cobrança</SelectItem>
                            <SelectItem value="agendamento">Agendamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <textarea
                        className="w-full rounded-lg border bg-background p-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Visita realizada no dia 08/03. Cliente trabalha com MedGen com preço de R$ 180,00..."
                        value={novoMemorial}
                        onChange={e => setNovoMemorial(e.target.value)}
                      />
                      <Button size="sm" className="w-full" onClick={addMemorial}>
                        <MessageSquare className="mr-1 h-4 w-4" /> Salvar Memorial
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Memorial Timeline */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-info" /> Histórico de Contatos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {memoriaisCliente.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Nenhum memorial registrado para este cliente.</p>
                      ) : (
                        <div className="space-y-3">
                          {memoriaisCliente.map(m => {
                            const Icon = tipoContatoIcon[m.tipo] || MessageSquare;
                            return (
                              <div key={m.id} className="flex gap-3 rounded-lg border p-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-[10px]">{m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}</Badge>
                                    <Badge variant="secondary" className="text-[10px]">{motivoLabel[m.motivo]}</Badge>
                                    <span className="text-[10px] text-muted-foreground ml-auto">{m.data}</span>
                                  </div>
                                  <p className="text-xs text-foreground mt-1.5 leading-relaxed">{m.descricao}</p>
                                  <p className="text-[10px] text-muted-foreground mt-1">Por: {m.vendedor}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <Eye className="mx-auto h-12 w-12 mb-3 opacity-30" />
                    <p className="font-medium">Selecione um cliente</p>
                    <p className="text-xs mt-1">Clique em um cliente na lista para ver detalhes e memoriais</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ═══ TAB: Equipe ═══ */}
        <TabsContent value="equipe">
          <div className="grid gap-4 md:grid-cols-3">
            {VENDEDORES.map(v => {
              const clientes = MOCK_CLIENTES.filter(c => c.vendedor === v);
              const contatos = memoriais.filter(m => m.vendedor === v);
              return (
                <Card key={v}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      {v}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xl font-bold">{clientes.length}</p>
                        <p className="text-[10px] text-muted-foreground">Clientes</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xl font-bold">{contatos.length}</p>
                        <p className="text-[10px] text-muted-foreground">Contatos</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                      {clientes.map(c => (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <span className="truncate">{c.nome}</span>
                          <Badge variant={statusLabel[c.status].variant} className="text-[10px] px-1.5 py-0 shrink-0 ml-1">
                            {statusLabel[c.status].label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
