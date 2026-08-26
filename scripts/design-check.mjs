import { readFile } from 'node:fs/promises'

const [contract, styles] = await Promise.all([
  readFile(new URL('../DESIGN.md', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
])

const requirements = [
  ['design contract', contract.includes('# Webfrank Developer Profile')],
  ['semantic color tokens', /--canvas:|--surface:|--ink:|--accent:/.test(styles)],
  ['visible focus treatment', styles.includes(':focus-visible')],
  ['mobile breakpoint', styles.includes('@media (max-width: 640px)')],
  ['tablet breakpoint', styles.includes('@media (max-width: 900px)')],
  ['reduced motion fallback', styles.includes('@media (prefers-reduced-motion: reduce)')],
  ['restrained surface tokens', /--radius-sm:\s*4px;[\s\S]*--radius-md:\s*6px;/.test(styles)],
  ['approved font stack', styles.includes("'Inter', 'Microsoft YaHei'")],
  ['skip link radius', /\.skip-link\s*\{[^}]*border-radius:\s*var\(--radius-sm\)/s.test(styles)],
  ['mobile menu target', /\.menu-button\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/s.test(styles)],
  ['horizontal project evidence', /\.featured-grid \.project-card\s*\{[^}]*grid-template-columns:/s.test(styles)],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length) {
  console.error(`Design check failed: ${failures.map(([name]) => name).join(', ')}`)
  process.exit(1)
}

console.log(`Design check passed: ${requirements.length} contract and implementation requirements verified.`)
