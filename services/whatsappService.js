const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const pino = require('pino');

const bot = require('../services/botService');

const MensagensRecebidas = require('../models/mensagensrecebidas');

let sock = null;
let connectionStatus = 'disconnected';
let currentQR = null;

async function connectToWhatsApp() {
  if (sock && connectionStatus === 'connected')
    return { status: 'already_connected' };  

  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../auth_info_baileys'));

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.toDataURL(qr, (err, url) => {
        if (!err)
          currentQR = url;        
      });
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;
      connectionStatus = 'disconnected';
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      currentQR = null;
    }
  });

  return { status: 'connecting' };
}

async function getConnectionStatus() {
  return { status: connectionStatus, qr: currentQR, user: sock?.user || null };
}

async function sendMessage(number, message) {
  if (!sock || connectionStatus !== 'connected')
    throw new Error('Não conectado ao WhatsApp');  

  const mensagemTratada = message.replace(/\\n/g, '\n');
  let [result] = await sock.onWhatsApp(number);

  if (!result?.exists) {
    const numberWithNine = number.replace(/^(55\d{2})(\d{8})$/, '$19$2');
    [result] = await sock.onWhatsApp(numberWithNine);
  }

  if (!result?.exists)
    throw new Error('Número não encontrado no WhatsApp');  

  await sock.sendMessage(result.jid, { text: mensagemTratada });
  return { status: 'Mensagem enviada com sucesso' };
}

async function sendMedia(number, filePath) {
  if (!sock || connectionStatus !== 'connected')
    throw new Error('Não conectado ao WhatsApp');  

  if (!fs.existsSync(filePath))
    throw new Error('Arquivo não encontrado');  

  const mimetype = mime.lookup(filePath) || 'application/octet-stream';
  const jid = `${number}@s.whatsapp.net`;

  await sock.sendMessage(jid, {
    document: { url: filePath },
    mimetype,
    fileName: path.basename(filePath),
  });

  return { status: 'Arquivo enviado com sucesso' };
}

let listenerActive = false;

function onMessage(callback) {
  if (!sock || connectionStatus !== 'connected') 
    throw new Error('WhatsApp não conectado');

  if (!listenerActive) {
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {

        const remoteJid = msg.key.remoteJid;
        
        if (remoteJid.endsWith('@s.whatsapp.net')) {
          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            null;
          
          const record = {
            celularremetente: remoteJid.replace('@s.whatsapp.net', '').slice(0, 20),
            mensagem: text || '',
            datahorarecebimento: new Date(),
            respondida: false
          };

          try {
            console.log('Salvando mensagem no banco de dados:', record);
            await MensagensRecebidas.create(record);
          } catch (err) {
            console.error('Erro ao salvar mensagem:', err);
          }          
        }
      }
    });
    listenerActive = true;
  }
}

function waitForConnection(timeout = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      if (connectionStatus === 'connected') return resolve();
      if (Date.now() - start > timeout) return reject(new Error('Timeout aguardando conexão WhatsApp'));
      setTimeout(check, 500);
    };

    check();
  });
}

async function init() {
  await connectToWhatsApp();  
  await waitForConnection();

  onMessage();
  
  return sendMessage;
}

module.exports = {  
  init,
  connectToWhatsApp,
  getConnectionStatus,
  sendMessage,
  sendMedia,
  onMessage
};
