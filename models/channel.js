import mongoose from "mongoose";

const channel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, },
    avatar: { type: String, },
    background: { type: String, },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Channel = mongoose.model("Channel", channel);
export default Channel