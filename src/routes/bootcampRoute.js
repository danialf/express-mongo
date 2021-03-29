import { Router } from 'express';

import {
     getBootcamps,
     getBootcamp,
     postBootcamp,
     updateBootcamp,
     deleteBootcamp,
     getBootcampsInRadius
} from '../controllers/bootcampController.js';

const router = Router();

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

export default router;