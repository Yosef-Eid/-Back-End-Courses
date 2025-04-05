import express from 'express';
import { verifyToken, } from '../middlewares/verify.js';
import { addCourse, deleteCourse, getAllCourses, getAllCoursesUser, getCourseById, updateCourse } from '../controls/courses/controlCourse.js';
import { verifyTokenAndCourseOwner} from '../middlewares/courseMiddleware.js';
import { upload } from '../utils/uploadAvatar.js';

const router = express.Router();

// course
router.get('/getAllCourses',verifyToken, getAllCourses)
router.get('/course/:courseId',verifyToken, getCourseById)
router.get('/getAllCoursesUser',verifyToken, getAllCoursesUser)
router.post('/addCourse/:channelId', verifyToken, upload, addCourse)
router.put('/updateCourse/:id', verifyToken, verifyTokenAndCourseOwner, upload, updateCourse)
router.delete('/deleteCourse/:id', verifyToken, verifyTokenAndCourseOwner, deleteCourse)

// video


export default router
