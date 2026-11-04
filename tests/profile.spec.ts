import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'

const generated = new URL('../profile/generated/', import.meta.url)

test('profile SVGs keep every glyph inside the card and separate portrait from information', async ({ page }) => {
  for (const layout of ['desktop', 'mobile']) {
    for (const theme of ['light', 'dark']) {
      const svg = await readFile(new URL(`${layout}-${theme}.svg`, generated), 'utf8')
      await page.setContent(svg)
      const violations = await page.locator('svg').evaluate((root) => {
        const viewBox = (root as SVGSVGElement).viewBox.baseVal
        const rows = [...root.querySelectorAll('text')].map((element) => ({ value: element.textContent, box: element.getBBox() }))
        return rows.filter(({ value, box }) => value?.trim() && (box.x < 10 || box.y < 10 || box.x + box.width > viewBox.width - 10 || box.y + box.height > viewBox.height - 10)).map(({ value }) => value)
      })
      expect(violations, `${layout}/${theme}: text must stay inside the SVG`).toEqual([])
      const portraitBottom = await page.locator('text[xml\\:space="preserve"]').evaluateAll((nodes) => Math.max(...nodes.map((node) => {
        const box = (node as SVGTextElement).getBBox()
        return box.y + box.height
      })))
      if (layout === 'mobile') {
        const name = await page.getByText('Frank', { exact: true }).evaluate((node) => (node as unknown as SVGTextElement).getBBox().y)
        expect(portraitBottom).toBeLessThan(name - 15)
      } else {
        const rightEdge = await page.locator('text[xml\\:space="preserve"]').evaluateAll((nodes) => Math.max(...nodes.map((node) => {
          const box = (node as SVGTextElement).getBBox()
          return box.x + box.width
        })))
        expect(rightEdge).toBeLessThan(365)
      }
    }
  }
})

test('the card stays readable beside a GitHub-style sidebar on a 900px screen', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8')
  let picture = readme.match(/<picture>[\s\S]*?<\/picture>/)![0]
  for (const layout of ['desktop', 'mobile']) {
    for (const theme of ['light', 'dark']) {
      const name = `${layout}-${theme}.svg`
      picture = picture.replaceAll(`./profile/generated/${name}`, `data:image/svg+xml;base64,${Buffer.from(await readFile(new URL(name, generated))).toString('base64')}`)
    }
  }
  await page.setContent(`<style>body{margin:32px;display:grid;grid-template-columns:264px minmax(0,1fr);gap:24px}img{max-width:100%;height:auto}</style><aside>Frank</aside><main>${picture}</main>`)
  await page.getByRole('img').evaluate((node) => (node as HTMLImageElement).decode())
  const smallestBodyFont = await page.getByRole('img').evaluate((node) => {
    const image = node as HTMLImageElement
    return (image.naturalWidth === 420 ? 14.5 : 16) * image.getBoundingClientRect().width / image.naturalWidth
  })
  expect(smallestBodyFont).toBeGreaterThanOrEqual(12)
})

test('README selects the correct responsive theme asset without horizontal overflow', async ({ page }) => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8')
  const original = readme.match(/<picture>[\s\S]*?<\/picture>/)?.[0]
  expect(original).toBeTruthy()
  const data = new Map<string, string>()
  let picture = original!
  for (const layout of ['desktop', 'mobile']) {
    for (const theme of ['light', 'dark']) {
      const name = `${layout}-${theme}.svg`
      const uri = `data:image/svg+xml;base64,${Buffer.from(await readFile(new URL(name, generated))).toString('base64')}`
      data.set(name, uri)
      picture = picture.replaceAll(`./profile/generated/${name}`, uri)
    }
  }
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme })
    await page.setContent(`<style>body{margin:16px}img{max-width:100%;height:auto}</style>${picture}`)
    const image = page.getByRole('img')
    await expect(image).toBeVisible()
    await image.evaluate((node) => (node as HTMLImageElement).decode())
    const mobile = page.viewportSize()!.width <= 1200
    expect(await image.evaluate((node) => (node as HTMLImageElement).currentSrc)).toBe(data.get(`${mobile ? 'mobile' : 'desktop'}-${colorScheme}.svg`))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
  }
})
