import {format} from "winston"
import {MESSAGE} from "triple-beam"

export default format((info, options = {}) => {
  const dateString = moment().format("DD.MM.YYYY hh:mm:ss")
  const levelString = options.level.toUpperCase().padStart(7)
  const messageString = info[MESSAGE] ? ` ${info[MESSAGE].trim()}` : ""
  info[MESSAGE] = `[${dateString} ${levelString}]${messageString}`
})