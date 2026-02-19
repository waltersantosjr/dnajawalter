import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, User, Clock, FileText, Edit, Trash, Plus } from "lucide-react";

const mockLogs = [
  { id: "1", user: "Admin", action: "Cadastro", desc: "Exame EX-2026-001 criado (Trio Judicial)", date: "19/02/2026 14:32", type: "create" },
  { id: "2", user: "Triagem", action: "Venda", desc: "Kit DNA-2026-045 vendido (DNAjá)", date: "19/02/2026 11:15", type: "create" },
  { id: "3", user: "Admin", action: "Alteração", desc: "Status EX-2026-002 atualizado para 'Em Andamento'", date: "18/02/2026 16:45", type: "update" },
  { id: "4", user: "Coletor", action: "Upload", desc: "RG adicionado ao participante João Silva", date: "18/02/2026 10:20", type: "update" },
  { id: "5", user: "Admin", action: "Exclusão", desc: "Participante removido do exame EX-2026-003", date: "17/02/2026 09:30", type: "delete" },
  { id: "6", user: "Admin", action: "Cadastro", desc: "Exame EX-2026-003 criado (Reconstrução Judicial)", date: "17/02/2026 08:00", type: "create" },
  { id: "7", user: "Triagem", action: "Venda", desc: "Kit DNA-2026-044 vendido (DNAjá)", date: "16/02/2026 15:10", type: "create" },
  { id: "8", user: "Coletor", action: "Alteração", desc: "Anamnese atualizada para Maria Santos", date: "16/02/2026 14:00", type: "update" },
];

const ACTION_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  create: { icon: Plus, color: "text-success" },
  update: { icon: Edit, color: "text-primary" },
  delete: { icon: Trash, color: "text-destructive" },
};

const Auditoria = () => {
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos" ? mockLogs : mockLogs.filter((l) => l.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-muted-foreground" /> Log de Auditoria
        </h1>
        <p className="text-muted-foreground">Registro de todas as ações na plataforma</p>
      </div>

      <div className="flex gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas Operações</SelectItem>
            <SelectItem value="create">Criação</SelectItem>
            <SelectItem value="update">Alteração</SelectItem>
            <SelectItem value="delete">Exclusão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-0">
            {filtered.map((log, i) => {
              const ai = ACTION_ICON[log.type];
              const Icon = ai.icon;
              return (
                <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < filtered.length - 1 && (
                    <div className="absolute left-[19px] top-10 h-full w-px bg-border" />
                  )}
                  <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-card ${ai.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{log.action}</p>
                      <Badge variant="outline" className="text-xs">{log.user}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.desc}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {log.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auditoria;
