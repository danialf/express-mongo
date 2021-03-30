import { Router } from 'express';

import {
     getCourses,
     getCourse,
     addCourse,
     updateCourse,
     deleteCourse
} from '../controllers/coursesController.js';

import Course from '../models/Course.js';
import advancedResult from '../middleware/advancedResultsMiddleware.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

router
     .route('/')
     .get(advancedResult(Course, {
          path: 'bootcamp',
          select: 'name description'
     }), getCourses)
     .post(protect, authorize('publisher', 'admin'), addCourse);

router
     .route('/:id')
     .get(getCourse)
     .put(protect, authorize('publisher', 'admin'), updateCourse)
     .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;