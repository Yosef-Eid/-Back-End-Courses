import Channel from "../models/channel.js";

export const checkChannelOwnership = async (req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.channelId);
        if (!channel) return res.status(404).json({ message: "Channel not found" });
        if (!req.user || !channel.user.equals(req.user.id)) return res.status(403).json({ message: "You are not allowed" });

        req.channel = channel;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
