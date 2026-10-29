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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/项目|Projects/)
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/这个页面不存在|This page doesn't exist/)
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

  test('keeps below-the-fold homepage content visible without scrolling', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.about-section')).toHaveCSS('opacity', '1')
    await expect(page.locator('.site-footer')).toHaveCSS('opacity', '1')
  })

  test('shows a full-row focus treatment for project destinations', async ({ page }) => {
    await page.goto('/')

    const firstProject = page.locator('.project-card').first()
    await firstProject.locator('.project-link').focus()
    await expect(firstProject).toHaveCSS('outline-color', 'rgb(189, 63, 31)')
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

    await expect(page.locator('h1')).toHaveText('这里放我的项目、笔记，还有一些没做完的想法。')
    await expect(page.getByRole('heading', { name: '我做的东西' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '联系我' })).toBeVisible()
    await expect(page.getByText('有事找我，或者聊聊也行。')).toBeVisible()
    await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href', '/projects')
    await page.screenshot({ path: testInfo.outputPath('homepage-zh.png'), fullPage: true })
    await testInfo.attach('homepage-zh', { path: testInfo.outputPath('homepage-zh.png'), contentType: 'image/png' })

    if (testInfo.project.name !== 'desktop-chrome') {
      const menu = page.locator('.menu-button')
      await expect(menu).toHaveAccessibleName('打开菜单')
      await menu.click()
      await expect(menu).toHaveAttribute('aria-expanded', 'true')
    }

    await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Here are my projects, notes, and a few unfinished ideas.')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Here are my projects, notes, and a few unfinished ideas.')
    await expect(page.getByRole('heading', { name: 'Contact me' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath('homepage-en.png'), fullPage: true })
    await testInfo.attach('homepage-en', { path: testInfo.outputPath('homepage-en.png'), contentType: 'image/png' })
    await page.locator('.hero-actions a').first().click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.locator('h1')).toHaveText('Projects')

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

    expect(contrast('#191918', '#f1efe8')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#56554f', '#f1efe8')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#bd3f1f', '#f1efe8')).toBeGreaterThanOrEqual(4.5)
  })
})

test.describe('reduced motion', () => {
  test('keeps homepage content visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.about-section')).toHaveCSS('opacity', '1')
    await expect(page.locator('.featured-section')).toHaveCSS('opacity', '1')
  })
})
