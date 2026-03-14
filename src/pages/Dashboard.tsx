import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dna, FileText, AlertTriangle, CheckCircle2, Package,
  Users, Activity, Calculator, Route, Barcode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_KITS = [
  { etiqueta: "DNA0001", status: "disponível" },
  { etiqueta: "DNA0002", status: "disponível" },
  { etiqueta: "DNA0003", status: "vendido" },
  { etiqueta: "DNA0004", status: "disponível" },
  { etiqueta: "DNA0005", status: "vendido" },
  { etiqueta: "DNA0006", status: "disponível" },
  { etiqueta: "DNA0007", status: "disponível" },
];

const QUICK_MENU = [
  { title: "DNAjá PDV", icon: Dna, color: "text-warning", bg: "bg-warning/10", url: "/dnaja" },
  { title: "Duo ou Trio", icon: Users, color: "text-success", bg: "bg-success/10", url: "/exames/novo" },
  { title: "Reconstituição", icon: Activity, color: "text-chart-4", bg: "bg-chart-4/10", url: "/simulador" },
  { title: "Documentos", icon: FileText, color: "text-primary", bg: "bg-primary/10", url: "/documentos" },
  { title: "Dr. DNAW", icon: Route, color: "text-chart-3", bg: "bg-chart-3/10", url: "/jornada-dna" },
  { title: "Calculadora", icon: Calculator, color: "text-info", bg: "bg-info/10", url: "/simulador-precos" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const kitsDisponiveis = MOCK_KITS.filter(k => k.status === "disponível");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user?.name || "Usuário"} 👋</h1>
        <p className="text-muted-foreground text-sm">Visão geral da plataforma</p>
      </div>

      {/* Quick Menu */}
      <div className="grid gap-3 grid-cols-3 md:grid-cols-6">
        {QUICK_MENU.map(item => (
          <button
            key={item.title}
            onClick={() => navigate(item.url)}
            className="rounded-xl border border-border p-3 text-center transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02] group"
          >
            <div className={`h-9 w-9 mx-auto rounded-lg ${item.bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className="font-medium text-xs">{item.title}</p>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Exames Hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Barcode className="h-8 w-8 text-warning shrink-0" />
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Kits Vendidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Pendências</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-success shrink-0" />
            <div>
              <p className="text-2xl font-bold">247</p>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meus Kits */}
      <Card className="border-warning/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4 text-warning" />
            Meus Kits — {kitsDisponiveis.length} disponíveis de {MOCK_KITS.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_KITS.map(k => (
              <Badge
                key={k.etiqueta}
                variant={k.status === "disponível" ? "outline" : "secondary"}
                className={`text-[10px] font-mono ${k.status === "disponível" ? "border-warning/40 text-warning" : "opacity-50 line-through"}`}
              >
                {k.etiqueta}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
