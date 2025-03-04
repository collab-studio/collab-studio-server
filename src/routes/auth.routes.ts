import express from 'express';
import passport from 'passport';

import AuthController from '../controllers/auth.controller';
import AuthValidator from '../validators/auth.validator';
import RequestValidator from '../utils/request.utils';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

// Local authentication
router.post(
  '/v1/register',
  RequestValidator.validateRequestBody(AuthValidator.registerSchema),
  AuthController.register
);
router.post(
  '/v1/login',
  RequestValidator.validateRequestBody(AuthValidator.loginSchema),
  AuthController.login
);
router.post(
  '/refresh',
  authMiddleware.verifyRefreshToken,
  AuthController.refreshToken
);
router.post('/logout', authMiddleware.verifyAccessToken, AuthController.logout);

// Google OAuth
router.get('/google', (req, res, next) => {
  const state = req.query.state as string;
  passport.authenticate('google', { scope: ['profile', 'email'], state })(
    req,
    res,
    next
  );
});
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  AuthController.googleCallback
);

export default router;
