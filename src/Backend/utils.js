import mongoose from "mongoose";
export async function connectToMongoDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}