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
        <div className="hero-status"><span><i /> {zh ? '当前关注' : 'CURRENT FOCUS'}</span><span>AI AGENTS · DEV TOOLS · AUTOMATION</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">FRANK / DEVELOPER &amp; BUILDER</p>
            <h1 id="hero-title">
              {zh ? <>你好，我是 Frank。<br /><em>我做能真正用上的工具。</em></> : <>Hi, I’m Frank.<br /><em>I build tools worth using.</em></>}
            </h1>
            <p className="hero-intro">{zh ? '我做 AI Agent、开发者工具，也记录过程中真正有用的东西。' : 'I build AI agents and developer tools, and share what proves useful along the way.'}</p>
            <div className="hero-actions">
              <SiteLink href="/projects" className="button button-primary">{zh ? '查看项目' : 'Explore projects'} <Icon name="arrow" /></SiteLink>
              <a className="button button-secondary" href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '进入知识库' : 'Visit knowledge base'} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <aside className="hero-process" aria-label={zh ? '个人说明' : 'Personal note'}>
            <p className="process-label">NOTE / 2026</p>
            <div className="process-orbit" aria-hidden="true"><span>F</span><i /><i /><i /></div>
            <p className="process-quote">{zh ? '相信好的工具应该消除摩擦，好的知识应该能够行动。' : 'Good tools remove friction. Good knowledge makes action possible.'}</p>
            <a href={profileLinks.github} target="_blank" rel="noreferrer"><Icon name="github" /> github.com/frank9306 <span aria-hidden="true">↗</span></a>
          </aside>
        </div>
        <div className="hero-marquee" aria-hidden="true"><span>39.9042° N</span><i /> <span>116.4074° E</span><i /> <span>UTC +08:00</span></div>
      </section>

      <section className="about-section page-shell" aria-labelledby="about-title" data-reveal>
        <div className="section-heading">
          <span className="section-kicker">01 / {zh ? '关于' : 'ABOUT'}</span>
          <h2 id="about-title">{zh ? '不讲宏大的叙事，先把问题解决。' : 'No grand narrative. Solve the problem first.'}</h2>
        </div>
        <div className="about-grid">
          <p className="about-lead">{zh ? '这里记录正在使用、持续改进的项目，也留下过程里真正有用的经验。' : 'This is where I keep the projects I use and improve, along with the lessons worth keeping.'}</p>
          <div className="focus-list">
            {[
              ['01', zh ? 'AI Agent 工程' : 'AI agent engineering', zh ? '让 Agent 真正执行任务。' : 'Making agents do real work.'],
              ['02', zh ? '开发者工具' : 'Developer tools', zh ? '解决每天都会碰到的麻烦。' : 'Fixing the friction I run into every day.'],
              ['03', zh ? '知识系统' : 'Knowledge systems', zh ? '把踩过的坑留下来。' : 'Keeping the lessons that cost something to learn.'],
            ].map(([number, title, text]) => <div className="focus-item" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="featured-section page-shell" aria-labelledby="featured-title" data-reveal>
        <div className="section-heading horizontal">
          <div><span className="section-kicker">02 / {zh ? '精选项目' : 'SELECTED WORK'}</span><h2 id="featured-title">{zh ? '最近做成的东西' : 'Things I’ve shipped lately'}</h2></div>
          <SiteLink href="/projects" className="text-link">{zh ? '查看全部项目' : 'View all projects'} <Icon name="arrow" /></SiteLink>
        </div>
        <div className="project-grid featured-grid">
          {projects.slice(0, 4).map((project) => <ProjectCard key={project.slug} project={project} compact loading={loading} />)}
        </div>
      </section>

      <section className="knowledge-section page-shell" aria-labelledby="knowledge-title" data-reveal>
        <div className="knowledge-number">03</div>
        <div>
          <span className="section-kicker">{zh ? '知识库' : 'KNOWLEDGE BASE'}</span>
          <h2 id="knowledge-title">{zh ? '用过、验证过，再写下来。' : 'Use it. Test it. Then write it down.'}</h2>
          <p>{zh ? '文章、笔记和资源，都来自真实项目里遇到的问题。' : 'Articles, notes, and resources drawn from problems in real projects.'}</p>
        </div>
        <a href={profileLinks.knowledge} target="_blank" rel="noreferrer" className="circle-link" aria-label={zh ? '打开知识库' : 'Open knowledge base'}><Icon name="arrow" size={28} /></a>
      </section>
    </>
  )
}
