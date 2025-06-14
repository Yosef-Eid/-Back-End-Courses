// Importing necessary models and utilities
import Channel from "../../models/channel.js";
import Course from "../../models/courses.js";
import { uploadToCloudinary } from "../../utils/uploadAvatar.js";
import { courseValidation, updateCourseValidation } from "../../validations/coursesValid/courseValidation.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        // Fetch all courses and populate user info (name and avatar)
        const allCourses = await Course.find().populate("user", "name avatar");
        if (allCourses.length === 0)
            return res.status(404).json({ message: "no course found" });

        res.status(200).json(allCourses);
    } catch (error) {
        handleError(res, error);
    }
};

// Get Course By ID
export const getCourseById = async (req, res) => {
    try {
        // Find course by ID and populate user info
        const course = await Course.findById(req.params.courseId).populate("user", "name avatar");
        if (!course)
            return res.status(404).json({ message: "course not found" });

        res.status(200).json(course);
    } catch (error) {
        handleError(res, error);
    }
};

// Get All Courses For Logged-in User
export const getAllCoursesUser = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user)
            return res.status(403).json({ message: "you are not allowed" });

        // Find courses that belong to the authenticated user
        const courses = await Course.find({ user: req.user.id });
        if (courses.length === 0)
            return res.status(404).json({ message: "no course found" });

        res.status(200).json(courses);
    } catch (error) {
        handleError(res, error);
    }
};

// Add New Course
export const addCourse = async (req, res) => {
    try {
        // Validate course input data
        const { error } = courseValidation.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        // Check if the channel exists and belongs to the current user
        const channel = await Channel.findById(req.params.channelId);
        if (!channel) return res.status(404).json({ message: "channel not found" });
        if (!channel.user || !channel.user.equals(req.user.id))
            return res.status(403).json({ message: "you are not allowed" });

        // Upload avatar image to Cloudinary
        const avatarCoursePath = req.files.avatar[0].path;
        const thumbnail = await uploadToCloudinary(avatarCoursePath, "upload");

        // Create new course document
        const newCourse = new Course({ ...req.body, avatar: thumbnail, user: req.user.id });
        const result = await newCourse.save();

        // Add course ID to channel's courses array
        channel.courses.push(newCourse.id);
        await channel.save();

        // Emit real-time event to notify clients
        const io = req.app.get("io");
        io.emit("courseAdded", result);

        res.status(201).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        // Validate updated data
        const { error } = updateCourseValidation.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        // Get new avatar if provided
        const avatarCoursePath = req.files.avatar?.[0]?.path;
        let avatar = req.course.avatar;

        // Upload new avatar if available
        if (avatarCoursePath) {
            avatar = await uploadToCloudinary(avatarCoursePath, "upload");
        }

        // Update course data in the database
        const result = await Course.findByIdAndUpdate(
            req.params.id,
            { ...req.body, avatar: avatar },
            { new: true }
        );

        // Emit real-time event to notify clients
        const io = req.app.get("io");
        io.emit("courseUpdated", result);

        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        // Delete course by ID
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse)
            return res.status(404).json({ message: "Course not found" });

        // Emit real-time event to notify clients
        const io = req.app.get("io");
        io.emit("courseDeleted", { id: req.params.id });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        handleError(res, error);
    }
};

// Error Handling Function
const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({
        message: "Something went wrong",
        error: error.message
    });
};
