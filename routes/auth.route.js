const express  = require('express'),
      router   = express.Router(),
      authController = require('../controllers/auth.controller'),
      authMiddlewares = require('../middlewares/authValidation'),
      isAuth    = require('../middlewares/verificationToken');

router.post('/signup' , authMiddlewares.validateUserData , authMiddlewares.validateIfUserDataExists , authController.signup);

router.post('/login' , authController.login);

router.get('/status' , isAuth , authController.getUserStatus);

router.patch('/status' , isAuth , authController.updateUserStatus);

module.exports = router;
