const whatsappService = require('../services/whatsappService');

async function connect(req, res) {
  try {
    const connectionInfo = await whatsappService.connectToWhatsApp();
    const status = await whatsappService.getConnectionStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function status(req, res) {
  try {
    const status = await whatsappService.getConnectionStatus();
    
    if(status.status === 'connected') {
      whatsappService.onMessage((msg) => {
        console.log('Mensagem recebida:', msg);
      });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendMessage(req, res) {
  try {
    const { number, message } = req.body;
    if (!number || !message) 
        return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });    

    const result = await whatsappService.sendMessage(number, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendMedia(req, res) {
  try {
    const { number, filePath } = req.body;
    if (!number || !filePath)
      return res.status(400).json({ error: 'Número e caminho do arquivo são obrigatórios' });    

    const result = await whatsappService.sendMedia(number, filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listenMessage(req, res) {
  try {
    whatsappService.onMessage(async (msg) => {      
      console.log("Mensagem recebida:", msg);                  
    });

    res.json({ status: 'Escutando mensagens do whatsapp...' });
  } catch (err) {
    res.status(500).json({ erros: err.message });
  }
};

module.exports = {
  connect,
  status,
  sendMessage,
  sendMedia,
  listenMessage
};
