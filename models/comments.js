import mongoose from 'mongoose'

const comments = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    comment: { type: String, minlength: 3, maxlength: 200 }
}, { timestamps: true })

const Comment = mongoose.model('Comment', comments)
export default Comment