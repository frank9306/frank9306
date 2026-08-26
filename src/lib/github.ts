import { projects as definitions } from '../data/projects'
import type { Project, ProjectDataResult, ProjectDefinition } from '../types'

const GITHUB_REPOS_URL = 'https://api.github.com/users/frank9306/repos?per_page=100&sort=updated'
export const PROJECT_CACHE_KEY = 'webfrank-github-projects-v3'
export const CACHE_TTL_MS = 60 * 60 * 1000
const EXCLUDED_REPOSITORIES = new Set(['my-knowledge', 'frank9306'])

interface GitHubRepo {
  name: string
  description?: string | null
  stargazers_count?: number
  language?: string | null
  updated_at?: string
  topics?: string[]
  fork?: boolean
  archived?: boolean
  html_url?: string
}

interface CacheEntry {
  expiresAt: number
  projects: Project[]
}

function fallbackProject(project: ProjectDefinition): Project {
  return { ...project, ...project.fallback, url: `https://github.com/frank9306/${project.repo}` }
}

export function matchProjects(repos: GitHubRepo[], projectDefinitions = definitions): Project[] {
  const definitionsByRepo = new Map(projectDefinitions.map((project) => [project.repo.toLowerCase(), project]))
  return repos
    .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOSITORIES.has(repo.name.toLowerCase()))
    .sort((left, right) => {
      const updatedOrder = (right.updated_at ?? '').localeCompare(left.updated_at ?? '')
      if (updatedOrder !== 0) return updatedOrder
      return left.name < right.name ? -1 : left.name > right.name ? 1 : 0
    })
    .map((repo, position) => {
      const definition = definitionsByRepo.get(repo.name.toLowerCase())
      const language = repo.language ?? definition?.fallback.language ?? 'Unknown'
      const description = repo.description ?? 'No description provided.'
      const stars = repo.stargazers_count ?? 0
      const updatedAt = repo.updated_at ?? definition?.fallback.updatedAt ?? '1970-01-01T00:00:00Z'
      const topics = repo.topics ?? []
      return {
        slug: definition?.slug ?? repo.name.toLowerCase(),
        repo: repo.name,
        index: String(position + 1).padStart(2, '0'),
        name: definition?.name ?? repo.name,
        description: definition?.description ?? { zh: description, en: description },
        role: definition?.role ?? { zh: 'GitHub 项目', en: 'GitHub project' },
        tags: topics.length > 0 ? topics : definition?.tags ?? (language === 'Unknown' ? [] : [language]),
        fallback: definition?.fallback ?? { stars, language, updatedAt },
        links: definition?.links,
        stars,
        language,
        updatedAt,
        url: repo.html_url || `https://github.com/frank9306/${repo.name}`,
      }
    })
}

export function readProjectCache(storage: Storage, now = Date.now()): Project[] | null {
  try {
    const raw = storage.getItem(PROJECT_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as CacheEntry
    if (!Array.isArray(cached.projects) || cached.expiresAt <= now) return null
    return cached.projects
  } catch {
    return null
  }
}

function writeProjectCache(storage: Storage, projects: Project[], now = Date.now()): void {
  try {
    storage.setItem(PROJECT_CACHE_KEY, JSON.stringify({ projects, expiresAt: now + CACHE_TTL_MS }))
  } catch {
    // Storage can be unavailable in privacy modes; live data remains usable.
  }
}

export async function loadProjects(options: {
  storage?: Storage
  fetcher?: typeof fetch
  now?: number
  timeoutMs?: number
} = {}): Promise<ProjectDataResult> {
  const storage = options.storage ?? localStorage
  const now = options.now ?? Date.now()
  const cached = readProjectCache(storage, now)
  if (cached) return { projects: cached, source: 'cache' }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000)
  try {
    const response = await (options.fetcher ?? fetch)(GITHUB_REPOS_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`)
    const repos = (await response.json()) as GitHubRepo[]
    const projects = matchProjects(repos)
    writeProjectCache(storage, projects, now)
    return { projects, source: 'live' }
  } catch {
    return { projects: definitions.map(fallbackProject), source: 'fallback' }
  } finally {
    clearTimeout(timeoutId)
  }
}
