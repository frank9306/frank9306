import { useState } from 'react'
import { profileLinks } from '../data/projects'
import { useLanguage } from '../context/LanguageContext'
import { Icon } from './Icon'
import { SiteLink } from './Link'

export function Header({ path }: { path: string }) {
  const { locale, toggleLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const zh = locale === 'zh'

  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLink href="/" className="brand" aria-label={zh ? 'Frank 首页' : 'Frank home'}>
          <span className="brand-mark">F.</span>
          <span className="brand-text">webfrank<span>.top</span></span>
        </SiteLink>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label={zh ? (open ? '关闭菜单' : '打开菜单') : (open ? 'Close menu' : 'Open menu')}>
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
        <nav id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label={zh ? '主导航' : 'Primary navigation'}>
          <SiteLink href="/" className={path === '/' ? 'active' : ''} onNavigate={() => setOpen(false)}>{zh ? '首页' : 'Home'}</SiteLink>
          <SiteLink href="/projects" className={path === '/projects' ? 'active' : ''} onNavigate={() => setOpen(false)}>{zh ? '项目' : 'Projects'}</SiteLink>
          <a href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '知识库' : 'Knowledge'} <span aria-hidden="true">↗</span></a>
          <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <button className="locale-button" type="button" onClick={toggleLocale} aria-label={zh ? 'Switch to English' : '切换到简体中文'}>
            <span className={zh ? 'selected' : ''}>中</span><span aria-hidden="true">/</span><span className={!zh ? 'selected' : ''}>EN</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
