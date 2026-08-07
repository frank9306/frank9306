import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CACHE_TTL_MS, PROJECT_CACHE_KEY, loadProjects, matchProjects, readProjectCache } from './github'

describe('GitHub project data', () => {
  beforeEach(() => localStorage.clear())

  it('matches repositories case-insensitively and preserves project order', () => {
    const result = matchProjects([
      { name: 'CODEX-SWITCH-HELPER', stargazers_count: 24, language: 'Rust', updated_at: '2026-08-03T00:00:00Z' },
      { name: 'POLYHARNESS', stargazers_count: 12, language: 'Python', updated_at: '2026-08-01T00:00:00Z' },
      { name: 'quick-nav-extension', stargazers_count: 18, language: 'TypeScript', updated_at: '2026-08-02T00:00:00Z' },
    ])
    expect(result[0].name).toBe('Codex Switch Helper')
    expect(result[0].stars).toBe(24)
    expect(result[1].stars).toBe(12)
    expect(result[2].stars).toBe(18)
  })

  it('ignores expired cache entries', () => {
    localStorage.setItem(PROJECT_CACHE_KEY, JSON.stringify({ expiresAt: 10, projects: [] }))
    expect(readProjectCache(localStorage, 11)).toBeNull()
  })

  it('returns and reuses live API data from cache', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { name: 'codex-switch-helper', stargazers_count: 20, language: 'Rust', updated_at: '2026-08-03T00:00:00Z' },
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
