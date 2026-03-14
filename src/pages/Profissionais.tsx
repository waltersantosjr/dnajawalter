import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck, UserPlus, FileText, Camera, CreditCard, MapPin,
  CheckCircle2, Upload, ClipboardList, ArrowRight, Printer, Building2,
  Users, AlertTriangle, Info,
} from "lucide-react";
import { toast } from "sonner";

const ETAPAS_HABILITACAO = [
  { titulo: "Dados Pessoais", desc: "CPF, nome completo, data de nascimento, telefone e e-mail", icon: CreditCard },
  { titulo: "Registro Profissional", desc: "Upload do documento de registro (CRBio, CRBM, CRF, CRM ou outro)", icon: Upload },
  { titulo: "Identificação Facial", desc: "Foto frontal do rosto para validação de identidade", icon: Camera },
  { titulo: "Endereço Completo", desc: "Endereço comercial ou residencial para atendimento", icon: MapPin },
  { titulo: "Dados para Nota Fiscal", desc: "CNPJ ou CPF, razão social, inscrição municipal e regime tributário", icon: Building2 },
  { titulo: "Termo de Compromisso", desc: "Assinatura digital do termo de responsabilidade e compromisso ético", icon: ClipboardList },
  { titulo: "Cadeia de Custódia", desc: "Declaração de responsabilidade pela cadeia de custódia do material", icon: ShieldCheck },
  { titulo: "Contrato de Credenciamento", desc: "Assinatura do contrato de credenciamento com a rede DNAjá", icon: FileText },
];

type Registro = "crbio" | "crbm" | "crf" | "crm" | "outro";

