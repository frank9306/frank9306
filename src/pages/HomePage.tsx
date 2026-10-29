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
            <h1 id="hero-title">{zh ? '这里放我的项目、笔记，还有一些没做完的想法。' : 'Here are my projects, notes, and a few unfinished ideas.'}</h1>
            <p className="hero-intro">{zh ? '我是 Frank，做 AI Agent、Codex 工具和自动化。' : "I'm Frank. I build AI agents, Codex tools, and automation."}</p>
            <div className="hero-actions">
              <SiteLink href="/projects" className="button button-primary">{zh ? '查看项目' : 'View projects'} <span aria-hidden="true">↗</span></SiteLink>
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
            <p>{zh ? '给 Agent 说明要做什么、参考什么、最后交付什么。' : 'Tell agents what to do, what to refer to, and what to deliver.'}</p>
          </article>
          <article className="practice-item">
            <h3>{zh ? '工程验证' : 'Engineering checks'}</h3>
            <p>{zh ? '检查结果，也记下怎么查的、发现了什么。' : 'Check the results and record how I checked them and what I found.'}</p>
          </article>
          <article className="practice-item practice-item-accent">
            <h3>{zh ? '日常自动化' : 'Everyday automation'}</h3>
            <p>{zh ? '写些小工具，少改几遍配置，少切几个页面。' : 'Write small tools to cut down on repeated setup and switching tabs.'}</p>
          </article>
        </div>
      </section>

      <section className="featured-section page-shell" aria-labelledby="featured-title">
        <div className="section-heading">
          <h2 id="featured-title">{zh ? '我做的东西' : 'Things I’ve made'}</h2>
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
          <p>{zh ? '反复改配置、检查 Agent 的结果、到处找常用链接，这些事我每天都会碰到。我会写点工具解决，再把代码和笔记放出来。' : 'I keep changing settings, checking agent results, and hunting for links. I write tools to help with these everyday problems, then share the code and notes.'}</p>
          <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '看笔记' : 'Read the notes'} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </>
  )
}
