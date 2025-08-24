const MensagensRecebidas = require('../models/mensagensrecebidas');
const natural = require('natural');
const Intencoes = require('../models/intencoes');
const Respostas = require('../models/respostas');

const classifier = new natural.BayesClassifier();

async function carregarIntencoes() {
  const intencoes = await Intencoes.findAll({
    include: [{ model: Respostas, as: 'respostas' }]
  });

  for (const i of intencoes) {
    const exemplo = i.frase_exemplo || i.nome;
    classifier.addDocument(exemplo.toLowerCase(), i.nome);
  }

  classifier.train();  
}

let respostasMap = {};

async function carregarRespostas() {
  const intencoes = await Intencoes.findAll({
    include: [{ model: Respostas, as: 'respostas' }]
  });

  respostasMap = {};

  for (const i of intencoes) {
    respostasMap[i.nome] = i.respostas.map(r => r.texto);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function iniciarBot(sendMessage) {
  console.log("Bot iniciado. Processando mensagens a cada 15 segundos...");

  await carregarIntencoes();
  await carregarRespostas();

  while (true) {    
    const msgs = await MensagensRecebidas.findAll({ where: { respondida: false } });

    for (const msg of msgs) {      
      const intencao = classifier.classify((msg.mensagem || '').toLowerCase());      
      
      const respostasIntencao = respostasMap[intencao] || ['Desculpe, não entendi sua mensagem.'];
      const resposta = respostasIntencao[Math.floor(Math.random() * respostasIntencao.length)];

      await sendMessage(msg.celularremetente, resposta);
      
      msg.respondida = true;
      await msg.save();

      console.log(`Mensagem respondida para ${msg.celularremetente}: ${resposta}`);

      await sleep(30000);
    }

    await sleep(15000);
  }
}

module.exports = { iniciarBot };