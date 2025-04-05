import express from 'express'
import { addReview, getReviews } from '../controls/courses/reviews.js';
import { verifyToken } from '../middlewares/verify.js';
const router = express.Router();

router.post('/addReview/:courseId', verifyToken, addReview)
router.get('/getReviews/:courseId', verifyToken, getReviews)

export default router