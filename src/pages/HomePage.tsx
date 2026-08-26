import { ProjectCard } from '../components/ProjectCard'
import { SiteLink } from '../components/Link'
import { Icon } from '../components/Icon'
import { useLanguage } from '../context/LanguageContext'
import { profileLinks } from '../data/projects'
import { useProjects } from '../hooks/useProjects'

export function HomePage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const { projects, loading } = useProjects()

  return (
    <>
      <section className="hero page-shell" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              {zh ? <>Frank — AI Agent<br />{' '}<span>与自动化工具开发者</span></> : <>Frank — AI agent and<br />{' '}<span>automation tools developer</span></>}
            </h1>
            <p className="hero-intro">{zh ? '构建可靠的智能代理、开发者工具，以及真正节省时间的自动化系统。' : 'I build reliable agents, developer tools, and automation systems that genuinely save time.'}</p>
            <div className="hero-actions">
              <SiteLink href="/projects" className="button button-primary">{zh ? '查看项目' : 'Explore projects'} <Icon name="arrow" /></SiteLink>
              <a className="hero-github" href={profileLinks.github} target="_blank" rel="noreferrer" aria-label={zh ? '在 GitHub 查看 Frank' : 'View Frank on GitHub'}>GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <aside className="hero-details" aria-label={zh ? '联系信息' : 'Contact details'}>
            <p><span aria-hidden="true">⌖</span>{zh ? '北京 · UTC+8' : 'Beijing · UTC+8'}</p>
            <a href={profileLinks.telegram} target="_blank" rel="noreferrer"><span aria-hidden="true">□</span>{zh ? '开放交流' : 'Open to conversation'} <Icon name="arrow" /></a>
          </aside>
        </div>
      </section>

      <section className="featured-section page-shell" aria-labelledby="featured-title" data-reveal>
        <div className="section-heading horizontal">
          <h2 id="featured-title">{zh ? '精选项目' : 'Selected work'}</h2>
          <SiteLink href="/projects" className="text-link">{zh ? '查看全部项目' : 'View all projects'} <Icon name="arrow" /></SiteLink>
        </div>
        <div className="project-grid featured-grid">
          {projects.slice(0, 4).map((project) => <ProjectCard key={project.slug} project={project} compact loading={loading} />)}
        </div>
      </section>

      <section id="about" className="about-section page-shell" aria-labelledby="about-title" data-reveal>
        <span className="section-kicker">{zh ? '关于' : 'About'}</span>
        <div className="about-grid">
          <h2 id="about-title">{zh ? '先把问题解决，\n再把方法留下。' : 'Solve the problem.\nKeep the method.'}</h2>
          <div className="about-copy">
            <p>{zh ? '我关注 AI Agent、自动化与开发者体验，持续构建自己真正使用的工具。' : 'I focus on AI agents, automation, and developer experience, continuously building tools I actually use.'}</p>
            <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '阅读文章与笔记' : 'Read articles and notes'} <Icon name="arrow" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
