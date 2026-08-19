import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"

const screens = [
  "splash",
  "onboard",
  "login",
  "role",
  "s-home",
  "t-home",
  "s-profile",
  "ai-chat",
]

await mkdir("shots", { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 520, height: 980 } })

for (const id of screens) {
  await page.goto(`http://127.0.0.1:5173/?screen=${id}&shot=1`, { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  const phone = page.locator("#phone-device")
  await phone.waitFor({ state: "visible" })
  await phone.screenshot({ path: `shots/${id}.png` })
  console.log("captured", id)
}

await browser.close()
