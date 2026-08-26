export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export interface ProjectDefinition {
  slug: string
  repo: string
  index: string
  name: string
  description: LocalizedText
  role: LocalizedText
  tags: string[]
  fallback: {
    stars: number
    language: string
    updatedAt: string
  }
  links?: {
    demo?: string
    docs?: string
  }
}

export interface Project extends ProjectDefinition {
  stars: number
  language: string
  updatedAt: string
  url: string
}

export interface ProjectDataResult {
  projects: Project[]
  source: 'live' | 'cache' | 'fallback'
}
