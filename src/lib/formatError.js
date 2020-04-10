import cleanStack from "clean-stack"

export default error => {
  if (error.stack) {
    return cleanStack(error.stack, {pretty: true})
  }
  return error
}