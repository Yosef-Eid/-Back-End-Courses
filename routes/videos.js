import express from 'express';
import { addVideo, deleteVideo, getAllVideos, getVideoById, getVideoCourse, updateVideo } from '../controls/courses/controlVideos.js';
import { verifyTokenCourse, verifyTokenVideo } from '../middlewares/courseMiddleware.js';
import { verifyToken } from '../middlewares/verify.js';
import { processFiles, uploadFiles } from '../utils/uploadVideo.js';

const router = express.Router();

/**
 * @swagger
 * /videos/getVideoCourse/{courseId}:
 *   get:
 *     summary: Get all videos of a course
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get('/getVideoCourse/:courseId', verifyToken, getVideoCourse)

/**
 * @swagger
 * /videos/getVideoById/{videoId}:
 *   get:
 *     summary: Get a specific video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.get('/getVideoById/:videoId', verifyToken, getVideoById)

/**
 * @swagger
 * /videos/getAllVideos:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Videos not found
 */
router.get('/getAllVideos', verifyToken, getAllVideos)

/**
 * @swagger
 * /videos/addVideo/{channelId}/{courseId}:
 *   post:
 *     summary: Add a video to a course
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: channelId
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/addVideo/:channelId/:courseId', verifyToken, verifyTokenCourse, uploadFiles, processFiles, addVideo)

/**
 * @swagger
 * /videos/updateVideo/{courseId}/{videoId}:
 *   put:
 *     summary: Update a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.put('/updateVideo/:courseId/:videoId', verifyToken, verifyTokenCourse, verifyTokenVideo, updateVideo)

/**
 * @swagger
 * /videos/deleteVideo/{courseId}/{videoId}:
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: courseId
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.delete('/deleteVideo/:courseId/:videoId', verifyToken, verifyTokenCourse, verifyTokenVideo, deleteVideo)

export default router
