import mongoose from "mongoose";
import { Message } from "./message";

const channelSchema = new mongoose.Schema({
    channelName: {
        type:String,
        required:true
    },
    type: {
        type:String,
        enum:["direct_message", "public"],
    },
    friends: {
        type: [String],
    },
    members: {
        type: [String],
    },
    messages: {
        type:[Message]
    }
},{ timestamps: true });

export const Channel = mongoose.model("Channel", channelSchema, "channels");

