import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './env.config';

declare global {
  namespace Express {
    interface AuthInfo {
      state?: string;
    }
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const state = req.authInfo?.state || req.query.state;

        if (!state) {
          throw new Error('Missing OAuth state parameter');
        }

        if (typeof state !== 'string') {
          throw new Error('Invalid state parameter');
        }

        const deviceInfo = JSON.parse(decodeURIComponent(state));

        return done(null, { profile, refreshToken, accessToken, deviceInfo });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// // 🔹 3️⃣ GitHub Strategy
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: '/auth/github/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await authenticateGitHubUser(profile);
//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

export default passport;
