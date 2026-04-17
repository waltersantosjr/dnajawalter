import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Receipt, Building2, Shield, Printer,
  Download, FileType, Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import {
  downloadTCU, downloadTRV, downloadInconclusivo,
  downloadCadeiaCustodia, downloadDesistencia,
} from "@/lib/docxGenerator";

const Documentos = () => {
  const [activeTab, setActiveTab] = useState("declaracoes");

  // TCU
  const [tcu, setTcu] = useState({ nome: "", documento: "", tipoExame: "" });
  // TRV
  const [trv, setTrv] = useState({ parente: "", documento: "", parentesco: "", supostoPai: "", certidao: "" });
  // Inconclusivo
  const [inc, setInc] = useState({ numCaso: "", probabilidade: "" });
  // Cadeia de Custódia
  const [cad, setCad] = useState({ numCaso: "", perito: "", registro: "", dataColeta: "" });
  // Desistência
  const [des, setDes] = useState({ ausente: "", numCaso: "", dataAgendada: "", motivo: "" });

  const handleDownload = async (fn: () => Promise<void>, name: string) => {
    try {
      await fn();
      toast.success(`${name} baixado em Word!`);
    } catch {
      toast.error("Erro ao gerar documento");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" /> Documentos e Orçamentos
        </h1>
        <p className="text-muted-foreground">Gere declarações, orçamentos, ofícios e documentos personalizados</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="declaracoes"><Shield className="mr-1 h-4 w-4" /> Declarações</TabsTrigger>
          <TabsTrigger value="orcamentos"><Receipt className="mr-1 h-4 w-4" /> Orçamentos</TabsTrigger>
          <TabsTrigger value="oficios"><Building2 className="mr-1 h-4 w-4" /> Ofícios</TabsTrigger>
          <TabsTrigger value="personalizado"><Briefcase className="mr-1 h-4 w-4" /> Personalizado</TabsTrigger>
        </TabsList>

        {/* Declarações */}
        <TabsContent value="declaracoes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Termo de Consentimento Unificado (TCU)</CardTitle>
              <CardDescription>Para exames Duo/Trio com pais vivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Nome do Participante</Label><Input placeholder="Nome completo" value={tcu.nome} onChange={(e) => setTcu({ ...tcu, nome: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">RG / CPF</Label><Input placeholder="Documento" value={tcu.documento} onChange={(e) => setTcu({ ...tcu, documento: e.target.value })} /></div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo de Exame</Label>
                <Select value={tcu.tipoExame} onValueChange={(v) => setTcu({ ...tcu, tipoExame: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent><SelectItem value="Duo">Duo</SelectItem><SelectItem value="Trio">Trio</SelectItem><SelectItem value="Reconstituição">Reconstituição</SelectItem><SelectItem value="Irmandade">Irmandade</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("TCU gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar TCU</Button>
                <Button variant="outline" onClick={() => handleDownload(() => downloadTCU(tcu), "TCU")}><FileType className="mr-1 h-4 w-4" /> Baixar Word</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Termo de Reconstituição e Veracidade (TRV)</CardTitle>
              <CardDescription>Para reconstituição genética</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Parente Colaborador</Label><Input placeholder="Nome completo" value={trv.parente} onChange={(e) => setTrv({ ...trv, parente: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">RG / CPF</Label><Input placeholder="Documento" value={trv.documento} onChange={(e) => setTrv({ ...trv, documento: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Grau de Parentesco</Label><Input placeholder="Ex: Irmão germano" value={trv.parentesco} onChange={(e) => setTrv({ ...trv, parentesco: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Nome do Suposto Pai Falecido</Label><Input placeholder="Nome completo" value={trv.supostoPai} onChange={(e) => setTrv({ ...trv, supostoPai: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label className="text-xs">Nº Certidão de Óbito</Label><Input placeholder="Número da certidão" value={trv.certidao} onChange={(e) => setTrv({ ...trv, certidao: e.target.value })} /></div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("TRV gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar TRV</Button>
                <Button variant="outline" onClick={() => handleDownload(() => downloadTRV(trv), "TRV")}><FileType className="mr-1 h-4 w-4" /> Baixar Word</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Declaração de Resultado Inconclusivo</CardTitle>
              <CardDescription>Para cenários sem índice conclusivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Nº do Caso</Label><Input placeholder="EX-2026-XXXX" value={inc.numCaso} onChange={(e) => setInc({ ...inc, numCaso: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Probabilidade Obtida (%)</Label><Input placeholder="Ex: 87,5" value={inc.probabilidade} onChange={(e) => setInc({ ...inc, probabilidade: e.target.value })} /></div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-3 rounded-md">"Declaro estar ciente de que o resultado situa-se na zona cinzenta (80-95%), não sendo suficiente para presunção de paternidade."</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Declaração gerada!")}><Printer className="mr-1 h-4 w-4" /> Gerar Declaração</Button>
                <Button variant="outline" onClick={() => handleDownload(() => downloadInconclusivo(inc), "Declaração")}><FileType className="mr-1 h-4 w-4" /> Baixar Word</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Declaração de Cadeia de Custódia</CardTitle>
              <CardDescription>Comprova a integridade das amostras coletadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Nº do Caso</Label><Input placeholder="EX-2026-XXXX" value={cad.numCaso} onChange={(e) => setCad({ ...cad, numCaso: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Perito Responsável</Label><Input placeholder="Nome do perito" value={cad.perito} onChange={(e) => setCad({ ...cad, perito: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">CRBio / CRF</Label><Input placeholder="Registro profissional" value={cad.registro} onChange={(e) => setCad({ ...cad, registro: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Data da Coleta</Label><Input type="date" value={cad.dataColeta} onChange={(e) => setCad({ ...cad, dataColeta: e.target.value })} /></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Declaração de Cadeia de Custódia gerada!")}><Printer className="mr-1 h-4 w-4" /> Gerar Declaração</Button>
                <Button variant="outline" onClick={() => handleDownload(() => downloadCadeiaCustodia(cad), "Cadeia de Custódia")}><FileType className="mr-1 h-4 w-4" /> Baixar Word</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Declaração de Desistência / Não Comparecimento</CardTitle>
              <CardDescription>Quando uma das partes não comparece à coleta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Nome do Ausente</Label><Input placeholder="Nome completo" value={des.ausente} onChange={(e) => setDes({ ...des, ausente: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Nº do Caso / Processo</Label><Input placeholder="EX-2026-XXXX" value={des.numCaso} onChange={(e) => setDes({ ...des, numCaso: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Data Agendada</Label><Input type="date" value={des.dataAgendada} onChange={(e) => setDes({ ...des, dataAgendada: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Motivo</Label><Input placeholder="Não compareceu / Desistência" value={des.motivo} onChange={(e) => setDes({ ...des, motivo: e.target.value })} /></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Declaração gerada!")}><Printer className="mr-1 h-4 w-4" /> Gerar Declaração</Button>
                <Button variant="outline" onClick={() => handleDownload(() => downloadDesistencia(des), "Desistência")}><FileType className="mr-1 h-4 w-4" /> Baixar Word</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orçamentos */}
        <TabsContent value="orcamentos" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Gerar Orçamento</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Cliente</Label><Input placeholder="Nome ou razão social" /></div>
                <div className="space-y-1"><Label className="text-xs">CPF / CNPJ</Label><Input placeholder="Documento" /></div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Modalidade do Exame</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duo">Duo</SelectItem><SelectItem value="trio">Trio</SelectItem>
                    <SelectItem value="reconstituicao">Reconstituição</SelectItem><SelectItem value="perfil">Perfil Individual</SelectItem>
                    <SelectItem value="dnaja">DNAjá</SelectItem><SelectItem value="ipm">IPM (Post Mortem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Valor (R$)</Label><Input placeholder="0,00" className="font-mono" /></div>
                <div className="space-y-1"><Label className="text-xs">Validade</Label><Input type="date" /></div>
              </div>
              <Button onClick={() => toast.success("Orçamento gerado!")}><Download className="mr-1 h-4 w-4" /> Gerar PDF</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ofícios */}
        <TabsContent value="oficios" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Ofício para Fórum / Comarca</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Comarca / Fórum</Label><Input placeholder="Ex: 2ª Vara de Família" /></div>
                <div className="space-y-1"><Label className="text-xs">Nº do Processo</Label><Input placeholder="Nº processo" /></div>
                <div className="space-y-1"><Label className="text-xs">Juiz(a)</Label><Input placeholder="Nome" /></div>
                <div className="space-y-1"><Label className="text-xs">Nº Caso (interno)</Label><Input placeholder="EX-2026-XXXX" /></div>
              </div>
              <Button onClick={() => toast.success("Ofício gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar Ofício</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Ofício para Defensoria Pública</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs">Defensoria</Label><Input placeholder="Ex: Defensoria Pública do Estado de SP" /></div>
                <div className="space-y-1"><Label className="text-xs">Defensor(a)</Label><Input placeholder="Nome" /></div>
                <div className="space-y-1"><Label className="text-xs">Assistido(a)</Label><Input placeholder="Nome do assistido" /></div>
                <div className="space-y-1"><Label className="text-xs">Nº Atendimento</Label><Input placeholder="Nº" /></div>
              </div>
              <Button onClick={() => toast.success("Ofício gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar Ofício</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalizado */}
        <TabsContent value="personalizado" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-5 w-5 text-chart-4" /> Gerador de Documento Personalizado</CardTitle>
              <CardDescription>Crie ofícios, petições e documentos personalizados com todos os dados necessários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs font-semibold">Nome Completo do Requerente</Label><Input placeholder="Nome completo" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">CPF do Requerente</Label><Input placeholder="000.000.000-00" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Nome do Advogado(a)</Label><Input placeholder="Dr./Dra. Nome Completo" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">OAB do Advogado</Label><Input placeholder="OAB/SP 000.000" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Comarca</Label><Input placeholder="Ex: São Paulo/SP" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Vara</Label><Input placeholder="Ex: 2ª Vara de Família" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Nº do Processo</Label><Input placeholder="0000000-00.0000.0.00.0000" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Nº do Ofício</Label><Input placeholder="Ofício nº 000/2026" /></div>
              </div>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label className="text-xs font-semibold">Nome do Juiz(a)</Label><Input placeholder="Exmo(a). Dr(a)." /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Nome do Perito Nomeado</Label><Input placeholder="Nome do perito" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">CRBio / CRF do Perito</Label><Input placeholder="Registro profissional" /></div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Laboratório</Label><Input placeholder="Nome do laboratório" /></div>
              </div>

              <Separator />

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Tipo de Documento</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oficio_perito">Ofício de Cadastro de Perito</SelectItem>
                    <SelectItem value="oficio_resultado">Ofício de Encaminhamento de Resultado</SelectItem>
                    <SelectItem value="peticao_dna">Petição para Exame de DNA</SelectItem>
                    <SelectItem value="peticao_ipm">Petição para Exumação (IPM)</SelectItem>
                    <SelectItem value="certidao_coleta">Certidão de Coleta</SelectItem>
                    <SelectItem value="declaracao_perito">Declaração do Perito</SelectItem>
                    <SelectItem value="intimacao">Intimação para Coleta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Observações / Corpo do Documento</Label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]" placeholder="Texto adicional ou corpo do documento..." />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => toast.success("Documento personalizado gerado!")}><Printer className="mr-1 h-4 w-4" /> Gerar Documento</Button>
                <Button variant="outline" onClick={() => toast.success("PDF baixado!")}><Download className="mr-1 h-4 w-4" /> Baixar PDF</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentos;
