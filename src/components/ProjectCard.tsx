import { useLanguage } from '../context/LanguageContext'
import type { Project } from '../types'
import { Icon } from './Icon'

export function ProjectCard({ project, compact = false, loading = false }: { project: Project; compact?: boolean; loading?: boolean }) {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const date = new Intl.DateTimeFormat(zh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short' }).format(new Date(project.updatedAt))

  return (
    <article className={`project-card ${compact ? 'compact' : ''}`}>
      <div className="project-card-top">
        <span className="project-index">{project.index}</span>
        <span className="project-role">{project.role[locale]}</span>
      </div>
      <div className="project-card-body">
        <h3>{project.name}</h3>
        <p>{project.description[locale]}</p>
      </div>
      <div className="project-tags" aria-label={zh ? '技术标签' : 'Technology tags'}>
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className={`project-meta ${loading ? 'is-loading' : ''}`} aria-live="polite">
        {loading ? (
          <><span className="skeleton short" /><span className="skeleton" /></>
        ) : (
          <>
            <span><Icon name="star" size={15} /> {project.stars}</span>
            <span><i className="language-dot" /> {project.language}</span>
            <span>{zh ? '更新于' : 'Updated'} {date}</span>
          </>
        )}
      </div>
      <a className="project-link" href={`https://github.com/frank9306/${project.repo}`} target="_blank" rel="noreferrer" aria-label={`${zh ? '在 GitHub 查看' : 'View on GitHub'} ${project.name}`}>
        <span>{zh ? '查看仓库' : 'View repository'}</span><Icon name="arrow" />
      </a>
    </article>
  )
}
