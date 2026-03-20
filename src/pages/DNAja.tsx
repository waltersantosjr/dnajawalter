import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dna, AlertTriangle, CheckCircle2, Package, Receipt, DollarSign,
  Home, Building2, ShoppingCart, Plus, Trash2, Tag, Printer,
  CreditCard, Banknote, Smartphone, CircleDot, Ticket, X, Barcode,
} from "lucide-react";
import { toast } from "sonner";

type NfType = "produto" | "servico" | "ecommerce" | "";
type Modalidade = "auto_coleta" | "presencial";
type Pagamento = "dinheiro" | "credito" | "debito" | "pix";

interface CartItem {
  id: string;
  barcode: string;
  etiqueta: string;
  kitPrice: number;
  salePrice: number;
  modalidade: Modalidade;
  date: string;
}

const NF_LABELS: Record<string, string> = { produto: "NF Produto", servico: "NF Serviço", ecommerce: "NF E-commerce" };
const NF_DESC: Record<string, string> = { produto: "Nota Fiscal de Produto (ICMS)", servico: "Nota Fiscal de Serviço (ISS)", ecommerce: "Venda online / marketplace" };

const PAGAMENTO_OPTIONS: { id: Pagamento; label: string; icon: React.ElementType }[] = [
  { id: "dinheiro", label: "Dinheiro", icon: Banknote },
  { id: "credito", label: "Crédito", icon: CreditCard },
  { id: "debito", label: "Débito", icon: CreditCard },
  { id: "pix", label: "PIX", icon: Smartphone },
];

const LABS_CREDENCIADOS = [
  { nome: "DNAjá Lab — São Paulo/SP", cidade: "São Paulo", telefone: "(11) 3333-4444" },
  { nome: "DNAjá Lab — Campinas/SP", cidade: "Campinas", telefone: "(19) 3222-5555" },
  { nome: "DNAjá Lab — Ribeirão Preto/SP", cidade: "Ribeirão Preto", telefone: "(16) 3111-6666" },
  { nome: "BioGenetics — Uberlândia/MG", cidade: "Uberlândia", telefone: "(34) 3253-4100" },
  { nome: "DNAjá Lab — Rio de Janeiro/RJ", cidade: "Rio de Janeiro", telefone: "(21) 3444-7777" },
];

