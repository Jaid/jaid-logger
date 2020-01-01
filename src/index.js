/** @module jaid-logger */

import "winston-daily-rotate-file"

import appFolder from "app-folder"
import ensureArray from "ensure-array"
import fs from "fs"
import fsExtra from "fs-extra"
import path from "path"
import {createLogger, format, transports} from "winston"

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
  const configFolder = appFolder(...ensureArray(name))
  const logFolder = path.join(configFolder, "log")
  if (!fs.existsSync(logFolder)) {
    fsExtra.mkdirpSync(logFolder)
  }
  const logger = createLogger({
    transports: [
      new transports.Console({
        level: process.env.JAID_LOGGER_LEVEL?.toLowerCase() || "info",
        format: format.combine(stringifyConsoleFormat(), format.splat(), consoleFormat()),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "debug",
        format: format.combine(stringifyFileFormat(), format.splat(), fileFormat({includeErrors: false})),
        filename: path.join(logFolder, "debug", "%DATE%.txt"),
      }),
      new transports.DailyRotateFile({
        ...commonRotateFileOptions,
        level: "warn",
        format: format.combine(stringifyFileFormat(), format.splat(), fileFormat()),
        filename: path.join(logFolder, "error", "%DATE%.txt"),
      }),
    ],
  })
  logger.appFolder = configFolder
  logger.logFolder = logFolder
  return logger
}