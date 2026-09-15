import fs from "fs"
const s = fs.readFileSync("src/App.tsx", "utf8")
const m = s.match(/type Screen =([\s\S]*?)\ntype Go/)
if (!m) { console.log("no Screen type"); process.exit(1) }
const screens = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
const checked = new Set([...s.matchAll(/screen === "([^"]+)"/g)].map((x) => x[1]))
const missing = screens.filter((x) => !checked.has(x))
console.log("Total screens", screens.length)
console.log("Missing render checks:", missing.join(", ") || "none")

const btnNo = []
const re = /<Btn([^>]*)>([^<]*)<\/Btn>/g
let mm
while ((mm = re.exec(s))) {
  if (!mm[1].includes("onClick")) {
    btnNo.push({
      line: s.slice(0, mm.index).split("\n").length,
      text: mm[2].trim().slice(0, 40),
    })
  }
}
console.log("\nBtn without onClick:", btnNo.length)
btnNo.forEach((b) => console.log(b.line + ": " + b.text))

const empty = [...s.matchAll(/onClick=\{\(\) => \{\}\}/g)]
console.log("\nEmpty onClick:", empty.length)
empty.forEach((x) => console.log("  line", s.slice(0, x.index).split("\n").length))
