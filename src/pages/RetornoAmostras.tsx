import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Package, Home, Building2, CalendarCheck, ArrowRight, ArrowLeft,
  Lock, Mail, Truck, MapPin, CheckCircle2, Info, ExternalLink, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

type Modalidade = "auto_coleta" | "unidade" | "agendado" | null;

const MODALIDADES = [
  {
    id: "auto_coleta" as const,
    titulo: "Em casa com Kit de Coleta",
    descricao: "Realizei a coleta em casa com o kit DNAjá",
    icon: Home,
    color: "text-success",
    bg: "bg-success/10 border-success/30",
  },
  {
    id: "unidade" as const,
    titulo: "Em uma unidade",
    descricao: "Fui até um laboratório credenciado",
    icon: Building2,
    color: "text-info",
    bg: "bg-info/10 border-info/30",
  },
  {
    id: "agendado" as const,
    titulo: "Com atendimento agendado em casa",
    descricao: "Um profissional foi até minha residência",
    icon: CalendarCheck,
    color: "text-chart-4",
    bg: "bg-chart-4/10 border-chart-4/30",
  },
];

const CORREIOS_OPTIONS = [
  {
    nome: "SEDEX",
    prazo: "1 a 3 dias úteis",
    descricao: "Envio rápido com rastreamento. Ideal para amostras biológicas.",
    destaque: true,
  },
  {
    nome: "PAC",
    prazo: "5 a 8 dias úteis",
    descricao: "Opção econômica. Verifique se o prazo é compatível com a validade da amostra.",
    destaque: false,
  },
  {
    nome: "SEDEX 10 / SEDEX 12",
    prazo: "Entrega até 10h ou 12h do dia seguinte",
    descricao: "Para envios urgentes com hora marcada.",
    destaque: false,
  },
];

