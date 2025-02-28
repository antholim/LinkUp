import { messageService } from "../serviceInit.js";
import { userService } from "../serviceInit.js"


const retrieveChannelMessageController = () => {
    return async function (req, res) {
        try {
            console.log("Retrieving messages");
            const decoded = await userService.verifyToken(req.query.accessToken, process.env.JWT_SECRET)
            // const channelName = req.body.channelName;
            // const creatorID = decoded._id;
            // console.log(decoded)
            // const response = await channelService.createChannel(channelName, creatorID);
            // console.log(response);
            // console.log(req, "req")
            console.log(req.query, "HERE QUERY")
            const channelId = req.query.channelId;
            const response = await messageService.getMessagesByChannelId(channelId)
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const MessageController = {retrieveChannelMessageController};
export default MessageController;