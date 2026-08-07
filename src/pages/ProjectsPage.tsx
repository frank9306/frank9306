import { ProjectCard } from '../components/ProjectCard'
import { useLanguage } from '../context/LanguageContext'
import { useProjects } from '../hooks/useProjects'

export function ProjectsPage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const { projects, loading, source } = useProjects()

  return (
    <div className="projects-page page-shell" data-reveal>
      <header className="page-header">
        <span className="section-kicker">INDEX / 01—04</span>
        <h1>{zh ? '项目与实验' : 'Projects & experiments'}</h1>
        <p>{zh ? '这些是我正在使用和维护的项目。它们都从一个具体问题开始。' : 'These are the projects I use and maintain. Each one started with a specific problem.'}</p>
      </header>
      {source === 'fallback' && !loading && (
        <p className="data-notice" role="status">{zh ? 'GitHub 暂时不可访问，当前显示最近保存的项目数据。' : 'GitHub is temporarily unavailable. Showing the latest saved project data.'}</p>
      )}
      <div className="project-grid projects-grid">
        {projects.map((project) => <ProjectCard key={project.slug} project={project} loading={loading} />)}
      </div>
      <div className="projects-footnote">
        <span>{zh ? '数据来源' : 'DATA SOURCE'}</span>
        <p>{zh ? '项目说明由人工维护；Stars、主要语言和更新时间来自 GitHub 公共 API。' : 'Project notes are curated; stars, primary language, and update dates come from the public GitHub API.'}</p>
      </div>
    </div>
  )
}
