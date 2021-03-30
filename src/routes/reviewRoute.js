import { Router } from 'express';
import { getReviews, getReview, addReview, updateReview, deleteReview } from '../controllers/reviewController.js';

import Review from '../models/Review.js';

const router = Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResultsMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

export default router;