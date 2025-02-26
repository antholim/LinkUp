import {userService} from "../serviceInit.js"

const loginController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to login");
            const response = await userService.authenticateUser(req.body.email, req.body.password);
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

const registerController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to register");
            const response = await userService.registerUser(req.body.email, req.body.password, req.body.username);
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
const joinChannelController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to join channel");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET)
            const userID = decoded._id;
            const channelID = req.body.channelID;
            const response = await userService.joinChannel(userID,channelID)
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

const UserController = {registerController, loginController, joinChannelController};
export default UserController;