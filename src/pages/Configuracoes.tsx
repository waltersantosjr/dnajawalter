import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, User, Shield } from "lucide-react";

const Configuracoes = () => {
  const { user, setRole } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-7 w-7 text-muted-foreground" /> Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" /> Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={user?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={user?.email || ""} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-warning" /> Nível de Acesso (Mock)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Perfil Ativo</Label>
              <Select value={user?.role || "admin"} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador do Laboratório</SelectItem>
                  <SelectItem value="coletor">Coletor (Clínica Parceira)</SelectItem>
                  <SelectItem value="triagem">Triagem / Recepção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Altere o perfil para testar diferentes visões da plataforma. O menu lateral se adaptará automaticamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
