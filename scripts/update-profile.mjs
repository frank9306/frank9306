import { mkdtemp, readFile, rename, rm, mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateProfile, renderProfile } from './profile/generate.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
let stage
try {
  const profile = JSON.parse(await readFile(join(root, 'profile/profile.json'), 'utf8'))
  const portrait = await readFile(join(root, 'profile/portrait.txt'), 'utf8')
  const portraitDark = await readFile(join(root, 'profile/portrait-dark.txt'), 'utf8')
  const renderOnly = process.argv.includes('--render-only')
  const result = renderOnly
    ? renderProfile({ profile, portrait, portraitDark, stats: JSON.parse(await readFile(join(root, 'profile/generated/stats.json'), 'utf8')) })
    : await generateProfile({ profile, portrait, portraitDark, token: process.env.GITHUB_TOKEN })
  const { files, stats } = result
  const target = join(root, 'profile/generated')
  // Stage on the same volume so replacement renames are atomic per resource.
  await mkdir(dirname(target), { recursive: true })
  stage = await mkdtemp(join(dirname(target), '.profile-stage-'))
  for (const [name, content] of Object.entries(files)) await writeFile(join(stage, name), content, 'utf8')
  await mkdir(target, { recursive: true })
  for (const name of Object.keys(files)) await rename(join(stage, name), join(target, name))
  console.log(`${renderOnly ? 'Re-rendered' : 'Updated'} ${Object.keys(files).length} profile resources from ${renderOnly ? 'saved' : 'live'} public GitHub data at ${stats.updatedAt}.`)
  console.log(`Repositories: ${stats.repositories}; Stars: ${stats.stars}; Forks: ${stats.forks}; Followers: ${stats.followers}; Commits: ${stats.commits}; PRs: ${stats.pullRequests}; Reviews: ${stats.reviews}.`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  if (stage) await rm(stage, { recursive: true })
}
