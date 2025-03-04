import jwt from 'jsonwebtoken';

import config from '../config/env.config';
import {
  DecodedToken,
  deviceInfoRequest,
  userRequest,
} from '../types/auth.types';
import { RefreshToken as RefreshTokenType, User } from '../types/user.types';
import RefreshToken from '../models/refreshToken.model';

const JWT_SECRET = config.jwtSecret;
const REFRESH_SECRET = config.refreshTokenSecret;

const generateToken = (user: User | DecodedToken): string =>
  jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '15m',
  });

const generateRefreshToken = (user: DecodedToken | User): string =>
  jwt.sign({ _id: user._id, email: user.email }, REFRESH_SECRET, {
    expiresIn: '7d',
  });

const verifyAccessToken = (token: string) => jwt.verify(token, JWT_SECRET);

const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const REFRESH_TOKEN_EXPIRY_THRESHOLD = 24 * 60 * 60; // 1 day threshold

const generateTokens = (user: User | DecodedToken) => {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

const generateRefreshTokenWithDeviceInfo = async (
  userId: string,
  token: string,
  user: userRequest | deviceInfoRequest
) => {
  return {
    userId,
    token,
    deviceId: user.deviceId,
    os: user.os,
    browser: user.browser,
    deviceType: user.deviceType,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  };
};

const storeRefreshTokenWithDeviceInfo = async (
  userId: string,
  deviceId: string,
  token: RefreshTokenType
) => {
  await RefreshToken.findOneAndUpdate(
    {
      userId: userId,
      deviceId: deviceId,
    },
    {
      $set: {
        toekn: token,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
      },
    },
    { upsert: true }
  );
};

export default {
  generateToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
  generateRefreshTokenWithDeviceInfo,
  storeRefreshTokenWithDeviceInfo,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_THRESHOLD,
};
