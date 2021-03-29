import { Router } from 'express';

import { getBootcamps, getBootcamp, postBootcamp, putBootcamp, deleteBootcamp } from '../controllers/bootcampController.js';

const router = Router();

router
     .route('/')
     .get(getBootcamps)
     .post(postBootcamp);

router
     .route('/:id')
     .get(getBootcamp)
     .put(putBootcamp)
     .delete(deleteBootcamp);

export default router;