/**
 * CRM de candidatos — Investidor Protegido
 *
 * Recebe o formulário de qualificação da landing e grava em duas abas:
 *   Respostas — registro cru, ninguém edita
 *   Esteira   — onde você trabalha (etapa, score, responsável, próximo passo)
 *
 * COMO INSTALAR
 *   1. Na planilha: Extensões > Apps Script
 *   2. Cole este arquivo inteiro, salve
 *   3. Rode a função `instalar` uma vez (autorize quando pedir)
 *   4. Implantar > Nova implantação > Tipo: App da Web
 *        Executar como: Eu
 *        Quem tem acesso: Qualquer pessoa
 *   5. Copie a URL gerada e coloque na variável de ambiente
 *      SHEETS_WEBHOOK_URL do site
 */

const PLANILHA_ID = '1kk3TUYySfHlqQyJ6RirSpCvs1Hfwekgwa2fxvlvAmRQ';

const ABA_RESPOSTAS = 'Respostas';
const ABA_ESTEIRA = 'Esteira';
const ABA_CONFIG = 'Config';

const ETAPAS = [
  'Novo', 'Em triagem', 'Qualificado', 'Não qualificado', 'Contato feito',
  'Conversa agendada', 'Entrevista realizada', 'Aprovado', 'Reprovado',
  'Sem retorno', 'Desistiu',
];

const PROXIMOS_PASSOS = [
  'Ligar', 'Mandar WhatsApp', 'Enviar e-mail', 'Agendar conversa',
  'Aguardar retorno', 'Nenhum',
];

const RESULTADOS = [
  'Atendeu · com interesse', 'Atendeu · sem interesse', 'Não atendeu',
  'Caixa postal', 'Número inválido',
];

const CABECALHO = [
  'ID', 'Entrada', 'Etapa', 'Score', 'Faixa', 'Responsável', 'Próximo passo',
  'Quando', 'Resultado do contato', 'Observações',
  'Nome', 'WhatsApp', 'Telefone', 'E-mail', 'Cidade', 'Estado', 'Idade',
  'LinkedIn', 'Instagram',
  'Atua com', 'Outra atuação', 'Tempo de vendas', 'Já trabalhou com',
  'Tem carteira', 'Tamanho da carteira', 'Certificações', 'Horas por semana',
  'Veículo', 'Notebook', 'Treinamentos', 'Renda atual', 'Meta em 12 meses',
  'Motivação', 'Autoavaliação',
];

