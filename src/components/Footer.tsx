import { useLanguage } from '../context/LanguageContext'
import { profileLinks } from '../data/projects'
import { Icon } from './Icon'

export function Footer() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return (
    <footer className="site-footer" data-reveal>
      <div className="footer-lead">
        <span className="section-kicker">{zh ? '保持联系' : 'Stay in touch'}</span>
        <h2>{zh ? '有值得解决的问题？聊聊。' : 'A problem worth solving? Let’s talk.'}</h2>
      </div>
      <div className="footer-links">
        <a href={profileLinks.email}><Icon name="mail" /> Email <Icon name="arrow" /></a>
        <a href={profileLinks.telegram} target="_blank" rel="noreferrer"><Icon name="telegram" /> Telegram <Icon name="arrow" /></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Frank</span>
        <div>
          <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '知识库' : 'Knowledge'}</a>
          <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profileLinks.email}>Email</a>
          <a href={profileLinks.telegram} target="_blank" rel="noreferrer">Telegram</a>
        </div>
        <span>{zh ? '北京 · UTC+8' : 'Beijing · UTC+8'}</span>
      </div>
    </footer>
  )
}
