import { useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { useLanguage } from '../context/LanguageContext'
import { useProjects } from '../hooks/useProjects'
import { profileLinks } from '../data/projects'

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
        <h1>{zh ? '项目文件夹' : 'Project folder'}</h1>
        <p>{zh ? '打开一个仓库，看看工具是怎样做出来的。' : 'Open a repository and see how a tool is built.'}</p>
      </header>
      {source === 'fallback' && !loading && (
        <p className="data-notice" role="status">{zh ? '暂时连不上 GitHub，先看看本地保存的项目。可直接打开仓库，或稍后刷新重试。' : 'GitHub is out of reach. These are locally saved projects. Open a repository directly, or refresh to try again.'}</p>
      )}
      {source === 'cache' && !loading && <p className="data-notice" role="status">{zh ? '正在查看一小时内缓存的 GitHub 项目。' : 'Viewing GitHub projects cached within the last hour.'}</p>}
      {loading && <p className="data-notice" role="status">{zh ? '正在读取 GitHub 项目…' : 'Reading GitHub projects…'}</p>}
      {!loading && projects.length === 0 && <div className="empty-folder"><p>{zh ? '这个文件夹暂时没有项目。' : 'There are no projects in this folder yet.'}</p><a href={profileLinks.github} target="_blank" rel="noreferrer">{zh ? '前往 GitHub 查看' : 'Check on GitHub'}<span aria-hidden="true"> ↗</span></a></div>}
      <div className="project-grid projects-grid" aria-busy={loading}>
        {visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} loading={loading} />)}
      </div>
      {canExpand && (
        <div className="projects-more">
          <button className="button button-secondary" type="button" onClick={() => setExpanded(true)}>
            {zh ? '展开更多项目（最多 10 项）' : 'Show more projects (up to 10)'}
          </button>
        </div>
      )}
      <div className="projects-footnote">
        <p>{zh ? '来源：GitHub 公共仓库 · 按更新时间排列 · 不含 Fork 与归档项目' : 'Source: public GitHub repositories · Latest updates first · Forks and archives excluded'}</p>
      </div>
    </div>
  )
}
