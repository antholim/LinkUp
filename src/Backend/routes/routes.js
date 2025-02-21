import express from "express"
import UserController from "../controllers/userController.js"
import ChannelController from "../controllers/channelController.js";

const router = express.Router();

router.post("/register", UserController.registerController())
router.post("/login", UserController.loginController())
router.post("/create-channel", ChannelController.createChannelController())

export default router;