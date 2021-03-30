import { Router } from 'express';

import {
     getBootcamps,
     getBootcamp,
     postBootcamp,
     updateBootcamp,
     deleteBootcamp,
     getBootcampsInRadius,
     bootcampPhotoUpload
} from '../controllers/bootcampController.js';

import courseRouter from './coursesRoute';

const router = Router();

// Re-route other resource router
router.use('/:bootcampId/courses', courseRouter);

router
     .route('/')
     .get(getBootcamps)
     .post(postBootcamp);

router
     .route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp);

router
     .route('/radius:/zipcode/:distance')
     .get(getBootcampsInRadius);

router
     .route('/radius:/lng/:lat/:distance')
     .get(getBootcampsInRadius);

router
     .route('/:id/photo')
     .put(bootcampPhotoUpload);

export default router;