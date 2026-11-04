import { useEffect, useState } from 'react'
import { useLanguage } from './context/LanguageContext'
import { Desktop } from './desktop/Desktop'

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
      ? isNotFound ? '找不到文件 | Frank 的桌面' : isProjects ? '我的项目 | Frank 的桌面' : 'Frank 的桌面 | 工具与笔记'
      : isNotFound ? "File not found | Frank's desktop" : isProjects ? "My projects | Frank's desktop" : "Frank's desktop | Tools and notes"
    const description = locale === 'zh'
      ? '打开 Frank 的桌面，看看 AI Agent、开发工具与自动化项目，或读一篇实践笔记。'
      : "Explore Frank's desktop: AI agents, developer tools, automation projects, and practical notes."
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://webfrank.top${isNotFound ? '/' : path}`)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://webfrank.top${isNotFound ? '/' : path}`)
  }, [locale, path])

  return <Desktop path={path} />
}
