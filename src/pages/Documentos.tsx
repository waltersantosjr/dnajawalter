import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Receipt, Scale, Building2, Shield, Printer,
  Download, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const Documentos = () => {
  const [activeTab, setActiveTab] = useState("declaracoes");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" /> Documentos e Orçamentos
        </h1>
        <p className="text-muted-foreground">Gere declarações, orçamentos e ofícios</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="declaracoes">
            <Shield className="mr-1 h-4 w-4" /> Declarações
          </TabsTrigger>
          <TabsTrigger value="orcamentos">
            <Receipt className="mr-1 h-4 w-4" /> Orçamentos
          </TabsTrigger>
          <TabsTrigger value="oficios">
            <Building2 className="mr-1 h-4 w-4" /> Ofícios
          </TabsTrigger>
        </TabsList>

        {/* ─── Declarações ─── */}
        <TabsContent value="declaracoes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Termo de Consentimento Unificado (TCU)</CardTitle>
              <CardDescription>Para exames Duo/Trio com pais vivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nome do Participante</Label>
                  <Input placeholder="Nome completo" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">RG / CPF</Label>
                  <Input placeholder="Documento" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo de Exame</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="trio">Trio</SelectItem>
                    <SelectItem value="reconstituicao">Reconstituição Genética</SelectItem>
                    <SelectItem value="irmandade">Irmandade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => toast.success("TCU gerado com sucesso! (simulação)")}>
                <Printer className="mr-1 h-4 w-4" /> Gerar TCU
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Termo de Reconstituição e Veracidade (TRV)</CardTitle>
              <CardDescription>Para reconstituição genética e testes de irmandade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Parente Colaborador</Label>
                  <Input placeholder="Nome completo" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">RG / CPF</Label>
                  <Input placeholder="Documento" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grau de Parentesco</Label>
                  <Input placeholder="Ex: Irmão germano" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nome do Suposto Pai Falecido</Label>
                  <Input placeholder="Nome completo" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nº Certidão de Óbito</Label>
                <Input placeholder="Número da certidão" />
              </div>
              <Button onClick={() => toast.success("TRV gerado com sucesso! (simulação)")}>
                <Printer className="mr-1 h-4 w-4" /> Gerar TRV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Declaração de Resultado Inconclusivo</CardTitle>
              <CardDescription>Para cenários sem índice conclusivo — partes devem assinar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nº do Caso</Label>
                  <Input placeholder="EX-2026-XXXX" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Probabilidade Obtida (%)</Label>
                  <Input placeholder="Ex: 87,5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                "Declaro estar ciente de que o resultado obtido situa-se na zona cinzenta (80-95%), 
                não sendo suficiente para presunção de paternidade. Recomenda-se ampliação de painel 
                ou inclusão de novos parentes de 1º grau."
              </p>
              <Button onClick={() => toast.success("Declaração gerada! (simulação)")}>
                <Printer className="mr-1 h-4 w-4" /> Gerar Declaração
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Orçamentos ─── */}
        <TabsContent value="orcamentos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerar Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Cliente</Label>
                  <Input placeholder="Nome ou razão social" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">CPF / CNPJ</Label>
                  <Input placeholder="Documento" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Modalidade do Exame</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duo">Duo (2 participantes)</SelectItem>
                    <SelectItem value="trio">Trio (3 participantes)</SelectItem>
                    <SelectItem value="reconstituicao">Reconstituição Genética</SelectItem>
                    <SelectItem value="perfil">Perfil Genético Individual</SelectItem>
                    <SelectItem value="dnaja">DNAjá (Kit Auto Coleta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input placeholder="0,00" className="font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Validade do Orçamento</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button onClick={() => toast.success("Orçamento gerado! (simulação)")}>
                <Download className="mr-1 h-4 w-4" /> Gerar Orçamento PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Ofícios ─── */}
        <TabsContent value="oficios" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ofício para Fórum / Comarca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Comarca / Fórum</Label>
                  <Input placeholder="Ex: 2ª Vara de Família - São Paulo" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº do Processo</Label>
                  <Input placeholder="Nº do processo judicial" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Juiz(a) Responsável</Label>
                  <Input placeholder="Nome" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº do Caso (interno)</Label>
                  <Input placeholder="EX-2026-XXXX" />
                </div>
              </div>
              <Button onClick={() => toast.success("Ofício para fórum gerado! (simulação)")}>
                <Printer className="mr-1 h-4 w-4" /> Gerar Ofício
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ofício para Defensoria Pública</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Defensoria</Label>
                  <Input placeholder="Ex: Defensoria Pública do Estado de SP" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Defensor(a)</Label>
                  <Input placeholder="Nome do defensor" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Assistido(a)</Label>
                  <Input placeholder="Nome do assistido" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº Atendimento</Label>
                  <Input placeholder="Nº do atendimento" />
                </div>
              </div>
              <Button onClick={() => toast.success("Ofício para defensoria gerado! (simulação)")}>
                <Printer className="mr-1 h-4 w-4" /> Gerar Ofício
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentos;
