import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';

import User from '../models/User.js';

const router = Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResultsMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;