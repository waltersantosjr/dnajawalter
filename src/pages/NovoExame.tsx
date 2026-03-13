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
  Scale, User, FilePlus, Tag,
} from "lucide-react";
import { toast } from "sonner";
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
  endereco: string;
  cep: string;
  cidadeUf: string;
  registroNasc: string;
  transplant: boolean | null;
  parentescoInvestigado: string;
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
  endereco: "",
  cep: "",
  cidadeUf: "",
  registroNasc: "",
  transplant: null,
  parentescoInvestigado: "",
  documents: [],
});

const getDefaultParticipants = (type: ExamType): Participant[] => {
  switch (type) {
    case "duo": return [createParticipant("Suposto Pai"), createParticipant("Filho(a) Investigante")];
    case "trio": return [createParticipant("Mãe"), createParticipant("Filho(a) Investigante"), createParticipant("Suposto Pai")];
    default: return [];
  }
};

const STEPS = ["Tipo de Exame", "Etiqueta DNAjá", "Entrevista", "Documentos", "Confirmação"];

const NovoExame = () => {
  const [step, setStep] = useState(0);
  const [examType, setExamType] = useState<ExamType>(null);
  const [purpose, setPurpose] = useState<Purpose>(null);
  const [etiquetaDNA, setEtiquetaDNA] = useState("");
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
    if (step === 1 && !etiquetaDNA.trim()) {
      toast.error("Digite a etiqueta do kit DNAjá");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    toast.success("Exame cadastrado com sucesso!", { description: `Tipo: ${examType?.toUpperCase()} - ${purpose} - Kit: ${etiquetaDNA}` });
    setShowFicha(true);
  };

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
            <Users className="h-7 w-7 text-success" /> Duo ou Trio
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
                  <p className="text-sm text-muted-foreground text-center">Mãe + Filho + Suposto Pai</p>
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

        {/* Step 1 - Etiqueta DNAjá */}
        {step === 1 && (
          <Card className="border-2 border-dashed border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Tag className="h-5 w-5" /> Etiqueta do Kit DNAjá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Digite ou bipe o código da etiqueta do kit DNAjá que será utilizado neste exame.
              </p>
              <div className="flex items-center justify-center">
                <div className="rounded-xl border-2 border-success bg-success/5 p-6 w-full max-w-md">
                  <Label className="text-sm font-bold text-success block text-center mb-3">COLE AQUI A ETIQUETA DNAJA</Label>
                  <Input
                    value={etiquetaDNA}
                    onChange={(e) => setEtiquetaDNA(e.target.value)}
                    className="text-center font-mono text-xl font-bold border-success/50 h-14"
                    placeholder="DNAJA-2025-XXXXX"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">Este código vincula o kit ao exame</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 - Interview / Entrevista (VGF style) */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
              <p className="text-xs font-semibold text-primary">📋 ENTREVISTAS — Preencha com letra maiúscula e legível. As assinaturas devem ser iguais às dos documentos de identificação.</p>
            </div>
            {participants.map((p) => {
              const colorMap: Record<string, string> = {
                "Mãe": "border-[hsl(330,81%,60%)] bg-[hsl(330,81%,60%)]",
                "Filho(a) Investigante": "border-success bg-success",
                "Suposto Pai": "border-primary bg-primary",
              };
              const headerColor = colorMap[p.role] || "border-info bg-info";
              return (
                <Card key={p.id} className="overflow-hidden">
                  <div className={`${headerColor.split(" ")[1]} px-4 py-2 text-white font-bold text-sm`}>
                    {p.role.toUpperCase()}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-xs font-bold">Nome Completo *</Label>
                        <Input value={p.name} onChange={(e) => updateParticipant(p.id, "name", e.target.value)} placeholder="Nome completo" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">CPF</Label>
                        <Input value={p.docNumber} onChange={(e) => updateParticipant(p.id, "docNumber", e.target.value)} placeholder="000.000.000-00" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">RG</Label>
                        <Input placeholder="RG" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">Sexo</Label>
                        <Select value={p.sex} onValueChange={(v) => updateParticipant(p.id, "sex", v)}>
                          <SelectTrigger><SelectValue placeholder="Sel." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">M</SelectItem>
                            <SelectItem value="feminino">F</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">Decl. Nasc. Vivo</Label>
                        <Input value={p.registroNasc} onChange={(e) => updateParticipant(p.id, "registroNasc", e.target.value)} placeholder="Nº Registro" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">Registro Nasc.</Label>
                        <Input placeholder="Nº Registro" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">Endereço</Label>
                        <Input value={p.endereco} onChange={(e) => updateParticipant(p.id, "endereco", e.target.value)} placeholder="Endereço completo" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">CEP</Label>
                        <Input value={p.cep} onChange={(e) => updateParticipant(p.id, "cep", e.target.value)} placeholder="00000-000" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">Cidade/UF</Label>
                        <Input value={p.cidadeUf} onChange={(e) => updateParticipant(p.id, "cidadeUf", e.target.value)} placeholder="Cidade - UF" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">📞 Telefone</Label>
                        <Input value={p.phone} onChange={(e) => updateParticipant(p.id, "phone", e.target.value)} placeholder="( ) _____-____" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">📅 Data de Nascimento</Label>
                        <Input type="date" value={p.birthDate} onChange={(e) => updateParticipant(p.id, "birthDate", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold">🌍 Natural de</Label>
                        <Input value={p.naturalDe} onChange={(e) => updateParticipant(p.id, "naturalDe", e.target.value)} placeholder="Cidade - UF" />
                      </div>
                    </div>
                    {/* Interview questions */}
                    <div className="rounded-lg bg-muted/50 p-3 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold">Realizou transfusão de sangue e/ou transplante de medula óssea nos últimos 3 meses?</Label>
                        <div className="flex gap-3">
                          <Button size="sm" variant={p.transplant === false ? "default" : "outline"} onClick={() => updateParticipant(p.id, "transplant", false)}>Não</Button>
                          <Button size="sm" variant={p.transplant === true ? "destructive" : "outline"} onClick={() => updateParticipant(p.id, "transplant", true)}>Sim</Button>
                        </div>
                        {p.transplant && (
                          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" /> Pode comprometer o resultado do exame
                          </div>
                        )}
                      </div>
                      {p.role.toLowerCase().includes("pai") && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Existe parentesco em 1º grau entre as partes investigante e investigado? Qual parentesco?</Label>
                            <div className="flex gap-3 items-center">
                              <Button size="sm" variant="outline">Não</Button>
                              <Button size="sm" variant="outline">Sim</Button>
                              <Input placeholder="Qual?" className="max-w-[150px] h-8 text-xs" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Existe a possibilidade de um parente em 1º grau do Suposto Pai ser o verdadeiro Pai Biológico?</Label>
                            <div className="flex gap-3 items-center">
                              <Button size="sm" variant="outline">Não</Button>
                              <Button size="sm" variant="outline">Sim</Button>
                              <div className="flex gap-2">
                                <label className="flex items-center gap-1 text-xs"><input type="radio" name={`parenteType_${p.id}`} /> Materno</label>
                                <label className="flex items-center gap-1 text-xs"><input type="radio" name={`parenteType_${p.id}`} /> Paterno</label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                  {["RG", "CPF", "Certidão de Nascimento", "Decl. Nascido Vivo"].map((doc) => {
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
                  <p><strong>Etiqueta DNAjá:</strong> <span className="font-mono font-bold text-success">{etiquetaDNA}</span></p>
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
            {etiquetaDNA && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">Kit DNAjá</p>
                <p className="font-mono font-bold text-success">{etiquetaDNA}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoExame;
