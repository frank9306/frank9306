import { useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useLanguage } from './context/LanguageContext'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectsPage } from './pages/ProjectsPage'

function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

export function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const { locale } = useLanguage()

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const isProjects = path === '/projects'
    const isNotFound = path !== '/' && !isProjects
    const title = locale === 'zh'
      ? isNotFound ? '页面不存在 | Frank' : isProjects ? '项目 | Frank' : 'Frank | AI Agent、Codex 工具与自动化'
      : isNotFound ? 'Page not found | Frank' : isProjects ? 'Projects | Frank' : 'Frank | AI agents, Codex tools, and automation'
    const description = locale === 'zh'
      ? 'Frank 的个人网站，记录 AI Agent、Codex 工具、自动化项目和实践笔记。'
      : "Frank's site for AI agents, Codex tools, automation projects, and working notes."
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://webfrank.top${isNotFound ? '/' : path}`)
  }, [locale, path])

  const page = path === '/' ? <HomePage /> : path === '/projects' ? <ProjectsPage /> : <NotFoundPage />

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">{locale === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a>
      <Header key={path} path={path} />
      <main id="main-content">{page}</main>
      <Footer />
    </div>
  )
}
