import express from "express";
import ChannelController from "../controllers/channelController.js";
import MessageController from "../controllers/messageController.js";
import UserController from "../controllers/userController.js";
const router = express.Router();

router.post("/register", UserController.registerController())
router.post("/login", UserController.loginController())
router.post("/authenticate", UserController.authenticationController())
router.post("/get-all-friends", UserController.getAllFriendsController())
router.post("/add-friend", UserController.addFriendController())


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
router.patch("/delete-channel", ChannelController.deleteChannelController())

router.patch("/join-channel", UserController.joinChannelController())
router.get("/retrieve-channel-message", MessageController.retrieveChannelMessageController())

router.post("/get-user-filters", UserController.getUserFiltersController());
router.post("/update-user-filters", UserController.updateUserFiltersController());


export default router;