import { useLanguage } from '../context/LanguageContext'
import { profileLinks } from '../data/projects'
import { Icon } from './Icon'

export function Footer() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return (
    <footer className="site-footer" data-reveal>
      <div className="footer-lead">
        <span className="section-kicker">04 / {zh ? '保持联系' : 'STAY IN TOUCH'}</span>
        <h2>{zh ? '想聊项目，或者只是交换想法？' : 'Want to talk projects—or just trade ideas?'}</h2>
        <p>{zh ? '都欢迎联系。' : 'Either way, say hello.'}</p>
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
        <span>{zh ? '北京 · 在线' : 'Beijing · Online'}</span>
      </div>
    </footer>
  )
}
