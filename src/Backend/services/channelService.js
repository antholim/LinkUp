import { Channel } from "../models/channel.js";
import { User } from "../models/user.js";

export default class ChannelService {
  async createChannel(channelName, creatorID, type = "public") {
    const channel = await Channel.create({
      channelName: channelName,
      type: type,
      members: [creatorID],
      messages: [],
    });
  }
  async createPrivateMessageChannel(creatorID, friendId, type = "direct_message") {
    const channel = await Channel.create({
      channelName: "direct_message",
      type: type,
      members: [creatorID, friendId],
      messages: [],
    });
    return channel;
  }
  async getAllChannel() {
    const channels = await Channel.find({ 
      isDeleted: { $ne: true },
      type: { $ne: "direct_message" }
    });
    const channelsNoMessages = channels.map(({_id, channelName, type, members}) => ({_id, channelName, type, members}));
    return channelsNoMessages;
  }
  async deleteChannel(channelID) {
    try {
      console.log(channelID)
      const channel = await Channel.updateOne({_id : channelID},{ $set: { isDeleted: true} })
      console.log(channel)
    } catch (error) {
      console.error(error)
    }
  }
  async getDmChannel(currentUserId, friendId) {
    const [currentUser, friend] = await Promise.all([
      User.findById(currentUserId),
      User.findById(friendId)
    ]);
    if (!currentUser || !friend) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    let channel = await Channel.findOne({
      type: "direct_message",
      members: { $all: [currentUserId, friendId], $size: 2 }
    });
    return channel;
  }
}