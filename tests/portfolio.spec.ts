import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.removeItem('webfrank-github-projects-v3'); if (!localStorage.getItem('webfrank-locale')) localStorage.setItem('webfrank-locale', 'zh') })
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: 'unavailable' }))
})

test('restores direct project and unknown GitHub Pages entries', async ({ page }) => {
  const fallback = await readFile(new URL('../public/404.html', import.meta.url), 'utf8')
  for (const path of ['/projects', '/missing-direct']) {
    await page.route(`**${path}`, route => route.fulfill({ status: 404, contentType: 'text/html', body: fallback }))
    await page.goto(path)
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    if (path === '/projects') await expect(page.getByRole('region', { name: '我的项目', exact: true })).toBeVisible()
    else await expect(page.getByRole('heading', { name: '这个文件不在桌面上。', exact: true })).toBeVisible()
  }
})

test('opens one document and restores focus through minimize and close', async ({ page }) => {
  await page.goto('/')
  await page.locator('#shortcut-notes').click()
  await page.locator('#shortcut-notes').click()
  const notes = page.getByRole('region', { name: 'notes.txt', exact: true })
  await expect(notes).toHaveCount(1)
  await expect(notes).toBeFocused()
  await notes.getByRole('button', { name: '最小化 notes.txt', exact: true }).click()
  await expect(notes).toBeHidden()
  await expect(page.locator('#task-notes')).toBeFocused()
  await page.locator('#task-notes').click()
  await expect(notes).toBeFocused()
  await notes.getByRole('button', { name: '关闭 notes.txt', exact: true }).click()
  await expect(page.locator('#task-notes')).toHaveCount(0)
  await expect(page.locator('#shortcut-notes')).toBeFocused()
})

test('preserves route on minimize and follows Back/Forward after close', async ({ page }) => {
  await page.goto('/')
  await page.locator('#shortcut-projects').click()
  const projects = page.getByRole('region', { name: '我的项目', exact: true })
  await projects.getByRole('button', { name: '最小化 我的项目', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await page.locator('#shortcut-projects').click()
  await expect(projects).toBeVisible()
  await projects.getByRole('button', { name: '关闭 我的项目', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await page.goBack()
  await expect(projects).toBeVisible()
  await page.goForward()
  await expect(projects).toBeHidden()
})

test('activates an inactive window control in one pointer click', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 1000, 'Inactive windows are hidden in compact mode')
  await page.goto('/')
  await page.getByRole('button', { name: '最小化 我的项目', exact: true }).click()
  await expect(page.locator('#window-projects')).toBeHidden()
  await expect(page.locator('#task-projects')).toBeFocused()
  await page.locator('#task-projects').click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.locator('#window-projects')).toBeFocused()
})

test('keeps four initial projects and expands up to ten', async ({ page }) => {
  const repos = Array.from({ length: 12 }, (_, index) => ({ name: `project-${String(index + 1).padStart(2, '0')}`, description: `Project ${index + 1}`, stargazers_count: index, language: 'TypeScript', updated_at: new Date(Date.UTC(2026, 7, 12 - index)).toISOString(), topics: ['automation'], fork: false, archived: false }))
  await page.route('https://api.github.com/**', route => route.fulfill({ json: repos }))
  await page.goto('/projects')
  await expect(page.locator('.project-card h3')).toHaveText(['project-01', 'project-02', 'project-03', 'project-04'])
  await page.getByRole('button', { name: '展开更多项目（最多 10 项）', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(10)
})

test('shows empty and fallback recovery states with explicit repository targets', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('status')).toContainText('暂时连不上 GitHub')
  await expect(page.getByRole('link', { name: '在 GitHub 查看 Codex Switch Helper', exact: true })).toHaveAttribute('href', 'https://github.com/frank9306/codex-switch-helper')
  await page.route('https://api.github.com/**', route => route.fulfill({ json: [] }))
  await page.reload()
  await expect(page.getByText('这个文件夹暂时没有项目。')).toBeVisible()
  await expect(page.getByRole('link', { name: '前往 GitHub 查看', exact: true })).toHaveAttribute('href', 'https://github.com/frank9306')
})

test('retains locale and rewrites document metadata', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to English', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.evaluate(() => { if (localStorage.getItem('webfrank-locale') !== 'en') throw new Error('Locale was not saved') })
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle("Frank's desktop | Tools and notes")
})

