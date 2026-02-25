import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, UserPlus, Dna, Fingerprint, ChevronRight, ChevronLeft,
  CheckCircle2, Circle, AlertTriangle, XCircle, Upload, FileText, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type ExamType = "duo" | "trio" | "reconstrucao" | "perfil" | null;
type Purpose = "judicial" | "particular" | null;
type ParticipantStatus = "presente" | "falecido" | "ausente";
type Material = "sangue" | "saliva";

interface Participant {
  id: string;
  role: string;
  name: string;
  birthDate: string;
  sex: string;
  docType: string;
  docNumber: string;
  status: ParticipantStatus;
  transplant: boolean | null;
  transfusion: boolean | null;
  material: Material;
  documents: string[];
}

const EXAM_TYPES = [
  { value: "duo", label: "Duo", desc: "Pai + Filho", icon: Users, color: "text-primary" },
  { value: "trio", label: "Trio", desc: "Pai + Mãe + Filho", icon: UserPlus, color: "text-success" },
  { value: "reconstrucao", label: "Reconstrução", desc: "Parentes Indiretos", icon: Dna, color: "text-chart-4" },
  { value: "perfil", label: "Perfil Genético", desc: "Individual", icon: Fingerprint, color: "text-warning" },
];

const STEPS = ["Tipo de Exame", "Participantes", "Ficha Cadastral", "Documentos", "Confirmação"];

const createParticipant = (role: string): Participant => ({
  id: Date.now().toString() + Math.random(),
  role,
  name: "",
  birthDate: "",
  sex: "",
  docType: "cpf",
  docNumber: "",
  status: "presente",
  transplant: null,
  transfusion: null,
  material: "saliva",
  documents: [],
});

const getDefaultParticipants = (type: ExamType): Participant[] => {
  switch (type) {
    case "duo": return [createParticipant("Suposto Pai"), createParticipant("Filho(a)")];
    case "trio": return [createParticipant("Suposto Pai"), createParticipant("Mãe"), createParticipant("Filho(a)")];
    case "reconstrucao": return [createParticipant("Filho(a)"), createParticipant("Mãe")];
    case "perfil": return [createParticipant("Examinado")];
    default: return [];
  }
};

