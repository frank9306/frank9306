import { useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { useLanguage } from '../context/LanguageContext'
import { useProjects } from '../hooks/useProjects'

export function ProjectsPage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const { projects, loading, source } = useProjects()
  const [expanded, setExpanded] = useState(false)
  const visibleProjects = projects.slice(0, expanded ? 10 : 4)
  const canExpand = !expanded && projects.length > 4

  return (
    <div className="projects-page page-shell">
      <header className="page-header">
        <h1>{zh ? '项目' : 'Projects'}</h1>
        <p>{zh ? '这里放的是我仍在用、也仍在维护的项目。每一个都对应一个自己遇到过的问题。' : 'These are projects I still use and maintain. Each one started with a problem I ran into myself.'}</p>
      </header>
      {source === 'fallback' && !loading && (
        <p className="data-notice" role="status">{zh ? 'GitHub 暂时不可访问，当前显示最近保存的项目数据。' : 'GitHub is temporarily unavailable. Showing the latest saved project data.'}</p>
      )}
      <div className="project-grid projects-grid">
        {visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} loading={loading} />)}
      </div>
      {canExpand && (
        <div className="projects-more">
          <button className="button button-secondary" type="button" onClick={() => setExpanded(true)}>
            {zh ? '显示更多' : 'Show more projects'}
          </button>
        </div>
      )}
      <div className="projects-footnote">
        <span>{zh ? '数据来源' : 'Data source'}</span>
        <p>{zh ? '仓库说明、主题、Stars、主要语言和更新时间来自 GitHub 公共 API；不可用时显示本地项目快照。' : 'Descriptions, topics, stars, primary language, and update dates come from the public GitHub API; local project snapshots appear when it is unavailable.'}</p>
      </div>
    </div>
  )
}
