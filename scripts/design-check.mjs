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
  ['rounded surface tokens', /--radius-sm:\s*10px;[\s\S]*--radius-md:\s*14px;[\s\S]*--radius-lg:\s*18px;/.test(styles)],
  ['approved font stack', styles.includes("'Inter', 'Microsoft YaHei'")],
  ['skip link radius', /\.skip-link\s*\{[^}]*border-radius:\s*var\(--radius-sm\)/s.test(styles)],
  ['menu button radius', /\.menu-button\s*\{[^}]*border-radius:\s*var\(--radius-sm\)/s.test(styles)],
  ['knowledge link radius', /\.circle-link\s*\{[^}]*border-radius:\s*var\(--radius-lg\)/s.test(styles)],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length) {
  console.error(`Design check failed: ${failures.map(([name]) => name).join(', ')}`)
  process.exit(1)
}

console.log(`Design check passed: ${requirements.length} contract and implementation requirements verified.`)
