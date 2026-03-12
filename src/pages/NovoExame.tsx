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
  Users, UserPlus, Dna, ChevronRight, ChevronLeft,
  CheckCircle2, Circle, AlertTriangle, XCircle, Upload, FileText,
  Scale, User, FilePlus,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FichaDNAja } from "@/components/FichaDNAja";

type ExamType = "duo" | "trio" | null;
type Purpose = "judicial" | "particular" | null;

interface Participant {
  id: string;
  role: string;
  name: string;
  birthDate: string;
  sex: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  naturalDe: string;
  transplant: boolean | null;
  documents: string[];
}

const createParticipant = (role: string): Participant => ({
  id: Date.now().toString() + Math.random(),
  role,
  name: "",
  birthDate: "",
  sex: "",
  docType: "cpf",
  docNumber: "",
  phone: "",
  email: "",
  naturalDe: "",
  transplant: null,
  documents: [],
});

const getDefaultParticipants = (type: ExamType): Participant[] => {
  switch (type) {
    case "duo": return [createParticipant("Suposto Pai"), createParticipant("Filho(a)")];
    case "trio": return [createParticipant("Suposto Pai"), createParticipant("Mãe"), createParticipant("Filho(a)")];
    default: return [];
  }
};

const STEPS = ["Tipo de Exame", "Participantes", "Ficha Cadastral", "Documentos", "Confirmação"];

const NovoExame = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState<ExamType>(null);
  const [purpose, setPurpose] = useState<Purpose>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [consent, setConsent] = useState(false);
  const [showFicha, setShowFicha] = useState(false);

  const selectExamType = (type: ExamType) => {
    setExamType(type);
    setParticipants(getDefaultParticipants(type));
  };

  const updateParticipant = (id: string, field: keyof Participant, value: any) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const next = () => {
    if (step === 0 && (!examType || !purpose)) {
      toast.error("Selecione o tipo e a finalidade do exame");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    toast.success("Exame cadastrado com sucesso!", { description: `Tipo: ${examType?.toUpperCase()} - ${purpose}` });
    setShowFicha(true);
  };

  const pendencies: string[] = [];
  participants.forEach((p) => {
    if (!p.name) pendencies.push(`Nome de ${p.role}`);
    if (p.transplant === null) pendencies.push(`Ficha de ${p.role}`);
    if (p.documents.length === 0) pendencies.push(`Docs de ${p.role}`);
  });
  if (!consent && step >= 4) pendencies.push("Termo de consentimento");

  if (showFicha && examType && purpose) {
    return (
      <FichaDNAja
        examType={examType}
        modality={purpose}
        participants={participants.map((p) => ({
          role: p.role,
          colorClass: p.role.toLowerCase().includes("pai") ? "pai" : p.role.toLowerCase().includes("mãe") ? "mae" : "filho",
          name: p.name,
          phone: p.phone,
          email: p.email,
          cpf: p.docNumber,
          birthDate: p.birthDate,
          naturalDe: p.naturalDe,
          sex: p.sex,
        }))}
        onClose={() => setShowFicha(false)}
      />
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FilePlus className="h-7 w-7 text-success" /> Novo Exame
          </h1>
          <p className="text-muted-foreground">Cadastro de exame de DNA — Duo ou Trio</p>
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
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${examType === "duo" ? "ring-2 ring-warning" : ""}`}
                onClick={() => selectExamType("duo")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
                    <Users className="h-8 w-8 text-warning" />
                  </div>
                  <p className="text-xl font-bold">DUO</p>
                  <p className="text-sm text-muted-foreground text-center">Filho + Suposto Pai</p>
                  <Badge variant="outline" className="border-warning text-warning">2 participantes</Badge>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${examType === "trio" ? "ring-2 ring-[hsl(330,81%,60%)]" : ""}`}
                onClick={() => selectExamType("trio")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(330,81%,60%)]/10">
                    <UserPlus className="h-8 w-8 text-[hsl(330,81%,60%)]" />
                  </div>
                  <p className="text-xl font-bold">TRIO</p>
                  <p className="text-sm text-muted-foreground text-center">Filho + Mãe + Suposto Pai</p>
                  <Badge variant="outline" className="border-[hsl(330,81%,60%)] text-[hsl(330,81%,60%)]">3 participantes</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-base">Finalidade do Exame</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant={purpose === "particular" ? "default" : "outline"}
                  onClick={() => setPurpose("particular")}
                  className={`h-auto flex-col gap-2 py-4 ${purpose === "particular" ? "bg-success hover:bg-success/90" : ""}`}
                >
                  <User className="h-6 w-6" />
                  <span className="text-base font-bold">Particular</span>
                  <span className="text-xs opacity-80">Iniciativa própria</span>
                </Button>
                <Button
                  variant={purpose === "judicial" ? "default" : "outline"}
                  onClick={() => setPurpose("judicial")}
                  className={`h-auto flex-col gap-2 py-4 ${purpose === "judicial" ? "bg-primary hover:bg-primary/90" : ""}`}
                >
                  <Scale className="h-6 w-6" />
                  <span className="text-base font-bold">Judicial</span>
                  <span className="text-xs opacity-80">Determinação judicial</span>
                </Button>
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
                      <Label className="text-xs">CPF / RG *</Label>
                      <Input value={p.docNumber} onChange={(e) => updateParticipant(p.id, "docNumber", e.target.value)} placeholder="CPF ou RG" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Telefone</Label>
                      <Input value={p.phone} onChange={(e) => updateParticipant(p.id, "phone", e.target.value)} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">E-mail</Label>
                      <Input value={p.email} onChange={(e) => updateParticipant(p.id, "email", e.target.value)} placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Natural de</Label>
                      <Input value={p.naturalDe} onChange={(e) => updateParticipant(p.id, "naturalDe", e.target.value)} placeholder="Cidade - UF" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                </CardContent>
              </Card>
            ))}
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
                  <p><strong>Finalidade:</strong> {purpose === "judicial" ? "⚖️ Judicial" : "👤 Particular"}</p>
                  <p><strong>Participantes:</strong> {participants.length}</p>
                </div>
                {participants.map((p) => (
                  <div key={p.id} className="rounded-md border p-3">
                    <p className="font-medium">{p.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.name || "Sem nome"} · {p.documents.length} docs
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
            <Button onClick={finish} disabled={!consent}>
              <FileText className="mr-1 h-4 w-4" /> Finalizar e Gerar Ficha
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
