import cleanStack from "clean-stack"
import {LEVEL, MESSAGE} from "triple-beam"
import {format} from "winston"

function formatError(error) {
  if (error.stack) {
    return cleanStack(error.stack, {pretty: true})
  }
  return error
}

export default format(error => {
  if (!(error instanceof Error)) {
    return error
  }
  const stringified = formatError(error)
  const info = Object.assign({}, {
    level: error.level,
    [LEVEL]: error[LEVEL] || error.level,
    message: stringified,
    [MESSAGE]: stringified,
  })
  return info
})