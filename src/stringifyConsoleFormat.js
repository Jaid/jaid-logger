import {format} from "winston"
import {SPLAT} from "triple-beam"
import cleanStack from "clean-stack"
import purdy from "purdy"
import {isObject} from "lodash"

const formatValue = value => {
  if (value instanceof Error) {
    if (value.stack) {
      return value.stack
      |> cleanStack(#, {pretty: true})
      |> #.replace(/[\n\r]\s*/sg, " -> ")
    }
    return String(value)
  }
  if (value |> isObject) {
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