test('supports Start keyboard navigation and visible focus', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await expect(page.locator('.skip-link')).toHaveCSS('outline-style', 'solid')
  await page.locator('#start-button').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#start-button')).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Escape')
  await expect(page.locator('#start-button')).toBeFocused()
})

test('keeps every route within the viewport and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const path of ['/', '/projects', '/missing']) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.goto('/')
  await expect(page.locator('.welcome-copy')).toHaveCSS('animation-name', 'none')
  expect(errors).toEqual([])
})

test('keeps mobile backgrounds inert or maximizes inside the desktop workspace', async ({ page }) => {
  await page.goto('/')
  if ((page.viewportSize()?.width ?? 0) <= 1000) {
    await expect(page.locator('.desktop-window:visible')).toHaveCount(1)
    await expect(page.getByRole('button', { name: /最大化/ })).toHaveCount(0)
    await page.locator('#shortcut-projects').click()
    await expect(page.locator('#window-hello')).toHaveAttribute('inert', '')
    await expect(page.locator('#window-projects')).toBeVisible()
  } else {
    await page.getByRole('button', { name: '最大化 hello.txt — 记事本', exact: true }).click()
    const workspace = await page.locator('.desktop-workspace').boundingBox()
    const frame = await page.locator('#window-hello').boundingBox()
    expect(frame).toEqual(workspace)
    await page.getByRole('button', { name: '还原 hello.txt — 记事本', exact: true }).click()
  }
})

test('computes readable contrast from the current theme instead of old color literals', async ({ page }) => {
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const [foreground, background] = await page.locator('.welcome-copy p').evaluate(el => [getComputedStyle(el).color, getComputedStyle(el.closest('.window-body')!).backgroundColor])
    const luminance = (rgb: string) => {
      const c = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 })
      return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
    }
    const a = luminance(foreground), b = luminance(background)
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(4.5)
    await page.locator('#shortcut-projects').click()
    await page.locator('.project-link').first().hover()
    const [hoverInk, hoverSurface] = await page.locator('.project-link').first().evaluate(el => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor])
    const hoverA = luminance(hoverInk), hoverB = luminance(hoverSurface)
    expect((Math.max(hoverA, hoverB) + .05) / (Math.min(hoverA, hoverB) + .05)).toBeGreaterThanOrEqual(4.5)
  }
})

test('keeps toolbar chrome and paper secondary text readable in both locales and schemes', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 1000, 'The sorting caption is visible on desktop only')
  const measure = async (selector: string) => {
    const target = page.locator(selector).first()
    await expect(target).toBeVisible()
    const colors = await target.evaluate(el => {
      let surface: Element | null = el
      while (surface && getComputedStyle(surface).backgroundColor === 'rgba(0, 0, 0, 0)') surface = surface.parentElement
      if (!surface) throw new Error('No painted background found')
      return { foreground: getComputedStyle(el).color, background: getComputedStyle(surface).backgroundColor }
    })
    const luminance = (rgb: string) => {
      const channels = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => {
        v /= 255
        return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4
      })
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
    }
    const a = luminance(colors.foreground), b = luminance(colors.background)
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
  }
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      for (const locale of ['zh', 'en']) {
        await page.goto('/projects')
        await page.evaluate(value => localStorage.setItem('webfrank-locale', value), locale)
        await page.reload()
        for (const selector of ['.explorer-toolbar > span', '.project-role', '.data-notice']) {
          expect(await measure(selector), `${width}/${scheme}/${locale}: ${selector}`).toBeGreaterThanOrEqual(4.5)
        }
        await page.locator('.project-link').first().hover()
        expect(await measure('.project-link'), `${width}/${scheme}/${locale}: repository hover`).toBeGreaterThanOrEqual(4.5)
      }
    }
  }
})
