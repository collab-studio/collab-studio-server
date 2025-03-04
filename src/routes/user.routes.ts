import express from 'express';
import UserController from '../controllers/user.controller';
import RequestValidator from '../utils/request.utils';
import UserValidator from '../validators/user.validator';
import AuthMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get(
  '/v1/:id',
  RequestValidator.validateReqParams(UserValidator.userIdSchema),
  AuthMiddleware.verifyAccessToken,
  UserController.getUserById
);

export default router;
