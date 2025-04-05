import Comment from "../models/comments.js";
import Video from "../models/videos.js"

export const getComments = async (req, res) => {
    try {

        const video = await Video.findById(req.params.videoId).select('_id')
        if (!video) return res.status(404).json('video not found')

        const comments = await Comment.find({ video: req.params.videoId }).populate('user', 'name avatar')
        if (comments.length === 0) return res.status(404).json('no comments found')

        res.status(200).json(comments)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const addComment = async (req, res) => {
    try {

        const video = await Video.findById(req.params.videoId).select('_id')
        if (!video) return res.status(404).json('video not found')

        const comment = new Comment({
            user: req.user.id,
            video: video.id,
            comment: req.body.comment
        })

        await comment.save()
        res.status(200).json(comment)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateComment = async (req, res) => {
    try {

        let updatedComment = await Comment.findById(req.params.commentId)
        if (!updatedComment) return res.status(404).json('comment not found')

        updatedComment.comment = req.body.comment
        await updatedComment.save()
        res.status(200).json(updatedComment)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


export const deleteComment = async (req, res) => {
    try {
 
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('comment deleted')

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
        
    }
}
