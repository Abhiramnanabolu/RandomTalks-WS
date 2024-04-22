const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

const messageHistory = [];

wss.on('connection', (ws) => {
  console.log('A new client connected');

  ws.send(JSON.stringify(messageHistory));

  
  ws.on('message', (message) => {
   // console.log('Received message:', message);

    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case 'history':
        
        ws.send(JSON.stringify({ type: 'history', data: messageHistory }));
        break;
      default:
        
        const { name, text } = parsedMessage;
        const timestamp = new Date();
        messageHistory.push({ name, text, timestamp });
        if (messageHistory.length > 100) {
          messageHistory.shift();
        }
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ name, text, timestamp }));
          }
        });
        break;
    }
  });


  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8080');
