import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity, UserPlus, UserMinus, Users, Baby, Heart,
  AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";

interface FamilyMember {
  id: string;
  role: string;
  label: string;
  icon: React.ElementType;
  added: boolean;
  weight: number;
}

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: "mae", role: "Mãe Biológica", label: "Mãe", icon: Heart, added: true, weight: 25 },
  { id: "filho", role: "Filho(a)", label: "Filho", icon: Baby, added: true, weight: 0 },
  { id: "irmao1", role: "Irmão do SP", label: "Irmão 1", icon: Users, added: false, weight: 20 },
  { id: "irmao2", role: "Irmão do SP", label: "Irmão 2", icon: Users, added: false, weight: 15 },
  { id: "avo_p", role: "Avô Paterno", label: "Avô Pat.", icon: Users, added: false, weight: 15 },
  { id: "avo_m", role: "Avó Paterna", label: "Avó Pat.", icon: Users, added: false, weight: 15 },
];

const getViabilityColor = (v: number) => {
  if (v <= 40) return { color: "text-destructive", bg: "bg-destructive", label: "Inviável", desc: "Não recomendado prosseguir" };
  if (v <= 70) return { color: "text-warning", bg: "bg-warning", label: "Risco de Inconclusão", desc: "Adicione mais parentes" };
  return { color: "text-success", bg: "bg-success", label: "Alta Viabilidade", desc: "Pode prosseguir" };
};

const Simulador = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const viability = members.filter((m) => m.added).reduce((acc, m) => acc + m.weight, 0);
  const capped = Math.min(viability, 100);
  const vInfo = getViabilityColor(capped);

  const toggle = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id && m.id !== "filho" ? { ...m, added: !m.added } : m))
    );
  };

  const available = members.filter((m) => !m.added && m.id !== "filho");
  const selected = members.filter((m) => m.added);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-chart-4" /> Simulador de Viabilidade Genética
        </h1>
        <p className="text-muted-foreground">Reconstrução genética - Suposto Pai Falecido/Ausente</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Family Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Árvore de Parentesco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Deceased father */}
            <div className="flex justify-center">
              <div className="rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5 px-6 py-3 text-center">
                <XCircle className="mx-auto h-8 w-8 text-destructive/60" />
                <p className="mt-1 font-semibold text-destructive/80">Suposto Pai</p>
                <Badge variant="destructive" className="mt-1">Falecido</Badge>
              </div>
            </div>

            {/* Selected members */}
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">Participantes na Reconstrução:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {selected.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <m.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                    {m.id !== "filho" && (
                      <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Available */}
            {available.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Parentes Disponíveis:</p>
                <div className="flex flex-wrap gap-2">
                  {available.map((m) => (
                    <Button key={m.id} variant="outline" size="sm" onClick={() => toggle(m.id)}>
                      <UserPlus className="mr-1 h-4 w-4 text-success" /> {m.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Viability Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Viabilidade do Exame</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gauge */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={capped <= 40 ? "hsl(var(--destructive))" : capped <= 70 ? "hsl(var(--warning))" : "hsl(var(--success))"}
                    strokeWidth="12"
                    strokeDasharray={`${(capped / 100) * 314} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className={`text-3xl font-bold ${vInfo.color}`}>{capped}%</p>
                </div>
              </div>

              <div className="text-center">
                <Badge className={`${vInfo.bg} text-white`}>{vInfo.label}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">{vInfo.desc}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 rounded-lg border p-4 text-sm">
              <p><strong>Índice Mínimo Legal:</strong> 99,99%</p>
              <p><strong>Probabilidade estimada:</strong> {capped <= 40 ? "< 90%" : capped <= 70 ? "94,5%" : "99,95%"}</p>
              {capped <= 70 && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-warning/10 p-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                  <p className="text-xs">Adicione mais parentes de 1º grau do suposto pai para aumentar a viabilidade.</p>
                </div>
              )}
              {capped > 70 && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-success/10 p-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                  <p className="text-xs">Combinação suficiente para resultado conclusivo.</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Prosseguir Mesmo Assim</Button>
              <Button className="flex-1" onClick={() => {}}>
                <UserPlus className="mr-1 h-4 w-4" /> Adicionar Parentes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulador;
