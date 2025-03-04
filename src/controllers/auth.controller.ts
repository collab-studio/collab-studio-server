import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import logger from '../config/logging.config';
import config from '../config/env.config';
import {
  AuthRequest,
  DecodedToken,
  deviceInfoRequest,
} from '../types/auth.types';
import RefreshTokenModel from '../models/refreshToken.model';

const register = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const tokens = await AuthService.registerUser(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !config.development,
      sameSite: 'strict',
    });

    logger.info(
      `request for user registration fulfilled ${user.username} ${user.email}`
    );
    res.status(201).json({ accessToken: tokens.accessToken });
  } catch (error) {
    logger.error(`request for user registration failed ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const tokens = await AuthService.loginUser(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !config.development,
      sameSite: 'strict',
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    logger.error(`request for user login failed ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?._id;
    const deviceId = req.body.deviceId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    await RefreshTokenModel.deleteMany({ userId, deviceId });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: !config.development,
      sameSite: 'strict',
    });
  } catch (error) {
    logger.error(`request for user logout failed ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthRequest).user as DecodedToken;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const deviceInfo = req.body;
    const tokens = await AuthService.refreshToken(user, deviceInfo);

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: !config.development,
        sameSite: 'strict',
      });
    }

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Google OAuth Callback
const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as
      | {
          profile: any;
          refreshToken: string;
          deviceInfo?: deviceInfoRequest;
        }
      | undefined;

    if (!user) {
      res.status(400).json({ message: 'Bad request' });
      return;
    }

    const { profile, refreshToken, deviceInfo } = user;
    if (!deviceInfo) throw new Error('Device info not found');

    const tokens = await AuthService.loginWithGoogle(
      profile,
      refreshToken,
      deviceInfo
    );

    if (tokens.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: !config.development,
        sameSite: 'strict',
      });
    }

    res.redirect(
      `${config.clientUrl}/google/callback?accessToken=${tokens.accessToken}`
    );
  } catch (error) {
    logger.error('Google authentication error:', error);
    res.status(500).json({ message: 'authentication failed' });
  }
};

export default { register, login, refreshToken, googleCallback, logout };
