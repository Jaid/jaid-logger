import moment from "moment"
import stripAnsi from "strip-ansi"
import {MESSAGE} from "triple-beam"
import {format} from "winston"

export default format((info, {includeErrors = true}) => {
  if (!includeErrors && (info.level === "warn" || info.level === "error")) {
    return
  }
  const dateString = moment().format("HH:mm:ss.SSS")
  const levelString = info.level.toUpperCase().padStart(7)
  if (!info.message) {
    return
  }
  const cleanedMessage = stripAnsi(String(info.message).trim())
  info[MESSAGE] = `[${dateString} ${levelString}] ${cleanedMessage}`
  return info
})