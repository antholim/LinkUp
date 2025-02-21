import { Channel } from "../models/channel";

export default class ChannelService {
  async createChannel(channelName, creatorID, type = "public") {
    const channel = await Channel.create({
      channelName: channelName,
      type: type,
      members: [creatorID],
      messages: [],
    });
  }
}