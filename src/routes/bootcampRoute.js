import { Router } from 'express';

import { getBootcamps, getBootcamp, postBootcamp, updateBootcamp, deleteBootcamp } from '../controllers/bootcampController.js';

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

export default router;