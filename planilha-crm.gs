/**
 * CRM de candidatos — Investidor Protegido
 *
 * Respostas — registro cru do que o formulário enviou. Ninguém edita.
 * Esteira   — uma coluna por resposta do candidato.
 * CRM       — acompanhamento: etapa, score, responsável, próximo passo.
 *
 * As três abas são criadas e mantidas automaticamente a cada envio.
 */

const PLANILHA_ID = '1kk3TUYySfHlqQyJ6RirSpCvs1Hfwekgwa2fxvlvAmRQ';

const ABA_RESPOSTAS = 'Respostas';
const ABA_ESTEIRA   = 'Esteira';
const ABA_CRM       = 'CRM';
const ABA_CONFIG    = 'Config';

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

/* Uma coluna por resposta do formulário. */
const CAB_ESTEIRA = [
  'Recebido em', 'ID', 'Nome completo', 'Idade', 'E-mail', 'Telefone', 'WhatsApp',
  'Cidade', 'Estado', 'LinkedIn', 'Instagram',
  'Atualmente trabalha com', 'Outra área de atuação',
  'Tempo de experiência comercial', 'Já trabalhou com',
  'Possui carteira de clientes', 'Quantidade de clientes', 'Certificações',
  'Horas por semana', 'Veículo próprio', 'Notebook', 'Participa de treinamentos',
  'Renda mensal atual', 'Meta de renda em 12 meses', 'Maior motivação',
  'Habilidade comercial',
];

/* Acompanhamento. As cinco do meio são preenchidas por você. */
const CAB_CRM = [
  'ID', 'Recebido em', 'Etapa', 'Score', 'Faixa',
  'Responsável', 'Próximo passo', 'Quando', 'Resultado do contato', 'Observações',
  'Nome', 'WhatsApp', 'E-mail', 'Cidade', 'Estado',
];

const CAB_RESPOSTAS = ['Recebido em', 'ID', 'Payload cru (JSON)'];

/* ===================== RECEBE O FORMULÁRIO ===================== */

function doPost(e) {
  if (!e || !e.postData) {
    throw new Error('Esta função só roda quando o site envia o formulário. Para testar pelo editor, use testarEnvio().');
  }

  const trava = LockService.getScriptLock();
  trava.waitLock(30000);

  try {
    const dados = JSON.parse(e.postData.contents);
    const p = dados.dadosPessoais || {};
    const l = dados.localizacaoRedes || {};
    const q = dados.qualificacao || {};

    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    const respostas = garanteAba(planilha, ABA_RESPOSTAS, CAB_RESPOSTAS);
    const esteira   = garanteAba(planilha, ABA_ESTEIRA,   CAB_ESTEIRA);
    const crm       = garanteAba(planilha, ABA_CRM,       CAB_CRM);

    const agora = new Date();
    const id = proximoId(esteira);
    const score = calcularScore(q);

    respostas.appendRow([agora, id, e.postData.contents]);

    esteira.appendRow([
      agora, id,
      p.nome || '', p.idade || '', p.email || '', p.telefone || '', p.whatsapp || '',
      l.cidade || '', l.estado || '', l.linkedin || '', l.instagram || '',
      lista(q.atuacaoAtual), q.outraAtuacao || '',
      q.tempoExperienciaComercial || '', lista(q.areasExperiencia),
      q.possuiCarteira || '', q.quantidadeClientes || '', lista(q.certificacoes),
      q.horasSemanais || '', q.veiculoProprio || '', q.possuiNotebook || '',
      q.participaTreinamentos || '', q.rendaAtual || '', q.rendaDesejada12Meses || '',
      q.maiorMotivacao || '', q.habilidadeComercial || '',
    ]);

    crm.appendRow([
      id, agora, 'Novo', score, faixa(score),
      '', '', '', '', '',
      p.nome || '', p.whatsapp || '', p.email || '', l.cidade || '', l.estado || '',
    ]);

    return json({ ok: true, id: id, score: score });
  } catch (erro) {
    try {
      SpreadsheetApp.openById(PLANILHA_ID).getSheetByName(ABA_RESPOSTAS)
        .appendRow([new Date(), 'ERRO', String(erro)]);
    } catch (ignorado) {}
    return json({ ok: false, erro: String(erro) });
  } finally {
    trava.releaseLock();
  }
}

