import { Message } from "../models/message.js"; 
import mongoose from "mongoose";

export default class MessageService {
  async sendMessage(channelId, senderId, content) {
    const message = await Message.create({
        channelId: channelId,
        senderId: senderId,
        content: content,
    });
  }
  async getMessagesByChannelId(channelId, options = {}) {
    try {
      console.log("ABDE", channelId)
      // Convert string ID to ObjectId if needed
      const objectIdChannelId = typeof channelId === 'string' 
        ? new mongoose.Types.ObjectId(channelId) 
        : channelId;
      
      // Start building the query
      let query = Message.find({ channelId: objectIdChannelId });
      
      // Apply optional pagination
      if (options.skip) query = query.skip(options.skip);
      if (options.limit) query = query.limit(options.limit);
      
      // Apply optional sorting (default to chronological order)
      const sortCriteria = options.sort || { createdAt: 1 };
      query = query.sort(sortCriteria);
      
      // Execute the query
      const messages = await query.exec();
      console.log(messages)
      return messages;
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw error;
    }
  }
}