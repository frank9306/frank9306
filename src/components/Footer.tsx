import { useLanguage } from '../context/LanguageContext'
import { profileLinks } from '../data/projects'

export function Footer() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-lead">
          <h2>{zh ? '有 Agent 或自动化的问题？' : 'Working through an agent or automation problem?'}</h2>
          <p>{zh ? '把问题发来，我们从具体约束开始聊。' : 'Send the problem over. We can start with the constraints.'}</p>
        </div>
        <div className="footer-links" aria-label={zh ? '联系方式' : 'Contact links'}>
          <a href={profileLinks.email}>Email <span aria-hidden="true">↗</span></a>
          <a href={profileLinks.telegram} target="_blank" rel="noreferrer">Telegram <span aria-hidden="true">↗</span></a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Frank</span>
          <div>
            <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '知识库' : 'Knowledge'}</a>
            <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
