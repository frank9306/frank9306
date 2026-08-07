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
      ? isNotFound ? '页面未找到 — Frank' : isProjects ? '项目 — Frank 的个人数字空间' : 'Frank 的个人数字空间'
      : isNotFound ? 'Page not found — Frank' : isProjects ? 'Projects — Frank · Developer & Builder' : 'Frank — Developer & Builder'
    const description = locale === 'zh'
      ? 'Frank 的个人数字空间，关注 AI Agent、开发者工具与自动化实践。'
      : 'Frank’s personal space for AI agents, developer tools, automation, and knowledge systems.'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://webfrank.top${isNotFound ? '/' : path}`)
  }, [locale, path])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.dataset.visible = 'true')
      return
    }

    document.documentElement.classList.add('reveal-ready')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.04, rootMargin: '0px 0px -8% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
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
