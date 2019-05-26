import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require
const {default: jaidLogger} = indexModule

it("should run", () => {
  const logger = jaidLogger(`${_PKG_NAME}-test`)
  logger.error("123")
  logger.warn("abc")
  logger.info("def")
})