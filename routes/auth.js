import express from 'express';
import { addCourseFavorite, addCourseToCart, getAllUsers, getCartCourses, getCurrentUser, getFavoriteCourses, getUserById, login, register, resendVerificationEmail, updateUser, verifyEmailCode } from '../controls/auth.js';
import  { verifyToken, verifyTokenAndAuthorization, verifyTokenIsAdmin } from '../middlewares/verify.js';
import { upload } from '../utils/uploadAvatar.js';
import { authRateLimiter } from '../utils/rateLimit.js';
const router = express.Router();

// users
router.get('/getCurrentUser',verifyToken , getCurrentUser)
router.get('/getAllUsers', verifyTokenIsAdmin, getAllUsers)
router.get('/getUser/:id', verifyTokenAndAuthorization, getUserById)
router.post('/register', authRateLimiter, register)
router.post('/login', authRateLimiter, login)
router.put('/updateUser/:id', verifyTokenAndAuthorization, upload, updateUser)
router.post('/verify-email', verifyEmailCode);
router.post('/resend-verification', resendVerificationEmail);

// favorite
router.put('/favorite/:courseId', verifyToken, addCourseFavorite)
router.get('/getFavoriteCourses', verifyToken, getFavoriteCourses)

// cart
router.put('/addCourseToCart/:courseId', verifyToken, addCourseToCart)
router.get('/getCartCourses', verifyToken, getCartCourses)


export default router