import { useEffect, useState } from 'react'
import { projects as definitions } from '../data/projects'
import { loadProjects } from '../lib/github'
import type { Project, ProjectDataResult } from '../types'

const fallbackProjects: Project[] = definitions.map((project) => ({
  ...project,
  ...project.fallback,
  url: `https://github.com/frank9306/${project.repo}`,
}))

let sharedRequest: Promise<ProjectDataResult> | null = null

export function useProjects() {
  const [state, setState] = useState<{
    projects: Project[]
    loading: boolean
    source: ProjectDataResult['source'] | null
  }>({ projects: fallbackProjects, loading: true, source: null })

  useEffect(() => {
    let active = true
    sharedRequest ??= loadProjects()
    sharedRequest.then((result) => {
      if (active) setState({ projects: result.projects, loading: false, source: result.source })
    })
    return () => {
      active = false
    }
  }, [])

  return state
}
