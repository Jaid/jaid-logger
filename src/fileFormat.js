import {format} from "winston"
import {MESSAGE} from "triple-beam"
import moment from "moment"

export default format((info, {includeErrors = true}) => {
  if (!includeErrors && (info.level === "warn" || info.level === "error")) {
    return
  }
  const dateString = moment().format("HH:mm:ss.SSS")
  const levelString = info.level.toUpperCase().padStart(7)
  if (!info.message) {
    return
  }
  info[MESSAGE] = `[${dateString} ${levelString}] ${info.message.trim()}`
  return info
})