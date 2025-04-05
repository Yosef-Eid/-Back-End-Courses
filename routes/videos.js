import express from 'express';
import { addVideo, deleteVideo, getAllVideos, getVideoById, getVideoCourse, updateVideo } from '../controls/courses/controlVideos.js';
import { verifyTokenCourse, verifyTokenVideo } from '../middlewares/courseMiddleware.js';
import { verifyToken } from '../middlewares/verify.js';
import { processFiles, uploadFiles } from '../utils/uploadVideo.js';

const router = express.Router();

router.get('/getVideoCourse/:courseId', verifyToken, getVideoCourse)
router.get('/getVideoById/:videoId', verifyToken, getVideoById)
router.get('/getAllVideos', verifyToken, getAllVideos)
router.post('/addVideo/:channelId/:courseId', verifyToken, verifyTokenCourse, uploadFiles, processFiles, addVideo)
router.put('/updateVideo/:courseId/:videoId', verifyToken, verifyTokenCourse, verifyTokenVideo, updateVideo)
router.delete('/deleteVideo/:courseId/:videoId', verifyToken, verifyTokenCourse, verifyTokenVideo, deleteVideo)

export default router
