import { SiteLink } from '../components/Link'
import { PixelIcon } from '../components/PixelIcon'
import { useLanguage } from '../context/LanguageContext'

export function HomePage({ onNotes }: { onNotes: () => void }) {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  return <div className="welcome-document">
    <div className="welcome-copy">
      <h1>{zh ? '你好，欢迎来到 Frank 的桌面。' : "Hello, welcome to Frank's desktop."}</h1>
      <p>{zh ? '这里存着我做的工具、写过的笔记。' : 'A place for the tools I build and the notes I write.'}</p>
      <div className="welcome-actions">
        <SiteLink href="/projects" className="retro-button"><PixelIcon name="folder" size={27} />{zh ? '打开我的项目' : 'Open my projects'}</SiteLink>
        <button className="retro-button" onClick={onNotes}><PixelIcon name="note" size={27} />{zh ? '阅读笔记' : 'Read my notes'}</button>
      </div>
    </div>
    <figure className="desk-art"><img src="/images/retro-desk.png" width="1536" height="1024" alt={zh ? '像素桌面一角：台灯、咖啡、电脑与绿植' : 'A pixel-art desk with a lamp, coffee, computer and plant'} fetchPriority="high" /><figcaption>{zh ? '保持好奇。' : 'Stay curious.'}</figcaption></figure>
  </div>
}
