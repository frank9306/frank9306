import { ProjectCard } from '../components/ProjectCard'
import { SiteLink } from '../components/Link'
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
            <p className="hero-kicker">Frank / {zh ? '独立开发者' : 'Independent developer'}</p>
            <h1 id="hero-title">{zh ? '把重复工作，做成可复用的工具。' : 'I turn repeated work into reusable tools.'}</h1>
            <p className="hero-intro">{zh ? '我是 Frank，做 AI Agent、Codex 工具和自动化。' : "I'm Frank. I build AI agents, Codex tools, and automation."}</p>
            <div className="hero-actions">
              <SiteLink href="/projects" className="button button-primary">{zh ? '看项目' : 'See projects'} <span aria-hidden="true">↗</span></SiteLink>
              <a className="hero-github" href={profileLinks.github} target="_blank" rel="noreferrer" aria-label={zh ? '在 GitHub 查看 Frank' : 'View Frank on GitHub'}>GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <figure className="hero-media">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/agent-workbench-hero-mobile.webp" />
              <img
                src="/images/agent-workbench-hero.webp"
                alt={zh ? '由纸张、金属模块和连线组成的自动化工作台' : 'An automation workbench made from paper, metal modules, and connecting lines'}
                width="1122"
                height="1402"
                fetchPriority="high"
              />
            </picture>
          </figure>
        </div>
      </section>

      <section className="practice-section page-shell" aria-labelledby="practice-title">
        <h2 id="practice-title">{zh ? '我在做的三件事' : 'Three things I work on'}</h2>
        <div className="practice-grid">
          <article className="practice-item practice-item-primary">
            <h3>{zh ? 'Agent 工作流' : 'Agent workflows'}</h3>
            <p>{zh ? '把目标、上下文和交付方式接起来。' : 'Connect goals, context, and delivery into one working flow.'}</p>
          </article>
          <article className="practice-item">
            <h3>{zh ? '工程验证' : 'Engineering checks'}</h3>
            <p>{zh ? '让检查、证据和结论留在同一条链路里。' : 'Keep checks, evidence, and conclusions in the same chain.'}</p>
          </article>
          <article className="practice-item practice-item-accent">
            <h3>{zh ? '日常自动化' : 'Everyday automation'}</h3>
            <p>{zh ? '把重复配置和频繁跳转收成小工具。' : 'Turn repeated setup and tab switching into small tools.'}</p>
          </article>
        </div>
      </section>

      <section className="featured-section page-shell" aria-labelledby="featured-title">
        <div className="section-heading">
          <h2 id="featured-title">{zh ? '最近还在维护的项目' : 'Projects I still maintain'}</h2>
          <SiteLink href="/projects" className="text-link">{zh ? '看全部' : 'View all'} <span aria-hidden="true">↗</span></SiteLink>
        </div>
        <div className="project-grid featured-grid">
          {projects.slice(0, 4).map((project) => <ProjectCard key={project.slug} project={project} compact loading={loading} />)}
        </div>
      </section>

      <section id="about" className="about-section page-shell" aria-labelledby="about-title">
        <div className="about-media">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/workflow-modules-mobile.webp" />
            <img
              src="/images/workflow-modules.webp"
              alt={zh ? '排成工作流的纸质模块与金属连接件' : 'Paper modules and metal connectors arranged as a workflow'}
              width="1599"
              height="900"
              loading="lazy"
            />
          </picture>
        </div>
        <div className="about-panel">
          <h2 id="about-title">{zh ? '先解决自己的问题。' : 'Start with my own problems.'}</h2>
          <p>{zh ? '我从每天真正遇到的摩擦出发：反复改配置、Agent 结果难验收、常用入口太散。跑通之后，再把它们整理成别人也能复用的代码和笔记。' : 'I start with friction I actually run into: repeated configuration, agent work that is hard to verify, and links scattered across tabs. Once a fix works, I turn it into reusable code and notes.'}</p>
          <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '看文章和笔记' : 'Read the notes'} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </>
  )
}
