import mongoose, { Schema, Document } from 'mongoose';
import { RefreshToken } from 'types/user.types';
import { v4 as uuidv4 } from 'uuid';

const RefreshTokenSchema = new Schema<RefreshToken & Document>({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  os: { type: String, required: true },
  browser: { type: String, required: true },
  deviceType: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<RefreshToken & Document>(
  'RefreshToken',
  RefreshTokenSchema
);