const Profissionais = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [form, setForm] = useState({
    nome: "", cpf: "", nascimento: "", telefone: "", email: "",
    registro: "crbio" as Registro, numRegistro: "", docFile: null as File | null,
    fotoFile: null as File | null,
    cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "SP",
    cnpj: "", razaoSocial: "", inscricaoMunicipal: "", regimeTrib: "simples",
    aceitouTermo: false, aceitouCustodia: false, aceitouContrato: false,
  });

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleFinalize = () => {
    if (!form.nome || !form.cpf || !form.numRegistro) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    toast.success("Cadastro finalizado! Termo de compromisso, cadeia de custódia e contrato gerados.");
    setShowCadastro(false);
    setEtapaAtual(0);
  };

  const PROFISSIONAIS_MOCK = [
    { nome: "Dra. Ana Silva", registro: "CRBio 45678/SP", cidade: "São Paulo/SP", status: "ativo", coletas: 128 },
    { nome: "Dr. Carlos Souza", registro: "CRBM 12345/MG", cidade: "Uberlândia/MG", status: "ativo", coletas: 87 },
    { nome: "Enf. Maria Santos", registro: "COREN 98765/RJ", cidade: "Rio de Janeiro/RJ", status: "pendente", coletas: 0 },
    { nome: "Dra. Patrícia Lima", registro: "CRF 33210/SP", cidade: "Campinas/SP", status: "ativo", coletas: 54 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-chart-3" /> Profissionais Habilitados
          </h1>
          <p className="text-muted-foreground">Cadastro e habilitação de profissionais para coleta DNAjá</p>
        </div>
        <Button onClick={() => setShowCadastro(!showCadastro)}>
          <UserPlus className="mr-2 h-4 w-4" /> {showCadastro ? "Voltar à Lista" : "Novo Cadastro"}
        </Button>
      </div>

      {!showCadastro ? (
        <>
          {/* Steps overview */}
          <Card className="border-chart-3/20 bg-chart-3/5">
            <CardContent className="p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Info className="h-4 w-4 text-chart-3" /> Passo a Passo para Habilitação</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {ETAPAS_HABILITACAO.map((etapa, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-3/20 text-chart-3 text-xs font-bold">{i + 1}</div>
                    <div>
                      <p className="font-semibold text-xs">{etapa.titulo}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{etapa.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-chart-3" /> Profissionais Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PROFISSIONAIS_MOCK.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">{p.registro} · {p.cidade}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">{p.coletas} coletas</span>
                      <Badge variant={p.status === "ativo" ? "default" : "outline"}>{p.status === "ativo" ? "Ativo" : "Pendente"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Registration form */
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Steps sidebar */}
          <div className="space-y-0">
            {ETAPAS_HABILITACAO.map((etapa, idx) => {
              const isActive = idx === etapaAtual;
              const isDone = idx < etapaAtual;
              return (
                <div key={idx} className="flex gap-2 cursor-pointer" onClick={() => setEtapaAtual(idx)}>
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all text-xs font-bold ${
                      isActive ? "border-chart-3 bg-chart-3 text-white" :
                      isDone ? "border-success bg-success text-white" : "border-border text-muted-foreground"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < ETAPAS_HABILITACAO.length - 1 && <div className={`w-0.5 flex-1 min-h-[12px] ${isDone ? "bg-success" : "bg-border"}`} />}
                  </div>
                  <div className={`mb-2 flex-1 rounded-md p-2 text-xs transition-all ${isActive ? "bg-chart-3/10 font-semibold text-chart-3" : "text-muted-foreground"}`}>
                    {etapa.titulo}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {(() => { const E = ETAPAS_HABILITACAO[etapaAtual]; return <><E.icon className="h-5 w-5 text-chart-3" /> {E.titulo}</>; })()}
              </CardTitle>
              <CardDescription>{ETAPAS_HABILITACAO[etapaAtual].desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {etapaAtual === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Nome Completo *</Label><Input value={form.nome} onChange={e => updateForm("nome", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">CPF *</Label><Input value={form.cpf} onChange={e => updateForm("cpf", e.target.value)} placeholder="000.000.000-00" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Data de Nascimento</Label><Input type="date" value={form.nascimento} onChange={e => updateForm("nascimento", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Telefone</Label><Input value={form.telefone} onChange={e => updateForm("telefone", e.target.value)} placeholder="(00) 00000-0000" /></div>
                  <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs font-semibold">E-mail</Label><Input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} /></div>
                </div>
              )}
              {etapaAtual === 1 && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tipo de Registro *</Label>
                      <Select value={form.registro} onValueChange={v => updateForm("registro", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crbio">CRBio (Biomédico)</SelectItem>
                          <SelectItem value="crbm">CRBM (Biomed. Molecul.)</SelectItem>
                          <SelectItem value="crf">CRF (Farmacêutico)</SelectItem>
                          <SelectItem value="crm">CRM (Médico)</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs font-semibold">Nº do Registro *</Label><Input value={form.numRegistro} onChange={e => updateForm("numRegistro", e.target.value)} placeholder="00000/UF" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Upload do Documento de Registro</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-chart-3/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Clique ou arraste o documento</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG — máx. 5MB</p>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => updateForm("docFile", e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>
              )}
              {etapaAtual === 2 && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-chart-3/50 transition-colors cursor-pointer">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold text-sm">Captura Facial</p>
                    <p className="text-xs text-muted-foreground mt-1">Tire uma foto frontal do rosto para validação de identidade</p>
                    <Button variant="outline" className="mt-3"><Camera className="mr-2 h-4 w-4" /> Capturar Foto</Button>
                  </div>
                  <div className="rounded-md bg-warning/10 p-3 text-xs text-warning flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Remova óculos escuros, bonés e mantenha boa iluminação.</span>
                  </div>
                </div>
              )}
              {etapaAtual === 3 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">CEP</Label><Input value={form.cep} onChange={e => updateForm("cep", e.target.value)} placeholder="00000-000" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Rua</Label><Input value={form.rua} onChange={e => updateForm("rua", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Número</Label><Input value={form.numero} onChange={e => updateForm("numero", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Complemento</Label><Input value={form.complemento} onChange={e => updateForm("complemento", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Bairro</Label><Input value={form.bairro} onChange={e => updateForm("bairro", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Cidade</Label><Input value={form.cidade} onChange={e => updateForm("cidade", e.target.value)} /></div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Estado</Label>
                    <Select value={form.estado} onValueChange={v => updateForm("estado", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {etapaAtual === 4 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">CNPJ ou CPF</Label><Input value={form.cnpj} onChange={e => updateForm("cnpj", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Razão Social</Label><Input value={form.razaoSocial} onChange={e => updateForm("razaoSocial", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-semibold">Inscrição Municipal</Label><Input value={form.inscricaoMunicipal} onChange={e => updateForm("inscricaoMunicipal", e.target.value)} /></div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Regime Tributário</Label>
                    <Select value={form.regimeTrib} onValueChange={v => updateForm("regimeTrib", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">Simples Nacional</SelectItem>
                        <SelectItem value="presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="real">Lucro Real</SelectItem>
                        <SelectItem value="mei">MEI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {etapaAtual === 5 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-3 text-sm text-muted-foreground max-h-60 overflow-y-auto">
                    <p className="font-bold text-foreground">TERMO DE COMPROMISSO — PROFISSIONAL COLETADOR DNAjá</p>
                    <p>Eu, <strong>{form.nome || "[nome]"}</strong>, inscrito(a) no CPF sob o nº <strong>{form.cpf || "[CPF]"}</strong>, portador(a) do registro profissional nº <strong>{form.numRegistro || "[registro]"}</strong>, declaro estar ciente e comprometer-me a:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Realizar a coleta de material biológico seguindo rigorosamente o protocolo técnico estabelecido;</li>
                      <li>Manter a cadeia de custódia inviolável desde a coleta até o envio ao laboratório;</li>
                      <li>Garantir a identificação correta de todos os participantes com documentação válida;</li>
                      <li>Preservar o sigilo e a confidencialidade de todos os dados dos testados;</li>
                      <li>Utilizar somente materiais e kits autorizados pela rede DNAjá;</li>
                      <li>Responder civil e criminalmente por qualquer irregularidade no procedimento de coleta.</li>
                    </ul>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.aceitouTermo} onChange={e => updateForm("aceitouTermo", e.target.checked)} className="rounded" />
                    <span>Li e aceito o Termo de Compromisso</span>
                  </label>
                </div>
              )}
              {etapaAtual === 6 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-3 text-sm text-muted-foreground max-h-60 overflow-y-auto">
                    <p className="font-bold text-foreground">DECLARAÇÃO DE RESPONSABILIDADE — CADEIA DE CUSTÓDIA</p>
                    <p>Declaro que me responsabilizo integralmente pela cadeia de custódia do material biológico coletado, garantindo:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Integridade das amostras desde a coleta até a entrega ao laboratório;</li>
                      <li>Acondicionamento adequado conforme normas técnicas vigentes;</li>
                      <li>Preenchimento completo e correto de toda a documentação;</li>
                      <li>Rastreabilidade de cada amostra coletada;</li>
                      <li>Envio dentro do prazo estipulado pelo laboratório (máximo 72 horas).</li>
                    </ul>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.aceitouCustodia} onChange={e => updateForm("aceitouCustodia", e.target.checked)} className="rounded" />
                    <span>Li e aceito a Declaração de Cadeia de Custódia</span>
                  </label>
                </div>
              )}
              {etapaAtual === 7 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-3 text-sm text-muted-foreground max-h-60 overflow-y-auto">
                    <p className="font-bold text-foreground">CONTRATO DE CREDENCIAMENTO — REDE DNAjá</p>
                    <p>CONTRATANTE: DNAjá Laboratórios Ltda.</p>
                    <p>CONTRATADO(A): <strong>{form.nome || "[nome]"}</strong> — {form.numRegistro || "[registro]"}</p>
                    <p className="mt-2">Pelo presente contrato, as partes acima qualificadas firmam acordo para credenciamento como ponto de coleta autorizado da rede DNAjá, nas seguintes condições:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>O profissional atuará como coletador(a) autorizado(a) na região de <strong>{form.cidade || "[cidade]"}/{form.estado}</strong>;</li>
                      <li>Será remunerado(a) conforme tabela de valores vigente por coleta realizada;</li>
                      <li>Manterá documentação profissional atualizada durante toda a vigência;</li>
                      <li>Vigência: 12 meses, renovável automaticamente;</li>
                      <li>Rescisão: com aviso prévio de 30 dias por qualquer das partes.</li>
                    </ul>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.aceitouContrato} onChange={e => updateForm("aceitouContrato", e.target.checked)} className="rounded" />
                    <span>Li e aceito o Contrato de Credenciamento</span>
                  </label>
                </div>
              )}

              <Separator />
              <div className="flex justify-between">
                <Button variant="outline" disabled={etapaAtual === 0} onClick={() => setEtapaAtual(e => e - 1)}>Anterior</Button>
                {etapaAtual < ETAPAS_HABILITACAO.length - 1 ? (
                  <Button onClick={() => setEtapaAtual(e => e + 1)}>Próximo <ArrowRight className="ml-1 h-4 w-4" /></Button>
                ) : (
                  <Button onClick={handleFinalize} disabled={!form.aceitouTermo || !form.aceitouCustodia || !form.aceitouContrato}>
                    <Printer className="mr-2 h-4 w-4" /> Finalizar e Gerar Documentos
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profissionais;
