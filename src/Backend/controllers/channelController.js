import {channelService} from "../serviceInit.js"
import { userService } from "../serviceInit.js"

const createChannelController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to create channel");
            const decoded = await userService.verifyToken(req.body.accessToken, process.env.JWT_SECRET)
            const channelName = req.body.channelName;
            const creatorID = decoded._id;
            console.log(decoded)
            const response = await channelService.createChannel(channelName, creatorID);
            console.log(response);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const getAllChannelController = () => {
    return async function (req, res) {
        try {
            const decoded = await userService.verifyToken(req.body.accessToken, process.env.JWT_SECRET)
            // console.log(req.body)
            // console.log(req.query, "query")
            // const channelName = req.body.channelName;
            // const creatorID = decoded._id;
            const response = await channelService.getAllChannel();
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const deleteChannelController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to get all channels");
            const decoded = await userService.verifyToken(req.body.accessToken, process.env.JWT_SECRET)
            const channelID = req.body.channelID;
            // const creatorID = decoded._id;
            const response = await channelService.deleteChannel(channelID);
            console.log(response);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const ChannelController = {createChannelController, getAllChannelController, deleteChannelController};
export default ChannelController;