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