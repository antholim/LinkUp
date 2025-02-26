import express from "express"
import UserController from "../controllers/userController.js"
import ChannelController from "../controllers/channelController.js";

const router = express.Router();

router.post("/register", UserController.registerController())
router.post("/login", UserController.loginController())
// {
//     "status": 200,
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2E1NzRlNmIzM2RhNDc1OTEwNDQzYzciLCJlbWFpbCI6ImFudGhvLmxpbTQ0MUBnbWFpbC5jb20iLCJpYXQiOjE3NDA1MDg0ODYsImV4cCI6MTc0MDUyMjg4Nn0.9BEeHPofAr1BBSKSc3pqdFsnRPdNQI8rbnBKa0xC-2A",
//     "message": "User authenticated"
// }
router.post("/create-channel", ChannelController.createChannelController())
router.get("/get-all-channel", ChannelController.getAllChannelController())
// [
//     {
//         "_id": "67be08223f20980c8ba8c22d",
//         "channelName": "chat",
//         "type": "public",
//         "members": [
//             "67a574b58fa24c42a9e47eed"
//         ]
//     }
// ]
router.delete("/delete-channel", ChannelController.deleteChannelController())

router.post("/join-channel", UserController.joinChannelController())


export default router;