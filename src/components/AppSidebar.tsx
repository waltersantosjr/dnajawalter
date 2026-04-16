import {
  Dna, LayoutDashboard, Barcode, FilePlus, FileText,
  Activity, TrendingUp, ClipboardList, Settings, LogOut, UserCog,
  Calculator, Receipt, Briefcase, Microscope, Route, Users, GraduationCap,
  Building2, ShieldCheck, Package, Heart, FileSearch } from
"lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter } from
"@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["admin", "coletor", "triagem"] },
  { title: "DNAjá", url: "/dnaja", icon: Dna, roles: ["admin", "triagem"] },
  { title: "1DNA", url: "/1dna", icon: FileSearch, roles: ["admin", "coletor", "triagem"] },
  { title: "G4U App", url: "/g4u", icon: Heart, roles: ["admin", "coletor", "triagem"] },
  { title: "Duo ou Trio", url: "/exames/novo", icon: Users, roles: ["admin", "coletor"] },
  { title: "Reconstituição", url: "/simulador", icon: Activity, roles: ["admin", "coletor"] },
  { title: "Exames Cadastrados", url: "/exames", icon: FileText, roles: ["admin", "coletor", "triagem"] },
  { title: "Acompanhamento", url: "/acompanhamento", icon: Microscope, roles: ["admin", "coletor", "triagem"] },
  { title: "Documentos", url: "/documentos", icon: Receipt, roles: ["admin", "coletor"] },
  { title: "Dr. DNAW", url: "/jornada-dna", icon: GraduationCap, roles: ["admin", "coletor", "triagem"] },
  { title: "Calculadora DNAjá", url: "/simulador-precos", icon: Calculator, roles: ["admin"] },
  { title: "Etiquetas", url: "/etiquetas", icon: Barcode, roles: ["admin", "coletor"] },
  { title: "IPM", url: "/ipm", icon: ClipboardList, roles: ["admin", "coletor"] },
  { title: "Retorno Amostras", url: "/retorno-amostras", icon: Package, roles: ["admin", "coletor", "triagem"] },
  
  { title: "Profissionais", url: "/profissionais", icon: ShieldCheck, roles: ["admin"] },
  { title: "CRM Comercial", url: "/crm", icon: Briefcase, roles: ["admin"] },
  { title: "Tendências", url: "/tendencias", icon: TrendingUp, roles: ["admin"] },
  { title: "Configurações", url: "/configuracoes", icon: Settings, roles: ["admin"] },
];

const ICON_COLORS: Record<string, string> = {
  Dashboard: "text-primary",
  DNAjá: "text-warning",
  "1DNA": "text-primary",
  "G4U App": "text-destructive",
  "Duo ou Trio": "text-success",
  "Reconstituição": "text-chart-4",
  "Exames Cadastrados": "text-info",
  Acompanhamento: "text-info",
  Documentos: "text-primary",
  "Dr. DNAW": "text-chart-3",
  "Calculadora DNAjá": "text-success",
  "Etiquetas": "text-chart-4",
  "IPM": "text-destructive",
  "Retorno Amostras": "text-chart-4",
  "Portal Credenciado": "text-primary",
  "Profissionais": "text-chart-3",
  "CRM Comercial": "text-chart-3",
  Tendências: "text-chart-3",
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
          <img alt="GN4U" className="h-14 w-14 rounded-lg object-contain" src="/logo-gn4u.png" />
          <div>
            <h2 className="text-base font-bold text-sidebar-foreground">GN4U</h2>
            <p className="text-xs text-sidebar-foreground/60">Genética & Saúde</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) =>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent hover:translate-x-1 transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                    >
                      <item.icon className={`mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${ICON_COLORS[item.title] || "text-muted-foreground"}`} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
