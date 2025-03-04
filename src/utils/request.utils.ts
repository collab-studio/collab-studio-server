import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logging.config';

const validateRequestBody = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.error(`Validation error`);

      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        res.status(400).json({ message: 'Bad request' });
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

const validateReqParams = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      logger.error(`Validation error`);

      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        res.status(400).json({ message: 'Bad request' });
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export default { validateReqParams, validateRequestBody };