const RetornoAmostras = () => {
  const [modalidade, setModalidade] = useState<Modalidade>(null);
  const [step, setStep] = useState(0); // 0 = escolha, 1 = form, 2 = instruções
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [cep, setCep] = useState("");
  const [observacao, setObservacao] = useState("");
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);

  const handleSelectModalidade = (m: Modalidade) => {
    setModalidade(m);
    if (m === "auto_coleta") {
      setStep(1);
    } else {
      setAuthenticated(true);
      setStep(2);
    }
  };

  const handleLogin = () => {
    if (!login.trim() || !senha.trim()) {
      toast.error("Preencha login e senha do kit");
      return;
    }
    setAuthenticated(true);
    setStep(2);
    toast.success("Kit autenticado com sucesso!");
  };

  const handleSolicitar = () => {
    setSolicitacaoEnviada(true);
    toast.success("Solicitação de retorno registrada com sucesso!");
  };

  const reset = () => {
    setModalidade(null);
    setStep(0);
    setLogin("");
    setSenha("");
    setAuthenticated(false);
    setCep("");
    setObservacao("");
    setSolicitacaoEnviada(false);
  };

  if (solicitacaoEnviada) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-7 w-7 text-success" /> Retorno de Amostras
          </h1>
        </div>
        <Card className="max-w-lg mx-auto border-success/30">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
            <h2 className="text-xl font-bold">Solicitação Registrada!</h2>
            <p className="text-muted-foreground">
              Sua solicitação de retorno de amostras foi registrada. Você receberá as instruções
              de envio e o código de postagem em breve.
            </p>
            {login && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">Kit: </span>
                <span className="font-mono font-bold">{login}</span>
              </div>
            )}
            <Button onClick={reset} variant="outline" className="mt-4">
              Nova Solicitação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-7 w-7 text-chart-4" /> Retorno de Amostras
        </h1>
        <p className="text-muted-foreground">
          Solicite atendimento para retornar suas amostras ao laboratório
        </p>
      </div>

      {/* Step 0: Escolha da modalidade */}
      {step === 0 && (
        <div className="max-w-xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center">Como você realizou os exames?</CardTitle>
              <CardDescription className="text-center">
                Selecione a modalidade de coleta para receber as instruções corretas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {MODALIDADES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectModalidade(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${m.bg}`}
                >
                  <m.icon className={`h-8 w-8 ${m.color} shrink-0`} />
                  <div className="text-left">
                    <p className="font-semibold">{m.titulo}</p>
                    <p className="text-xs text-muted-foreground">{m.descricao}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 1: Login/Senha (auto coleta) */}
      {step === 1 && modalidade === "auto_coleta" && !authenticated && (
        <div className="max-w-md mx-auto space-y-4">
          <Button variant="ghost" size="sm" onClick={() => { setStep(0); setModalidade(null); }}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-warning" /> Autenticação do Kit
              </CardTitle>
              <CardDescription>
                Digite o login e senha que vieram com o seu kit DNAjá para prosseguir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  O login e senha estão impressos na etiqueta do seu kit de coleta. 
                  Essas credenciais garantem que apenas você tenha acesso ao resultado do exame.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Login do Kit</Label>
                <Input
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Ex: dna0001"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Senha do Kit</Label>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                <Lock className="mr-2 h-4 w-4" /> Autenticar Kit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Instruções de retorno */}
      {step === 2 && authenticated && (
        <div className="max-w-3xl mx-auto space-y-4">
          <Button variant="ghost" size="sm" onClick={reset}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
          </Button>

          <div className="grid gap-4 md:grid-cols-[1fr_320px]">
            {/* Instruções principais */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="h-5 w-5 text-chart-4" /> Instruções de Envio
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {MODALIDADES.find((m) => m.id === modalidade)?.titulo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modalidade === "auto_coleta" && (
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-warning">Atenção — Auto Coleta</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Após a coleta, armazene o envelope de amostra em local seco e envie o mais rápido possível 
                          pelos Correios para garantir a integridade do material.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Passo a passo:</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
                        <span>Coloque o(s) envelope(s) de amostra dentro da embalagem fornecida no kit.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
                        <span>Lacre a embalagem com segurança.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
                        <span>
                          Leve a uma agência dos <strong>Correios</strong> e envie via <strong>SEDEX</strong> (recomendado) 
                          ou <strong>PAC</strong> para o endereço indicado na etiqueta de retorno.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">4</span>
                        <span>Guarde o comprovante de postagem e o código de rastreamento.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-destructive" /> Endereço de Destino
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono">
                      <p className="font-bold">Laboratório DNAjá — Biovida</p>
                      <p>Rua Exemplo, 123 — Sala 45</p>
                      <p>Centro — São Paulo/SP</p>
                      <p>CEP: 01001-000</p>
                      <p className="text-xs text-muted-foreground mt-1">A/C: Setor de Triagem de Amostras</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opções de envio Correios */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-5 w-5 text-info" /> Opções de Envio — Correios
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Recomendamos SEDEX para melhor preservação das amostras
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CORREIOS_OPTIONS.map((opt) => (
                    <div
                      key={opt.nome}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        opt.destaque ? "border-success/40 bg-success/5" : "border-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{opt.nome}</span>
                          {opt.destaque && (
                            <Badge className="bg-success text-success-foreground text-[10px] px-1.5 py-0">
                              Recomendado
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.descricao}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 ml-2">{opt.prazo}</Badge>
                    </div>
                  ))}
                  <a
                    href="https://www.correios.com.br/enviar/encomendas/nacional"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    <ExternalLink className="h-3 w-3" /> Consultar preços e prazos no site dos Correios
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Formulário */}
            <div className="space-y-4">
              {login && (
                <Card className="border-success/30">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">Kit autenticado:</span>
                      <span className="font-mono font-bold">{login}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Solicitar Atendimento</CardTitle>
                  <CardDescription className="text-xs">
                    Informe seus dados para receber suporte no retorno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">CEP de origem</Label>
                    <Input
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="font-mono"
                      maxLength={9}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Observações (opcional)</Label>
                    <Textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Dúvidas ou informações adicionais..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                  <Button onClick={handleSolicitar} className="w-full">
                    <Package className="mr-2 h-4 w-4" /> Solicitar Retorno
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Info className="h-3 w-3" /> Dúvidas frequentes
                </p>
                <p>• O envio é por conta do cliente, exceto em promoções específicas.</p>
                <p>• Não envie amostras por transportadoras não autorizadas.</p>
                <p>• O prazo do resultado começa a contar após o recebimento no laboratório.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetornoAmostras;
