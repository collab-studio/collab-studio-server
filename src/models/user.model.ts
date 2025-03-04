import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { ExternalAuth, MFA, Passkey, User } from '../types/user.types';

const ExternalAuthSchema = new Schema<ExternalAuth>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  mfaEnabled: { type: Boolean, default: false },
  refreshToken: { type: String },
});

const PasskeySchema = new Schema<Passkey>({
  credentialId: { type: String, required: true },
  publicKey: { type: String, required: true },
});

const MFASchema = new Schema<MFA>({
  secret: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
});

const UserSchema = new Schema<User & Document>(
  {
    _id: { type: String, default: uuidv4 },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    externalAuth: { type: [ExternalAuthSchema], default: [] },
    passkeys: { type: [PasskeySchema], default: [] },
    appMFA: { type: MFASchema, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare hashed passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<User & Document>('User', UserSchema);
