import { useLanguage } from '../context/LanguageContext'
import type { Project } from '../types'
import { PixelIcon, type PixelIconName } from './PixelIcon'

export function ProjectCard({ project, loading = false }: { project: Project; loading?: boolean }) {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const date = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short' }).format(new Date(project.updatedAt))

  return (
    <article className="project-card">
      <div className="project-app-icon"><PixelIcon name={({ 'codex-switch-helper': 'bolt', polyharness: 'cubes', 'quick-nav': 'compass', 'agent-skills': 'robot' } as Record<string, PixelIconName>)[project.slug] ?? 'folder'} size={48} /></div>
      <div className="project-card-body">
        <h3>{project.name}</h3>
        <span className="project-role">{project.role[locale]}</span>
        <p>{project.description[locale]}</p>
        <a className="project-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`${zh ? '在 GitHub 查看' : 'View on GitHub'} ${project.name}`}>
          <span>{zh ? '打开仓库' : 'Open repository'}</span><b aria-hidden="true">↗</b>
        </a>
      <div className="project-tags" aria-label={zh ? '技术标签' : 'Technology tags'}>
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className={`project-meta ${loading ? 'is-loading' : ''}`} aria-live="polite">
        {loading ? (
          <><span className="skeleton short" /><span className="skeleton" /></>
        ) : (
          <>
            <span>{project.stars} Stars</span>
            <span>{project.language}</span>
            <span>{zh ? '更新于' : 'Updated'} {date}</span>
          </>
        )}
      </div>
      </div>
    </article>
  )
}
