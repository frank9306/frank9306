import { access, readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const [contract, styles, desktop, home, projects, notes] = await Promise.all([
  read('DESIGN.md'), read('src/styles.css'), read('src/desktop/Desktop.tsx'),
  read('src/pages/HomePage.tsx'), read('src/pages/ProjectsPage.tsx'), read('src/data/notes.ts'),
])
const assets = await Promise.all(['public/images/retro-desk.png', 'public/images/retro-desk.png.json', 'public/fonts/Manrope-Latin.woff2'].map((path) => access(new URL(`../${path}`, import.meta.url)).then(() => true, () => false)))
const requirements = [
  ['current desktop design record', contract.includes("Frank's desktop") && contract.includes('#087c7d')],
  ['teal/navy/paper semantic tokens', ['--desktop:', '--title:', '--paper:', '--ink:', '--focus:'].every((token) => styles.includes(token))],
  ['automatic dark scheme', styles.includes('@media (prefers-color-scheme: dark)')],
  ['self-hosted font', styles.includes("url('/fonts/Manrope-Latin.woff2')") && !styles.includes('fonts.googleapis.com')],
  ['original desk asset and provenance', assets.every(Boolean) && home.includes('/images/retro-desk.png')],
  ['visible keyboard and project focus', styles.includes(':focus-visible') && styles.includes('.project-card:focus-within')],
  ['compact normal-flow layout', styles.includes('@media (max-width: 1000px)') && /\.desktop-window\s*\{\s*position:\s*relative/.test(styles)],
  ['small mobile layout', styles.includes('@media (max-width: 600px)')],
  ['reduced motion fallback', styles.includes('@media (prefers-reduced-motion: reduce)')],
  ['dynamic viewport workspace', styles.includes('100dvh')],
  ['hidden background focus boundary', desktop.includes('inert={hidden}') && desktop.includes('hidden={hidden}')],
  ['native project route links', desktop.includes('href="/projects"')],
  ['real taskbar and start menu', desktop.includes('task-buttons') && desktop.includes('start-button')],
  ['keyboard position alternatives', desktop.includes("place('top')") && desktop.includes("type: 'reset'")],
  ['loading/empty/cache/fallback states', ['empty-folder', "source === 'cache'", "source === 'fallback'", 'aria-busy'].every((state) => projects.includes(state))],
  ['verified article targets', ['paperclip-codex-weixin-agent-company', 'vibe-coding-top-10-readings', 'cross-session-agent-handoff'].every((slug) => notes.includes(slug))],
  ['sharp corners', !styles.includes('border-radius')],
  ['targeted transitions', !/transition:\s*all\b/.test(styles)],
  ['no obsolete workbench images in welcome', !home.includes('workbench')],
]
const failures = requirements.filter(([, passed]) => !passed)
if (failures.length) { console.error(`Design check failed: ${failures.map(([name]) => name).join(', ')}`); process.exit(1) }
console.log(`Design check passed: ${requirements.length} contract/static requirements verified. Runtime layout and contrast require Playwright assertions.`)
