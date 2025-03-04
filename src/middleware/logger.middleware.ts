import { NextFunction, Request, Response } from 'express';
import logger from '../config/logging.config';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    logger.info(
      `[${req.method}]: ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};
