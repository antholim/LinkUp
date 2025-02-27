import UserService from "./services/userService.js";
import ChannelService from "./services/channelService.js";
import MessageService from "./services/messageService.js";

export const userService = new UserService();
export const channelService = new ChannelService();
export const messageService = new MessageService();
