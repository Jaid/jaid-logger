/** @module jaid-logger */

import fs from "fs"
import path from "path"

import {isArray, camelCase} from "lodash"
import {createLogger, format, transports} from "winston"
import "winston-daily-rotate-file"
import fsExtra from "fs-extra"
import appFolder from "app-folder"

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

/**
 * @typedef {Object} JaidLogger
 * @prop {string} appFolder
 * @prop {string} logFolder
 * @prop {Function} log
 * @prop {Function} info
 * @prop {Function} warn
 * @prop {Function} error
 * @prop {Function} debug
 */

/**
 * @param {string|string[]} name App name
 * @return {JaidLogger}
 */
export default name => {
  if (!isArray(name)) {
    name = [name]
  }
  const normalizedName = camelCase(name.join(" "))
  const configFolder = appFolder(...name)
  const logFolder = path.join(configFolder, "log")
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
  logger.appFolder = configFolder
  logger.logFolder = logFolder
  return logger
}