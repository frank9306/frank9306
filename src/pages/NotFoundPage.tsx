import { SiteLink } from '../components/Link'
import { useLanguage } from '../context/LanguageContext'

export function NotFoundPage() {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return <div className="not-found-document">
    <h1>{zh ? '这个文件不在桌面上。' : 'This file is not on the desktop.'}</h1>
    <p>{zh ? '地址可能已经改变。回到桌面，继续查看项目或笔记。' : 'The address may have changed. Return to the desktop to explore projects and notes.'}</p>
    <SiteLink className="retro-button" href="/">{zh ? '返回桌面' : 'Back to desktop'}</SiteLink>
  </div>
}
