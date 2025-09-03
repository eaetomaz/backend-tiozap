const MensagensRecebidas = require('../models/mensagensrecebidas');
const natural = require('natural');
const Intencoes = require('../models/intencoes');
const Respostas = require('../models/respostas');
const Configuracoes = require('../models/config');
const { Op } = require('sequelize');

const classifier = new natural.BayesClassifier();

async function ValidarUsoBot() {
  const config = await Configuracoes.findOne();
  
  if(config.ativar == 0 || !config.ativar) return false;    

    const diasMap = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const diaAtual = diasMap[new Date().getDay()];   
    let diasAtivos = [];    

    switch(config.diassemana.toLowerCase()) {
        case 'segunda à sexta':
            diasAtivos = ['Segunda','Terça','Quarta','Quinta','Sexta'];
            break;
        case 'segunda à domingo':
            diasAtivos = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
            break;
        case 'segunda, quarta e sexta':
            diasAtivos = ['Segunda','Quarta','Sexta'];
            break;
        case 'terça e quinta':
            diasAtivos = ['Terça','Quinta'];
            break;
        default:
            diasAtivos = [];
    }

  if(!diasAtivos.includes(diaAtual)) return false;
  
  const agora = new Date().toTimeString().slice(0, 8);

  if(agora < config.horarioinicial || agora > config.horariofinal) return false;  

  return true;    
}

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
  console.log("Bot iniciado. Validando configurações e processando mensagens a cada 15 segundos...");    

  await carregarIntencoes();
  await carregarRespostas();

  const notSendNumber = [
    "49999335543",
    "554999335543",
    "554988938279"
  ];

  while (true) {        
    const msgs = await MensagensRecebidas.findAll({
       where: { 
        respondida: false,
        celularremetente: { [Op.notIn]: notSendNumber }
       } 
      });

    if(msgs.length > 0) {
      if(!await ValidarUsoBot()) {
        // console.log('Automação não configurada.');
        await sleep(1500);
        continue;
      }
    }

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