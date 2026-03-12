import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, X, Dna, Tag } from "lucide-react";

interface FichaParticipant {
  role: string;
  colorClass: string; // e.g. "pai", "mae", "filho"
  name?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  naturalDe?: string;
  sex?: string;
}

interface FichaDNAjaProps {
  examType: "duo" | "trio" | "reconstituicao";
  modality: "judicial" | "particular";
  participants: FichaParticipant[];
  onClose: () => void;
  processNumber?: string;
  comarca?: string;
}

const SECTION_STYLES: Record<string, { headerBg: string; borderColor: string; labelColor: string; inputBorder: string; bgGradient: string }> = {
  pai: {
    headerBg: "bg-[hsl(217,91%,60%)]",
    borderColor: "border-[hsl(217,91%,60%)]",
    labelColor: "text-[hsl(224,76%,48%)]",
    inputBorder: "border-[hsl(217,91%,60%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(214,100%,97%)] to-white",
  },
  mae: {
    headerBg: "bg-[hsl(330,81%,60%)]",
    borderColor: "border-[hsl(330,81%,60%)]",
    labelColor: "text-[hsl(336,78%,43%)]",
    inputBorder: "border-[hsl(330,81%,60%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(326,78%,95%)] to-white",
  },
  filho: {
    headerBg: "bg-[hsl(160,84%,39%)]",
    borderColor: "border-[hsl(160,84%,39%)]",
    labelColor: "text-[hsl(162,83%,24%)]",
    inputBorder: "border-[hsl(160,84%,39%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(138,76%,97%)] to-white",
  },
  parente: {
    headerBg: "bg-[hsl(199,89%,48%)]",
    borderColor: "border-[hsl(199,89%,48%)]",
    labelColor: "text-[hsl(200,98%,39%)]",
    inputBorder: "border-[hsl(199,89%,48%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(199,100%,97%)] to-white",
  },
  judicial: {
    headerBg: "bg-[hsl(220,9%,46%)]",
    borderColor: "border-[hsl(220,9%,46%)]",
    labelColor: "text-[hsl(215,14%,34%)]",
    inputBorder: "border-[hsl(220,9%,46%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(210,20%,98%)] to-white",
  },
  coleta: {
    headerBg: "bg-[hsl(25,95%,53%)]",
    borderColor: "border-[hsl(25,95%,53%)]",
    labelColor: "text-[hsl(20,91%,42%)]",
    inputBorder: "border-[hsl(25,95%,53%)]",
    bgGradient: "bg-gradient-to-r from-[hsl(33,100%,96%)] to-white",
  },
};

const getRoleStyle = (role: string): string => {
  const lower = role.toLowerCase();
  if (lower.includes("pai") && !lower.includes("mãe")) return "pai";
  if (lower.includes("mãe") || lower.includes("mae")) return "mae";
  if (lower.includes("filho") || lower.includes("filha") || lower.includes("investigante")) return "filho";
  return "parente";
};

const getRoleEmoji = (role: string): string => {
  const lower = role.toLowerCase();
  if (lower.includes("suposto pai")) return "👨";
  if (lower.includes("mãe") || lower.includes("mae")) return "👩";
  if (lower.includes("filho") || lower.includes("filha")) return "👶";
  if (lower.includes("avô") || lower.includes("avo")) return "👴";
  if (lower.includes("avó")) return "👵";
  if (lower.includes("irmão") || lower.includes("irmao")) return "👨‍🦱";
  if (lower.includes("irmã") || lower.includes("irma")) return "👩‍🦱";
  return "👤";
};