const DNAja = () => {
  const [modalidade, setModalidade] = useState<Modalidade>("auto_coleta");
  const [barcode, setBarcode] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [kitPrice, setKitPrice] = useState("0,00");
  const [salePrice, setSalePrice] = useState("0,00");
  const [nfType, setNfType] = useState<NfType>("");
  const [pagamento, setPagamento] = useState<Pagamento | "">("");
  const [desconto, setDesconto] = useState("0,00");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cidadeCliente, setCidadeCliente] = useState("");
  const [sales, setSales] = useState<{ barcode: string; etiqueta: string; status: string }[]>([
    { barcode: "1111111111111", etiqueta: "TRK-IHEV6CIL", status: "vendido" },
  ]);
  const [showVoucher, setShowVoucher] = useState<{ item: CartItem; lab: typeof LABS_CREDENCIADOS[0] } | null>(null);

  const parseBRL = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const addToCart = () => {
    if (!barcode.trim()) { toast.error("Digite ou bipe o código de barras"); return; }
    const item: CartItem = {
      id: Date.now().toString(), barcode, etiqueta, kitPrice: parseBRL(kitPrice),
      salePrice: parseBRL(salePrice), modalidade, date: new Date().toLocaleDateString("pt-BR"),
    };

    if (modalidade === "presencial") {
      // Go straight to voucher
      const lab = findNearestLab(cidadeCliente);
      setSales(prev => [...prev, { barcode: item.barcode, etiqueta: item.etiqueta || `DNA${item.id.slice(-4)}`, status: "vendido" }]);
      setShowVoucher({ item, lab });
      setBarcode(""); setEtiqueta("");
      toast.success("Voucher gerado com sucesso!");
      return;
    }

    setCart([...cart, item]);
    setBarcode(""); setEtiqueta("");
    toast.success("Kit adicionado ao carrinho");
  };

  const removeFromCart = (id: string) => setCart(cart.filter(c => c.id !== id));
  const subtotal = cart.reduce((a, c) => a + c.salePrice, 0);
  const custoTotal = cart.reduce((a, c) => a + c.kitPrice, 0);
  const descontoVal = parseBRL(desconto);
  const total = Math.max(subtotal - descontoVal, 0);

  const findNearestLab = (cidade: string) => {
    const match = LABS_CREDENCIADOS.find(l => l.cidade.toLowerCase() === cidade.toLowerCase());
    return match || LABS_CREDENCIADOS[0];
  };

  const finalizarVenda = () => {
    if (cart.length === 0) { toast.error("Adicione kits ao carrinho"); return; }
    if (!nfType) { toast.error("Selecione o tipo de nota fiscal"); return; }
    if (!pagamento) { toast.error("Selecione a forma de pagamento"); return; }

    const presenciais = cart.filter(c => c.modalidade === "presencial");
    cart.forEach(c => {
      setSales(prev => [...prev, { barcode: c.barcode, etiqueta: c.etiqueta || `DNA${c.id.slice(-4)}`, status: "vendido" }]);
    });

    toast.success(`Venda finalizada! ${cart.length} kit(s) · R$ ${total.toFixed(2)}`);

    if (presenciais.length > 0) {
      const lab = findNearestLab(cidadeCliente);
      setShowVoucher({ item: presenciais[0], lab });
    }
    setCart([]);
  };

  // Voucher for presencial
  if (showVoucher) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-background/95 print:relative print:bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4 print:hidden">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Ticket className="h-5 w-5 text-success" /> Voucher de Coleta Presencial
          </h2>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" /> Imprimir</Button>
            <Button variant="outline" onClick={() => setShowVoucher(null)}><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="mx-auto max-w-xl p-8 print:p-4">
          <div className="rounded-xl border-2 border-success p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-success">🧬 VOUCHER DE COLETA PRESENCIAL</h1>
              <p className="text-sm text-muted-foreground">DNAjá® - Kit Auto Coleta</p>
              <Separator />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Código de Barras</p><p className="font-mono font-bold">{showVoucher.item.barcode}</p></div>
              <div><p className="text-xs text-muted-foreground">Etiqueta DNA</p><p className="font-mono font-bold">{showVoucher.item.etiqueta || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground">Data de Emissão</p><p className="font-bold">{showVoucher.item.date}</p></div>
              <div><p className="text-xs text-muted-foreground">Validade</p><p className="font-bold text-warning">30 dias</p></div>
            </div>
            <Separator />

            {/* Lab credenciado */}
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 space-y-2">
              <p className="font-bold text-primary text-sm">🏥 Laboratório Credenciado Indicado</p>
              <p className="font-semibold">{showVoucher.lab.nome}</p>
              <p className="text-sm text-muted-foreground">📞 {showVoucher.lab.telefone}</p>
              <p className="text-xs text-muted-foreground">Apresente este voucher no balcão de atendimento.</p>
            </div>

            <div className="rounded-lg bg-success/10 p-4 space-y-2">
              <p className="font-bold text-success text-sm">📍 Instruções para o Cliente</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                <li>Apresente este voucher no laboratório credenciado indicado acima</li>
                <li>Leve documento com foto (RG ou CNH) de todos os participantes</li>
                <li>A coleta é indolor — feita por swab bucal (cotonete na bochecha)</li>
                <li>O resultado será enviado em até 5 dias úteis</li>
              </ol>
            </div>

            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 space-y-2">
              <p className="text-xs font-bold text-center text-muted-foreground">OUTROS LABORATÓRIOS CREDENCIADOS</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {LABS_CREDENCIADOS.filter(l => l.nome !== showVoucher.lab.nome).map(l => (
                  <p key={l.nome}>• {l.nome} — {l.telefone}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-warning/10 p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
              <p className="text-xs text-warning font-semibold">SEM VALIDADE JUDICIAL — Kit apenas informativo (Peace of Mind)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with DNA icon */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dna className="h-7 w-7 text-warning" />
            DNAjá PDV - Ponto de Venda
          </h1>
          <p className="text-muted-foreground">Registro de venda de kits de auto coleta</p>
        </div>
        <Badge variant="outline" className="border-success text-success gap-1.5 px-3 py-1">
          <CircleDot className="h-3 w-3 fill-success" /> Sistema Online
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Warning */}
          <div className="rounded-lg border-2 border-warning/30 bg-warning/5 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm">
              <strong className="text-warning">SEM VALIDADE JUDICIAL</strong> — Kits DNAjá são apenas informativos (Peace of Mind).
            </p>
          </div>

          {/* Add Kit Card - redesigned per reference image */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(var(--success)/0.7)] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Dna className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-xl">DNAjá - Venda Rápida</p>
                  <p className="text-sm opacity-90">Registre a venda do kit de auto coleta</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              {/* Modalidade */}
              <div>
                <p className="font-bold text-sm mb-3">Modalidade</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModalidade("auto_coleta")}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${modalidade === "auto_coleta" ? "border-success bg-success/5 shadow-sm" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <Home className={`h-5 w-5 mb-1 ${modalidade === "auto_coleta" ? "text-success" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-sm">Auto Coleta</p>
                    <p className="text-xs text-muted-foreground">Cliente coleta em casa</p>
                  </button>
                  <button
                    onClick={() => setModalidade("presencial")}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${modalidade === "presencial" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <Building2 className={`h-5 w-5 mb-1 ${modalidade === "presencial" ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-sm">Coleta Presencial</p>
                    <p className="text-xs text-muted-foreground">Coleta realizada no lab</p>
                  </button>
                </div>
              </div>

              {/* Barcode */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold flex items-center gap-1">
                  <Barcode className="h-4 w-4 text-muted-foreground" /> Código de Barras do Kit *
                </Label>
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="font-mono h-12 text-base border-2 border-success/50 focus:border-success"
                  placeholder="Bipe ou digite o código..."
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">Use o leitor de código de barras ou digite manualmente</p>
              </div>

              {/* Etiqueta */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold flex items-center gap-1">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Código da Etiqueta DNA
                </Label>
                <Input
                  value={etiqueta}
                  onChange={(e) => setEtiqueta(e.target.value)}
                  className="font-mono"
                  placeholder="Ex: DNA0011"
                />
              </div>

              {/* Cidade (for presencial) */}
              {modalidade === "presencial" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold flex items-center gap-1">
                    📍 Cidade do Cliente
                  </Label>
                  <Input
                    value={cidadeCliente}
                    onChange={(e) => setCidadeCliente(e.target.value)}
                    placeholder="Ex: São Paulo"
                  />
                  <p className="text-xs text-muted-foreground">O voucher indicará o laboratório credenciado mais próximo</p>
                </div>
              )}

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" /> Valor do Kit (custo)
                  </Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input value={kitPrice} onChange={(e) => setKitPrice(e.target.value)} className="font-mono" placeholder="0,00" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-success" /> Valor de Venda
                  </Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="font-mono" placeholder="0,00" />
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)] text-white text-base" onClick={addToCart}>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Registrar Venda
              </Button>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Últimas Vendas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sales.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span className="font-mono text-sm">{s.barcode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-success text-success text-xs">{s.status}</Badge>
                      <Badge variant="secondary" className="text-xs font-mono">{s.etiqueta}</Badge>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma venda registrada</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4 text-muted-foreground" /> Nota Fiscal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["produto", "servico", "ecommerce"] as NfType[]).map(nf => (
                <button key={nf} onClick={() => setNfType(nf)} className={`w-full rounded-lg border-2 p-3 text-left transition-all ${nfType === nf ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                  <p className="font-semibold text-sm">{NF_LABELS[nf]}</p>
                  <p className="text-xs text-muted-foreground">{NF_DESC[nf]}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /> Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {PAGAMENTO_OPTIONS.map(op => (
                  <button key={op.id} onClick={() => setPagamento(op.id)} className={`rounded-lg border-2 p-3 flex flex-col items-center gap-1.5 transition-all ${pagamento === op.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                    <op.icon className={`h-5 w-5 ${pagamento === op.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-semibold">{op.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Receipt className="h-4 w-4 text-muted-foreground" /> Resumo da Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length > 0 && (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm rounded-md border p-2">
                      <div>
                        <p className="font-mono text-xs">{item.barcode}</p>
                        <p className="text-xs text-muted-foreground">{item.modalidade === "presencial" ? "Presencial" : "Auto Coleta"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">R$ {item.salePrice.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({cart.length} kits)</span><span className="font-mono">R$ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Custo total</span><span className="font-mono text-muted-foreground">R$ {custoTotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Desconto R$</span>
                  <Input value={desconto} onChange={e => setDesconto(e.target.value)} className="w-24 h-7 text-xs font-mono text-right" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">Total a Pagar</span>
                <span className="text-2xl font-bold text-success font-mono">R$ {total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)] text-white" size="lg" disabled={cart.length === 0} onClick={finalizarVenda}>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Finalizar Venda
              </Button>
              {cart.length === 0 && <p className="text-xs text-muted-foreground text-center">Adicione kits ao carrinho para finalizar.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DNAja;
