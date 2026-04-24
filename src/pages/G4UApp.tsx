import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload, FileText, Heart, Brain, Activity, Trophy, Star,
  TrendingUp, Flame, Dumbbell, Apple, Pill, Stethoscope,
  Target, Zap, Shield, Smile, CloudSun, Droplets,
  CheckCircle2, Clock, Plus, Eye, HandHeart, Wind, Phone,
  Frown, Meh, Laugh, Angry, Sparkles, AlertTriangle,
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

/* ─── Mood Check-in ─── */

type MoodId = "otimo" | "bem" | "neutro" | "triste" | "ansioso" | "panico" | "raiva" | "exausto";

interface Mood {
  id: MoodId;
  label: string;
  icon: React.ElementType;
  emoji: string;
  color: string;
  bg: string;
  level: "ok" | "atencao" | "alerta";
  message: string;
  suggestions: string[];
}

const MOODS: Mood[] = [
  {
    id: "otimo", label: "Ótimo", icon: Laugh, emoji: "😄",
    color: "text-success", bg: "bg-success/10 border-success/40",
    level: "ok",
    message: "Que bom que está se sentindo bem! Aproveite para registrar o que contribuiu para esse momento.",
    suggestions: ["Anote o que te fez bem hoje no diário", "Compartilhe a energia positiva com alguém", "Mantenha sua rotina de sono e exercícios"],
  },
  {
    id: "bem", label: "Bem", icon: Smile, emoji: "🙂",
    color: "text-success", bg: "bg-success/5 border-success/30",
    level: "ok",
    message: "Você está em equilíbrio. Continue cuidando dos pequenos hábitos.",
    suggestions: ["Beba água regularmente", "Faça uma pausa consciente de 5 min", "Dê uma caminhada curta"],
  },
  {
    id: "neutro", label: "Neutro", icon: Meh, emoji: "😐",
    color: "text-muted-foreground", bg: "bg-muted border-border",
    level: "ok",
    message: "Tudo bem ter dias neutros. Observe sem julgar.",
    suggestions: ["Faça algo prazeroso por 10 min", "Ouça uma música que te anima", "Saia ao ar livre brevemente"],
  },
  {
    id: "triste", label: "Triste", icon: Frown, emoji: "😔",
    color: "text-info", bg: "bg-info/10 border-info/40",
    level: "atencao",
    message: "Reconhecer a tristeza já é um passo. Seja gentil consigo.",
    suggestions: ["Converse com alguém de confiança", "Permita-se descansar sem culpa", "Anote 3 coisas pelas quais é grato hoje"],
  },
  {
    id: "ansioso", label: "Ansioso", icon: Activity, emoji: "😟",
    color: "text-warning", bg: "bg-warning/10 border-warning/40",
    level: "atencao",
    message: "A ansiedade é natural. Vamos respirar juntos para regular o sistema nervoso.",
    suggestions: ["Respiração 4-7-8 (inspire 4s, segure 7s, solte 8s)", "Beba água gelada lentamente", "Liste o que está sob seu controle agora"],
  },
  {
    id: "panico", label: "Pânico", icon: AlertTriangle, emoji: "😰",
    color: "text-destructive", bg: "bg-destructive/10 border-destructive/50",
    level: "alerta",
    message: "Você está em segurança. Vamos ancorar o agora com a técnica 5-4-3-2-1.",
    suggestions: [
      "5 coisas que você VÊ ao redor",
      "4 coisas que pode TOCAR",
      "3 sons que está OUVINDO",
      "2 cheiros que sente",
      "1 sabor na boca",
      "Se persistir, ligue CVV: 188 (24h, gratuito)",
    ],
  },
  {
    id: "raiva", label: "Com Raiva", icon: Angry, emoji: "😠",
    color: "text-destructive", bg: "bg-destructive/10 border-destructive/40",
    level: "atencao",
    message: "A raiva traz informação. Antes de reagir, vamos descarregar a energia com cuidado.",
    suggestions: ["Faça 10 respirações profundas", "Saia do ambiente por 10 minutos", "Escreva o que sente sem filtro (depois rasgue)"],
  },
  {
    id: "exausto", label: "Exausto", icon: CloudSun, emoji: "😴",
    color: "text-chart-3", bg: "bg-chart-3/10 border-chart-3/40",
    level: "atencao",
    message: "Seu corpo pede pausa. Exaustão crônica merece atenção médica.",
    suggestions: ["Reduza estímulos (telas, ruído) por 30 min", "Hidrate-se e coma algo leve", "Avalie qualidade do seu sono recente"],
  },
];

const EMERGENCY_CONTACTS = [
  { name: "CVV — Centro de Valorização da Vida", number: "188", desc: "24h, gratuito, sigiloso" },
  { name: "SAMU", number: "192", desc: "Emergência médica" },
  { name: "CAPS — Apoio em Saúde Mental", number: "Buscar unidade local", desc: "Atendimento especializado" },
];

