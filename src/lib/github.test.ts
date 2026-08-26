import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CACHE_TTL_MS, PROJECT_CACHE_KEY, loadProjects, matchProjects, readProjectCache } from './github'

describe('GitHub project data', () => {
  beforeEach(() => localStorage.clear())

  it('maps eligible repositories dynamically and sorts them by latest update', () => {
    const result = matchProjects([
      { name: 'older-project', description: 'Older project', stargazers_count: 12, language: 'Python', updated_at: '2026-08-01T00:00:00Z', topics: ['agents'], fork: false, archived: false, html_url: 'https://github.com/frank9306/older-project' },
      { name: 'latest-project', description: 'Latest project', stargazers_count: 24, language: 'Rust', updated_at: '2026-08-03T00:00:00Z', topics: ['codex'], fork: false, archived: false, html_url: 'https://github.com/frank9306/latest-project' },
      { name: 'alpha-project', description: 'Alphabetical tie breaker', stargazers_count: 4, language: 'TypeScript', updated_at: '2026-08-03T00:00:00Z', topics: [], fork: false, archived: false, html_url: 'https://github.com/frank9306/alpha-project' },
      { name: 'my-knowledge', description: 'Knowledge base', stargazers_count: 1, language: 'TypeScript', updated_at: '2026-08-06T00:00:00Z', topics: [], fork: false, archived: false, html_url: 'https://github.com/frank9306/my-knowledge' },
      { name: 'FRANK9306', description: 'Profile homepage', stargazers_count: 1, language: 'HTML', updated_at: '2026-08-05T00:00:00Z', topics: [], fork: false, archived: false, html_url: 'https://github.com/frank9306/frank9306' },
      { name: 'forked-project', description: null, stargazers_count: 3, language: null, updated_at: '2026-08-04T00:00:00Z', topics: [], fork: true, archived: false, html_url: 'https://github.com/frank9306/forked-project' },
      { name: 'archived-project', description: null, stargazers_count: 2, language: null, updated_at: '2026-08-05T00:00:00Z', topics: [], fork: false, archived: true, html_url: 'https://github.com/frank9306/archived-project' },
    ])
    expect(result.map((project) => project.name)).toEqual(['alpha-project', 'latest-project', 'older-project'])
    expect(result[1].stars).toBe(24)
    expect(result[2].stars).toBe(12)
    expect(result[1].tags).toEqual(['codex'])
  })

  it('uses safe card values when optional repository fields are absent', () => {
    const [project] = matchProjects([
      { name: 'minimal-project', stargazers_count: 0, updated_at: '2026-08-03T00:00:00Z' },
    ])
    expect(project.description.en).toBe('No description provided.')
    expect(project.language).toBe('Unknown')
    expect(project.tags).toEqual([])
    expect(project.url).toBe('https://github.com/frank9306/minimal-project')
  })

  it('ignores expired cache entries', () => {
    localStorage.setItem(PROJECT_CACHE_KEY, JSON.stringify({ expiresAt: 10, projects: [] }))
    expect(readProjectCache(localStorage, 11)).toBeNull()
  })

  it('returns and reuses live API data from cache', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { name: 'codex-switch-helper', description: 'Switch Codex environments', stargazers_count: 20, language: 'Rust', updated_at: '2026-08-03T00:00:00Z', topics: ['codex'], fork: false, archived: false, html_url: 'https://github.com/frank9306/codex-switch-helper' },
    ]), { status: 200 }))
    const first = await loadProjects({ storage: localStorage, fetcher, now: 100, timeoutMs: 100 })
    const second = await loadProjects({ storage: localStorage, fetcher, now: 100 + CACHE_TTL_MS - 1 })
    expect(first.source).toBe('live')
    expect(first.projects[0].stars).toBe(20)
    expect(second.source).toBe('cache')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('falls back to static snapshots when the API fails', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('offline'))
    const result = await loadProjects({ storage: localStorage, fetcher, timeoutMs: 10 })
    expect(result.source).toBe('fallback')
    expect(result.projects).toHaveLength(4)
    expect(result.projects[0].stars).toBeGreaterThanOrEqual(0)
  })
})
