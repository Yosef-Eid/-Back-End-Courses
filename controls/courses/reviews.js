import Course from "../../models/courses.js";
import Review from "../../models/reviews.js";

export const addReview = async (req, res) => {
    try {

        const { rating, comment } = req.body

        // Check if course exists 
        const course = await Course.findById(req.params.courseId).select('_id')
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" });


        // Check if user has already reviewed the course 
        const exitingReview = await Review.findOne({ user: req.user.id, course: course._id })

        // If user has already reviewed the course, update the review
        if (exitingReview) {
            exitingReview.rating = rating;
            exitingReview.comment = comment;
            await exitingReview.save();
            return res.status(200).json(exitingReview);
        }

        const reviews = new Review({
            user: req.user.id,
            course: course._id,
            rating,
            comment
        })

        await reviews.save();
        res.status(201).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getReviews = async (req, res) => {
    try {

        const reviews = await Review.find({ course: req.params.courseId })
        if (reviews.length === 0) return res.status(404).json({ message: "No reviews found" })
        res.status(200).json(reviews)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

