import express from 'express'
import { addComment, deleteComment, getComments, updateComment } from '../controls/comment.js'
import { verifyToken } from '../middlewares/verify.js'

const router = express.Router()

/**
 * @swagger
 * definitions:
 *   Comment:
 *     tags: [Comments]
 *     type: object
 *     properties:
 *       text:
 *         type: string
 *         description: The content of the comment
 *       userId:
 *         type: string
 *         description: ID of the user who made the comment
 *       videoId:
 *         type: string
 *         description: ID of the video being commented on
 */

/**
 * @swagger
 * /comments/getComments/{videoId}:
 *   get:
 *     summary: Get all comments for a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video to get comments for
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.get('/getComments/:videoId', verifyToken, getComments)

/**
 * @swagger
 * /comments/addComment/{videoId}:
 *   post:
 *     summary: Add a new comment to a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment text
 *             required:
 *               - text
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.post('/addComment/:videoId', verifyToken, addComment)

/**
 * @swagger
 * /comments/updateComment/{commentId}:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated comment text
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Comment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not comment owner
 *       404:
 *         description: Comment not found
 */
router.put('/updateComment/:commentId', verifyToken, updateComment)

/**
 * @swagger
 * /comments/deleteComment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not comment owner
 *       404:
 *         description: Comment not found
 */
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)

export default router