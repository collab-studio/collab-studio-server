import mongoose from 'mongoose';

import logger from './logging.config';
import config from './env.config';

const MONGO_URI = config.mongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    logger.info(`MongoDB Connected Successfully: ${MONGO_URI}`);

    mongoose.connection.on('error', function (err) {
      logger.error('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
      logger.info('Mongoose disconnected');
    });

    // Gracefully handle process exit (CTRL+C)
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB Disconnected on SIGINT');
      process.exit(0);
    });

    // usually invoked by docker stop for graceful db shutdown
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB Disconnected on SIGTERM');
      process.exit(0);
    });

    // Handle uncaught exceptions (optional)
    process.on('uncaughtException', async (err) => {
      await mongoose.connection.close();
      logger.info('MongoDB Disconnected due to Uncaught Exception:', err);
      process.exit(0);
    });
  } catch (error) {
    logger.error('MongoDB Connection Error:', error);

    //TODO: Handle DB connection retry
  }
};

export default connectDB;
