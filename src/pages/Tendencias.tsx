import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Globe, Brain, ScanLine, ShieldCheck, Video,
  BarChart3, Clock, Package,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const volumeData = [
  { mes: "Jul", dtc: 120, judicial: 85 },
  { mes: "Ago", dtc: 145, judicial: 90 },
  { mes: "Set", dtc: 160, judicial: 78 },
  { mes: "Out", dtc: 190, judicial: 95 },
  { mes: "Nov", dtc: 210, judicial: 88 },
  { mes: "Dez", dtc: 230, judicial: 102 },
];

const pieData = [
  { name: "Duo", value: 45 },
  { name: "Trio", value: 30 },
  { name: "DNAjá", value: 15 },
  { name: "Reconstrução", value: 7 },
  { name: "Perfil", value: 3 },
];

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(0, 84%, 60%)",
];

const trends = [
  { icon: Globe, color: "text-primary", title: "Direct-to-Consumer (DTC)", desc: "Crescimento de 40% ao ano. Pareamento por QR Code + App móvel para resultados." },
  { icon: Brain, color: "text-chart-4", title: "IA em Validação de Documentos", desc: "OCR reduz 70% de erros. AWS Textract e Google Document AI liderando." },
  { icon: ScanLine, color: "text-success", title: "Redução de Carga Cognitiva", desc: "Progressive Disclosure, Smart Defaults e Save & Continue em formulários." },
  { icon: ShieldCheck, color: "text-warning", title: "Blockchain para Custódia", desc: "Registro imutável de cadeia de custódia. Rastreabilidade total de amostras." },
  { icon: Video, color: "text-info", title: "Coleta Supervisionada por Vídeo", desc: "Telemedicina para coletas remotas com validação em tempo real." },
];

const Tendencias = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="h-7 w-7 text-warning" /> Tendências e Métricas
      </h1>
      <p className="text-muted-foreground">Panorama global de identificação genética</p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Package className="h-10 w-10 text-warning" />
          <div>
            <p className="text-2xl font-bold">1.247</p>
            <p className="text-sm text-muted-foreground">Kits vendidos (6 meses)</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Clock className="h-10 w-10 text-primary" />
          <div>
            <p className="text-2xl font-bold">4m 32s</p>
            <p className="text-sm text-muted-foreground">Tempo médio de cadastro</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <BarChart3 className="h-10 w-10 text-success" />
          <div>
            <p className="text-2xl font-bold">98,7%</p>
            <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-lg">Volume: DTC vs Judicial</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="dtc" fill="hsl(217, 91%, 60%)" name="DTC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="judicial" fill="hsl(142, 71%, 45%)" name="Judicial" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Distribuição por Tipo</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <div>
      <h2 className="mb-4 text-xl font-bold">Tendências Mundiais</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trends.map((t) => (
          <Card key={t.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <t.icon className={`mb-3 h-8 w-8 ${t.color}`} />
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default Tendencias;
