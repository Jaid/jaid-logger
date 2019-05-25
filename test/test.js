import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require
const {default: jaidLogger} = indexModule

it("should run", () => {
  const result = jaidLogger()
  expect(result).toBeGreaterThan(1549410770)
})