/* ============================================================
   RECEBE O FORMULÁRIO
   ============================================================ */

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(30000); // evita duas submissões gravarem na mesma linha

  try {
    const dados = JSON.parse(e.postData.contents);
    const pessoais = dados.dadosPessoais || {};
    const local = dados.localizacaoRedes || {};
    const q = dados.qualificacao || {};

    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    const esteira = planilha.getSheetByName(ABA_ESTEIRA);
    const respostas = planilha.getSheetByName(ABA_RESPOSTAS);

    if (!esteira || !respostas) {
      return json({ ok: false, erro: 'Rode a função instalar() antes de receber envios.' });
    }

    const agora = new Date();
    const id = proximoId(esteira);
    const score = calcularScore(q);

    esteira.appendRow([
      id,
      agora,
      'Novo',
      score,
      faixa(score),
      '', '', '', '', '',                     // responsável, próximo passo, quando, resultado, observações
      pessoais.nome || '',
      pessoais.whatsapp || '',
      pessoais.telefone || '',
      pessoais.email || '',
      local.cidade || '',
      local.estado || '',
      pessoais.idade || '',
      local.linkedin || '',
      local.instagram || '',
      lista(q.atuacaoAtual),
      q.outraAtuacao || '',
      q.tempoExperienciaComercial || '',
      lista(q.areasExperiencia),
      q.possuiCarteira || '',
      q.quantidadeClientes || '',
      lista(q.certificacoes),
      q.horasSemanais || '',
      q.veiculoProprio || '',
      q.possuiNotebook || '',
      q.participaTreinamentos || '',
      q.rendaAtual || '',
      q.rendaDesejada12Meses || '',
      q.maiorMotivacao || '',
      q.habilidadeComercial || '',
    ]);

    // Registro cru, para conferência
    respostas.appendRow([agora, id, e.postData.contents]);

    return json({ ok: true, id: id, score: score });
  } catch (erro) {
    // Guarda o erro na aba de respostas para você conseguir investigar depois
    try {
      SpreadsheetApp.openById(PLANILHA_ID)
        .getSheetByName(ABA_RESPOSTAS)
        .appendRow([new Date(), 'ERRO', String(erro)]);
    } catch (ignorado) {}
    return json({ ok: false, erro: String(erro) });
  } finally {
    trava.releaseLock();
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function lista(valor) {
  return Array.isArray(valor) ? valor.join('; ') : (valor || '');
}

function proximoId(esteira) {
  const linhas = Math.max(0, esteira.getLastRow() - 1); // desconta o cabeçalho
  return 'IP-' + String(linhas + 1).padStart(4, '0');
}

/* ============================================================
   SCORE — 0 a 100
   ============================================================ */

function calcularScore(q) {
  let total = 0;

  // Tempo de vendas — 20
  total += ({
    'Nunca vendi': 0, 'Menos de 1 ano': 5, 'De 1 a 3 anos': 10,
    'De 3 a 5 anos': 15, 'Mais de 5 anos': 20,
  })[q.tempoExperienciaComercial] || 0;

  // Carteira de clientes — 20
  if (q.possuiCarteira === 'Sim') {
    total += 8 + (({
      'Até 20': 2, 'De 21 a 50': 5, 'De 51 a 100': 8,
      'De 101 a 300': 10, 'Mais de 300': 12,
    })[q.quantidadeClientes] || 0);
  }

  // Certificações — 15 (5 por certificação; "Nenhuma" não conta)
  const certs = (q.certificacoes || []).filter(function (c) { return c !== 'Nenhuma'; });
  total += Math.min(15, certs.length * 5);

  // Horas por semana — 15
  total += ({
    'Até 10 horas por semana': 3, 'De 11 a 20 horas': 6, 'De 21 a 30 horas': 9,
    'De 31 a 40 horas': 12, 'Mais de 40 horas': 15,
  })[q.horasSemanais] || 0;

  // Aderência de área — 10 (5 por área relevante, olhando atuação e histórico)
  const relevantes = ['Mercado financeiro', 'Consórcio', 'Seguro', 'Previdência', 'Investimentos'];
  const areas = (q.atuacaoAtual || []).concat(q.areasExperiencia || []);
  const encontradas = relevantes.filter(function (r) { return areas.indexOf(r) !== -1; });
  total += Math.min(10, encontradas.length * 5);

  // Autoavaliação — 10 (a nota de 0 a 10 vale 1 ponto cada)
  total += Math.min(10, Number(q.habilidadeComercial) || 0);

  // Estrutura — 10
  if (q.veiculoProprio === 'Sim') total += 3;
  if (q.possuiNotebook === 'Sim') total += 3;
  if (q.participaTreinamentos === 'Sim') total += 4;

  return Math.min(100, total);
}

function faixa(score) {
  if (score >= 70) return 'A';
  if (score >= 45) return 'B';
  return 'C';
}

/* ============================================================
   INSTALAÇÃO — rode uma vez
   ============================================================ */

/**
 * Cria as três abas com cabeçalho, cores e listas suspensas.
 * Roda uma vez. Se já houver candidato gravado, se recusa a rodar —
 * porque montar as abas apaga o conteúdo existente.
 */
function instalar() {
  const planilha = SpreadsheetApp.openById(PLANILHA_ID);
  const jaExiste = planilha.getSheetByName(ABA_ESTEIRA);

  if (jaExiste && jaExiste.getLastRow() > 1) {
    const qtd = jaExiste.getLastRow() - 1;
    throw new Error(
      'A aba Esteira já tem ' + qtd + ' candidato(s). O instalar() apagaria todos. ' +
      'Se você quer mesmo recomeçar do zero, rode reinstalarDoZero().'
    );
  }

  montarTudo(planilha);
  Logger.log('Pronto. Agora implante como App da Web e use a URL no SHEETS_WEBHOOK_URL.');
}

/**
 * Refaz as abas mesmo que já existam candidatos. APAGA TUDO.
 * Só use se quiser realmente zerar a base.
 */
function reinstalarDoZero() {
  montarTudo(SpreadsheetApp.openById(PLANILHA_ID));
  Logger.log('Abas recriadas do zero. Os candidatos anteriores foram apagados.');
}

function montarTudo(planilha) {
  montarEsteira(aba(planilha, ABA_ESTEIRA));
  montarRespostas(aba(planilha, ABA_RESPOSTAS));
  montarConfig(aba(planilha, ABA_CONFIG));
  SpreadsheetApp.flush();
}

function aba(planilha, nome) {
  return planilha.getSheetByName(nome) || planilha.insertSheet(nome);
}

function montarEsteira(s) {
  s.clear();
  s.setConditionalFormatRules([]); // zera regras antigas, para instalar() poder rodar de novo
  s.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);

  const cab = s.getRange(1, 1, 1, CABECALHO.length);
  cab.setFontWeight('bold').setFontSize(10)
     .setBackground('#14140F').setFontColor('#FFD400')
     .setVerticalAlignment('middle');
  s.setRowHeight(1, 34);
  s.setFrozenRows(1);
  s.setFrozenColumns(3); // ID, Entrada, Etapa ficam sempre à vista

  // Faixas de cor por bloco, no cabeçalho
  s.getRange(1, 11, 1, 9).setBackground('#1E3A52');  // Contato   (K–S)
  s.getRange(1, 20, 1, 15).setBackground('#1E4034'); // Qualificação (T–AH)

  // Listas suspensas
  suspensa(s, 3, ETAPAS);           // C · Etapa
  suspensa(s, 7, PROXIMOS_PASSOS);  // G · Próximo passo
  suspensa(s, 9, RESULTADOS);       // I · Resultado do contato

  s.getRange('B2:B').setNumberFormat('dd/mm/yyyy hh:mm');
  s.getRange('H2:H').setNumberFormat('dd/mm/yyyy');

  pintarEtapas(s);
  pintarFaixas(s);
  larguras(s);
}

