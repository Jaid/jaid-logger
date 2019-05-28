import {format} from "winston"
import {SPLAT} from "triple-beam"
import cleanStack from "clean-stack"

const process = value => {
  if (value instanceof Error) {
    if (value.stack) {
      return value.stack
      |> cleanStack(#, {pretty: true})
    }
    return String(value)
  }
  return value
}

export default format(info => {
  const splat = info[SPLAT]
  if (!splat || !splat.length) {
    return info
  }
  info[SPLAT] = info[SPLAT].map(value => process(value))
  return info
})