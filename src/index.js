import fs from "fs"
import path from "path"

import filenamify from "filenamify"
import {createLogger, format, transports} from "winston"
import "winston-daily-rotate-file"
import appdataPath from "appdata-path"
import fsExtra from "fs-extra"

import consoleFormat from "./consoleFormat"
import fileFormat from "./fileFormat"
import stringifyConsoleFormat from "./stringifyConsoleFormat"
import stringifyFileFormat from "./stringifyFileFormat"

const commonRotateFileOptions = {
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
}

export default name => {
  const normalizedName = filenamify(name, {replacement: ""})
  const appFolder = appdataPath(normalizedName)
  const logFolder = path.join(appFolder, "log")
  if (!fs.existsSync(logFolder)) {
    fsExtra.mkdirpSync(logFolder)
  }
  const logger = createLogger({
    transports: [
      new transports.Console({
        level: "info",
        format: format.combine(stringifyConsoleFormat(), format.splat(), consoleFormat()),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "debug",
        format: format.combine(stringifyFileFormat(), format.splat(), fileFormat({includeErrors: false})),
        filename: path.join(logFolder, `${normalizedName}_debug_%DATE%.txt`),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "warn",
        format: format.combine(stringifyFileFormat(), format.splat(), fileFormat()),
        filename: path.join(logFolder, `${normalizedName}_error_%DATE%.txt`),
      }),
    ],
  })
  logger.appFolder = appFolder
  logger.logFolder = logFolder
  return logger
}