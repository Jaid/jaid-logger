import chalk from "chalk"
import figures from "figures"
import {MESSAGE} from "triple-beam"
import {format} from "winston"

const withPrefix = (level, message) => {
  if (level === "info") {
    return `${chalk.blue(figures.info)} ${message}`
  }
  if (level === "warn") {
    return chalk.yellow(`${figures.warning} ${message}`)
  }
  if (level === "error") {
    return chalk.redBright(`${figures.cross} ${message}`)
  }
  return message
}

export default format(info => {
  info[MESSAGE] = withPrefix(info.level, info.message)
  return info
})