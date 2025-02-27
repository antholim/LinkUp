import { Message } from "../models/message.js"; 

export default class MessageService {
  async sendMessage(channelId, senderId, content) {
    const message = await Message.create({
        channelId: channelId,
        senderId: senderId,
        content: content,
    });
  }
}