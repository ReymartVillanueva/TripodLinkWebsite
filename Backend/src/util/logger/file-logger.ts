var winston = require("winston");
require("winston-daily-rotate-file");

import * as path from "path";
import { LOG_FOLDER, LOGGER_CONFIG_FOLDER } from "../../main";

export const createLogger = (service: string, companyId: string) => {
  let logger_name = (service + "-" + companyId).toUpperCase();

  var transport = new winston.transports.DailyRotateFile({
    dirname: LOG_FOLDER,
    filename: logger_name + "_%DATE%.log",
    datePattern: "YYYYMMDD",
    maxFiles: "15d",
    auditFile: path.join(LOGGER_CONFIG_FOLDER, logger_name + ".config"),
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.prettyPrint()
    ),
  });

  var logger = winston.createLogger({
    transports: [transport],
  });

  logger.exitOnError = false;

  logger.log("info", "New log start.");

  return logger;
};
