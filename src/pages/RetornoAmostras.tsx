import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Package, Home, Building2, CalendarCheck, ArrowRight, ArrowLeft,
  Lock, Mail, Truck, MapPin, CheckCircle2, Info, ExternalLink, AlertTriangle,
  Printer, Calculator, Search
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
    precoBase: 32.5,
  },
  {
    nome: "PAC",
    prazo: "5 a 8 dias úteis",
    descricao: "Opção econômica. Verifique se o prazo é compatível com a validade da amostra.",
    destaque: false,
    precoBase: 18.9,
  },
  {
    nome: "SEDEX 10 / SEDEX 12",
    prazo: "Entrega até 10h ou 12h do dia seguinte",
    descricao: "Para envios urgentes com hora marcada.",
    destaque: false,
    precoBase: 55.0,
  },
];

const DEST_CEP = "01001-000";
const DEST_CIDADE = "São Paulo/SP";

const calcularFrete = (cepOrigem: string) => {
  const cepNum = parseInt(cepOrigem.replace(/\D/g, ""));
  if (isNaN(cepNum) || cepOrigem.replace(/\D/g, "").length < 8) return null;

  // Simulação baseada na distância do CEP de destino (SP capital)
  const destNum = 1001000;
  const diff = Math.abs(cepNum - destNum);
  const fator = 1 + (diff / 100000000) * 2.5;

  return CORREIOS_OPTIONS.map((opt) => ({
    servico: opt.nome,
    prazo: opt.prazo,
    valor: Math.round(opt.precoBase * fator * 100) / 100,
    destaque: opt.destaque,
  }));
};

