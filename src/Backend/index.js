import cors from "cors"
import dotenv from "dotenv"
import express from "express"
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


import { spawn } from "child_process"
import http from 'http'
import { createRequire } from "module"
import { WebSocketServer } from 'ws'
import { Message } from "./models/message.js"
import { sendJSON, verifyToken } from "./utils.js"
import { User } from "./models/user.js"

const require = createRequire(import.meta.url);
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

// async function processMessageWithAI(messageContent) {
//   const inputData = { text: messageContent };
//   const pythonProcess = spawn("python", ["run_model.py"]);

//   // Return a Promise to handle asynchronous behavior
//   return new Promise((resolve, reject) => {
//     // Send input data to Python via stdin
//     pythonProcess.stdin.write(JSON.stringify(inputData));
//     pythonProcess.stdin.end(); // Close stdin after sending data

//     // Capture Python output
//     pythonProcess.stdout.on("data", (data) => {
//       console.log(`Python Output: ${data.toString()}`);
//       resolve({
//         predictions: data.toString()
//       });
//     });

//     // Handle errors
//     pythonProcess.stderr.on("data", (error) => {
//       reject(`Error: ${error.toString()}`);
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         reject(`Python process exited with code ${code}`);
//       }
//     });
//   });
// }

async function processMessageWithAI(messageContent) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["run_model.py"]);

    let outputData = "";
    let errorData = "";

    // Send input data to Python
    pythonProcess.stdin.write(JSON.stringify({ text: messageContent }));
    pythonProcess.stdin.end();

    // Capture stdout (valid JSON)
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    // Capture stderr (warnings/errors)
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python Process Error:\n${errorData}`);
        reject(new Error("Python process failed"));
      } else {
        try {
          // ✅ Ignore PyTorch Warnings & Extract Valid JSON
          const jsonMatch = outputData.match(/\{.*\}/s); // Extract JSON from output
          if (!jsonMatch) {
            throw new Error("Invalid JSON output from Python");
          }
          const parsedData = JSON.parse(jsonMatch[0]); // Parse only valid JSON
          resolve(parsedData);
        } catch (error) {
          reject(new Error("Failed to parse Python output"));
        }
      }
    });
  });
}


// async function processMessageWithAI(messageContent) {
//   return new Promise((resolve, reject) => {
//     const pythonProcess = spawn("python3", ["run_model.py"]);

//     pythonProcess.stdin.write(JSON.stringify({ text: messageContent }));
//     pythonProcess.stdin.end();

//     let outputData = "";
//     pythonProcess.stdout.on("data", (data) => {
//       outputData += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error(`Python Error: ${data.toString()}`);
//       reject(new Error("Python process error"));
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         reject(new Error(`Python process exited with code ${code}`));
//       } else {
//         try {
//           const parsedData = JSON.parse(outputData.trim());
//           resolve(parsedData); // Parsed AI analysis result
//         } catch (error) {
//           reject(new Error("Failed to parse Python output"));
//         }
//       }
//     });
//   });
// }


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
          
        // case 'send_message':
        //   if (!clientId) {
        //     sendJSON(ws, 'error', { message: 'Not authenticated3' });
        //     return;
        //   }
          
        //   try{
        //     const AImodRaw = await processMessageWithAI(data.data.content);
        //     const AIMod = await JSON.parse(AImodRaw.predictions.trim())
        //     console.log("AI Analysis:", AIMod);

        //     //Check if the message falls into any of the 6 harmful categories
        //     const isHarmful = Object.values(AIMod).some(
        //       (value) => value === 1
        //     );

        //     if (isHarmful) {
        //       // Notify the user that their message is harmful and won't be sent
        //       sendJSON(ws, "message_blocked", {
        //         message: "Your message may contain harmful content and was not sent.",
        //       });
        //       console.log(
        //         `Blocked message from ${clientId}: "${data.data.content}"`
        //       );
        //       return;
        //     }

        //   // Create new message in database
        //   const newMessage = await Message.create({
        //     channelId: data.data.channelId,
        //     senderId: clientId, // Use authenticated user ID
        //     senderUsername:user.username,
        //     content: data.data.content,
        //   });
        //   console.log("MESSAGE CREATED")
        //   console.log({
        //     channelId: data.data.channelId,
        //     senderId: clientId, // Use authenticated user ID
        //     senderUsername:user.username,
        //     content: data.data.content,
        //   })
          
        //   // Populate sender info for frontend display
        //   const populatedMessage = await Message.findById(newMessage._id)
        //     .populate('senderId', 'username avatarUrl')
        //     .lean();
          
        //   // Broadcast to everyone in the channel
        //   console.log(populatedMessage, "populated message")
        //   broadcastToChannel(data.data.channelId, 'new_message', populatedMessage);

        //   }catch(error){
        //     console.error("Error processing message with AI:", error);
        //   }
        //   break;

        case 'send_message':
          if (!clientId) {
              sendJSON(ws, 'error', { message: 'Not authenticated3' });
              return;
          }
          
          try {
              // 🔹 Get AI Analysis
              const AIMod = await processMessageWithAI(data.data.content);
              console.log("AI Analysis:", AIMod);
      
              //Get the user’s active filters (from frontend request)
              console.log(clientId, "TAMER")
              const user = await User.findOne({ _id: clientId })
              const userFilters = user.filters || []; // Add filters here
              console.log("User filters:", userFilters);
      
              //Check if the message triggers any active filters
              const isHarmful = Object.keys(AIMod).some(
                  (label) => userFilters.includes(label) && AIMod[label] == 1
              );
              console.log(isHarmful, "IS HARMFUL")
              if (isHarmful) {
                  sendJSON(ws, "message_blocked", {
                      message: "Your message may contain harmful content and was not sent.",
                      blockedBy: userFilters
                  });
                  console.log(
                      `Blocked message from ${clientId}: "${data.data.content}" based on filters: ${userFilters}`
                  );
                  return;
              }
      
              // 🔹 Save Message with User Filters
              const newMessage = await Message.create({
                  channelId: data.data.channelId,
                  senderId: clientId,
                  senderUsername: user.username,
                  content: data.data.content,
                  userFilters
              });
      
              console.log("MESSAGE CREATED:", newMessage);
      
              // 🔹 Populate sender info for frontend display
              const populatedMessage = await Message.findById(newMessage._id)
                  .populate('senderId', 'username avatarUrl')
                  .lean();
      
              // 🔹 Broadcast the message
              console.log(populatedMessage, "populated message");
              broadcastToChannel(data.data.channelId, 'new_message', populatedMessage);
      
          } catch (error) {
              console.error("Error processing message with AI:", error);
          }
          break;
      
      

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
