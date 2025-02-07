import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
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
    }
},{ timestamps: true });

export const Channel = mongoose.model("Channel", channelSchema, "channels");

