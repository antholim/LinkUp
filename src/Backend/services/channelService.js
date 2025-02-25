import { Channel } from "../models/channel.js";

export default class ChannelService {
  async createChannel(channelName, creatorID, type = "public") {
    const channel = await Channel.create({
      channelName: channelName,
      type: type,
      members: [creatorID],
      messages: [],
    });
  }
  async getAllChannel() {
    const channels = await Channel.find({});
    const channelsNoMessages = channels.map(({_id, channelName, type, members}) => ({_id, channelName, type, members}));
    console.log(channelsNoMessages)
    return channelsNoMessages;
  }
  async deleteChannel(channelID) {
    await Channel.deleteOne({_id : channelID})
  }
}