import { RequestHandler } from 'express';
import { AuthRequest, DecodedToken } from '../types/auth.types';
import AuthUtils from '../utils/auth.utils';

const verifyAccessToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'] as string | undefined;

  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = AuthUtils.verifyAccessToken(token);
    (req as AuthRequest).user = decoded as DecodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

const verifyRefreshToken: RequestHandler = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res
      .status(401)
      .json({ message: 'Unauthorized: No refresh token provided' });
    return;
  }

  try {
    const decoded = AuthUtils.verifyRefreshToken(refreshToken);
    (req as AuthRequest).user = decoded as DecodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Invalid Refresh token' });
  }
};

export default { verifyAccessToken, verifyRefreshToken };
