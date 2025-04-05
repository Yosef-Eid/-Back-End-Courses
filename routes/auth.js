import express from 'express';
import { addCourseFavorite, addCourseToCart, getAllUsers, getCartCourses, getCurrentUser, getFavoriteCourses, getUserById, login, register, updateUser } from '../controls/auth.js';
import  { verifyToken, verifyTokenAndAuthorization, verifyTokenIsAdmin } from '../middlewares/verify.js';
import { upload } from '../utils/uploadAvatar.js';
const router = express.Router();

// users
router.get('/getCurrentUser',verifyToken , getCurrentUser)
router.get('/getAllUsers', verifyTokenIsAdmin, getAllUsers)
router.get('/getUser/:id', verifyTokenAndAuthorization, getUserById)
router.post('/register', register)
router.post('/login', login)
router.put('/updateUser/:id', verifyTokenAndAuthorization, upload, updateUser)

// favorite
router.put('/favorite/:courseId', verifyToken, addCourseFavorite)
router.get('/getFavoriteCourses', verifyToken, getFavoriteCourses)

// cart
router.put('/addCourseToCart/:courseId', verifyToken, addCourseToCart)
router.get('/getCartCourses', verifyToken, getCartCourses)


export default router