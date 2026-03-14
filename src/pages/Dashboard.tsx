import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dna, Barcode, FileText, AlertTriangle, TrendingUp,
  Users, Clock, CheckCircle2, Package, Activity, Route,
  Calculator, ArrowRight, Briefcase,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const mockChartData = [
  { mes: "Set", exames: 42 },
  { mes: "Out", exames: 58 },
  { mes: "Nov", exames: 65 },
  { mes: "Dez", exames: 49 },
  { mes: "Jan", exames: 71 },
  { mes: "Fev", exames: 38 },
];

const recentExams = [
  { id: "EX-2026-001", tipo: "Trio", status: "concluido", data: "19/02/2026" },
  { id: "EX-2026-002", tipo: "Duo", status: "andamento", data: "18/02/2026" },
  { id: "EX-2026-003", tipo: "Reconstrução", status: "pendente", data: "17/02/2026" },
  { id: "DNA-2026-045", tipo: "DNAjá", status: "concluido", data: "17/02/2026" },
  { id: "EX-2026-004", tipo: "Perfil", status: "pendente", data: "16/02/2026" },
];

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  concluido: { label: "Concluído", variant: "default" },
  andamento: { label: "Em Andamento", variant: "secondary" },
  pendente: { label: "Pendente", variant: "outline" },
};

const MOCK_KITS = [
  { etiqueta: "DNA0001", status: "disponível" },
  { etiqueta: "DNA0002", status: "disponível" },
  { etiqueta: "DNA0003", status: "vendido" },
  { etiqueta: "DNA0004", status: "disponível" },
  { etiqueta: "DNA0005", status: "vendido" },
  { etiqueta: "DNA0006", status: "disponível" },
  { etiqueta: "DNA0007", status: "disponível" },
  { etiqueta: "DNA0008", status: "vendido" },
  { etiqueta: "DNA0009", status: "disponível" },
  { etiqueta: "DNA0010", status: "disponível" },
];

const QUICK_MENU = [
  { title: "DNAjá PDV", desc: "Venda rápida de kits", icon: Dna, color: "text-warning", bg: "bg-warning/10", url: "/dnaja" },
  { title: "Duo ou Trio", desc: "Cadastrar exame", icon: Users, color: "text-success", bg: "bg-success/10", url: "/exames/novo" },
  { title: "Reconstituição", desc: "Simular cenário", icon: Activity, color: "text-chart-4", bg: "bg-chart-4/10", url: "/simulador" },
  { title: "Documentos", desc: "Gerar declarações", icon: FileText, color: "text-primary", bg: "bg-primary/10", url: "/documentos" },
  { title: "Dr. DNAW", desc: "Jornada do DNA", icon: Route, color: "text-chart-3", bg: "bg-chart-3/10", url: "/jornada-dna" },
  { title: "Calculadora", desc: "Preços e impostos", icon: Calculator, color: "text-info", bg: "bg-info/10", url: "/simulador-precos" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const kitsDisponiveis = MOCK_KITS.filter(k => k.status === "disponível");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user?.name || "Usuário"} 👋</h1>
        <p className="text-muted-foreground">Visão geral da plataforma GenID</p>
      </div>

      {/* Quick Menu */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">⚡ Menu Rápido</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {QUICK_MENU.map(item => (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className="rounded-xl border-2 border-border p-4 text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02] group"
            >
              <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* KPIs + Meus Kits */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exames Hoje</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kits DNAjá</CardTitle>
            <Barcode className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Vendidos hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Documentos faltando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        {/* Meus Kits */}
        <Card className="border-warning/30 bg-gradient-to-br from-warning/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">📦 Meus Kits</CardTitle>
            <Package className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{kitsDisponiveis.length}</div>
            <p className="text-xs text-muted-foreground">disponíveis de {MOCK_KITS.length} total</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {kitsDisponiveis.slice(0, 4).map(k => (
                <Badge key={k.etiqueta} variant="outline" className="text-[10px] font-mono border-warning/30 text-warning">{k.etiqueta}</Badge>
              ))}
              {kitsDisponiveis.length > 4 && (
                <Badge variant="outline" className="text-[10px] border-muted-foreground/30">+{kitsDisponiveis.length - 4}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Volume de Exames
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="exames" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-warning" />
              Exames Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{exam.id}</p>
                    <p className="text-xs text-muted-foreground">{exam.tipo} · {exam.data}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[exam.status].variant}>
                    {STATUS_BADGE[exam.status].label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
