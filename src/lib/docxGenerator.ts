import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const HEADER_TEXT = "GN4U - Genética & Saúde";
const SUBHEADER_TEXT = "Laboratório de Identificação Humana";

function header(title: string): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: HEADER_TEXT, bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: SUBHEADER_TEXT, italics: true, size: 20 })],
      spacing: { after: 300 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: title, bold: true, size: 26 })],
      spacing: { after: 400 },
    }),
  ];
}

function field(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || "_______________________________" }),
    ],
  });
}

function paragraph(text: string, opts: { bold?: boolean; italics?: boolean } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: 200 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics })],
  });
}

function signatureBlock(): Paragraph[] {
  const today = new Date().toLocaleDateString("pt-BR");
  return [
    new Paragraph({ spacing: { before: 600, after: 200 }, alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `Local e data: _______________________, ${today}` })] }),
    new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "_______________________________________" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Assinatura", bold: true })] }),
  ];
}

async function downloadDoc(filename: string, children: Paragraph[]) {
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children,
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export async function downloadTCU(data: { nome: string; documento: string; tipoExame: string }) {
  const children = [
    ...header("TERMO DE CONSENTIMENTO UNIFICADO (TCU)"),
    field("Nome do Participante", data.nome),
    field("RG / CPF", data.documento),
    field("Tipo de Exame", data.tipoExame),
    paragraph("Eu, acima qualificado(a), declaro que fui devidamente informado(a) sobre a natureza, objetivos, procedimentos e finalidades do exame de DNA a ser realizado, bem como sobre o uso das amostras biológicas coletadas, exclusivamente para fins de identificação genética e vínculo de parentesco."),
    paragraph("Autorizo, de forma livre e esclarecida, a coleta de material biológico (swab bucal ou sangue) e a realização das análises genéticas necessárias, ciente de que os resultados serão utilizados conforme a finalidade declarada e mantidos em sigilo, em conformidade com a LGPD (Lei nº 13.709/2018)."),
    paragraph("Declaro ainda estar ciente da cadeia de custódia, da identificação por etiqueta DNAjá e do procedimento de descarte das amostras após o prazo legal de armazenamento."),
    ...signatureBlock(),
  ];
  await downloadDoc("TCU_Termo_Consentimento_Unificado.docx", children);
}

export async function downloadTRV(data: { parente: string; documento: string; parentesco: string; supostoPai: string; certidao: string }) {
  const children = [
    ...header("TERMO DE RECONSTITUIÇÃO E VERACIDADE (TRV)"),
    field("Parente Colaborador", data.parente),
    field("RG / CPF", data.documento),
    field("Grau de Parentesco", data.parentesco),
    field("Nome do Suposto Pai (Falecido)", data.supostoPai),
    field("Nº da Certidão de Óbito", data.certidao),
    paragraph("Declaro, sob as penas da lei, que sou parente biológico legítimo do investigado falecido acima identificado, conforme o grau de parentesco declarado, e que as informações por mim prestadas são verdadeiras."),
    paragraph("Autorizo a coleta de minha amostra biológica para fins de Reconstituição Genética, ciente de que minha contribuição é fundamental para a viabilidade técnica do exame post mortem, sendo o resultado calculado por índices estatísticos de inclusão/exclusão de parentesco."),
    paragraph("Comprometo-me a apresentar a documentação comprobatória do parentesco (certidões de nascimento, casamento e óbito), bem como a manter a veracidade das informações declaradas."),
    ...signatureBlock(),
  ];
  await downloadDoc("TRV_Termo_Reconstituicao_Veracidade.docx", children);
}

export async function downloadInconclusivo(data: { numCaso: string; probabilidade: string }) {
  const children = [
    ...header("DECLARAÇÃO DE RESULTADO INCONCLUSIVO"),
    field("Nº do Caso", data.numCaso),
    field("Probabilidade Obtida (%)", data.probabilidade),
    paragraph("Declaro estar ciente de que o resultado do exame de vínculo genético situa-se na denominada \"zona cinzenta\" (probabilidade entre 80% e 95%), não sendo, portanto, suficiente para presunção técnico-científica de paternidade/maternidade ou parentesco, conforme padrões internacionais (ISFG/AABB)."),
    paragraph("Estou ciente das alternativas técnicas disponíveis para elucidação do caso, tais como: (i) inclusão de novos parentes na análise (Trio, Reconstituição); (ii) ampliação do número de marcadores genéticos analisados; (iii) análise de cromossomo Y ou DNA mitocondrial, conforme aplicável."),
    paragraph("A liberação deste laudo inconclusivo segue as normas técnicas vigentes e não invalida a integridade do processo analítico realizado."),
    ...signatureBlock(),
  ];
  await downloadDoc("Declaracao_Resultado_Inconclusivo.docx", children);
}

export async function downloadCadeiaCustodia(data: { numCaso: string; perito: string; registro: string; dataColeta: string }) {
  const children = [
    ...header("DECLARAÇÃO DE CADEIA DE CUSTÓDIA"),
    field("Nº do Caso", data.numCaso),
    field("Perito Responsável", data.perito),
    field("CRBio / CRF", data.registro),
    field("Data da Coleta", data.dataColeta),
    paragraph("Declaro, na qualidade de perito responsável, que as amostras biológicas referentes ao caso acima identificado foram coletadas, identificadas, lacradas e transportadas em estrita observância aos protocolos de cadeia de custódia adotados pelo laboratório, garantindo a rastreabilidade integral desde a coleta até a análise laboratorial."),
    paragraph("Atesto que: (i) as etiquetas DNAjá foram aplicadas na presença dos participantes; (ii) os lacres de segurança foram conferidos e mantidos íntegros; (iii) o transporte ocorreu sob condições adequadas de temperatura e segurança; (iv) o registro fotográfico e documental foi realizado conforme procedimento operacional padrão (POP)."),
    paragraph("A presente declaração tem por finalidade comprovar a integridade do material biológico processado, conferindo validade técnica e jurídica aos resultados obtidos."),
    ...signatureBlock(),
  ];
  await downloadDoc("Declaracao_Cadeia_Custodia.docx", children);
}

export async function downloadDesistencia(data: { ausente: string; numCaso: string; dataAgendada: string; motivo: string }) {
  const children = [
    ...header("DECLARAÇÃO DE DESISTÊNCIA / NÃO COMPARECIMENTO"),
    field("Nome do Ausente", data.ausente),
    field("Nº do Caso / Processo", data.numCaso),
    field("Data Agendada", data.dataAgendada),
    field("Motivo", data.motivo),
    paragraph("Declaro, para os devidos fins, que a parte acima identificada NÃO COMPARECEU à coleta de material biológico previamente agendada na data informada, ou manifestou expressamente sua desistência do procedimento."),
    paragraph("O laboratório aguardou em ambiente adequado, com equipe técnica preparada, conforme protocolo, sendo registradas as tentativas de contato e reagendamento. A ausência injustificada poderá ensejar: (i) cobrança da taxa de comparecimento; (ii) comunicação ao juízo solicitante (em casos judiciais); (iii) arquivamento do procedimento por desistência tácita."),
    paragraph("A presente declaração é emitida para fins de comprovação junto às partes interessadas, advogados, defensores públicos e/ou autoridades judiciais."),
    ...signatureBlock(),
  ];
  await downloadDoc("Declaracao_Desistencia_Nao_Comparecimento.docx", children);
}
