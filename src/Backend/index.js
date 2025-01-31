import express from "express"
import cors from "cors"
import dotenv from "dotenv"

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})