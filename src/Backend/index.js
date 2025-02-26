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
const webSocket = http.createServer();

const wss = new WebSocketServer({ server:webSocket });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    //Validate with NLP Model
    //Store it in the database
    console.log('received: %s', data);
  });

  ws.send('something');
});

const WEBSOCKET_PORT = 4000;
webSocket.listen(WEBSOCKET_PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${WEBSOCKET_PORT}`);
});