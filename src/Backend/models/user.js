import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [String],
    },
    channels: {
        type: [String],
    },
    avatar: {
        type: String
    },
    filters: { type: [String], default: [] },
},{ timestamps: true });

export const User = mongoose.model("User", userSchema, "users");

