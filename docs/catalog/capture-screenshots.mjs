import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'screenshots')
const BASE = process.env.MIDESK_URL || 'http://localhost:3000'

const USERS = {
  owner: { email: 'owner@midesk.test', password: 'password' },
  member: { email: 'member@midesk.test', password: 'password' },
  finance: { email: 'finance@midesk.test', password: 'password' }
}

const SHOTS = [
  { name: '01-login', path: '/login', auth: false },
  { name: '02-dashboard', path: '/dashboard', user: 'owner' },
  { name: '03-projects', path: '/projects', user: 'owner' },
  { name: '04-worklog', path: '/worklog', user: 'owner' },
  { name: '05-calendar', path: '/calendar', user: 'owner' },
  { name: '06-leave', path: '/leave', user: 'owner' },
  { name: '07-chat', path: '/chat', user: 'owner' },
  { name: '08-meetings', path: '/meetings', user: 'owner' },
  { name: '09-ai', path: '/ai', user: 'owner' },
  { name: '10-notes', path: '/notes', user: 'owner' },
  { name: '11-performance', path: '/performance', user: 'owner' },
  { name: '12-crm', path: '/crm', user: 'owner' },
  { name: '13-correspondence', path: '/correspondence', user: 'owner' },
  { name: '14-surveys', path: '/surveys', user: 'owner' },
  { name: '15-reports', path: '/reports', user: 'owner' },
  { name: '16-hr-dashboard', path: '/hr', user: 'owner' },
  { name: '17-hr-attendance', path: '/hr/attendance', user: 'owner' },
  { name: '18-hr-personnel', path: '/hr/personnel', user: 'owner' },
  { name: '19-finance-dashboard', path: '/finance', user: 'finance' },
  { name: '20-finance-expenses', path: '/finance/expenses', user: 'finance' },
  { name: '21-my-finance', path: '/my-finance', user: 'member' },
  { name: '22-settings', path: '/settings', user: 'owner' },
  { name: '23-teams', path: '/teams', user: 'owner' },
  { name: '24-notifications', path: '/notifications', user: 'owner' }
]

async function login(page, userKey) {
  const user = USERS[userKey]
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.locator('input[type="email"], input[name="email"]').first().fill(user.email)
  await page.locator('input[type="password"]').first().fill(user.password)
  await page.locator('button[type="submit"]').first().click()
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 })
  await page.waitForTimeout(1500)
}

async function capture() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'fa-IR'
  })
  const page = await context.newPage()

  let currentUser = null

  for (const shot of SHOTS) {
    try {
      if (shot.auth !== false && shot.user && shot.user !== currentUser) {
        await login(page, shot.user)
        currentUser = shot.user
      }

      if (shot.auth === false) {
        await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' })
      } else {
        await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' })
      }

      await page.waitForTimeout(1200)

      if (shot.name === '03-projects') {
        const projectLink = page.locator('a[href*="/projects/"]').first()
        if (await projectLink.count()) {
          await projectLink.click()
          await page.waitForTimeout(1500)
          await page.screenshot({
            path: path.join(OUT, '03b-project-kanban.png'),
            fullPage: false
          })
        }
      }

      await page.screenshot({
        path: path.join(OUT, `${shot.name}.png`),
        fullPage: false
      })
      console.log(`✓ ${shot.name}`)
    } catch (error) {
      console.error(`✗ ${shot.name}:`, error.message)
    }
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${OUT}`)
}

capture()
