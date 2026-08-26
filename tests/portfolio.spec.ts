import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: 'unavailable',
  }))
})

test.describe('portfolio browser journey', () => {
  test('restores a direct GitHub Pages entry to the projects route', async ({ page }) => {
    const pagesFallback = await readFile(new URL('../public/404.html', import.meta.url), 'utf8')
    await page.route('**/projects', (route) => route.fulfill({
      status: 404,
      contentType: 'text/html',
      body: pagesFallback,
    }))

    await page.goto('/projects')
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/项目与实验|Projects & experiments/)
  })

  test('restores an unknown GitHub Pages entry to the site not-found route', async ({ page }) => {
    const pagesFallback = await readFile(new URL('../public/404.html', import.meta.url), 'utf8')
    await page.route('**/missing-direct', (route) => route.fulfill({
      status: 404,
      contentType: 'text/html',
      body: pagesFallback,
    }))

    await page.goto('/missing-direct')
    await expect(page).toHaveURL(/\/missing-direct$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/这条路径还没有内容|Nothing has been built on this path/)
  })

  test('shows four latest repositories and expands the projects page to ten', async ({ page }) => {
    const repositories = Array.from({ length: 12 }, (_, index) => ({
      name: `project-${String(index + 1).padStart(2, '0')}`,
      description: `Project ${index + 1}`,
      stargazers_count: index,
      language: 'TypeScript',
      updated_at: new Date(Date.UTC(2026, 7, 12 - index)).toISOString(),
      topics: ['automation'],
      fork: false,
      archived: false,
      html_url: `https://github.com/frank9306/project-${String(index + 1).padStart(2, '0')}`,
    }))
    await page.route('https://api.github.com/**', (route) => route.fulfill({ json: repositories }))

    await page.goto('/')
    await expect(page.locator('.project-card')).toHaveCount(4)
    await expect(page.locator('.project-card h3')).toHaveText(['project-01', 'project-02', 'project-03', 'project-04'])

    await page.goto('/projects')
    await expect(page.locator('.project-card')).toHaveCount(4)
    const more = page.getByRole('button', { name: /more|更多/i })
    await expect(more).toBeVisible()
    await more.click()
    await expect(page.locator('.project-card')).toHaveCount(10)
    await expect(more).toBeHidden()
  })

  test('renders every route without horizontal overflow or console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })

    for (const path of ['/', '/projects', '/missing']) {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      const widths = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }))
      expect(widths.scroll).toBe(widths.client)
    }

    expect(errors).toEqual([])
  })

  test('shows the curated fallback projects when GitHub is unavailable', async ({ page }) => {
    const fallbackProjects = [
      'Codex Switch Helper',
      'PolyHarness',
      'QuickNav',
      'Agent Skills',
    ]

    for (const path of ['/', '/projects']) {
      await page.goto(path)
      await expect(page.locator('.project-card h3')).toHaveText(fallbackProjects)
      await expect(page.locator('.project-card')).toHaveCount(4)
    }
  })

  test('supports navigation and persistent language switching', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('webfrank-locale', 'zh'))
    await page.reload()

    if (testInfo.project.name !== 'desktop-chrome') {
      const menu = page.locator('.menu-button')
      await expect(menu).toHaveAccessibleName('打开菜单')
      await menu.click()
      await expect(menu).toHaveAttribute('aria-expanded', 'true')
    }

    await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi, I’m Frank')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi, I’m Frank')
  })

  test('supports keyboard focus and core WCAG AA contrast', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await expect(page.locator('.skip-link')).toHaveCSS('outline-style', 'solid')

    if (testInfo.project.name !== 'desktop-chrome') {
      const menu = page.locator('.menu-button')
      await menu.focus()
      await page.keyboard.press('Enter')
      await expect(menu).toHaveAttribute('aria-expanded', 'true')
    }

    const contrast = (foreground: string, background: string) => {
      const luminance = (hex: string) => {
        const channels = hex.match(/[a-f\d]{2}/gi)?.map((value) => parseInt(value, 16) / 255) ?? []
        const linear = channels.map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
        return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]
      }
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
      return (values[0] + .05) / (values[1] + .05)
    }

    expect(contrast('#e6f0f5', '#07111b')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#8da0ae', '#07111b')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#62e6bd', '#07111b')).toBeGreaterThanOrEqual(4.5)
  })
})

test.describe('reduced motion', () => {
  test('keeps reveal content visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.about-section')).toHaveCSS('opacity', '1')
    await expect(page.locator('.featured-section')).toHaveCSS('opacity', '1')
  })
})
