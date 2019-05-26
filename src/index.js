import fs from "fs"
import path from "path"

import {createLogger, format, transports} from "winston"
import "winston-daily-rotate-file"
import appdataPath from "appdata-path"
import fsExtra from "fs-extra"

import consoleFormat from "./consoleFormat"
import fileFormat from "./fileFormat"

const commonRotateFileOptions = {
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
}

export default name => {
  const logFolder = path.join(appdataPath(name), "log")
  if (!fs.existsSync(logFolder)) {
    fsExtra.mkdirpSync(logFolder)
  }
  const logger = createLogger({
    transports: [
      new transports.Console({
        level: "info",
        format: format.combine(format.splat(), consoleFormat()),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "debug",
        format: format.combine(format.splat(), fileFormat({includeErrors: false})),
        filename: path.join(logFolder, `${name}_debug_%DATE%.txt`),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "warn",
        format: format.combine(format.splat(), fileFormat()),
        filename: path.join(logFolder, `${name}_error_%DATE%.txt`),
      }),
    ],
  })
  return logger
}