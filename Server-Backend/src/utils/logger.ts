import * as winston from "winston";

const { combine, colorize, timestamp, align, printf, errors, splat, json } =
  winston.format;

const logger = winston.createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
