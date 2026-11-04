/** Generate a complete, public-only profile snapshot without writing to disk. */
export async function generateProfile({ profile, portrait, portraitDark = portrait, token, now = new Date(), fetch = globalThis.fetch }) {
  if (!token) throw new Error('GITHUB_TOKEN is required; previous profile assets are unchanged.')
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(profile.login)) throw new Error('Invalid GitHub login.')
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Invalid profile update time.')
  validatePortrait(portrait)
  validatePortrait(portraitDark)
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  async function request(url, body) {
    let response
    try {
      response = await fetch(url, {
        headers, signal: AbortSignal.timeout(30_000),
        ...(body ? { method: 'POST', body: JSON.stringify(body), headers: { ...headers, 'Content-Type': 'application/json' } } : {}),
      })
    } catch {
      throw new Error('GitHub request failed; previous profile assets are unchanged.')
    }
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}; previous profile assets are unchanged.`)
    try {
      return { value: await response.json(), headers: response.headers }
    } catch {
      throw new Error('GitHub response was incomplete or invalid JSON.')
    }
  }
  const identity = (await request(`https://api.github.com/users/${profile.login}`)).value
  requireCount(identity.followers)
  const stats = { repositories: 0, stars: 0, forks: 0, followers: identity.followers, updatedAt: now.toISOString() }
  let url = `https://api.github.com/users/${profile.login}/repos?type=owner&per_page=100&page=1`
  const seenPages = new Set()
  while (url) {
    const nextURL = new URL(url)
    if (nextURL.origin !== 'https://api.github.com' || nextURL.pathname !== `/users/${profile.login}/repos` || seenPages.has(url)) {
      throw new Error('GitHub pagination URL was invalid or repeated.')
    }
    seenPages.add(url)
    const page = await request(url)
    if (!Array.isArray(page.value)) throw new Error('GitHub repository response was incomplete.')
    for (const repo of page.value) {
      if (typeof repo.private !== 'boolean' || typeof repo.fork !== 'boolean') throw new Error('GitHub repository response was incomplete.')
      if (repo.private || repo.fork) continue
      requireCount(repo.stargazers_count)
      requireCount(repo.forks_count)
      stats.repositories += 1
      stats.stars += repo.stargazers_count
      stats.forks += repo.forks_count
    }
    url = page.headers.get('link')?.match(/<([^>]+)>; rel="next"/)?.[1]
  }
  const from = new Date(now)
  const day = from.getUTCDate()
  from.setUTCDate(1)
  from.setUTCFullYear(from.getUTCFullYear() - 1)
  const daysInMonth = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)).getUTCDate()
  from.setUTCDate(Math.min(day, daysInMonth))
  stats.period = { from: from.toISOString(), to: now.toISOString() }
  stats.commits = 0
  async function collection(operationName, fields, start, end, cursor = null) {
    const isConnection = operationName !== 'CommitContributions'
    const query = `query ${operationName}($login: String!, $from: DateTime!, $to: DateTime!${isConnection ? ', $cursor: String' : ''}) {
      user(login: $login) { contributionsCollection(from: $from, to: $to) { ${fields} } }
    }`
    const result = (await request('https://api.github.com/graphql', {
      operationName, query,
      variables: { login: profile.login, from: start, to: end, ...(isConnection ? { cursor } : {}) },
    })).value
    if (result.errors?.length || !result.data?.user?.contributionsCollection) {
      throw new Error('GitHub GraphQL response was incomplete; previous profile assets are unchanged.')
    }
    return result.data.user.contributionsCollection
  }
  // A month bounds daily commit entries. Never silently accept GitHub's repository cap.
  let start = new Date(from)
  while (start <= now) {
    const next = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))
    const end = new Date(Math.min(next.getTime() - 1, now.getTime()))
    const result = await collection('CommitContributions', `
      totalRepositoriesWithContributedCommits
      commitContributionsByRepository(maxRepositories: 100) {
        repository { isPrivate }
        contributions(first: 100) { nodes { commitCount isRestricted } pageInfo { hasNextPage } }
      }`, start.toISOString(), end.toISOString())
    requireCount(result.totalRepositoriesWithContributedCommits)
    if (!Array.isArray(result.commitContributionsByRepository) || result.commitContributionsByRepository.length !== Math.min(100, result.totalRepositoriesWithContributedCommits)) throw new Error('GitHub commit response was incomplete.')
    if (result.totalRepositoriesWithContributedCommits > 100) {
      throw new Error('GitHub commit repository limit exceeded; refusing incomplete statistics.')
    }
    for (const group of result.commitContributionsByRepository) {
      if (typeof group.repository?.isPrivate !== 'boolean') throw new Error('GitHub commit response was incomplete.')
      if (group.repository.isPrivate !== false) continue
      requireConnection(group.contributions)
      if (group.contributions.pageInfo.hasNextPage) throw new Error('GitHub commit data was truncated.')
      for (const contribution of group.contributions.nodes) {
        if (typeof contribution?.isRestricted !== 'boolean') throw new Error('GitHub commit response was incomplete.')
        if (contribution.isRestricted === false) {
          requireCount(contribution.commitCount)
          stats.commits += contribution.commitCount
        }
      }
    }
    start = next
  }
  for (const [operationName, field, key, repositoryField] of [
    ['PullRequests', 'pullRequestContributions', 'pullRequests', 'pullRequest { repository { isPrivate } }'],
    ['Reviews', 'pullRequestReviewContributions', 'reviews', 'repository { isPrivate }'],
  ]) {
    stats[key] = 0
    let cursor = null
    const seenCursors = new Set()
    do {
      const result = await collection(operationName,
        `${field}(first: 100, after: $cursor) { nodes { isRestricted ${repositoryField} } pageInfo { hasNextPage endCursor } }`,
        stats.period.from, stats.period.to, cursor)
      const connection = result[field]
      requireConnection(connection)
      for (const node of connection.nodes) {
        if (typeof node?.isRestricted !== 'boolean') throw new Error('GitHub contribution response was incomplete.')
        const repository = key === 'pullRequests' ? node.pullRequest?.repository : node.repository
        if (node.isRestricted === false && typeof repository?.isPrivate !== 'boolean') throw new Error('GitHub contribution response was incomplete.')
        if (node.isRestricted === false && repository?.isPrivate === false) stats[key] += 1
      }
      const next = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null
      if (connection.pageInfo.hasNextPage && (!next || seenCursors.has(next))) throw new Error('GitHub pagination did not advance.')
      if (next) seenCursors.add(next)
      cursor = next
    } while (cursor)
  }
  return renderProfile({ profile, portrait, portraitDark, stats })
}

