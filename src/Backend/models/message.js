import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
    channelID:{
        type:String,
        required:[true, "Channel ID is required"]
    },

    senderID:{
        type:String,
        required:[true, "Sender ID is required"]
    },

    content:{
        type:String,
        required:[true, "Content is required"]
    },
},{ timestamps: true });

export const Message = mongoose.model("Message", messageSchema, "messages");

