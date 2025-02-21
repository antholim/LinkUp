import {channelService} from "../serviceInit.js"

const createChannelController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to create channel");
            const response = await channelService.createChannel(req.body.channelName, req.body.creatorID);
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

const ChannelController = {createChannelController};
export default ChannelController;