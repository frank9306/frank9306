import { SiteLink } from '../components/Link'
import { useLanguage } from '../context/LanguageContext'

export function NotFoundPage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return (
    <div className="not-found page-shell">
      <p className="error-code">404 / NOT FOUND</p>
      <h1>{zh ? '这个页面不存在。' : "This page doesn't exist."}</h1>
      <p>{zh ? '链接可能已经变了。先回首页看看。' : 'The link may have changed. Head back home.'}</p>
      <SiteLink href="/" className="button button-primary">{zh ? '返回首页' : 'Back home'} <span aria-hidden="true">↗</span></SiteLink>
    </div>
  )
}
