import Course from "../models/courses.js";
import Video from "../models/videos.js";


/*
 * This middleware verifies that the user is the owner of the course
 * before allowing them to perform operations on the course
*/
export const verifyTokenAndCourseOwner = async (req, res, next) => {
    try {
        if (!req.user) return res.status(403).json({ message: "you are not allowed" })
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "course not found" })
        if (!course.user || !course.user.equals(req.user.id)) return res.status(403).json({ message: "you are not allowed" })

        req.course = course;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * This middleware verifies that the user is the owner of the course
 * before allowing them to perform operations on the course.
 */
export const verifyTokenCourse = async (req, res, next) => {
    try {
        if (!req.user) return res.status(403).json({ message: "you are not allowed" })

        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "course not found" })
        if (!course.user || !course.user.equals(req.user.id)) return res.status(403).json({ message: "you are not allowed" })
        req.course = course;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * This middleware verifies that the user is the owner of the video
 * before allowing them to perform operations on the video.
 */
export const verifyTokenVideo = async (req, res, next) => {
    try {
        if (!req.user) return res.status(403).json({ message: "you are not allowed" })
        const video = await Video.findById(req.params.videoId);
        if (!video) return res.status(404).json({ message: "video not found" })
        if (!video.user || !video.user.equals(req.user.id)) return res.status(403).json({ message: "you are not allowed" })

        req.video = video;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

