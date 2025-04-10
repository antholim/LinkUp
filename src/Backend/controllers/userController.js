import { userService } from "../serviceInit.js";

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
const authenticationController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to authenticate");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userID = decoded._id;
            if (userID) {
                res.status(200).json({message:"Success", user: decoded});
            } else {
                res.status(401).json({message:"Error"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const getAllFriendsController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to get all friends");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userID = decoded._id;
            if (userID) {
                const friends = await userService.getAllFriends(userID);
                res.status(200).json(friends);
            } else {
                res.status(401).json({message:"Error"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

const addFriendController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to add friend");
            console.log(req.body)
            const accessToken = req.body.accessToken;
            const friendId = req.body.friendId;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const _id = decoded._id;
            if (_id) {
                const friends = userService.addFriend(_id, friendId);
                res.status(200).json(friends);
            } else {
                res.status(401).json({message:"Error"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}
const getUserFiltersController = () => {
    return async function (req, res) {
        try {
            console.log("Retrieving user filters...");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userID = decoded._id;

            if (!userID) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const filters = await userService.getUserFilters(userID);
            res.status(200).json({ filters });
        } catch (error) {
            console.error("Error retrieving user filters:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

const updateUserFiltersController = () => {
    return async function (req, res) {
        try {
            console.log("Updating user filters...");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userID = decoded._id;

            if (!userID) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const newFilters = req.body.filters || [];
            const updatedUser = await userService.updateUserFilters(userID, newFilters);
            
            res.status(200).json({ message: "Filters updated", filters: updatedUser.filters });
        } catch (error) {
            console.error("Error updating user filters:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

const findAUserController = () => {
    return async function (req, res) {
        try {
            console.log("Finding a user...");
            const accessToken = req.body.accessToken;
            const partialUsername = req.body.partialUsername;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userID = decoded._id;

            if (!userID) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const matchingUsers = await userService.findAUser(partialUsername);
            res.status(200).json(matchingUsers);
            // const updatedUser = await userService.updateUserFilters(userID, newFilters);
            
            // res.status(200).json({ message: "Filters updated", filters: updatedUser.filters });
        } catch (error) {
            console.error("Error updating user filters:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

const userRoleController = () => {
    return async function (req, res) {
        try {
            console.log("Finding a user...");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userId = decoded._id;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userRole = await userService.getUserRole(userId);
            res.status(200).json(userRole);
            // const updatedUser = await userService.updateUserFilters(userID, newFilters);
            
            // res.status(200).json({ message: "Filters updated", filters: updatedUser.filters });
        } catch (error) {
            console.error("Error updating user filters:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

const getAllUserController = () => {
    return async function (req, res) {
        try {
            console.log("Getting users...");
            const accessToken = req.query.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET);
            const userId = decoded._id;

            if (!userId && decoded.role !== "admin") {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const users = await userService.getUsers();
            console.log(users)
            res.status(200).json(users);
        } catch (error) {
            console.error("Error updating user filters:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}

const promoteUserController = () => {
    return async function (req, res) {
        try {
            console.log("Trying to promote user...");
            const accessToken = req.body.accessToken;
            const decoded = await userService.verifyToken(accessToken, process.env.JWT_SECRET)

            const userIdToPromote = req.body._id;
            if (decoded?.role === "admin") {
                const response = await userService.promoteUser(userIdToPromote);
                console.log(response);
                res.status(200).json({
                    message: "Success"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 200,
                message: "Internal server error"
            });
        }
    }
}

const UserController = {registerController, loginController, joinChannelController, authenticationController, 
    getAllFriendsController, addFriendController, getUserFiltersController, updateUserFiltersController, findAUserController, userRoleController, getAllUserController, promoteUserController};
export default UserController;