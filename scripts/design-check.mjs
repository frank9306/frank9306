import { access, readFile } from 'node:fs/promises'

const [contract, styles, home, footer] = await Promise.all([
  readFile(new URL('../DESIGN.md', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8'),
])

const visibleCopy = `${home}\n${footer}`
const assetChecks = await Promise.all([
  access(new URL('../public/images/agent-workbench-hero.webp', import.meta.url)).then(() => true, () => false),
  access(new URL('../public/images/workflow-modules.webp', import.meta.url)).then(() => true, () => false),
  access(new URL('../public/fonts/Manrope-Latin.woff2', import.meta.url)).then(() => true, () => false),
])

const requirements = [
  ['design contract', contract.includes('# Webfrank Systems Workbench')],
  ['explicit Taste Skill dials', contract.includes('DESIGN_VARIANCE 8, MOTION_INTENSITY 5, and VISUAL_DENSITY 4')],
  ['semantic color tokens', /--canvas:|--surface:|--ink:|--accent:/.test(styles)],
  ['light and dark theme tokens', styles.includes('@media (prefers-color-scheme: dark)')],
  ['self-hosted variable font', styles.includes("url('/fonts/Manrope-Latin.woff2')") && !styles.includes('fonts.googleapis.com')],
  ['project-owned imagery', assetChecks.every(Boolean) && home.includes('/images/agent-workbench-hero.webp') && home.includes('/images/workflow-modules.webp')],
  ['visible focus treatment', styles.includes(':focus-visible') && styles.includes(':focus-within')],
  ['mobile breakpoint', styles.includes('@media (max-width: 767px)')],
  ['tablet breakpoint', styles.includes('@media (max-width: 980px)')],
  ['reduced motion fallback', styles.includes('@media (prefers-reduced-motion: reduce)')],
  ['dynamic viewport hero', styles.includes('100dvh')],
  ['asymmetric hero grid', /\.hero-grid\s*\{[^}]*repeat\(12/s.test(styles)],
  ['asymmetric project matrix', /\.project-card:nth-child\(4n \+ 1\)[\s\S]*grid-column:\s*span 7/s.test(styles)],
  ['sharp shape system', !styles.includes('border-radius')],
  ['no transition all', !/transition:\s*all\b/.test(styles)],
  ['no visible em dash', !/[—–]/.test(visibleCopy)],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length) {
  console.error(`Design check failed: ${failures.map(([name]) => name).join(', ')}`)
  process.exit(1)
}

console.log(`Design check passed: ${requirements.length} contract and implementation requirements verified.`)
