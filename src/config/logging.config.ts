import pino from 'pino';

function configureLogger(environment: string) {
  let logger;
  switch (environment) {
    case 'production':
      logger = pino({
        level: 'info',
        formatters: {
          level(label) {
            return { level: label };
          },
        },
        // transport: {
        //   target: 'pino-elasticsearch',
        //   options: { index: 'logs', node: 'http://localhost:9200' }, // Send logs to Elasticsearch
        // },
      });
      break;
    default: // development
      logger = pino({
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      });
      break;
  }

  return logger;
}

export default configureLogger(process.env.NODE_ENV || 'development');
