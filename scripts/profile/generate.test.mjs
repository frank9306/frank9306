// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generateProfile, renderProfile } from './generate.mjs'

const now = new Date('2026-11-03T09:20:00.000Z')
const profile = {
  login: 'frank9306', name: 'Frank', role: '全栈工程师', experience: '近十年开发经验',
  focus: ['AI Agent', 'Harness Engineering', '浏览器自动化'],
  stack: ['Python · TypeScript · JavaScript', 'Playwright · FastAPI · React · Linux'],
  tools: 'Codex · Claude', website: 'webfrank.top', notes: 'knowledge.webfrank.top',
}

function api({ pages = [[]], followers = 0, commits = [], prs = [], reviews = [], fail } = {}) {
  const requests = []
  const fetch = async (input, options) => {
    const url = new URL(input)
    const body = options?.body ? JSON.parse(options.body) : null
    requests.push({ url, body })
    if (fail) return fail(url, body)
    if (url.pathname === '/users/frank9306') return Response.json({ followers })
    if (url.pathname.endsWith('/repos')) {
      const page = Number(url.searchParams.get('page'))
      return Response.json(pages[page - 1] ?? [], {
        headers: page < pages.length ? { link: `<https://api.github.com/users/frank9306/repos?type=owner&per_page=100&page=${page + 1}>; rel="next"` } : {},
      })
    }
    const page = body.variables.cursor ? 1 : 0
    const connection = (nodes) => ({ nodes: nodes[page] ?? [], pageInfo: { hasNextPage: page + 1 < nodes.length, endCursor: page + 1 < nodes.length ? 'next' : null } })
    const groups = body.variables.from === '2025-11-03T09:20:00.000Z' ? commits : []
    const collection = body.operationName === 'CommitContributions'
      ? { totalRepositoriesWithContributedCommits: groups.length, commitContributionsByRepository: groups }
      : { pullRequestContributions: connection(prs), pullRequestReviewContributions: connection(reviews) }
    return Response.json({ data: { user: { contributionsCollection: collection } } })
  }
  return { fetch, requests }
}

