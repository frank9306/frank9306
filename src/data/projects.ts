import type { ProjectDefinition } from '../types'

export const projects: ProjectDefinition[] = [
  {
    slug: 'codex-switch-helper',
    repo: 'codex-switch-helper',
    index: '01',
    name: 'Codex Switch Helper',
    description: {
      zh: '不用反复改配置，在不同 Codex 环境之间快速切换。',
      en: 'Switch between Codex environments without repeatedly editing configuration.',
    },
    role: { zh: '开发者工具', en: 'Developer tool' },
    tags: ['Rust', 'Codex', 'Desktop'],
    fallback: { stars: 3, language: 'Rust', updatedAt: '2026-07-01T00:00:00Z' },
  },
  {
    slug: 'polyharness',
    repo: 'PolyHarness',
    index: '02',
    name: 'PolyHarness',
    description: {
      zh: '给 Agent 的工程结果配上目标、检查和证据。',
      en: 'Give agent-driven engineering explicit goals, checks, and evidence.',
    },
    role: { zh: '工程基础设施', en: 'Engineering infrastructure' },
    tags: ['Python', 'Agents', 'Verification'],
    fallback: { stars: 0, language: 'Python', updatedAt: '2026-07-01T00:00:00Z' },
  },
  {
    slug: 'quick-nav',
    repo: 'quick-nav-extension',
    index: '03',
    name: 'QuickNav',
    description: {
      zh: '一个安静、顺手的新标签页，把常用网站放在眼前。',
      en: 'A quiet, practical new tab that keeps everyday sites close at hand.',
    },
    role: { zh: '浏览器扩展', en: 'Browser extension' },
    tags: ['TypeScript', 'Extension', 'Productivity'],
    fallback: { stars: 8, language: 'TypeScript', updatedAt: '2026-07-01T00:00:00Z' },
  },
  {
    slug: 'agent-skills',
    repo: 'agent-skills',
    index: '04',
    name: 'Agent Skills',
    description: {
      zh: '把反复使用的方法做成可以安装、复用和验证的 Agent Skills。',
      en: 'Reusable, installable Agent Skills built from workflows worth repeating.',
    },
    role: { zh: '技能集合', en: 'Skill collection' },
    tags: ['Agents', 'Skills', 'Workflow'],
    fallback: { stars: 0, language: 'Markdown', updatedAt: '2026-08-07T00:00:00Z' },
  },
]

export const profileLinks = {
  github: 'https://github.com/frank9306',
  knowledge: 'https://knowledge.webfrank.top/',
  email: 'mailto:liufrank621@gmail.com',
  telegram: 'https://t.me/frankl0622',
} as const
