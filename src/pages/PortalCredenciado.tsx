import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
  Building2, ShoppingCart, Scale, Briefcase, Stethoscope,
  ChevronRight, Dna,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PORTAIS = [
  {
    id: "laboratorios",
    titulo: "Laboratórios",
    desc: "Gestão de coletas, resultados e cadeia de custódia",
    icon: Building2,
    cor: "text-primary",
    bg: "bg-primary/10",
    url: "/",
  },
  {
    id: "pdv",
    titulo: "PDV — Ponto de Venda",
    desc: "Venda de kits DNAjá e emissão de vouchers",
    icon: ShoppingCart,
    cor: "text-warning",
    bg: "bg-warning/10",
    url: "/",
  },
  {
    id: "judicial",
    titulo: "Judicial",
    desc: "Exames judiciais, peritos e laudos",
    icon: Scale,
    cor: "text-chart-4",
    bg: "bg-chart-4/10",
    url: "/",
  },
  {
    id: "comercial",
    titulo: "Comercial",
    desc: "CRM, pipeline de vendas e comissões",
    icon: Briefcase,
    cor: "text-success",
    bg: "bg-success/10",
    url: "/",
  },
  {
    id: "profissional",
    titulo: "Profissional da Saúde / Coleta",
    desc: "Habilitação e gestão de coletadores",
    icon: Stethoscope,
    cor: "text-chart-3",
    bg: "bg-chart-3/10",
    url: "/",
  },
];

const PortalCredenciado = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Dna className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {user?.name || "Usuário"} 👋
          </h1>
          <p className="text-muted-foreground">Selecione o portal para continuar</p>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PORTAIS.map(portal => (
            <Card
              key={portal.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:scale-[1.02]"
              onClick={() => navigate(portal.url)}
            >
              <CardHeader className="pb-2">
                <div className={`h-10 w-10 rounded-xl ${portal.bg} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                  <portal.icon className={`h-5 w-5 ${portal.cor}`} />
                </div>
                <CardTitle className="text-base flex items-center justify-between">
                  {portal.titulo}
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs">{portal.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalCredenciado;