export function FichaDNAja({ examType, modality, participants, onClose, processNumber, comarca }: FichaDNAjaProps) {
  const [etiqueta, setEtiqueta] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const examLabel = examType === "duo" ? "DUO (Filho + Suposto Pai)" : examType === "trio" ? "TRIO (Filho + Mãe + Suposto Pai)" : "RECONSTITUIÇÃO";

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background/95 print:relative print:bg-white">
      {/* Print controls - hidden on print */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4 print:hidden">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Dna className="h-5 w-5 text-primary" /> Ficha de Cadastro DNAjá
        </h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={printRef} className="mx-auto max-w-4xl p-6 print:p-0 print:max-w-none">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(224,76%,33%)] to-[hsl(217,91%,60%)] p-6 text-center text-white mb-6 print:rounded-none">
          <h1 className="text-2xl font-bold tracking-wide">🧬 INVESTIGAÇÃO DE VÍNCULO GENÉTICO</h1>
          <p className="mt-2 text-sm opacity-90">GRALAB BIOMOL - DNAJA®</p>
        </div>

        {/* Etiqueta DNAjá */}
        <div className="mb-6 rounded-lg border-2 border-dashed border-primary p-6 text-center bg-muted/30">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tag className="h-5 w-5 text-primary" />
            <strong className="text-primary text-sm">COLE AQUI ETIQUETA DNAJA</strong>
          </div>
          <div className="inline-block rounded-md border-2 border-primary bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Código do Kit:</p>
            <Input
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
              placeholder="DNAJA-2025-XXXXX"
              className="text-center font-mono text-lg font-bold text-success border-primary/30 max-w-[250px]"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">TODOS OS DADOS SÃO IMPRESCINDÍVEIS</p>
        </div>

        {/* Modalidade Panel */}
        <div className="mb-6 rounded-xl border-2 border-primary bg-muted/20 p-6">
          <p className="text-center font-bold text-primary text-base mb-4">🧬 SELEÇÃO DE MODALIDADE DO EXAME</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-center font-semibold text-sm uppercase tracking-wide text-muted-foreground">📊 Tipo de Exame</p>
              <div className="flex justify-center">
                <Badge variant="outline" className={`px-6 py-2 text-sm font-bold ${examType === "duo" ? "border-warning bg-warning/10 text-warning" : examType === "trio" ? "border-[hsl(330,81%,60%)] bg-[hsl(330,81%,60%)]/10 text-[hsl(330,81%,60%)]" : "border-info bg-info/10 text-info"}`}>
                  {examLabel}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-center font-semibold text-sm uppercase tracking-wide text-muted-foreground">📑 Modalidade</p>
              <div className="flex justify-center">
                <Badge variant="outline" className={`px-6 py-2 text-sm font-bold ${modality === "particular" ? "border-success bg-success/10 text-success" : "border-primary bg-primary/10 text-primary"}`}>
                  {modality === "particular" ? "👤 PARTICULAR" : "⚖️ JUDICIAL"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Judicial Section */}
        {modality === "judicial" && (
          <div className={`mb-6 rounded-lg border-2 overflow-hidden ${SECTION_STYLES.judicial.borderColor} ${SECTION_STYLES.judicial.bgGradient}`}>
            <div className={`${SECTION_STYLES.judicial.headerBg} px-5 py-3 text-white font-bold flex items-center gap-2`}>
              ⚖️ DADOS JUDICIAIS
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Número do Processo:</Label>
                  <Input defaultValue={processNumber} className={SECTION_STYLES.judicial.inputBorder} />
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Comarca:</Label>
                  <Input defaultValue={comarca} className={SECTION_STYLES.judicial.inputBorder} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Vara/Juízo:</Label>
                  <Input className={SECTION_STYLES.judicial.inputBorder} />
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>UF:</Label>
                  <Input maxLength={2} className={SECTION_STYLES.judicial.inputBorder} />
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Ofício/Mandado nº:</Label>
                  <Input className={SECTION_STYLES.judicial.inputBorder} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Data do Ofício:</Label>
                  <Input type="date" className={SECTION_STYLES.judicial.inputBorder} />
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.judicial.labelColor}`}>Nome do Juiz:</Label>
                  <Input className={SECTION_STYLES.judicial.inputBorder} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Participant Sections */}
        {participants.map((p, idx) => {
          const styleKey = getRoleStyle(p.role);
          const styles = SECTION_STYLES[styleKey];
          const emoji = getRoleEmoji(p.role);

          return (
            <div key={idx} className={`mb-6 rounded-lg border-2 overflow-hidden ${styles.borderColor} ${styles.bgGradient} print:break-inside-avoid`}>
              <div className={`${styles.headerBg} px-5 py-3 text-white font-bold flex items-center gap-2 text-base`}>
                <span className="text-lg">{emoji}</span> {p.role.toUpperCase()}
              </div>
              <div className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>Nome completo:</Label>
                    <Input defaultValue={p.name} className={styles.inputBorder} />
                  </div>
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>📞 Telefone:</Label>
                    <Input defaultValue={p.phone} className={styles.inputBorder} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>📧 E-mail:</Label>
                    <Input defaultValue={p.email} className={styles.inputBorder} />
                  </div>
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>🆔 CPF:</Label>
                    <Input defaultValue={p.cpf} className={styles.inputBorder} />
                  </div>
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>🪪 RG:</Label>
                    <Input defaultValue={p.rg} className={styles.inputBorder} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>📅 Data de nascimento:</Label>
                    <Input type="date" defaultValue={p.birthDate} className={styles.inputBorder} />
                  </div>
                  <div className="space-y-1">
                    <Label className={`text-xs font-bold ${styles.labelColor}`}>🌍 Natural de:</Label>
                    <Input defaultValue={p.naturalDe} className={styles.inputBorder} />
                  </div>
                  {styleKey === "filho" && (
                    <div className="space-y-1">
                      <Label className={`text-xs font-bold ${styles.labelColor}`}>Sexo:</Label>
                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`sexo_${idx}`} /> F</label>
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`sexo_${idx}`} /> M</label>
                      </div>
                    </div>
                  )}
                </div>
                {(styleKey === "pai" || styleKey === "mae") && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className={`text-xs font-bold ${styles.labelColor}`}>
                        Tem parentesco com {styleKey === "pai" ? "a mãe" : "o suposto pai"}?
                      </Label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`parentesco_${idx}`} /> Não</label>
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`parentesco_${idx}`} /> Sim. Qual?</label>
                        <Input placeholder="Especificar" className={`max-w-[150px] ${styles.inputBorder}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className={`text-xs font-bold ${styles.labelColor}`}>Transplante de medula óssea?</Label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`transplante_${idx}`} /> Não</label>
                        <label className="flex items-center gap-1.5 text-sm"><input type="radio" name={`transplante_${idx}`} /> Sim</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div className={`mt-4 rounded-lg border-2 p-4 ${styles.borderColor}`} style={{ background: "rgba(0,0,0,0.02)" }}>
                  <p className={`text-center font-bold text-sm mb-2 ${styles.labelColor}`}>✍️ DECLARAÇÃO</p>
                  <p className="text-xs text-muted-foreground text-justify mb-3">
                    Eu autorizo a coleta de amostra do meu sangue ou saliva para fazer o exame de DNA (teste de paternidade).
                    Assumo total responsabilidade por esta decisão e confirmo que todas as informações que forneci são verdadeiras.
                  </p>
                  <p className="text-[10px] text-muted-foreground mb-3 italic">
                    (Se menor de 18 anos, a assinatura deve ser do responsável legal).
                  </p>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20 p-4 text-center min-h-[70px]">
                      <p className="text-xs font-bold">Assinatura - {p.role}</p>
                    </div>
                    {modality === "judicial" && (
                      <div className="text-center">
                        <p className="text-[10px] font-bold mb-1">👆 Impressão digital</p>
                        <div className="w-[75px] h-[75px] border-2 border-muted-foreground/30 rounded bg-card" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Coleta Section */}
        <div className={`mb-6 rounded-lg border-2 overflow-hidden ${SECTION_STYLES.coleta.borderColor} ${SECTION_STYLES.coleta.bgGradient} print:break-inside-avoid`}>
          <div className={`${SECTION_STYLES.coleta.headerBg} px-5 py-3 text-white font-bold flex items-center gap-2`}>
            🩸 DADOS DA COLETA
          </div>
          <div className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className={`text-xs font-bold ${SECTION_STYLES.coleta.labelColor}`}>Data da Coleta:</Label>
                <Input type="date" className={SECTION_STYLES.coleta.inputBorder} />
              </div>
              <div className="space-y-1">
                <Label className={`text-xs font-bold ${SECTION_STYLES.coleta.labelColor}`}>Hora:</Label>
                <Input type="time" className={SECTION_STYLES.coleta.inputBorder} />
              </div>
              <div className="space-y-1">
                <Label className={`text-xs font-bold ${SECTION_STYLES.coleta.labelColor}`}>Local:</Label>
                <Input className={SECTION_STYLES.coleta.inputBorder} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className={`text-xs font-bold ${SECTION_STYLES.coleta.labelColor}`}>Tipo de Amostra:</Label>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="amostra" /> 🩸 Sangue</label>
                <label className="flex items-center gap-1.5 text-sm"><input type="radio" name="amostra" /> 💧 Saliva (Swab Bucal)</label>
              </div>
            </div>
            <div className={`mt-4 rounded-lg border-2 p-4 ${SECTION_STYLES.coleta.borderColor}`} style={{ background: "rgba(0,0,0,0.02)" }}>
              <p className={`text-center font-bold text-sm mb-2 ${SECTION_STYLES.coleta.labelColor}`}>✍️ ASSINATURA DO COLETOR</p>
              <div className="flex gap-4 items-end">
                <div className="flex-1 rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20 p-4 text-center min-h-[70px]">
                  <p className="text-xs font-bold">Assinatura do Responsável pela Coleta</p>
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${SECTION_STYLES.coleta.labelColor}`}>CRF/CRBio:</Label>
                  <Input className={`max-w-[150px] ${SECTION_STYLES.coleta.inputBorder}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-lg border bg-muted/30 p-4 text-center text-xs text-muted-foreground print:break-inside-avoid">
          <p>GRALAB BIOMOL - DNAJA® | Documento gerado pelo sistema DNAjá</p>
          <p>Este documento é parte integrante do processo de investigação de vínculo genético.</p>
        </div>
      </div>
    </div>
  );
}
