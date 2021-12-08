import * as winston from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { MAX_LOG_FILE, MAX_LOG_SIZE } from './config';
import DailyRotateFile = require('winston-daily-rotate-file');

const customTransports: Array<winston.transports.ConsoleTransportInstance | DailyRotateFile> = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        all: true,
      }),
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
];

const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: customTransports,
  // other options
};

if (process.env.NODE_ENV === 'production') {
  loggerConfig.transports.push(
    new DailyRotateFile({
      filename: './src/storage/logs/log.%DATE%',
      format: winston.format.combine(
        winston.format.colorize({
          all: false,
        }),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
      // define whether or not to gzip archived log files. (default: 'false')
      zippedArchive: false,
      maxSize: MAX_LOG_SIZE,
      maxFiles: MAX_LOG_FILE,
    }),
  );
}

export const LoggerModule = WinstonModule.forRoot(loggerConfig);

export const logger = WinstonModule.createLogger(loggerConfig);

winston.loggers.add('customLogger', {
  transports: loggerConfig.transports,
});
