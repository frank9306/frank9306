import { SiteLink } from '../components/Link'
import { Icon } from '../components/Icon'
import { useLanguage } from '../context/LanguageContext'

export function NotFoundPage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return (
    <div className="not-found page-shell" data-reveal>
      <p className="error-code">404 / NOT FOUND</p>
      <h1>{zh ? '这条路径还没有内容。' : 'Nothing has been built on this path.'}</h1>
      <p>{zh ? '地址可能已经改变，或者这个页面从未存在。' : 'The address may have changed, or the page may never have existed.'}</p>
      <SiteLink href="/" className="button button-primary">{zh ? '返回首页' : 'Back home'} <Icon name="arrow" /></SiteLink>
    </div>
  )
}