/* Cria a aba se faltar e garante o cabeçalho, sem tocar nos dados. */
function garanteAba(planilha, nome, cabecalho) {
  let s = planilha.getSheetByName(nome);
  if (!s) s = planilha.insertSheet(nome);

  if (s.getMaxColumns() < cabecalho.length) {
    s.insertColumnsAfter(s.getMaxColumns(), cabecalho.length - s.getMaxColumns());
  }

  if (String(s.getRange(1, 1).getValue()).trim() !== cabecalho[0]) {
    if (s.getLastRow() > 0) s.insertRowBefore(1);
    s.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho])
      .setFontWeight('bold').setFontSize(10)
      .setBackground('#14140F').setFontColor('#FFD400')
      .setVerticalAlignment('middle');
    s.setRowHeight(1, 32);
    s.setFrozenRows(1);
    if (nome === ABA_CRM) {
      s.setFrozenColumns(2);
      suspensa(s, 3, ETAPAS);
      suspensa(s, 7, PROXIMOS_PASSOS);
      suspensa(s, 9, RESULTADOS);
      pintarEtapas(s);
      pintarFaixas(s);
    }
  }
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function lista(v) { return Array.isArray(v) ? v.join('; ') : (v || ''); }

function proximoId(esteira) {
  const linhas = Math.max(0, esteira.getLastRow() - 1);
  return 'IP-' + String(linhas + 1).padStart(4, '0');
}

/* ===================== SCORE — 0 a 100 ===================== */

function calcularScore(q) {
  let total = 0;

  total += ({ 'Nunca vendi': 0, 'Menos de 1 ano': 5, 'De 1 a 3 anos': 10,
    'De 3 a 5 anos': 15, 'Mais de 5 anos': 20 })[q.tempoExperienciaComercial] || 0;

  if (q.possuiCarteira === 'Sim') {
    total += 8 + (({ 'Até 20': 2, 'De 21 a 50': 5, 'De 51 a 100': 8,
      'De 101 a 300': 10, 'Mais de 300': 12 })[q.quantidadeClientes] || 0);
  }

  const certs = (q.certificacoes || []).filter(function (c) { return c !== 'Nenhuma'; });
  total += Math.min(15, certs.length * 5);

  total += ({ 'Até 10 horas por semana': 3, 'De 11 a 20 horas': 6,
    'De 21 a 30 horas': 9, 'De 31 a 40 horas': 12, 'Mais de 40 horas': 15 })[q.horasSemanais] || 0;

  const relevantes = ['Mercado financeiro', 'Consórcio', 'Seguro', 'Previdência', 'Investimentos'];
  const areas = (q.atuacaoAtual || []).concat(q.areasExperiencia || []);
  total += Math.min(10, relevantes.filter(function (r) { return areas.indexOf(r) !== -1; }).length * 5);

  total += Math.min(10, Number(q.habilidadeComercial) || 0);

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

/* ===================== APOIO ===================== */

function suspensa(s, coluna, valores) {
  const regra = SpreadsheetApp.newDataValidation()
    .requireValueInList(valores, true).setAllowInvalid(false).build();
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
      .whenTextEqualTo(etapa).setBackground(cores[etapa]).setRanges([alvo]).build();
  });
  s.setConditionalFormatRules(s.getConditionalFormatRules().concat(regras));
}

function pintarFaixas(s) {
  const alvo = s.getRange(2, 5, s.getMaxRows() - 1, 1);
  const cores = { 'A': '#CDEBD8', 'B': '#F6EDD9', 'C': '#EEF0F2' };
  const regras = Object.keys(cores).map(function (letra) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(letra).setBackground(cores[letra]).setBold(true).setRanges([alvo]).build();
  });
  s.setConditionalFormatRules(s.getConditionalFormatRules().concat(regras));
}

/* ===================== TESTE ===================== */

function testarEnvio() {
  const exemplo = {
    dadosPessoais: { nome: 'Ana Souza', idade: 34, email: 'ana@exemplo.com',
      telefone: '(61) 98888-7777', whatsapp: '(61) 98888-7777' },
    localizacaoRedes: { cidade: 'Brasília', estado: 'Distrito Federal',
      linkedin: '', instagram: '@anasouza' },
    qualificacao: { atuacaoAtual: ['Consórcio', 'Seguro'], outraAtuacao: '',
      tempoExperienciaComercial: 'De 3 a 5 anos',
      areasExperiencia: ['Consórcio', 'Previdência'],
      possuiCarteira: 'Sim', quantidadeClientes: 'De 51 a 100',
      certificacoes: ['CPA-20', 'ANCORD'], horasSemanais: 'De 31 a 40 horas',
      veiculoProprio: 'Sim', possuiNotebook: 'Sim', participaTreinamentos: 'Sim',
      rendaAtual: 'De R$ 5 mil a R$ 10 mil', maiorMotivacao: 'Crescimento',
      habilidadeComercial: '8', rendaDesejada12Meses: 'R$ 25.000,00' },
  };
  Logger.log(doPost({ postData: { contents: JSON.stringify(exemplo) } }).getContent());
}
