import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.config';
import AuthRouter from './routes/auth.routes';
import UserRouter from './routes/user.routes';
import config from './config/env.config';
import { loggerMiddleware } from './middleware/logger.middleware';
import passport from './config/passport.config';

// Load environment variables
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(passport.initialize());
app.use(loggerMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy does not allow this origin!'));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use((req: Request, res: Response, next: NextFunction): void => {
  const allowedOrigins = config.allowedOrigins;
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Content-Security-Policy', `default-src 'self' ${origin}`);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

// Routes
app.use('/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

export default app;
