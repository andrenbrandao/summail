import winston, { createLogger, format } from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.combine(format.errors({ stack: true }), format.json()),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

export default logger;