/** Rebuild artwork from an existing aggregate snapshot, without network access. */
export function renderProfile({ profile, portrait, portraitDark = portrait, stats }) {
  validatePortrait(portrait)
  validatePortrait(portraitDark)
  for (const key of ['repositories', 'stars', 'forks', 'followers', 'commits', 'pullRequests', 'reviews']) requireCount(stats?.[key])
  if (![stats.updatedAt, stats.period?.from, stats.period?.to].every((value) => typeof value === 'string' && Number.isFinite(Date.parse(value))) || Date.parse(stats.period.from) > Date.parse(stats.period.to)) {
    throw new Error('Saved profile snapshot has invalid timestamps.')
  }
  const files = { 'stats.json': `${JSON.stringify(stats, null, 2)}\n` }
  for (const mobile of [false, true]) {
    for (const dark of [false, true]) {
      files[`${mobile ? 'mobile' : 'desktop'}-${dark ? 'dark' : 'light'}.svg`] = render(profile, dark ? portraitDark : portrait, stats, mobile, dark)
    }
  }
  return { files, stats }
}

function validatePortrait(portrait) {
  if (typeof portrait !== 'string' || !portrait.trim() || portrait.trimEnd().split(/\r?\n/).length > 64 || portrait.split(/\r?\n/).some((line) => line.length > 96)) throw new Error('ASCII portrait must fit 96 columns and 64 lines.')
}

function requireCount(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('GitHub response was incomplete: expected a nonnegative integer.')
}

function requireConnection(value) {
  if (!Array.isArray(value?.nodes) || typeof value?.pageInfo?.hasNextPage !== 'boolean') throw new Error('GitHub connection response was incomplete.')
}

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character])
const units = (value) => Array.from(value).reduce((sum, character) => sum + (character.codePointAt(0) > 255 ? 2 : 1), 0)

function wrap(value, limit) {
  if (String(value).includes(' · ')) {
    const lines = []
    let line = ''
    for (const part of String(value).split(' · ')) {
      const joined = line ? `${line} · ${part}` : part
      if (units(joined) <= limit) line = joined
      else {
        if (line) lines.push(line)
        const wrapped = wrap(part, limit)
        lines.push(...wrapped.slice(0, -1))
        line = wrapped.at(-1) ?? ''
      }
    }
    return [...lines, line].filter(Boolean)
  }
  const lines = []
  let line = ''
  for (const character of String(value)) {
    if (units(line + character) > limit) {
      const space = line.lastIndexOf(' ')
      if (space > line.length * 0.45) {
        lines.push(line.slice(0, space))
        line = line.slice(space + 1)
      } else {
        lines.push(line)
        line = ''
      }
    }
    line += character
  }
  return [...lines, line].filter(Boolean)
}