export default function G4UApp() {
  const [tab, setTab] = useState("painel");
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodIntensity, setMoodIntensity] = useState(5);

  const current = MOODS.find((m) => m.id === selectedMood);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`"${file.name}" adicionado ao seu histórico de saúde!`);
  };

  const saveMood = () => {
    if (!selectedMood) {
      toast.error("Selecione como você está se sentindo");
      return;
    }
    toast.success("Check-in emocional registrado. +15 XP!");
    setMoodNote("");
  };

  return (
    <div className="space-y-6">
      {/* Hero Header — Saúde em suas mãos */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-chart-3 p-6 md:p-8 text-primary-foreground">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <HandHeart className="h-full w-full" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <HandHeart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">G4U — Sua saúde em suas mãos</h1>
                <p className="text-sm md:text-base opacity-90 mt-1 max-w-xl">
                  Centralize exames, hábitos e bem-estar emocional em um só lugar. Medicina 4P + cuidado humano, todos os dias.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="gap-1 bg-white/20 backdrop-blur border-0 text-primary-foreground hover:bg-white/30">
                <Flame className="h-4 w-4" /> {GAMIFICATION.streak} dias
              </Badge>
              <Badge className="gap-1 bg-white/20 backdrop-blur border-0 text-primary-foreground hover:bg-white/30">
                <Star className="h-4 w-4" /> Nível {GAMIFICATION.level}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick mood prompt */}
        <div className="bg-card border-t px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-chart-3" />
            <div>
              <p className="font-semibold text-sm">Como você está se sentindo agora?</p>
              <p className="text-xs text-muted-foreground">Um check-in rápido melhora seu autoconhecimento.</p>
            </div>
          </div>
          <Button onClick={() => setTab("sentir")} className="bg-chart-3 hover:bg-chart-3/90 text-white shrink-0">
            <Heart className="mr-2 h-4 w-4" /> Fazer check-in
          </Button>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="painel"><Activity className="h-4 w-4 mr-1" /> Painel</TabsTrigger>
          <TabsTrigger value="sentir"><Heart className="h-4 w-4 mr-1" /> Como me sinto</TabsTrigger>
          <TabsTrigger value="documentos"><FileText className="h-4 w-4 mr-1" /> Docs</TabsTrigger>
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

        {/* Como me sinto */}
        <TabsContent value="sentir" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="h-6 w-6 text-chart-3" /> Como você está se sentindo?
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Toque na emoção que mais combina com este momento. Não há resposta certa — apenas sua verdade de hoje.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const active = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.03] active:scale-[0.98] ${
                        active ? `${m.bg} ring-2 ring-offset-2 ring-current ${m.color}` : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{m.emoji}</span>
                        <Icon className={`h-5 w-5 ${active ? m.color : "text-muted-foreground"}`} />
                      </div>
                      <p className={`mt-2 font-semibold text-sm ${active ? m.color : ""}`}>{m.label}</p>
                    </button>
                  );
                })}
              </div>

              {current && (
                <div className="space-y-4">
                  {/* Intensity */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Intensidade</Label>
                      <span className={`text-sm font-bold ${current.color}`}>{moodIntensity}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={moodIntensity}
                      onChange={(e) => setMoodIntensity(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Leve</span>
                      <span>Moderado</span>
                      <span>Intenso</span>
                    </div>
                  </div>

                  {/* Personalized message */}
                  <div className={`rounded-xl border-2 p-4 ${current.bg}`}>
                    <p className={`font-bold flex items-center gap-2 ${current.color}`}>
                      <span className="text-2xl">{current.emoji}</span>
                      {current.label}
                    </p>
                    <p className="text-sm text-foreground/80 mt-2">{current.message}</p>

                    <div className="mt-4 space-y-2">
                      <p className={`text-xs font-bold uppercase tracking-wide ${current.color}`}>
                        {current.level === "alerta" ? "🆘 Faça agora" : "💡 Sugestões"}
                      </p>
                      <ul className="space-y-1.5">
                        {current.suggestions.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${current.color}`} />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <Label htmlFor="mood-note" className="text-sm font-semibold">
                      Quer escrever algo? (opcional)
                    </Label>
                    <Textarea
                      id="mood-note"
                      placeholder="O que está passando pela sua mente?"
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={saveMood} className="flex-1" size="lg">
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Registrar check-in (+15 XP)
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => { setSelectedMood(null); setMoodNote(""); setMoodIntensity(5); }}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Breathing exercise */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" /> Respiração guiada — 4-7-8
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Inspire</strong> pelo nariz por <strong>4 segundos</strong>.</p>
              <p><strong>Segure</strong> o ar por <strong>7 segundos</strong>.</p>
              <p><strong>Solte</strong> pela boca por <strong>8 segundos</strong>.</p>
              <p className="pt-2">Repita por 4 ciclos. Comprovadamente reduz ansiedade e ativa o sistema parassimpático.</p>
            </CardContent>
          </Card>

          {/* Emergency */}
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <Phone className="h-5 w-5" /> Precisa de ajuda agora?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EMERGENCY_CONTACTS.map((c) => (
                <div key={c.number} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                  <Badge variant="destructive" className="text-base font-bold px-3 py-1">{c.number}</Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Você não está sozinho(a). Procurar ajuda é um ato de coragem.
              </p>
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
              <p>• <strong>+15 XP</strong> — Check-in emocional diário</p>
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
              <Button variant="outline" className="w-full" onClick={() => setTab("sentir")}>
                <Heart className="mr-2 h-4 w-4 text-chart-3" /> Fazer check-in emocional agora
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
