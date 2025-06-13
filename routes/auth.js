import express from 'express';
import { addCourseFavorite, addCourseToCart, deleteUser, getAllUsers, getCartCourses, getCurrentUser, getFavoriteCourses, getUserById, login, register, resendVerificationEmail, updateUser, verifyEmailCode } from '../controls/auth.js';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenIsAdmin } from '../middlewares/verify.js';
import { upload } from '../utils/uploadAvatar.js';
import { authRateLimiter } from '../utils/rateLimit.js';
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     tags: [Users]
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       profileImage:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /users/getCurrentUser:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/getCurrentUser', verifyToken, getCurrentUser)

/**
 * @swagger
 * /users/getAllUsers:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
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
 *                 $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/getAllUsers', verifyTokenIsAdmin, getAllUsers)

/**
 * @swagger
 * /users/getUser/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/getUser/:id', verifyTokenAndAuthorization, getUserById)

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       429:
 *         description: Too many requests
 */
router.post('/register', authRateLimiter, register)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many requests
 */
router.post('/login', authRateLimiter, login)

/**
 * @swagger
 * /users/updateUser/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/updateUser/:id', verifyTokenAndAuthorization, upload, updateUser)

/**
 * @swagger
 * /users/deleteUser/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/deleteUser/:id', verifyTokenAndAuthorization, deleteUser)

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     summary: Verify email with verification code
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid code
 */
router.post('/verify-email', verifyEmailCode);

/**
 * @swagger
 * /users/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Bad request
 */
router.post('/resend-verification', resendVerificationEmail);

/**
 * @swagger
 * /users/favorite/{courseId}:
 *   put:
 *     summary: Add course to favorite
 *     tags: [Favorite]
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
 */
router.put('/favorite/:courseId', verifyToken, addCourseFavorite)

/**
 * @swagger
 * /users/favorite:
 *   get:
 *     summary: Get favorite courses
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getFavoriteCourses', verifyToken, getFavoriteCourses)

/**
 * @swagger
 * /users/cart/{courseId}:
 *   put:
 *     summary: Add course to cart
 *     tags: [Cart]
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
 */
router.put('/addCourseToCart/:courseId', verifyToken, addCourseToCart)

/**
 * @swagger
 * /users/cart:
 *   get:
 *     summary: Get cart courses
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getCartCourses', verifyToken, getCartCourses)

export default router