function render(profile, portrait, stats, mobile, dark) {
  const p = dark
    ? { bg: '#0d1117', border: '#30363d', ink: '#c9d1d9', muted: '#8b949e', title: '#58a6ff', key: '#ffa657', dots: '#484f58' }
    : { bg: '#ffffff', border: '#d0d7de', ink: '#24292f', muted: '#57606a', title: '#0969da', key: '#953800', dots: '#afb8c1' }
  const width = mobile ? 420 : 1040
  const left = mobile ? 22 : 390
  const right = width - (mobile ? 22 : 32)
  const valueX = left + (mobile ? 102 : 144)
  const font = mobile ? 14.5 : 16
  const text = []
  const add = (x, y, content, color = p.ink, size = font, extra = '') => text.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${escape(content)}</text>`)
  const rule = (x1, y, x2, color = p.border, extra = '') => text.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" ${extra}/>`)

  add(24, 37, `${profile.login}@github`, p.title, mobile ? 14 : 15)
  add(width - 25, 37, '~', p.muted, 15, 'text-anchor="end"')
  rule(22, 59, width - 22)
  const art = portrait.trimEnd().split(/\r?\n/)
  const columns = Math.max(...art.map((line) => line.length))
  const artFont = Math.min(mobile ? 10.3 : 11.2, (mobile ? 300 : 318) / (columns * 0.6), (mobile ? 312 : 436) / (art.length * 1.2))
  const artX = (mobile ? width / 2 : 185) - Math.max(...art.map((line) => line.length)) * artFont * 0.6 / 2
  const artLine = artFont * 1.2
  for (const [i, line] of art.entries()) {
    add(artX, (mobile ? 93 : 110) + i * artLine, line, p.ink, artFont, 'xml:space="preserve" font-family="Consolas,Menlo,monospace"')
  }
  if (!mobile) add(185, 574, profile.login, p.muted, 12, 'text-anchor="middle"')

  const titleY = mobile ? 448 : 112
  add(left, titleY, profile.name, p.ink, mobile ? 28 : 32, 'font-weight="600"')
  add(left, titleY + 31, `${profile.role} · ${profile.experience}`, p.muted, mobile ? 14 : 15)
  let y = titleY + 75
  for (const [label, values] of [['Focus', profile.focus], ['Stack', profile.stack], ['Tools', [profile.tools]]]) {
    const rows = values.flatMap((value) => wrap(value, Math.floor((right - valueX) / (font * 0.63))))
    add(left, y, label, p.key)
    rule(left + label.length * font * 0.62 + 10, y - 4, valueX - 13, p.dots, 'stroke-dasharray="1 5" stroke-linecap="round"')
    for (const line of rows) {
      add(valueX, y, line)
      y += 25
    }
    y += 13
  }
  y += 12
  add(left, y, '─ GitHub Stats', p.title, font)
  rule(left + 150, y - 5, right)
  y += 25
  add(left, y, '公开数据 · Commit / PR / Review 为近 12 个月', p.muted, mobile ? 10.8 : 12)
  y += 34
  const metrics = [
    ['Repos', stats.repositories], ['Stars', stats.stars], ['Forks', stats.forks], ['Followers', stats.followers],
    ['Commits', stats.commits], ['PRs', stats.pullRequests], ['Reviews', stats.reviews],
  ]
  const gap = mobile ? 28 : 36
  const columnWidth = (right - left - gap) / 2
  const statFont = mobile ? 13 : 15
  for (const [i, [label, count]] of metrics.entries()) {
    const x = left + (i % 2) * (columnWidth + gap)
    const value = new Intl.NumberFormat('en-US').format(count)
    add(x, y, label, p.key, statFont)
    const end = x + columnWidth
    const dotStart = x + label.length * statFont * 0.62 + 8
    const dotEnd = end - value.length * statFont * 0.62 - 9
    if (dotEnd > dotStart) rule(dotStart, y - 4, dotEnd, p.dots, 'stroke-dasharray="1 5" stroke-linecap="round"')
    add(end, y, value, p.ink, statFont, 'text-anchor="end"')
    if (i % 2 === 1 || i === metrics.length - 1) y += 30
  }
  y += 8
  const dateFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', dateStyle: 'short' })
  add(left, y, `${dateFormat.format(new Date(stats.period.from))} → ${dateFormat.format(new Date(stats.period.to))} · 公开贡献`, p.muted, mobile ? 11 : 12)
  y += 29
  rule(22, y, width - 22)
  const updated = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', dateStyle: 'short', timeStyle: 'short', hour12: false }).format(new Date(stats.updatedAt))
  add(24, y + 28, `Updated ${updated} CST`, p.muted, mobile ? 10.5 : 12)
  if (!mobile) add(width - 25, y + 28, profile.website, p.title, 12, 'text-anchor="end"')
  const height = y + 53
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description" font-family="Consolas,Menlo,'Microsoft YaHei','PingFang SC','Noto Sans CJK SC',monospace">
<title id="title">${escape(profile.name)} 的 GitHub 工程终端</title>
<desc id="description">${escape(`${profile.role}，${profile.experience}。关注 ${profile.focus.join('、')}。公开 GitHub 统计更新于 ${updated}，贡献周期为最近 12 个月。`)}</desc>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="${p.bg}" stroke="${p.border}"/>
${text.join('\n')}
</svg>\n`
}
