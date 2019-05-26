import path from "path"
import fs from "fs"

import appdataPath from "appdata-path"
import moment from "moment"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require
const {default: jaidLogger} = indexModule

it("should run", () => {
  const dateString = moment().format("YYYY-MM-DD")
  const id = `${_PKG_NAME}-test`
  const logger = jaidLogger(id)
  logger.error("123")
  logger.warn("abc")
  logger.info("def")
  const logScopes = ["debug", "error"]
  for (const logScope of logScopes) {
    const logFile = path.join(appdataPath(id), "log", `${id}_${logScope}_${dateString}.txt`)
    expect(fs.existsSync(logFile)).toBeTruthy()
    const content = fs.readFileSync(logFile, "utf8")
    expect(content.length).toBeGreaterThan(5)
  }
})