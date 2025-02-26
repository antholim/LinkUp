import mongoose from "mongoose";
import { messageSchema } from "./message.js";

const channelSchema = new mongoose.Schema({
    channelName: {
        type:String,
        required:true
    },
    type: {
        type:String,
        enum:["direct_message", "public"],
    },
    members: {
        type: [String],
    },
    messages: {
        type:[messageSchema]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });

export const Channel = mongoose.model("Channel", channelSchema, "channels");