function suspensa(s, coluna, valores) {
  const regra = SpreadsheetApp.newDataValidation()
    .requireValueInList(valores, true)
    .setAllowInvalid(false)
    .build();
  s.getRange(2, coluna, s.getMaxRows() - 1, 1).setDataValidation(regra);
}

function pintarEtapas(s) {
  const cores = {
    'Novo': '#EEF0F2', 'Em triagem': '#F6EDD9', 'Qualificado': '#DDEFE4',
    'Não qualificado': '#F5DEDB', 'Contato feito': '#DCE8F3',
    'Conversa agendada': '#E4E0F2', 'Entrevista realizada': '#EEE1F3',
    'Aprovado': '#CDEBD8', 'Reprovado': '#F5DEDB',
    'Sem retorno': '#F3EED4', 'Desistiu': '#EAEAE5',
  };
  const alvo = s.getRange(2, 3, s.getMaxRows() - 1, 1);
  const regras = Object.keys(cores).map(function (etapa) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(etapa)
      .setBackground(cores[etapa])
      .setRanges([alvo])
      .build();
  });
  s.setConditionalFormatRules(s.getConditionalFormatRules().concat(regras));
}

function pintarFaixas(s) {
  const alvo = s.getRange(2, 5, s.getMaxRows() - 1, 1); // E · Faixa
  const cores = { 'A': '#CDEBD8', 'B': '#F6EDD9', 'C': '#EEF0F2' };
  const regras = Object.keys(cores).map(function (letra) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(letra)
      .setBackground(cores[letra])
      .setBold(true)
      .setRanges([alvo])
      .build();
  });
  s.setConditionalFormatRules(s.getConditionalFormatRules().concat(regras));
}

function larguras(s) {
  const w = [80, 130, 140, 60, 60, 110, 140, 100, 170, 220,
             180, 140, 140, 210, 130, 150, 60, 180, 140,
             200, 150, 140, 240, 90, 130, 180, 170, 80, 90, 110, 170, 130, 150, 100];
  for (let i = 0; i < w.length; i++) s.setColumnWidth(i + 1, w[i]);
}

function montarRespostas(s) {
  s.clear();
  s.getRange(1, 1, 1, 3).setValues([['Recebido em', 'ID', 'Payload cru (JSON)']]);
  s.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#14140F').setFontColor('#FFD400');
  s.setFrozenRows(1);
  s.setColumnWidth(1, 150);
  s.setColumnWidth(2, 90);
  s.setColumnWidth(3, 700);
  s.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm:ss');
}

function montarConfig(s) {
  s.clear();
  s.getRange(1, 1, 1, 3).setValues([['Etapas', 'Próximo passo', 'Resultado do contato']]);
  s.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#14140F').setFontColor('#FFD400');
  s.getRange(2, 1, ETAPAS.length, 1).setValues(ETAPAS.map(function (v) { return [v]; }));
  s.getRange(2, 2, PROXIMOS_PASSOS.length, 1).setValues(PROXIMOS_PASSOS.map(function (v) { return [v]; }));
  s.getRange(2, 3, RESULTADOS.length, 1).setValues(RESULTADOS.map(function (v) { return [v]; }));
  s.setFrozenRows(1);
  [200, 180, 220].forEach(function (largura, i) { s.setColumnWidth(i + 1, largura); });
}

/* ============================================================
   TESTE — roda sem precisar do site
   ============================================================ */

function testarEnvio() {
  const exemplo = {
    dadosPessoais: {
      nome: 'Ana Souza', idade: 34, email: 'ana@exemplo.com',
      telefone: '(61) 98888-7777', whatsapp: '(61) 98888-7777',
    },
    localizacaoRedes: {
      cidade: 'Brasília', estado: 'Distrito Federal',
      linkedin: '', instagram: '@anasouza',
    },
    qualificacao: {
      atuacaoAtual: ['Consórcio', 'Seguro'], outraAtuacao: '',
      tempoExperienciaComercial: 'De 3 a 5 anos',
      areasExperiencia: ['Consórcio', 'Previdência'],
      possuiCarteira: 'Sim', quantidadeClientes: 'De 51 a 100',
      certificacoes: ['CPA-20', 'ANCORD'],
      horasSemanais: 'De 31 a 40 horas',
      veiculoProprio: 'Sim', possuiNotebook: 'Sim', participaTreinamentos: 'Sim',
      rendaAtual: 'De R$ 5 mil a R$ 10 mil',
      maiorMotivacao: 'Crescimento',
      habilidadeComercial: '8',
      rendaDesejada12Meses: 'R$ 25.000,00',
    },
  };

  const resposta = doPost({ postData: { contents: JSON.stringify(exemplo) } });
  Logger.log(resposta.getContent());
}
