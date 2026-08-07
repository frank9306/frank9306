import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
})

test.describe('portfolio browser journey', () => {
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

  test('shows only the selected projects in order across project surfaces', async ({ page }) => {
    const selectedProjects = [
      'Codex Switch Helper',
      'PolyHarness',
      'QuickNav',
      'Agent Skills',
    ]

    for (const path of ['/', '/projects']) {
      await page.goto(path)
      await expect(page.locator('.project-card h3')).toHaveText(selectedProjects)
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
