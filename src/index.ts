import {server as webSocketServer, connection} from 'websocket';
import http from 'http';
import { OutgoingMessage, SupportedMessages as OutgoingSupportedMessages} from './messages/outgoingMessages';
import { incomingMessage,SupportedMessages } from './messages/incomeMessages';
import { UserManager } from './UserManager';
import { InMemoryStore } from './store/inMemmoryStore';


const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server

const userManager = new UserManager();
const chatManager = new InMemoryStore();


server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

function originIsAllowed(origin:string) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);

            try {
                messageHandler(connection, JSON.parse(message.utf8Data))
                
            } catch (error) {
                
            }
        }
      
    });

   function messageHandler(ws:connection, message: incomingMessage){
    if(message.type === SupportedMessages.JoinRoom){
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws)
    }
    if(message.type === SupportedMessages.SendMessage){
        const payload = message.payload;
        const user = userManager.getUser(payload.userId, payload.userId);
        if(!user){
            return;
        };

        const chat = chatManager.addChat(payload.message, payload.roomId, payload.userId,user.name)

        if(!chat){
            return
        }
    }
    if(message.type === SupportedMessages.UpvoteMessage){
        const payload = message.payload;

        const chat = chatManager.upvote(payload.chatId, payload.userId,payload.roomId)

        if(!chat){
            return
        };

        const outgoingPayload:OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.userId,
                upvote: chat.upvotes.length
            }

        }
        userManager.broadCast( payload.roomId,payload.userId, outgoingPayload)
    }
    
   }
   
});