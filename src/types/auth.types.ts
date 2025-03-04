import { Request } from 'express';

export interface deviceInfoRequest {
  deviceType: string;
  os: string;
  browser: string;
  deviceId: string;
}

export interface userRequest extends deviceInfoRequest {
  username?: string;
  email: string;
  password: string;
}

export interface DecodedToken {
  _id: string;
  email: string;
  exp: number;
  iat: number;
  deviceId: string;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}
