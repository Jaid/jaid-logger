import {format} from "winston"
import {MESSAGE} from "triple-beam"

export default format((info, options = {}) => {
  info[MESSAGE] = info[MESSAGE]
})