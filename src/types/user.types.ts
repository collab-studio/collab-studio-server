import { Types } from 'mongoose';

// Interface for External Authentication (Google, GitHub, Facebook, etc.)
export interface ExternalAuth {
  provider: string; // 'google', 'github', 'facebook', 'saml'
  providerId: string; // Unique user ID from provider
  email?: string; // Optional: Email provided by provider
  mfaEnabled: boolean; // Does IdP enforce MFA?
  refreshToken?: string; // Refresh token issued by IdP
}

// Interface for WebAuthn Passkeys
export interface Passkey {
  credentialId: string;
  publicKey: string;
}

// Interface for MFA (Handled by Application)
export interface MFA {
  secret: string; // Secret for TOTP
  enabled: boolean; // Whether MFA is enabled
  verified: boolean; // Whether MFA has been set up
}

export interface RefreshToken {
  token: string;
  deviceId: string;
  os: string;
  browser: string;
  deviceType: string;
  expiresAt: Date;
  userId: string;
}

// User Interface
export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  externalAuth: ExternalAuth[];
  passkeys: Passkey[];
  appMFA: MFA | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
