import cleanStack from "clean-stack"
import {isObject} from "lodash"
import purdy from "purdy"
import {SPLAT} from "triple-beam"
import {format} from "winston"

const formatValue = value => {
  if (value instanceof Error) {
    if (value.stack) {
      const cleanedStack = cleanStack(value.stack, {pretty: true})
      return cleanedStack
    }
    return String(value)
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