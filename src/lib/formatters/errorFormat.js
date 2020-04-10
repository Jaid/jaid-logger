import {LEVEL, MESSAGE} from "triple-beam"
import {format} from "winston"

import formatError from "lib/formatError"

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