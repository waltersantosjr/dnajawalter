import {
  Dna, LayoutDashboard, Barcode, FilePlus, FileText,
  Activity, TrendingUp, ClipboardList, Settings, LogOut, UserCog,
  Calculator, Receipt, Briefcase, Microscope,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import dnajaLogo from "@/assets/dnaja-logo.png";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["admin", "coletor", "triagem"] },
  { title: "DNAjá", url: "/dnaja", icon: Barcode, roles: ["admin", "triagem"] },
  { title: "Reconstituição", url: "/exames/novo", icon: FilePlus, roles: ["admin", "coletor"] },
  { title: "Exames", url: "/exames", icon: FileText, roles: ["admin", "coletor", "triagem"] },
  { title: "Acompanhamento", url: "/acompanhamento", icon: Microscope, roles: ["admin", "coletor", "triagem"] },
  { title: "Simulador", url: "/simulador", icon: Activity, roles: ["admin", "coletor"] },
  { title: "Valores/Impostos", url: "/simulador-precos", icon: Calculator, roles: ["admin"] },
  { title: "CRM Comercial", url: "/crm", icon: Briefcase, roles: ["admin"] },
  { title: "Documentos", url: "/documentos", icon: Receipt, roles: ["admin", "coletor"] },
  { title: "Tendências", url: "/tendencias", icon: TrendingUp, roles: ["admin"] },
  { title: "Auditoria", url: "/auditoria", icon: ClipboardList, roles: ["admin"] },
  { title: "Configurações", url: "/configuracoes", icon: Settings, roles: ["admin"] },
];

const ICON_COLORS: Record<string, string> = {
  Dashboard: "text-primary",
  DNAjá: "text-warning",
  "Reconstituição": "text-success",
  Exames: "text-info",
  Acompanhamento: "text-info",
  Simulador: "text-chart-4",
  "Valores/Impostos": "text-success",
  "CRM Comercial": "text-chart-3",
  Documentos: "text-primary",
  Tendências: "text-chart-3",
  Auditoria: "text-muted-foreground",
  Configurações: "text-muted-foreground",
};

export function AppSidebar() {
  const { user, setRole, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role || "triagem")
  );

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src={dnajaLogo} alt="DNAjá" className="h-10 w-auto rounded-lg object-contain" />
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground">DNAjá</h2>
            <p className="text-xs text-sidebar-foreground/60">Vínculo Genético</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${ICON_COLORS[item.title]}`} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">
            <UserCog className="mr-1 h-3 w-3" /> Perfil Mock
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Select value={user?.role || "admin"} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="h-8 border-sidebar-border bg-sidebar-accent text-xs text-sidebar-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="coletor">Coletor</SelectItem>
                <SelectItem value="triagem">Triagem</SelectItem>
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
