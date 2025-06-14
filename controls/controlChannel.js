
// Import Required Modules & Models
import Channel from "../models/channel.js";
import Course from "../models/courses.js";
import Video from "../models/videos.js";
import { uploadToCloudinary } from "../utils/uploadAvatar.js"; // Image upload helper


// Get All Channels
export const getAllChannels = async (req, res) => {
    try {
        // Retrieve all channels from the database
        const allChannels = await Channel.find();
        res.status(200).json(allChannels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Get Current User's Channel
export const getChannel = async (req, res) => {
    try {
        // Find channel linked to the logged-in user
        const channel = await Channel.find({ user: req.user.id });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        // Ensure the logged-in user is the owner of the channel
        if (!channel.user.equals(req.user.id)) return res.status(403).json({ message: "You are not allowed to access this channel" });
        res.status(200).json(channel);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Create New Channel
export const createChannel = async (req, res) => {
    try {
        // Validate avatar upload
        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ message: 'Avatar is required' });
        }

        // Upload avatar to Cloudinary
        const avatarUrl = await uploadToCloudinary(req.files.avatar[0].path, 'channels');

        // Optional: Upload background image to Cloudinary
        let backgroundUrl = '';
        if (req.files.background) {
            backgroundUrl = await uploadToCloudinary(req.files.background[0].path, 'channels');
        }

        // Create a new channel object
        const newChannel = new Channel({
            ...req.body,
            user: req.user.id,
            avatar: avatarUrl,
            background: backgroundUrl
        });

        // Save to DB and respond with new channel
        const channel = await newChannel.save();
        res.status(201).json(channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Update Existing Channel
export const updateChannel = async (req, res) => {
    try {
        // Get current avatar and background from existing channel
        let { avatar, background } = req.channel;

        // Upload new avatar if provided
        if (req.files.avatar) {
            avatar = await uploadToCloudinary(req.files.avatar[0].path, 'channels');
        }

        // Upload new background if provided
        if (req.files.background) {
            background = await uploadToCloudinary(req.files.background[0].path, 'channels');
        }

        // Update channel details
        Object.assign(req.channel, {
            ...req.body,
            avatar: avatar || req.channel.avatar,
            background: background || req.channel.background
        });

        // Save changes to DB
        await req.channel.save();
        res.status(200).json(req.channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Delete a Channel
export const deleteChannel = async (req, res) => {
    try {
        const userId = req.channel.user;

        // Delete all related videos and courses owned by the user
        await Video.deleteMany({ user: userId });
        await Course.deleteMany({ user: userId });

        // Delete the channel itself
        await req.channel.deleteOne();

        res.status(200).json({ message: "Channel deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
