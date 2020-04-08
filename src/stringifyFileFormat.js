import cleanStack from "clean-stack"
import {SPLAT} from "triple-beam"
import {format} from "winston"

const process = value => {
  if (value instanceof Error) {
    if (value.stack) {
      const cleanedStack = cleanStack(value.stack, {pretty: true})
      return cleanedStack
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