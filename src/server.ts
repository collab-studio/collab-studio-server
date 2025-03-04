import config from './config/env.config';
import app from './app';
import logger from './config/logging.config';

app.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}`);
});