const RetornoAmostras = () => {
  const [modalidade, setModalidade] = useState<Modalidade>(null);
  const [step, setStep] = useState(0);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [cep, setCep] = useState("");
  const [observacao, setObservacao] = useState("");
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const [freteResult, setFreteResult] = useState<ReturnType<typeof calcularFrete>>(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const etiquetaRef = useRef<HTMLDivElement>(null);

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

  const handleCalcularFrete = () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length < 8) {
      toast.error("Informe um CEP válido com 8 dígitos");
      return;
    }
    setCalculandoFrete(true);
    setTimeout(() => {
      const result = calcularFrete(cep);
      setFreteResult(result);
      setCalculandoFrete(false);
      if (result) toast.success("Frete calculado!");
    }, 800);
  };

  const handleSolicitar = () => {
    setSolicitacaoEnviada(true);
    toast.success("Solicitação de retorno registrada com sucesso!");
  };

  const handlePrintEtiqueta = () => {
    const el = etiquetaRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=600,height=500");
    if (!win) return;
    win.document.write(`
      <html><head><title>Etiqueta de Postagem DNAjá</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .etiqueta { border: 3px solid #000; padding: 20px; max-width: 480px; margin: auto; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
        .header h2 { margin: 0 0 4px; font-size: 18px; }
        .header p { margin: 0; font-size: 11px; color: #555; }
        .section { margin-bottom: 12px; }
        .section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #555; margin-bottom: 4px; letter-spacing: 1px; }
        .dest { font-size: 14px; line-height: 1.6; }
        .dest .nome { font-weight: bold; font-size: 16px; }
        .remet { font-size: 12px; line-height: 1.5; color: #333; }
        .kit-info { display: flex; justify-content: space-between; border-top: 2px dashed #000; padding-top: 10px; margin-top: 12px; font-size: 12px; }
        .kit-info .label { color: #555; font-size: 10px; text-transform: uppercase; }
        .kit-info .value { font-weight: bold; font-size: 14px; font-family: monospace; }
        .selo { text-align: center; margin-top: 16px; border: 2px solid #000; padding: 8px; font-weight: bold; font-size: 13px; background: #f0f0f0; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <div class="etiqueta">
        <div class="header">
          <h2>DNAjá — Etiqueta de Postagem Pré-Paga</h2>
          <p>Recorte e cole na embalagem de retorno</p>
        </div>
        <div class="section">
          <div class="section-title">Destinatário</div>
          <div class="dest">
            <div class="nome">Laboratório DNAjá — Biovida</div>
            <div>Rua Exemplo, 123 — Sala 45</div>
            <div>Centro — São Paulo/SP</div>
            <div>CEP: ${DEST_CEP}</div>
            <div style="font-size:11px;color:#555;">A/C: Setor de Triagem de Amostras</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Remetente</div>
          <div class="remet">
            <div>${login ? `Kit: ${login}` : "Cliente DNAjá"}</div>
            <div>${cep ? `CEP Origem: ${cep}` : ""}</div>
          </div>
        </div>
        <div class="kit-info">
          <div><div class="label">ID do Kit</div><div class="value">${login || "—"}</div></div>
          <div><div class="label">Modalidade</div><div class="value">${modalidade === "auto_coleta" ? "Auto Coleta" : modalidade === "unidade" ? "Unidade" : "Agendado"}</div></div>
          <div><div class="label">Data</div><div class="value">${new Date().toLocaleDateString("pt-BR")}</div></div>
        </div>
        <div class="selo">✉ POSTAGEM PRÉ-PAGA — NÃO NECESSITA SELO</div>
      </div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>
    `);
    win.document.close();
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
    setFreteResult(null);
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
                        <span>Imprima a <strong>etiqueta de postagem pré-paga</strong> e cole na embalagem.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">4</span>
                        <span>
                          Leve a uma agência dos <strong>Correios</strong> e entregue o pacote já etiquetado.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">5</span>
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
                      <p>Centro — {DEST_CIDADE}</p>
                      <p>CEP: {DEST_CEP}</p>
                      <p className="text-xs text-muted-foreground mt-1">A/C: Setor de Triagem de Amostras</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Etiqueta de postagem pré-paga */}
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Printer className="h-5 w-5 text-primary" /> Etiqueta de Postagem Pré-Paga
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Imprima, recorte e cole na embalagem de retorno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div ref={etiquetaRef} className="border-2 border-foreground/80 rounded-lg p-4 space-y-3 bg-card">
                    <div className="text-center border-b-2 border-foreground/30 pb-2">
                      <p className="font-bold text-base">DNAjá — Etiqueta de Postagem Pré-Paga</p>
                      <p className="text-[10px] text-muted-foreground">Recorte e cole na embalagem</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Destinatário</p>
                      <p className="font-bold text-sm">Laboratório DNAjá — Biovida</p>
                      <p className="text-xs">Rua Exemplo, 123 — Sala 45</p>
                      <p className="text-xs">Centro — {DEST_CIDADE}</p>
                      <p className="text-xs">CEP: {DEST_CEP}</p>
                      <p className="text-[10px] text-muted-foreground">A/C: Setor de Triagem de Amostras</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Remetente</p>
                      <p className="text-xs">{login ? `Kit: ${login}` : "Cliente DNAjá"}</p>
                      {cep && <p className="text-xs">CEP Origem: {cep}</p>}
                    </div>
                    <div className="flex justify-between border-t border-dashed border-foreground/30 pt-2 text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">ID do Kit</p>
                        <p className="font-mono font-bold">{login || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Modalidade</p>
                        <p className="font-mono font-bold">
                          {modalidade === "auto_coleta" ? "Auto Coleta" : modalidade === "unidade" ? "Unidade" : "Agendado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Data</p>
                        <p className="font-mono font-bold">{new Date().toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="text-center border-2 border-foreground/50 rounded p-2 bg-muted/30 font-bold text-xs">
                      ✉ POSTAGEM PRÉ-PAGA — NÃO NECESSITA SELO
                    </div>
                  </div>
                  <Button onClick={handlePrintEtiqueta} className="w-full">
                    <Printer className="mr-2 h-4 w-4" /> Imprimir Etiqueta
                  </Button>
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

            {/* Sidebar */}
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

              {/* Calculadora de frete */}
              <Card className="border-info/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-info" /> Calculadora de Frete
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Simule o valor do envio pelos Correios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">CEP de origem</Label>
                    <div className="flex gap-2">
                      <Input
                        value={cep}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 8);
                          if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
                          setCep(v);
                        }}
                        placeholder="00000-000"
                        className="font-mono"
                        maxLength={9}
                      />
                      <Button
                        size="sm"
                        onClick={handleCalcularFrete}
                        disabled={calculandoFrete}
                        className="shrink-0"
                      >
                        {calculandoFrete ? (
                          <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Destino: {DEST_CEP} — {DEST_CIDADE}</span>
                  </div>

                  {freteResult && (
                    <div className="space-y-2 border-t pt-3">
                      {freteResult.map((f) => (
                        <div
                          key={f.servico}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                            f.destaque ? "border-success/40 bg-success/5" : "border-border"
                          }`}
                        >
                          <div>
                            <span className="font-semibold">{f.servico}</span>
                            <p className="text-[10px] text-muted-foreground">{f.prazo}</p>
                          </div>
                          <span className="font-bold text-sm">
                            R$ {f.valor.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      ))}
                      <p className="text-[10px] text-muted-foreground italic">
                        * Valores simulados. Consulte os Correios para valores exatos.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Solicitar Atendimento</CardTitle>
                  <CardDescription className="text-xs">
                    Informe seus dados para receber suporte no retorno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
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
                <p>• Com a etiqueta pré-paga, basta entregar na agência dos Correios.</p>
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
