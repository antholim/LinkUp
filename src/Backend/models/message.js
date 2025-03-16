import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const messageSchema = new Schema({
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: [true, "Channel ID is required"],
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Sender ID is required"],
      index: true
    },
    senderUsername: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    isEdited: {
      type: Boolean,
      default: false
    },

    userFilter: {
      type: [String],
      default: []
    }
  }, { 
    timestamps: true 
  });

export const Message = mongoose.model("Message", messageSchema, "messages");

