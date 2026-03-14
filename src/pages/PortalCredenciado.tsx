import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2, ShoppingCart, Scale, Briefcase, Stethoscope,
  ArrowRight, Users, MapPin, Phone, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PORTAIS = [
  {
    id: "laboratorios",
    titulo: "Laboratórios",
    desc: "Gerencie laboratórios credenciados, resultados e cadeia de custódia",
    icon: Building2,
    cor: "text-primary",
    bg: "bg-primary/10",
    items: ["Cadastro de unidades", "Gestão de coletas", "Envio de resultados", "Cadeia de custódia"],
    url: "/acompanhamento",
  },
  {
    id: "pdv",
    titulo: "PDV — Ponto de Venda",
    desc: "Venda de kits DNAjá, emissão de vouchers e controle de estoque",
    icon: ShoppingCart,
    cor: "text-warning",
    bg: "bg-warning/10",
    items: ["Venda de kits", "Voucher presencial", "Controle de estoque", "Histórico de vendas"],
    url: "/dnaja",
  },
  {
    id: "judicial",
    titulo: "Judicial",
    desc: "Exames judiciais, nomeação de peritos e laudos com cadeia de custódia",
    icon: Scale,
    cor: "text-chart-4",
    bg: "bg-chart-4/10",
    items: ["Exames judiciais", "Reconstituição genética", "IPM (Post Mortem)", "Documentos e ofícios"],
    url: "/exames/novo",
  },
  {
    id: "comercial",
    titulo: "Comercial",
    desc: "CRM, pipeline de vendas, metas e comissionamento",
    icon: Briefcase,
    cor: "text-success",
    bg: "bg-success/10",
    items: ["Pipeline de vendas", "Leads e oportunidades", "Metas e KPIs", "Comissões"],
    url: "/crm",
  },
  {
    id: "profissional",
    titulo: "Profissional da Saúde / Coleta",
    desc: "Habilitação, cadastro e gestão de profissionais coletadores",
    icon: Stethoscope,
    cor: "text-chart-3",
    bg: "bg-chart-3/10",
    items: ["Cadastro de coletadores", "Habilitação e documentos", "Termo de compromisso", "Cadeia de custódia"],
    url: "/profissionais",
  },
];

const PortalCredenciado = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" /> Portal Credenciado
        </h1>
        <p className="text-muted-foreground">Acesse os módulos disponíveis para sua operação</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PORTAIS.map(portal => (
          <Card
            key={portal.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.02]"
            onClick={() => navigate(portal.url)}
          >
            <CardHeader className="pb-3">
              <div className={`h-12 w-12 rounded-xl ${portal.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <portal.icon className={`h-6 w-6 ${portal.cor}`} />
              </div>
              <CardTitle className="text-lg flex items-center justify-between">
                {portal.titulo}
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardTitle>
              <CardDescription>{portal.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {portal.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortalCredenciado;
