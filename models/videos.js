import mongoose from "mongoose";

const videos = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    video: { type: String, required: true },
    thumbnail: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Video = mongoose.model("Video", videos);
export default Video