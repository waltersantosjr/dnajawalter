import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload, FileText, Heart, Brain, Activity, Trophy, Star,
  TrendingUp, Flame, Dumbbell, Apple, Pill, Stethoscope,
  BarChart3, Target, Zap, Shield, Smile, CloudSun, Droplets,
  CheckCircle2, Clock, Plus, Eye,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Mock Data ─── */

interface HealthDoc {
  id: string;
  tipo: string;
  nome: string;
  data: string;
  icon: React.ElementType;
  color: string;
}

const MOCK_DOCS: HealthDoc[] = [
  { id: "1", tipo: "Exame de Sangue", nome: "Hemograma Completo", data: "2025-03-15", icon: Droplets, color: "text-destructive" },
  { id: "2", tipo: "Bioimpedância", nome: "Avaliação Corporal", data: "2025-03-01", icon: Dumbbell, color: "text-primary" },
  { id: "3", tipo: "Receita Médica", nome: "Prescrição Cardiologista", data: "2025-02-20", icon: Pill, color: "text-chart-4" },
  { id: "4", tipo: "Dieta", nome: "Plano Nutricional", data: "2025-02-10", icon: Apple, color: "text-success" },
  { id: "5", tipo: "Exame de Imagem", nome: "Ultrassom Abdômen", data: "2025-01-28", icon: Eye, color: "text-info" },
  { id: "6", tipo: "Saúde Mental", nome: "Avaliação Psicológica", data: "2025-01-15", icon: Brain, color: "text-chart-3" },
];

const GAMIFICATION = {
  level: 12,
  xp: 740,
  xpNext: 1000,
  streak: 7,
  badges: [
    { name: "Hidratação", icon: Droplets, earned: true },
    { name: "Sono Regular", icon: CloudSun, earned: true },
    { name: "Exercícios", icon: Dumbbell, earned: true },
    { name: "Check-up", icon: Stethoscope, earned: false },
    { name: "Meditação", icon: Brain, earned: false },
    { name: "Dieta", icon: Apple, earned: true },
  ],
  dailyTasks: [
    { task: "Beber 2L de água", done: true, xp: 10 },
    { task: "30 min de exercício", done: true, xp: 20 },
    { task: "Registrar refeição", done: false, xp: 15 },
    { task: "8h de sono", done: true, xp: 10 },
    { task: "5 min de meditação", done: false, xp: 15 },
  ],
};

const MEDICINE_4P = [
  { title: "Preditiva", icon: TrendingUp, color: "bg-primary/10 text-primary", desc: "Com base nos seus exames, seu risco cardiovascular está baixo. Continue monitorando colesterol a cada 6 meses." },
  { title: "Preventiva", icon: Shield, color: "bg-success/10 text-success", desc: "Suas vacinas estão em dia. Próximo check-up recomendado: Julho/2025. Bioimpedância sugere manter IMC atual." },
  { title: "Personalizada", icon: Target, color: "bg-chart-4/10 text-chart-4", desc: "Seu perfil genético indica metabolismo lento para cafeína. Considere limitar a 2 xícaras/dia para melhor qualidade de sono." },
  { title: "Participativa", icon: Heart, color: "bg-destructive/10 text-destructive", desc: "Você completou 74% das metas de saúde este mês. Engajamento acima da média! Continue registrando seus dados." },
];

