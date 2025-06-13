import express from 'express';
import { verifyToken, } from '../middlewares/verify.js';
import { addCourse, deleteCourse, getAllCourses, getAllCoursesUser, getCourseById, updateCourse } from '../controls/courses/controlCourse.js';
import { verifyTokenAndCourseOwner} from '../middlewares/courseMiddleware.js';
import { upload } from '../utils/uploadAvatar.js';

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Courses not found
 */
router.get('/getAllCourses', verifyToken, getAllCourses)

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get a specific course
 *     tags: [Courses]
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
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get('/course/:courseId',verifyToken, getCourseById)

/**
 * @swagger
 * /courses/user:
 *   get:
 *     summary: Get all courses of a user
 *     tags: [Courses]
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
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Courses not found
 */
router.get('/getAllCoursesUser',verifyToken, getAllCoursesUser)

/**
 * @swagger
 * /courses/{channelId}:
 *   post:
 *     summary: Add course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: channelId
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
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/addCourse/:channelId', verifyToken, upload, addCourse)

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
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
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 */
router.put('/updateCourse/:id', verifyToken, verifyTokenAndCourseOwner, upload, updateCourse)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.delete('/deleteCourse/:id', verifyToken, verifyTokenAndCourseOwner, deleteCourse)

export default router
