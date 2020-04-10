import {SPLAT} from "triple-beam"
import {format} from "winston"

import formatError from "lib/formatError"

const formatValue = value => {
  if (value instanceof Error) {
    return formatError(value)
  }
  return value
}

export default format(info => {
  const splat = info[SPLAT]
  if (!splat || !splat.length) {
    return info
  }
  info[SPLAT] = info[SPLAT].map(value => formatValue(value))
  return info
})