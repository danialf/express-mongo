import express from 'express';
const {
     register,
     login,
     logout,
     getMe,
     forgotPassword,
     resetPassword,
     updateDetails,
     updatePassword,
     confirmEmail,
} = require('../controllers/authController.js');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;