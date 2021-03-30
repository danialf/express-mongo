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

const router = Router({ mergeParams: true });

router
     .route('/')
     .get(advancedResult(Course,{
          path: 'bootcamp',
          select: 'name description'
     }), getCourses)
     .post(addCourse);

router
     .route('/:id')
     .get(getCourse)
     .put(updateCourse)
     .delete(deleteCourse);

export default router;