export default function G4UApp() {
  const [tab, setTab] = useState("painel");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`"${file.name}" adicionado ao seu histórico de saúde!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-destructive" /> G4U App
          </h1>
          <p className="text-muted-foreground mt-1">
            A saúde em suas mãos — Medicina 4P integrada
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 text-base py-1 px-3">
            <Flame className="h-4 w-4 text-warning" /> {GAMIFICATION.streak} dias
          </Badge>
          <Badge className="gap-1 text-base py-1 px-3 bg-chart-3">
            <Star className="h-4 w-4" /> Nível {GAMIFICATION.level}
          </Badge>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="painel"><Activity className="h-4 w-4 mr-1" /> Painel</TabsTrigger>
          <TabsTrigger value="documentos"><FileText className="h-4 w-4 mr-1" /> Meus Docs</TabsTrigger>
          <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-1" /> Upload</TabsTrigger>
          <TabsTrigger value="gamificacao"><Trophy className="h-4 w-4 mr-1" /> Conquistas</TabsTrigger>
          <TabsTrigger value="4p"><Stethoscope className="h-4 w-4 mr-1" /> Med. 4P</TabsTrigger>
        </TabsList>

        {/* Painel */}
        <TabsContent value="painel" className="mt-6 space-y-6">
          {/* XP Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso Nível {GAMIFICATION.level}</span>
                <span className="text-sm text-muted-foreground">{GAMIFICATION.xp}/{GAMIFICATION.xpNext} XP</span>
              </div>
              <Progress value={(GAMIFICATION.xp / GAMIFICATION.xpNext) * 100} className="h-3" />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{MOCK_DOCS.length}</p>
                <p className="text-xs text-muted-foreground">Documentos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 mx-auto text-warning mb-2" />
                <p className="text-2xl font-bold">{GAMIFICATION.streak}</p>
                <p className="text-xs text-muted-foreground">Dias Seguidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto text-chart-3 mb-2" />
                <p className="text-2xl font-bold">{GAMIFICATION.badges.filter(b => b.earned).length}</p>
                <p className="text-xs text-muted-foreground">Conquistas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Smile className="h-8 w-8 mx-auto text-success mb-2" />
                <p className="text-2xl font-bold">74%</p>
                <p className="text-xs text-muted-foreground">Score Saúde</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Zap className="h-5 w-5 text-warning" /> Missões do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {GAMIFICATION.dailyTasks.map((t, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${t.done ? "bg-success/10" : "bg-muted/50"}`}>
                  <div className="flex items-center gap-2">
                    {t.done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Clock className="h-5 w-5 text-muted-foreground" />}
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.task}</span>
                  </div>
                  <Badge variant="outline">+{t.xp} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documentos" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">Seu histórico unificado de saúde para apresentar em consultas.</p>
          {MOCK_DOCS.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-muted ${doc.color}`}>
                  <doc.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{doc.nome}</p>
                  <p className="text-sm text-muted-foreground">{doc.tipo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{new Date(doc.data).toLocaleDateString("pt-BR")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Upload */}
        <TabsContent value="upload" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Exames", desc: "Sangue, imagem, laboratoriais", icon: Stethoscope, color: "border-primary/30" },
              { label: "Bioimpedância", desc: "Composição corporal", icon: Dumbbell, color: "border-chart-4/30" },
              { label: "Receitas", desc: "Prescrições médicas", icon: Pill, color: "border-destructive/30" },
              { label: "Dietas", desc: "Planos nutricionais", icon: Apple, color: "border-success/30" },
              { label: "Saúde Mental", desc: "Avaliações, terapia", icon: Brain, color: "border-chart-3/30" },
              { label: "Outros", desc: "Qualquer documento", icon: FileText, color: "border-muted-foreground/30" },
            ].map((cat, i) => (
              <Card key={i} className={`border-dashed border-2 ${cat.color} hover:shadow-md transition-all`}>
                <CardContent className="flex flex-col items-center justify-center py-8 gap-3">
                  <cat.icon className="h-10 w-10 text-muted-foreground" />
                  <p className="font-semibold">{cat.label}</p>
                  <p className="text-xs text-muted-foreground text-center">{cat.desc}</p>
                  <Label htmlFor={`upload-${i}`} className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Enviar
                    </div>
                    <Input id={`upload-${i}`} type="file" className="hidden" onChange={handleUpload} />
                  </Label>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gamificação */}
        <TabsContent value="gamificacao" className="mt-6 space-y-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {GAMIFICATION.badges.map((b, i) => (
              <Card key={i} className={`text-center ${b.earned ? "" : "opacity-40"}`}>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center ${b.earned ? "bg-chart-3/20" : "bg-muted"}`}>
                    <b.icon className={`h-7 w-7 ${b.earned ? "text-chart-3" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-xs font-medium">{b.name}</p>
                  {b.earned && <Badge className="text-[10px] bg-chart-3">✓</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Como ganhar XP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>+10 XP</strong> — Completar missão diária</p>
              <p>• <strong>+50 XP</strong> — Upload de novo exame ou documento</p>
              <p>• <strong>+100 XP</strong> — Manter streak de 7 dias</p>
              <p>• <strong>+200 XP</strong> — Check-up completo no prazo</p>
              <p>• <strong>+500 XP</strong> — Atingir todas as metas mensais</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medicina 4P */}
        <TabsContent value="4p" className="mt-6 space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Medicina 4P</strong> (Preditiva, Preventiva, Personalizada, Participativa) utiliza seus dados de saúde
                para criar recomendações inteligentes e acompanhar sua evolução ao longo do tempo.
              </p>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {MEDICINE_4P.map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-chart-3" /> Saúde Mental
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <Smile className="h-8 w-8 mx-auto text-success mb-1" />
                  <p className="text-sm font-medium">Humor</p>
                  <p className="text-lg font-bold text-success">Bom</p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto text-warning mb-1" />
                  <p className="text-sm font-medium">Estresse</p>
                  <p className="text-lg font-bold text-warning">Moderado</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <CloudSun className="h-8 w-8 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">Sono</p>
                  <p className="text-lg font-bold text-primary">7.2h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
