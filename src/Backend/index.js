import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/routes.js"
import { connectToMongoDB } from "./utils.js"
dotenv.config()

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

await connectToMongoDB();

app.use("/", userRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})


import { WebSocketServer } from 'ws';
import http from 'http';
import { messageService } from "./serviceInit.js"
import {sendJSON, verifyToken} from "./utils.js"
import { Message } from "./models/message.js"
const webSocket = http.createServer();

const wss = new WebSocketServer({ server:webSocket });

// Heartbeat interval
const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 35000;

const clients = new Map();
// Map channels to connected client IDs
const channels = new Map();
const addToChannel = (clientId, channelId) => {
  if (!channels.has(channelId)) {
    channels.set(channelId, []);
  }
  
  const channelClients = channels.get(channelId);
  if (!channelClients.includes(clientId)) {
    channelClients.push(clientId);
  }
};
const broadcastToChannel = (channelId, type, data, excludeClient = null) => {
  console.log("Broadcasting...")
  const channelClients = channels.get(channelId) || [];
  console.log(clients, "clients map")
  console.log(channels, "channels map")
  // channelClients.forEach(clientId => {
  //   sendJSON(client.ws, type, data);
  // })
  channelClients.forEach(clientId => {
    const client = clients.get(clientId);
    if (client && client.ws !== excludeClient) {
      sendJSON(client.ws, type, data);
    }
  });
  console.log("Broadcasting complete", channelClients)
};
const heartbeat = (ws) => {
  ws.isAlive = true;
};
wss.on('connection', async (ws, req) => {
  console.log('New connection established');
  
  ws.isAlive = true;
  ws.on('pong', () => heartbeat(ws));
  
  // Client ID will be set after authentication
  let clientId = null;
  
  ws.on('message', async (message) => {
    try {
      const data = await JSON.parse(message);
      // Handle different message types
      console.log(data, "MY DATA")
      const user = verifyToken(data.data.accessToken);
      console.log(user)
      clientId = user._id;
      switch (data.type) {
        case 'authenticate':
          // Authenticate user and store connection
          console.log("authentication")
          if (!clientId) { //Check with db
            sendJSON(ws, 'error', { message: 'Authentication failed' });
            ws.close();
            return;
          }
          console.log("authentication success")
          clients.set(clientId, { ws, clientId });
          
        //   clientId = userId;
        //   clients.set(clientId, { ws, userId });
          
        //   // Join user's channels
        //   const userChannels = await Channel.find({ 
        //     members: { $elemMatch: { userId } } 
        //   });
          
        //   userChannels.forEach(channel => {
        //     addToChannel(clientId, channel._id.toString());
        //   });
          
        //   sendJSON(ws, 'authenticated', { userId });
        //   break;
          
        case 'join_channel':
          console.log("JOIN CHANNEL")
          if (!clientId) {
            sendJSON(ws, 'error', { message: 'Not authenticated1' });
            return;
          }
          
          
          addToChannel(clientId, data.data.channelId);
          console.log(`User ${clientId} joined channel ${data.data.channelId}`);
          break;
          
        case 'leave_channel':
          if (!clientId) {
            sendJSON(ws, 'error', { message: 'Not authenticated2' });
            return;
          }
          
          // removeFromChannel(clientId, data.channelId);
          console.log(`User ${clientId} left channel ${data.channelId}`);
          break;
          
        case 'send_message':
          if (!clientId) {
            sendJSON(ws, 'error', { message: 'Not authenticated3' });
            return;
          }
          
          // Create new message in database
          const newMessage = await Message.create({
            channelId: data.data.channelId,
            senderId: clientId, // Use authenticated user ID
            content: data.data.content,
          });
          console.log("MESSAGE CREATED")
          
          console.log({
            channelId: data.data.channelId,
            senderId: clientId, // Use authenticated user ID
            content: data.data.content,
          })
          
          // Populate sender info for frontend display
          const populatedMessage = await Message.findById(newMessage._id)
            .populate('senderId', 'username avatarUrl')
            .lean();
          
          // Broadcast to everyone in the channel
          console.log(populatedMessage, "populated message")
          broadcastToChannel(data.data.channelId, 'new_message', populatedMessage);
          
          // If this is a reply, also notify the parent message thread
          // if (data.parentMessageId) {
          //   broadcastToChannel(`thread:${data.parentMessageId}`, 'new_reply', populatedMessage);
          // }
          
          // Handle mentions
          // if (data.mentions && data.mentions.length > 0) {
          //   data.mentions.forEach(userId => {
          //     const mentionedClient = clients.get(userId);
          //     if (mentionedClient) {
          //       sendJSON(mentionedClient.ws, 'mention', {
          //         message: populatedMessage,
          //         channel: data.channelId
          //       });
          //     }
          //   });
          // }
          break;
        
        // case 'typing':
        //   if (!clientId) {
        //     sendJSON(ws, 'error', { message: 'Not authenticated' });
        //     return;
        //   }
          
        //   // Broadcast typing indicator to channel (except sender)
        //   broadcastToChannel(data.channelId, 'user_typing', {
        //     userId: clientId,
        //     channelId: data.channelId
        //   }, ws);
        //   break;
          
        case 'ping':
          sendJSON(ws, 'pong', {});
          return;
        
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      sendJSON(ws, 'error', { message: 'Failed to process message' });
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Connection closed:', clientId);
    
    if (clientId) {
      // Remove from all channels
      channels.forEach((clientIds, channelId) => {
        // removeFromChannel(clientId, channelId);
      });
      
      // Remove from clients list
      clients.delete(clientId);
    }
  });
});

// Implement heartbeat check
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log('Terminating inactive connection');
            return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
    });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
    clearInterval(interval);
});

const WEBSOCKET_PORT = 4000;
webSocket.listen(WEBSOCKET_PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${WEBSOCKET_PORT}`);
});