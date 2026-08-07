import { projects as definitions } from '../data/projects'
import type { Project, ProjectDataResult, ProjectDefinition } from '../types'

const GITHUB_REPOS_URL = 'https://api.github.com/users/frank9306/repos?per_page=100&sort=updated'
export const PROJECT_CACHE_KEY = 'webfrank-github-projects-v1'
export const CACHE_TTL_MS = 60 * 60 * 1000

interface GitHubRepo {
  name: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

interface CacheEntry {
  expiresAt: number
  projects: Project[]
}

function fallbackProject(project: ProjectDefinition): Project {
  return { ...project, ...project.fallback }
}

export function matchProjects(repos: GitHubRepo[], projectDefinitions = definitions): Project[] {
  const reposByName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]))
  return projectDefinitions.map((project) => {
    const repo = reposByName.get(project.repo.toLowerCase())
    if (!repo) return fallbackProject(project)
    return {
      ...project,
      stars: repo.stargazers_count,
      language: repo.language ?? project.fallback.language,
      updatedAt: repo.updated_at,
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
