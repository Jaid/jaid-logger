import fs from "fs"
import path from "path"

import {createLogger, format, transports} from "winston"
import "winston-daily-rotate-file"
import appdataPath from "appdata-path"
import fsExtra from "fs-extra"

import consoleFormat from "./consoleFormat"
import fileFormat from "./fileFormat"

export default name => {
  const logFolder = path.join(appdataPath(name), "log")
  if (!fs.existsSync(logFolder)) {
    fsExtra.mkdirpSync(logFolder)
  }
  const logger = createLogger({
    level: "debug",
    transports: [
      new (transports.Console)({
        format: format.combine(format.splat(), consoleFormat),
      }),
      new (winston.transports.DailyRotateFile)({
        filename: path.join(logFolder, "log-%DATE%.txt"),
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: format.combine(format.splat(), fileFormat),
      }),
    ],
  })
  return logger
}