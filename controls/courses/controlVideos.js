// Import necessary models and utility functions
import Channel from "../../models/channel.js";
import Course from "../../models/courses.js";
import Video from "../../models/videos.js";
import { deleteFromCloudinary, processFiles, uploadFiles } from "../../utils/uploadVideo.js";


// Get a video by its ID
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId); // Find video by ID
        if (!video) return res.status(404).json({ message: "Video not found" }); // If video doesn't exist
        if (!video.user.equals(req.user.id)) return res.status(403).json({ message: "You are not allowed to access this video" }); // Check ownership

        res.status(200).json(video); // Return video
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message }); // Handle errors
    }
};


// Get all videos for a specific course
export const getVideoCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate("videos"); // Get course with its videos
        const channel = await Channel.findOne({ user: req.user.id }).select('name avatar'); // Get channel info

        if (!course) return res.status(404).json({ message: "Course not found" }); // Check if course exists

        res.status(200).json({ course, channel }); // Return course and channel info
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// Get all videos uploaded by the current user
export const getAllVideos = async (req, res) => {
    try {
        if (!req.user) return res.status(403).json({ message: "you are not allowed" }); // Check authentication
        const videos = await Video.find({ user: req.user.id }); // Find all videos for user
        res.status(200).json(videos); // Return list
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// Add a new video to a course
export const addVideo = async (req, res) => {
    try {
        // Create a new video instance with user and file info
        const video = new Video({
            ...req.body,
            user: req.user.id,
            video: req.videoUrl, // Video URL from processed upload
            thumbnail: req.thumbnailUrl // Thumbnail URL from processed upload
        });

        await video.save(); // Save video to database

        // Add video ID to the related course
        req.course.videos.push(video.id);
        await req.course.save();

        // Emit real-time notification for video addition
        const io = req.app.get("io");
        io.emit("videoAdded", video);

        res.status(201).json(video); // Return new video
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Update an existing video
export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId); // Find video by ID
        if (!video) return res.status(404).json({ message: 'Video not found' }); // Check existence

        // Upload new files (if any)
        uploadFiles(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            await processFiles(req, res, async () => {
                // Set default to existing URLs
                let newVideoUrl = video.video;
                let newThumbnailUrl = video.thumbnail;

                // If new video uploaded, delete old one and update URL
                if (req.videoUrl) {
                    if (video.video) await deleteFromCloudinary(video.video);
                    newVideoUrl = req.videoUrl;
                }

                // If new thumbnail uploaded, delete old one and update URL
                if (req.thumbnailUrl) {
                    if (video.thumbnail) await deleteFromCloudinary(video.thumbnail);
                    newThumbnailUrl = req.thumbnailUrl;
                }

                // Prepare updated video data
                const updatedData = {
                    title: req.body.title || video.title,
                    description: req.body.description || video.description,
                    video: newVideoUrl,
                    thumbnail: newThumbnailUrl
                };

                // Update the video in DB
                const updatedVideo = await Video.findByIdAndUpdate(
                    req.params.videoId,
                    updatedData,
                    { new: true } // Return updated video
                );

                // Emit real-time notification for video update
                const io = req.app.get("io");
                io.emit("videoUpdated", updatedVideo);

                res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


//  Delete a video
export const deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.videoId); // Remove video from DB

        // Emit real-time notification for video deletion
        const io = req.app.get("io");
        io.emit("videoDeleted", req.params.videoId);

        res.status(200).json({ message: "video deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
