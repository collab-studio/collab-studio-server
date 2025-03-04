import RefreshToken from '../models/refreshToken.model';
import User from '../models/user.model';
import AuthUtil from '../utils/auth.utils';
import {
  DecodedToken,
  deviceInfoRequest,
  userRequest,
} from '../types/auth.types';

const registerUser = async (user: userRequest) => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) throw new Error('User already exists');

  let newUser = new User({
    email: user.email,
    password: user.password,
    username: user.username,
  });
  await newUser.save();

  const { accessToken, refreshToken } = AuthUtil.generateTokens(newUser);
  const refreshTokenWithDeviceInfo =
    await AuthUtil.generateRefreshTokenWithDeviceInfo(
      newUser._id,
      refreshToken,
      user
    );

  await RefreshToken.create(refreshTokenWithDeviceInfo);

  return { accessToken, refreshToken };
};

const loginUser = async (reqUser: userRequest) => {
  const user = await User.findOne({ email: reqUser.email });

  if (!user) throw new Error('User not found');
  if (!user.password) throw new Error('User registered with external provider');

  const isMatch = await user.comparePassword(reqUser.password);
  if (!isMatch) throw new Error('Incorrect password');

  const { accessToken, refreshToken } = AuthUtil.generateTokens(user);
  const refreshTokenWithDeviceInfo =
    await AuthUtil.generateRefreshTokenWithDeviceInfo(
      user._id,
      refreshToken,
      reqUser
    );

  await AuthUtil.storeRefreshTokenWithDeviceInfo(
    user._id,
    reqUser.deviceId,
    refreshTokenWithDeviceInfo
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (
  user: DecodedToken,
  deviceInfo: deviceInfoRequest
) => {
  const accessToken = AuthUtil.generateToken(user);

  const tokenExpTime = user.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const refreshExpiryThreshold = AuthUtil.REFRESH_TOKEN_EXPIRY_THRESHOLD;

  if (tokenExpTime - currentTime < refreshExpiryThreshold) {
    const refreshToken = AuthUtil.generateRefreshToken(user);

    const actualUser = await User.findById(user._id);
    if (!actualUser) throw new Error('User not found');

    const refreshTokenWithDeviceInfo =
      await AuthUtil.generateRefreshTokenWithDeviceInfo(
        actualUser._id,
        refreshToken,
        deviceInfo
      );

    await AuthUtil.storeRefreshTokenWithDeviceInfo(
      actualUser._id,
      user.deviceId,
      refreshTokenWithDeviceInfo
    );

    return { refreshToken, accessToken };
  }

  return { accessToken };
};

const logout = async (refreshToken: string) => {
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('User not found');
  await user.save();
};

const loginWithGoogle = async (
  profile: any,
  googleRefreshToken: string,
  deviceInfo: deviceInfoRequest
) => {
  let user = await User.findOne({ email: profile.emails[0].value });

  if (!user) {
    user = new User({
      email: profile.emails[0].value,
      username: profile.displayName,
      externalAuth: [
        {
          provider: 'google',
          providerId: profile.id,
          refreshToken: googleRefreshToken,
        },
      ],
    });
  } else {
    const googleAuthProvider = user.externalAuth.find(
      (auth) => auth.provider === 'google'
    );
    if (
      googleAuthProvider &&
      googleRefreshToken &&
      googleAuthProvider.refreshToken !== googleRefreshToken
    ) {
      googleAuthProvider.refreshToken = googleRefreshToken;
    } else if (!googleAuthProvider) {
      user.externalAuth.push({
        provider: 'google',
        providerId: profile.id,
        refreshToken: googleRefreshToken,
        mfaEnabled: false,
      });
    }
  }

  await user.save();

  const { accessToken, refreshToken } = AuthUtil.generateTokens(user);
  const refreshTokenWithDeviceInfo =
    await AuthUtil.generateRefreshTokenWithDeviceInfo(
      user._id,
      refreshToken,
      deviceInfo
    );

  await AuthUtil.storeRefreshTokenWithDeviceInfo(
    user._id,
    deviceInfo.deviceId,
    refreshTokenWithDeviceInfo
  );

  return { refreshToken, accessToken };
};

export default {
  registerUser,
  loginUser,
  refreshToken,
  loginWithGoogle,
  logout,
};
