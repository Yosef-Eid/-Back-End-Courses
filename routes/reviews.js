import express from 'express'
import { addReview, getReviews } from '../controls/courses/reviews.js';
import { verifyToken } from '../middlewares/verify.js';
const router = express.Router();

/**
 * @swagger
 * /reviews/addReview/{courseId}:
 *   post:
 *     summary: Add review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/addReview/:courseId', verifyToken, addReview)

/**
 * @swagger
 * /reviews/getReviews/{courseId}:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
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
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get('/getReviews/:courseId', verifyToken, getReviews)

export default router