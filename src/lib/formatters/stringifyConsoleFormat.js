import {isObject} from "lodash"
import purdy from "purdy"
import {SPLAT} from "triple-beam"
import {format} from "winston"

import formatError from "lib/formatError"

const formatValue = value => {
  if (value instanceof Error) {
    return formatError(value)
  }
  if (isObject(value)) {
    return purdy.stringify(value, {
      indent: 2,
    })
  }
  return value
}

export default format(info => {
  const splat = info[SPLAT] || info.splat
  if (!splat || !splat.length) {
    return info
  }
  info.splat = splat.map(x => formatValue(x))
  delete info[SPLAT]
  return info
})