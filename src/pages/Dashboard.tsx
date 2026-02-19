import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dna, Barcode, FileText, AlertTriangle, TrendingUp,
  Users, Clock, CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user?.name || "Usuário"} 👋</h1>
        <p className="text-muted-foreground">Visão geral da plataforma GenID</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
