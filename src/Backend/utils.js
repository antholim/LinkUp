import mongoose from "mongoose";
import jwt from "jsonwebtoken"
export async function connectToMongoDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}
export function verifyToken(token, secret = process.env.JWT_SECRET) {
    return jwt.verify(token, secret, (err, decoded) => {
        return decoded;
    });
}
export const sendJSON = (ws, type, data) => {
    if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type, data }));
    }
};
