import delay from "delay"
import fs from "fs"
import moment from "moment"
import ms from "ms.macro"
import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require
const {default: jaidLogger} = indexModule

it("should run", async () => {
  const dateString = moment().format("YYYY-MM-DD")
  const name = `${_PKG_NAME}-test`
  const logger = jaidLogger(name)
  expect(logger.appFolder.endsWith(name)).toBeTruthy()
  expect(logger.logFolder.endsWith("log")).toBeTruthy()
  logger.error("Something went wrong: %s", new Error("123"))
  logger.warn("abc is not %s", "cba")
  logger.info("def")
  const logScopes = ["debug", "error"]
  for (const logScope of logScopes) {
    const logFile = path.join(logger.logFolder, logScope, `${dateString}.txt`)
    logger.info("%s log file: %s", logScope, logFile)
    await delay(3000) // Needed because logger.info is async and we have to wait for the logFile to get created and written
    expect(fs.existsSync(logFile)).toBeTruthy()
    const content = fs.readFileSync(logFile, "utf8")
    expect(content.length).toBeGreaterThan(5)
  }
}, ms`10 seconds`)