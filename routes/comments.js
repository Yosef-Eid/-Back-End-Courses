import express from 'express'
import { addComment, deleteComment, getComments, updateComment } from '../controls/comment.js'
import { verifyToken } from '../middlewares/verify.js'

const router = express.Router()

router.get('/getComments/:videoId', verifyToken, getComments)
router.post('/addComment/:videoId', verifyToken, addComment)
router.put('/updateComment/:commentId', verifyToken, updateComment)
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)

export default router