const NovoExame = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState<ExamType>(null);
  const [purpose, setPurpose] = useState<Purpose>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [consent, setConsent] = useState(false);

  const selectExamType = (type: ExamType) => {
    setExamType(type);
    setParticipants(getDefaultParticipants(type));
  };

  const updateParticipant = (id: string, field: keyof Participant, value: any) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const hasBlockingCondition = participants.some(
    (p) => p.transfusion === true && p.material === "sangue"
  );

  const next = () => {
    if (step === 0 && (!examType || !purpose)) {
      toast.error("Selecione o tipo e a finalidade do exame");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    toast.success("Exame cadastrado com sucesso!", { description: `Tipo: ${examType?.toUpperCase()}` });
    navigate("/exames");
  };

  const pendencies: string[] = [];
  participants.forEach((p) => {
    if (!p.name) pendencies.push(`Nome de ${p.role}`);
    if (p.transplant === null) pendencies.push(`Ficha de ${p.role}`);
    if (p.documents.length === 0) pendencies.push(`Docs de ${p.role}`);
  });
  if (!consent && step >= 4) pendencies.push("Termo de consentimento");

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dna className="h-7 w-7 text-primary" /> Novo Exame
          </h1>
          <p className="text-muted-foreground">Cadastro de exame de identificação humana</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "font-semibold text-primary" : ""}>{s}</span>
            ))}
          </div>
          <Progress value={((step + 1) / 5) * 100} className="h-2" />
        </div>

        {/* Step 0 - Type */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {EXAM_TYPES.map((t) => (
                <Card
                  key={t.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${examType === t.value ? "ring-2 ring-primary" : ""}`}
                  onClick={() => selectExamType(t.value as ExamType)}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-6">
                    <t.icon className={`h-10 w-10 ${t.color}`} />
                    <p className="text-lg font-bold">{t.label}</p>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Finalidade</Label>
              <div className="flex gap-4">
                {(["judicial", "particular"] as const).map((p) => (
                  <Button
                    key={p}
                    variant={purpose === p ? "default" : "outline"}
                    onClick={() => setPurpose(p)}
                    className="flex-1 capitalize"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 - Participants */}
        {step === 1 && (
          <div className="space-y-4">
            {participants.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-primary" />
                    {p.role}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome Completo *</Label>
                      <Input value={p.name} onChange={(e) => updateParticipant(p.id, "name", e.target.value)} placeholder="Nome completo" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Data de Nascimento *</Label>
                      <Input type="date" value={p.birthDate} onChange={(e) => updateParticipant(p.id, "birthDate", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Sexo *</Label>
                      <Select value={p.sex} onValueChange={(v) => updateParticipant(p.id, "sex", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Documento *</Label>
                      <Input value={p.docNumber} onChange={(e) => updateParticipant(p.id, "docNumber", e.target.value)} placeholder="CPF ou RG" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <div className="flex gap-2">
                      {(["presente", "falecido", "ausente"] as const).map((s) => (
                        <Button
                          key={s}
                          type="button"
                          size="sm"
                          variant={p.status === s ? "default" : "outline"}
                          onClick={() => updateParticipant(p.id, "status", s)}
                          className="capitalize"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                    {p.status === "falecido" && p.role.includes("Pai") && (
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate("/simulador")}>
                        <Activity className="mr-1 h-4 w-4 text-chart-4" /> Abrir Simulador de Viabilidade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => setParticipants([...participants, createParticipant("Participante Adicional")])}>
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Participante
            </Button>
          </div>
        )}

        {/* Step 2 - Ficha Cadastral */}
        {step === 2 && (
          <div className="space-y-4">
            {participants.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{p.role}: {p.name || "(sem nome)"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Transplante de medula nos últimos 12 meses?</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant={p.transplant === true ? "destructive" : "outline"} onClick={() => updateParticipant(p.id, "transplant", true)}>Sim</Button>
                      <Button size="sm" variant={p.transplant === false ? "default" : "outline"} onClick={() => updateParticipant(p.id, "transplant", false)}>Não</Button>
                    </div>
                    {p.transplant && (
                      <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" /> Exame pode ser inconclusivo
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Transfusão de sangue nos últimos 90 dias?</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant={p.transfusion === true ? "destructive" : "outline"} onClick={() => updateParticipant(p.id, "transfusion", true)}>Sim</Button>
                      <Button size="sm" variant={p.transfusion === false ? "default" : "outline"} onClick={() => updateParticipant(p.id, "transfusion", false)}>Não</Button>
                    </div>
                    {p.transfusion && (
                      <div className="flex items-center gap-2 rounded-md bg-warning/10 p-2 text-sm text-warning">
                        <AlertTriangle className="h-4 w-4" /> Aguardar 90 dias ou coletar saliva
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Material de coleta</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant={p.material === "sangue" ? "default" : "outline"} onClick={() => updateParticipant(p.id, "material", "sangue")}>Sangue</Button>
                      <Button size="sm" variant={p.material === "saliva" ? "default" : "outline"} onClick={() => updateParticipant(p.id, "material", "saliva")}>Saliva</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {hasBlockingCondition && (
              <div className="flex items-center gap-2 rounded-lg border-2 border-destructive bg-destructive/5 p-4">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">BLOQUEIO: Transfusão recente + Sangue</p>
                  <p className="text-sm text-muted-foreground">Altere para saliva ou aguarde 90 dias.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3 - Documents */}
        {step === 3 && (
          <div className="space-y-4">
            {participants.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{p.role}: {p.name || "(sem nome)"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["RG", "CPF", "Certidão de Nascimento"].map((doc) => {
                    const uploaded = p.documents.includes(doc);
                    return (
                      <div key={doc} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          {uploaded ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={uploaded ? "secondary" : "outline"}
                          onClick={() => {
                            if (!uploaded) {
                              updateParticipant(p.id, "documents", [...p.documents, doc]);
                              toast.success(`${doc} enviado (simulado)`);
                            }
                          }}
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          {uploaded ? "Enviado" : "Upload"}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 4 - Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Exame</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm">
                  <p><strong>Tipo:</strong> {examType?.toUpperCase()}</p>
                  <p><strong>Finalidade:</strong> {purpose}</p>
                  <p><strong>Participantes:</strong> {participants.length}</p>
                </div>
                {participants.map((p) => (
                  <div key={p.id} className="rounded-md border p-3">
                    <p className="font-medium">{p.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.name || "Sem nome"} · {p.status} · {p.material} · {p.documents.length} docs
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex items-center gap-2">
              <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
              <Label className="text-sm">Declaro que todas as informações são verdadeiras e autorizo o exame.</Label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
          </Button>
          {step < 4 ? (
            <Button onClick={next}>
              Próximo <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={!consent || hasBlockingCondition}>
              <CheckCircle2 className="mr-1 h-4 w-4" /> Finalizar Cadastro
            </Button>
          )}
        </div>
      </div>

      {/* Status Panel */}
      <div className="hidden w-64 lg:block">
        <Card className="sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" /> Status Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i < step ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : i === step ? (
                  <Circle className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={i <= step ? "font-medium" : "text-muted-foreground"}>{s}</span>
              </div>
            ))}
            {pendencies.length > 0 && (
              <div className="mt-4 space-y-1 border-t pt-3">
                <p className="font-semibold text-destructive text-xs">Pendências ({pendencies.length})</p>
                {pendencies.slice(0, 5).map((p) => (
                  <p key={p} className="text-xs text-muted-foreground">• {p}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoExame;