describe('GitHub profile generation', () => {
  it('re-renders a saved public snapshot without changing its values or update time', () => {
    const stats = Object.freeze({ repositories: 11, stars: 10, forks: 1, followers: 4, commits: 116, pullRequests: 1, reviews: 1, updatedAt: now.toISOString(), period: Object.freeze({ from: '2025-11-03T09:20:00.000Z', to: now.toISOString() }) })
    const result = renderProfile({ profile, portrait: '@@', stats })
    expect(JSON.parse(result.files['stats.json'])).toEqual(stats)
    expect(result.files['desktop-light.svg']).toContain('Updated 2026-11-03 17:20 CST')
  })

  it('fits detailed theme-specific portraits with uniform glyph proportions', async () => {
    const light = Array.from({ length: 54 }, () => '@'.repeat(80)).join('\n')
    const dark = Array.from({ length: 54 }, () => ':'.repeat(80)).join('\n')
    const result = await generateProfile({ profile, portrait: light, portraitDark: dark, token: 'test-token', now, fetch: api().fetch })
    for (const layout of ['desktop', 'mobile']) {
      const lightSVG = result.files[`${layout}-light.svg`]
      const darkSVG = result.files[`${layout}-dark.svg`]
      expect(lightSVG).toContain('>'.concat('@'.repeat(80), '</text>'))
      expect(darkSVG).toContain('>'.concat(':'.repeat(80), '</text>'))
      const rows = [...lightSVG.matchAll(/<text x="([^"]+)" y="([^"]+)"[^>]*font-size="([^"]+)" xml:space="preserve"/g)]
      expect(rows).toHaveLength(54)
      const font = Number(rows[0][3])
      const pitch = Number(rows[1][2]) - Number(rows[0][2])
      expect(pitch / font).toBeCloseTo(1.2, 5)
      expect(Number(rows.at(-1)[2]) + font).toBeLessThan(layout === 'mobile' ? 421 : 562)
    }
  })

  it('counts public original repositories across every page and their Stars/Forks', async () => {
    const transport = api({ followers: 4, pages: [
      [{ fork: false, private: false, stargazers_count: 7, forks_count: 2 }, { fork: true, private: false, stargazers_count: 100, forks_count: 50 }],
      [{ fork: false, private: false, stargazers_count: 5, forks_count: 3 }, { fork: false, private: true, stargazers_count: 80, forks_count: 40 }],
    ] })
    const result = await generateProfile({ profile, portrait: '@@\n@@', token: 'test-token', now, fetch: transport.fetch })
    expect(result.stats).toMatchObject({ repositories: 2, stars: 12, forks: 5, followers: 4 })
    expect(transport.requests.filter(({ url }) => url.pathname.endsWith('/repos'))).toHaveLength(2)
  })

  it('counts only public commit, PR and review contributions, including later connection pages', async () => {
    const group = (isPrivate, nodes) => ({ repository: { isPrivate }, contributions: { nodes, pageInfo: { hasNextPage: false } } })
    const pr = (isPrivate, isRestricted = false) => ({ isRestricted, pullRequest: { repository: { isPrivate } } })
    const review = (isPrivate) => ({ isRestricted: false, repository: { isPrivate } })
    const transport = api({
      commits: [group(false, [{ commitCount: 8, isRestricted: false }, { commitCount: 3, isRestricted: false }]), group(true, [{ commitCount: 999, isRestricted: false }])],
      prs: [[pr(false), pr(true), pr(false, true)], [pr(false)]],
      reviews: [[review(true)], [review(false), review(false)]],
    })
    const result = await generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch: transport.fetch })
    expect(result.stats).toMatchObject({ commits: 11, pullRequests: 2, reviews: 2, period: { from: '2025-11-03T09:20:00.000Z', to: '2026-11-03T09:20:00.000Z' } })
    const windows = transport.requests.filter(({ body }) => body?.operationName === 'CommitContributions')
    expect(windows).toHaveLength(13)
    expect(windows[1].body.variables.from).toBe('2025-12-01T00:00:00.000Z')
    expect(windows[0].body.variables.to).toBe('2025-11-30T23:59:59.999Z')
    expect(JSON.stringify(result)).not.toContain('999')
  })

  it('returns four self-contained SVG variants with escaped biography/portrait and readable mobile text', async () => {
    const transport = api()
    const result = await generateProfile({ profile: { ...profile, name: 'Frank <&>', focus: ['可验证的自动化工程实践与可复用工具接口'.repeat(3)] }, portrait: '<&>\n@@', token: 'test-token', now, fetch: transport.fetch })
    expect(Object.keys(result.files).sort()).toEqual(['desktop-dark.svg', 'desktop-light.svg', 'mobile-dark.svg', 'mobile-light.svg', 'stats.json'])
    for (const [name, content] of Object.entries(result.files)) {
      if (!name.endsWith('.svg')) continue
      expect(content).toContain('Frank &lt;&amp;&gt;')
      expect(content).toContain('&lt;&amp;&gt;')
      expect(content).toContain('GitHub Stats')
      expect(content).toContain('公开贡献')
      expect(content).not.toMatch(/<script|<foreignObject|<image|@import|(?:href|src)="https?:\/\//)
      expect(content).toContain(name.startsWith('mobile') ? 'viewBox="0 0 420 ' : 'viewBox="0 0 1040 ')
      expect(content).toContain(name.includes('dark') ? '#0d1117' : '#ffffff')
      expect(content).not.toMatch(/<text[^>]*>· /)
    }
    expect(JSON.parse(result.files['stats.json'])).toEqual(result.stats)
    expect(result.stats).toMatchObject({ repositories: 0, stars: 0, forks: 0, commits: 0, pullRequests: 0, reviews: 0 })
  })

  it('clamps a leap-day anniversary to February 28 and uses an exact 12-month period', async () => {
    const result = await generateProfile({ profile, portrait: '@@', token: 'test-token', now: new Date('2024-02-29T12:34:00Z'), fetch: api().fetch })
    expect(result.stats.period).toEqual({ from: '2023-02-28T12:34:00.000Z', to: '2024-02-29T12:34:00.000Z' })
  })

  it('rejects incomplete statistics instead of rendering misleading numbers', async () => {
    const transport = api({ fail: () => Response.json({}) })
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch: transport.fetch })).rejects.toThrow('incomplete')
  })

  it.each([401, 403, 429, 500])('fails closed on HTTP %s without returning partial assets or token values', async (status) => {
    const transport = api({ fail: () => Response.json({ message: 'test-token' }, { status }) })
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch: transport.fetch })).rejects.toThrow(`HTTP ${status}`)
  })

  it('rejects GraphQL errors even when HTTP succeeds', async () => {
    const transport = api()
    const fetch = (url, options) => url.endsWith('/graphql') ? Response.json({ errors: [{ message: 'private-name test-token' }], data: null }) : transport.fetch(url, options)
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch })).rejects.toThrow('GraphQL response was incomplete')
  })

  it('never sends credentials to an off-site pagination URL', async () => {
    const requests = []
    const fetch = (url) => {
      requests.push(url)
      if (new URL(url).hostname !== 'api.github.com') throw new Error('Unexpected off-site request')
      return url.endsWith('/frank9306')
        ? Response.json({ followers: 0 })
        : Response.json([], { headers: { link: '<https://example.com/steal>; rel="next"' } })
    }
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch })).rejects.toThrow('pagination')
    expect(requests).toHaveLength(2)
  })

  it('rejects contribution records without explicit privacy metadata', async () => {
    const transport = api({ commits: [{ repository: { isPrivate: false }, contributions: { nodes: [{ commitCount: 7 }], pageInfo: { hasNextPage: false } } }] })
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch: transport.fetch })).rejects.toThrow('incomplete')
  })

  it('refuses capped commit repository results rather than publishing a partial sum', async () => {
    const transport = api()
    const fetch = (url, options) => {
      const body = options?.body ? JSON.parse(options.body) : null
      return body?.operationName === 'CommitContributions'
        ? Response.json({ data: { user: { contributionsCollection: { totalRepositoriesWithContributedCommits: 101, commitContributionsByRepository: Array.from({ length: 100 }, () => ({ repository: { isPrivate: false } })) } } } })
        : transport.fetch(url, options)
    }
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch })).rejects.toThrow('limit exceeded')
  })

  it('rejects stalled contribution cursors instead of looping forever', async () => {
    const transport = api()
    const fetch = (url, options) => {
      const body = options?.body ? JSON.parse(options.body) : null
      return body?.operationName === 'PullRequests'
        ? Response.json({ data: { user: { contributionsCollection: { pullRequestContributions: { nodes: [], pageInfo: { hasNextPage: true, endCursor: 'same' } } } } } })
        : transport.fetch(url, options)
    }
    await expect(generateProfile({ profile, portrait: '@@', token: 'test-token', now, fetch })).rejects.toThrow('pagination did not advance')
  })
})
