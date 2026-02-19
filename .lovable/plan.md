

# 🧬 Plataforma GenID - Gestão de Exames de Identificação Humana
## Protótipo Visual Completo

### Estilo Visual
- **Tema claro** com fundo branco/cinza claro
- **Ícones coloridos** usando Lucide React com cores temáticas (azul para DNA, verde para sucesso, âmbar para alertas, vermelho para bloqueios)
- **Design moderno** com cards arredondados, sombras suaves e gradientes sutis
- **Paleta principal**: Azul (#3B82F6) como primária, com acentos em verde, âmbar e violeta

---

### Módulo 1: Autenticação e RBAC (Mock)

**Tela de Login**
- Email + Senha com visual profissional e logo da plataforma
- Simulação de 2FA com campo OTP após login
- Seletor de perfil mock (Admin, Coletor, Triagem) para testar visões diferentes

**Dashboard Principal**
- Sidebar com navegação por módulos
- Cards resumo: exames do dia, kits vendidos, pendências
- Menu adapta-se ao perfil selecionado (itens visíveis/ocultos)

---

### Módulo 2A: DNAjá - Venda Rápida

**Tela estilo PDV**
- Campo grande para código de barras com ícone de scanner
- Data de venda preenchida automaticamente
- Campos opcionais de email/telefone
- Banner de aviso "SEM VALIDADE JUDICIAL"
- Botão "Registrar Venda" com feedback de sucesso
- Lista das últimas vendas do dia abaixo

---

### Módulo 2B: Wizard de Exames Padrão

**Etapa 1 - Tipo de Exame**
- 4 cards grandes com ícones coloridos: Duo, Trio, Reconstrução, Perfil Genético
- Seleção de finalidade: Judicial ou Particular

**Etapa 2 - Participantes**
- Formulários dinâmicos conforme tipo selecionado
- Campos: Nome, Data Nascimento, Sexo, Documento
- Status do participante: Presente / Falecido / Ausente
- Botão para abrir Simulador quando pai = Falecido

**Etapa 3 - Anamnese Clínica**
- Perguntas por participante com alertas visuais
- Validação de transplante de medula e transfusão
- Seleção de material (Sangue/Saliva)
- Bloqueio visual quando condição impeditiva é detectada

**Etapa 4 - Documentos**
- Upload simulado de documentos (RG, CPF, Certidão)
- Checklist visual do que foi enviado

**Etapa 5 - Confirmação e Termo**
- Resumo completo do caso
- Checkbox de consentimento
- Botão de finalização

**Painel Lateral de Status** (fixo durante todo o wizard)
- Progresso visual com checkmarks
- Lista de pendências em tempo real

---

### Módulo 3: Dashboard de Tendências (Informativo)

- Página com cards informativos sobre tendências DTC, OCR, IA
- Dados mock de métricas (kits vendidos, tempo médio de cadastro)
- Gráficos com Recharts mostrando volume de exames

---

### Módulo 4: Simulador de Viabilidade Genética

**Árvore Genealógica Interativa**
- Interface visual com cards de familiares arrastáveis
- Posições na árvore: Avós, Pai (falecido), Irmãos, Mãe, Filho
- Ao adicionar/remover parentes, recalcula viabilidade

**Velocímetro de Viabilidade**
- Gauge visual com 3 zonas (vermelho/amarelo/verde)
- Percentual e recomendação textual
- Sugestões de parentes adicionais para melhorar o índice

---

### Módulo 5: Gestão e Auditoria

**Lista de Exames**
- Tabela com filtros por status, tipo, data
- Badges coloridos para status (Pendente, Em Andamento, Concluído)
- Busca por código ou nome

**Log de Auditoria (Mock)**
- Timeline de ações com usuário, data, ação realizada
- Filtros por tipo de operação

---

### Páginas e Rotas
1. `/login` - Tela de login com 2FA simulado
2. `/` - Dashboard principal
3. `/dnaja` - Venda rápida de kits
4. `/exames/novo` - Wizard de cadastro de exames
5. `/exames` - Lista de exames cadastrados
6. `/simulador` - Simulador de viabilidade (também acessível dentro do wizard)
7. `/tendencias` - Relatório de tendências
8. `/auditoria` - Log de auditoria
9. `/configuracoes` - Perfil e configurações

