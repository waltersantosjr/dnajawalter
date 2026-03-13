import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Tag } from "lucide-react";

const mockExams = [
  { id: "EX-2026-001", tipo: "Trio", finalidade: "Judicial", status: "concluido", data: "19/02/2026", participantes: "João, Maria, Pedro", etiquetaDNA: "DNA0041" },
  { id: "EX-2026-002", tipo: "Duo", finalidade: "Particular", status: "andamento", data: "18/02/2026", participantes: "Carlos, Ana", etiquetaDNA: "DNA0040" },
  { id: "EX-2026-003", tipo: "Reconstituição", finalidade: "Judicial", status: "pendente", data: "17/02/2026", participantes: "Lucas, Marta, José", etiquetaDNA: "DNA0039" },
  { id: "DNA-2026-045", tipo: "DNAjá", finalidade: "Informativo", status: "concluido", data: "17/02/2026", participantes: "Anônimo", etiquetaDNA: "DNA0045" },
  { id: "EX-2026-004", tipo: "Perfil", finalidade: "Particular", status: "pendente", data: "16/02/2026", participantes: "Fernanda", etiquetaDNA: "DNA0038" },
  { id: "EX-2026-005", tipo: "Trio", finalidade: "Judicial", status: "andamento", data: "15/02/2026", participantes: "Roberto, Sandra, Luana", etiquetaDNA: "DNA0037" },
];

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  concluido: { label: "Concluído", variant: "default" },
  andamento: { label: "Em Andamento", variant: "secondary" },
  pendente: { label: "Pendente", variant: "outline" },
};

const ListaExames = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");

  const filtered = mockExams.filter((e) => {
    const matchSearch = e.id.toLowerCase().includes(search.toLowerCase()) || e.participantes.toLowerCase().includes(search.toLowerCase()) || e.etiquetaDNA.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || e.status === statusFilter;
    const matchType = typeFilter === "todos" || e.tipo === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-info" /> Exames Cadastrados
        </h1>
        <p className="text-muted-foreground">Gerencie todos os exames da plataforma</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" placeholder="Buscar por código, nome ou etiqueta DNAjá..." />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="andamento">Em Andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Tipos</SelectItem>
            <SelectItem value="Duo">Duo</SelectItem>
            <SelectItem value="Trio">Trio</SelectItem>
            <SelectItem value="Reconstituição">Reconstituição</SelectItem>
            <SelectItem value="Perfil">Perfil</SelectItem>
            <SelectItem value="DNAjá">DNAjá</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Código</th>
                  <th className="px-4 py-3 text-left font-medium">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Etiqueta DNAjá</span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Finalidade</th>
                  <th className="px-4 py-3 text-left font-medium">Participantes</th>
                  <th className="px-4 py-3 text-left font-medium">Data</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium">{e.id}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs border-success/50 text-success">{e.etiquetaDNA}</Badge>
                    </td>
                    <td className="px-4 py-3">{e.tipo}</td>
                    <td className="px-4 py-3">{e.finalidade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.participantes}</td>
                    <td className="px-4 py-3">{e.data}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[e.status].variant}>{STATUS_BADGE[e.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaExames;
