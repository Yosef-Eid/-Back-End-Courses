import mongoose from "mongoose";

const reviewCourse = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    course: {type: mongoose.Schema.Types.ObjectId, ref:'Course'},
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
}, {timestamps: true});

const Review = mongoose.model("Review", reviewCourse);
export default Review