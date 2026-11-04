import { useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { SiteLink } from '../components/Link'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { useLanguage } from '../context/LanguageContext'
import { profileLinks } from '../data/projects'
import { notes } from '../data/notes'
import { HomePage } from '../pages/HomePage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

type WindowId = 'hello' | 'projects' | 'notes' | 'contact'
type Point = { x: number; y: number }
type WindowState = { id: WindowId; minimized: boolean; maximized: boolean; position?: Point }
type DesktopState = { windows: WindowState[]; focus: string | null; focusSerial: number }
type Action = { type: 'open' | 'raise' | 'minimize' | 'close' | 'maximize'; id: WindowId } | { type: 'route'; projects: boolean } | { type: 'move'; id: WindowId; position: Point } | { type: 'reset' }

const identities: WindowId[] = ['hello', 'projects', 'notes', 'contact']
const icons: Record<WindowId, PixelIconName> = { hello: 'computer', projects: 'folder', notes: 'note', contact: 'mail' }

function reducer(state: DesktopState, action: Action): DesktopState {
  if (action.type === 'reset') return { ...state, windows: state.windows.map((win) => ({ ...win, maximized: false, position: undefined })) }
  if (action.type === 'route') {
    if (action.projects) return reducer(state, { type: 'open', id: 'projects' })
    return { ...state, windows: state.windows.filter((win) => win.id !== 'projects'), focus: 'shortcut-projects', focusSerial: state.focusSerial + 1 }
  }
  const existing = state.windows.find((win) => win.id === action.id)
  const others = state.windows.filter((win) => win.id !== action.id)
  if (action.type === 'maximize' || action.type === 'move') return { ...state, windows: state.windows.map((win) => win.id === action.id ? { ...win, maximized: action.type === 'maximize' ? !win.maximized : false, position: action.type === 'move' ? action.position : win.position } : win) }
  if (action.type === 'close') return { windows: others, focus: `shortcut-${action.id}`, focusSerial: state.focusSerial + 1 }
  if (action.type === 'minimize') return { ...state, windows: state.windows.map((win) => win.id === action.id ? { ...win, minimized: true } : win), focus: `task-${action.id}`, focusSerial: state.focusSerial + 1 }
  if (action.type === 'raise') {
    if (!existing || state.windows.at(-1)?.id === action.id) return state
    return { ...state, windows: [...others, existing] }
  }
  return { windows: [...others, { ...(existing ?? { id: action.id, maximized: false }), minimized: false }], focus: `window-${action.id}`, focusSerial: state.focusSerial + 1 }
}

function initialState(path: string): DesktopState {
  const compact = window.innerWidth <= 1000
  const short = window.innerHeight < 900
  const windows = identities.map((id) => ({ id, minimized: (compact && id !== (path === '/projects' ? 'projects' : 'hello')) || (!compact && short && (id === 'notes' || id === 'contact')), maximized: false }))
  const active = path === '/projects' ? 'projects' : 'hello'
  return { windows: [...windows.filter((win) => win.id !== active), windows.find((win) => win.id === active)!], focus: path === '/projects' ? 'window-projects' : null, focusSerial: 0 }
}

export function Desktop({ path }: { path: string }) {
  const { locale, toggleLocale } = useLanguage()
  const zh = locale === 'zh'
  const [state, dispatch] = useReducer(reducer, path, initialState)
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [menu, setMenu] = useState<'start' | 'file' | 'help' | null>(null)
  const compact = viewport.width <= 1000
  const menuRef = useRef<HTMLDivElement>(null)
  const menuTrigger = useRef<HTMLButtonElement | null>(null)
  const drag = useRef<{ id: WindowId; start: Point; origin: Point } | null>(null)
  const valid = path === '/' || path === '/projects'
  const active = state.windows.filter((win) => !win.minimized).at(-1)?.id
  const names: Record<WindowId, string> = { hello: zh ? 'hello.txt — 记事本' : 'hello.txt — Notepad', projects: zh ? '我的项目' : 'My projects', notes: 'notes.txt', contact: zh ? '联系 Frank' : 'Contact Frank' }
  const shortcutNames: Record<WindowId, string> = { hello: zh ? '关于 Frank' : 'About Frank', projects: zh ? '我的项目' : 'My projects', notes: zh ? '开发笔记' : 'Notes', contact: zh ? '联系' : 'Contact' }

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    const route = () => { dispatch({ type: 'route', projects: window.location.pathname.replace(/\/+$/, '') === '/projects' }); setMenu(null) }
    window.addEventListener('resize', resize)
    window.addEventListener('popstate', route)
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('popstate', route) }
  }, [])

  useLayoutEffect(() => {
    if (state.focus) document.getElementById(state.focus)?.focus({ preventScroll: true })
  }, [state.focus, state.focusSerial])

  useEffect(() => {
    if (!menu) return
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const outside = (event: globalThis.PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !menuTrigger.current?.contains(event.target as Node)) setMenu(null)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [menu])

  const open = (id: WindowId) => {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
    const destination = id === 'projects' ? '/projects' : ['/', '/projects'].includes(currentPath) ? currentPath : '/'
    if (currentPath !== destination) {
      window.history.pushState({}, '', destination); window.dispatchEvent(new PopStateEvent('popstate'))
    }
    setMenu(null); dispatch({ type: 'open', id }); if (compact) window.scrollTo({ top: 0 })
  }
  const close = (id: WindowId) => {
    dispatch({ type: 'close', id })
    if (id === 'projects' && path === '/projects') { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }
  }
  const toggleMenu = (next: typeof menu, trigger: HTMLButtonElement) => { menuTrigger.current = trigger; setMenu(menu === next ? null : next) }
  const menuKeys = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { setMenu(null); menuTrigger.current?.focus(); event.stopPropagation() }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus(); event.preventDefault()
  }
  const projectLink = (className?: string, id?: string) => <SiteLink id={id} href="/projects" className={className} onNavigate={() => open('projects')}><PixelIcon name="folder" />{zh ? '我的项目' : 'My projects'}</SiteLink>
  const entries = <>{identities.map((id) => id === 'projects' ? <SiteLink key={id} href="/projects" onNavigate={() => open(id)}><PixelIcon name={icons[id]} />{shortcutNames[id]}</SiteLink> : <button key={id} onClick={() => open(id)}><PixelIcon name={icons[id]} />{shortcutNames[id]}</button>)}<a href={profileLinks.github} target="_blank" rel="noreferrer"><PixelIcon name="github" />GitHub ↗</a><button onClick={() => setMenu('help')}>{zh ? '桌面使用帮助' : 'Desktop help'}</button></>

  // Default geometry is responsive; content scrolls inside desktop windows.
  const workspaceHeight = Math.max(240, viewport.height - 104)
  const width = Math.min(viewport.width - 180, 1190)
  const left = Math.max(144, (viewport.width - width + 116) / 2)
  const tall = viewport.height >= 900
  const helloHeight = tall ? 282 : 254
  const projectTop = helloHeight + 42
  const projectHeight = tall ? Math.max(300, workspaceHeight - projectTop - 221) : workspaceHeight - projectTop - 16
  const bottomTop = projectTop + projectHeight + 18
  const geometry = (win: WindowState) => {
    if (win.maximized) return { left: 0, top: 0, width: viewport.width, height: workspaceHeight }
    const frameWidth = win.id === 'notes' ? width * .5 : win.id === 'contact' ? width * .48 : width
    const height = Math.min(workspaceHeight, Math.max(180, win.id === 'hello' ? helloHeight : win.id === 'projects' ? projectHeight : workspaceHeight - bottomTop - 14))
    const x = win.position?.x ?? (win.id === 'contact' ? left + width * .52 : left)
    const y = win.position?.y ?? (win.id === 'hello' ? 24 : win.id === 'projects' ? projectTop : bottomTop)
    return { left: Math.max(0, Math.min(x, viewport.width - frameWidth)), top: Math.max(0, Math.min(y, workspaceHeight - height)), width: frameWidth, height }
  }
  const beginDrag = (event: PointerEvent<HTMLDivElement>, win: WindowState) => {
    if (compact || win.maximized || event.button !== 0 || (event.target as HTMLElement).closest('button')) return
    const frame = geometry(win)
    drag.current = { id: win.id, start: { x: event.clientX, y: event.clientY }, origin: { x: frame.left, y: frame.top } }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const moving = drag.current
    if (!moving) return
    const win = state.windows.find((item) => item.id === moving.id)!
    const frame = geometry(win)
    dispatch({ type: 'move', id: moving.id, position: { x: Math.max(0, Math.min(viewport.width - frame.width, moving.origin.x + event.clientX - moving.start.x)), y: Math.max(0, Math.min(workspaceHeight - frame.height, moving.origin.y + event.clientY - moving.start.y)) } })
  }
  const place = (position: 'top' | 'center' | 'bottom') => {
    const win = state.windows.find((item) => item.id === active)
    if (!win) return
    const frame = geometry({ ...win, maximized: false })
    dispatch({ type: 'move', id: win.id, position: position === 'top' ? { x: 0, y: 0 } : position === 'center' ? { x: (viewport.width - frame.width) / 2, y: (workspaceHeight - frame.height) / 2 } : { x: viewport.width - frame.width, y: workspaceHeight - frame.height } })
    setMenu(null)
    document.getElementById(`window-${win.id}`)?.focus()
  }

  return <div className={`desktop-shell ${compact ? 'compact-desktop' : ''}`}>
    <a className="skip-link" href="#main-content">{zh ? '跳到桌面内容' : 'Skip to desktop content'}</a>
    <header className="desktop-menubar bevel">
      <SiteLink href="/" className="desktop-brand"><PixelIcon name="computer" size={34} /><strong>{zh ? 'Frank 的桌面' : "Frank's desktop"}</strong></SiteLink>
      <nav className="top-navigation" aria-label={zh ? '桌面菜单' : 'Desktop menu'}>
        <button aria-expanded={menu === 'file'} onClick={(event) => toggleMenu('file', event.currentTarget)}>{zh ? '文件' : 'File'}</button>
        <SiteLink href="/projects" onNavigate={() => open('projects')}>{zh ? '项目' : 'Projects'}</SiteLink>
        <button onClick={() => open('notes')}>{zh ? '笔记' : 'Notes'}</button>
        <button aria-expanded={menu === 'help'} onClick={(event) => toggleMenu('help', event.currentTarget)}>{zh ? '帮助' : 'Help'}</button>
      </nav>
      <button className="locale-button" onClick={toggleLocale} aria-label={zh ? 'Switch to English' : '切换为中文'}><span className={zh ? 'chosen-language' : ''}>中</span><span aria-hidden="true"> / </span><span className={!zh ? 'chosen-language' : ''}>EN</span></button>
    </header>
    <main id="main-content" tabIndex={-1} className="desktop-workspace">
      <nav className="desktop-shortcuts" aria-label={zh ? '桌面快捷方式' : 'Desktop shortcuts'}>
        <button id="shortcut-hello" onClick={() => open('hello')}><PixelIcon name="computer" size={50} /><span>{shortcutNames.hello}</span></button>
        {projectLink(undefined, 'shortcut-projects')}
        <button id="shortcut-notes" onClick={() => open('notes')}><PixelIcon name="note" size={50} /><span>{shortcutNames.notes}</span></button>
        <a href={profileLinks.github} target="_blank" rel="noreferrer" aria-label={zh ? '在 GitHub 查看 Frank ↗' : 'View Frank on GitHub ↗'}><PixelIcon name="github" size={50} /><span>GitHub ↗</span></a>
        <button id="shortcut-contact" onClick={() => open('contact')}><PixelIcon name="mail" size={50} /><span>{shortcutNames.contact}</span></button>
      </nav>
      {!valid ? <section className="not-found-window bevel"><div className="window-title"><PixelIcon name="note" />404.txt</div><NotFoundPage /></section> : identities.map((id) => state.windows.find((win) => win.id === id)).filter((win): win is WindowState => !!win).map((win) => {
        const hidden = win.minimized || (compact && win.id !== active)
        return <section key={win.id} id={`window-${win.id}`} className={`desktop-window window-${win.id} bevel ${active === win.id ? 'is-active' : ''} ${win.maximized ? 'is-maximized' : ''}`} role="region" aria-label={names[win.id]} tabIndex={-1} hidden={hidden} inert={hidden}
          style={compact ? undefined : { ...geometry(win), zIndex: state.windows.findIndex((item) => item.id === win.id) + 1 }}
          onPointerDownCapture={() => dispatch({ type: 'raise', id: win.id })} onFocusCapture={() => dispatch({ type: 'raise', id: win.id })}>
          <div className="window-title" onPointerDown={(event) => beginDrag(event, win)} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}><PixelIcon name={win.id === 'hello' ? 'note' : icons[win.id]} size={25} /><span>{names[win.id]}</span><div className="window-controls">
            <button onClick={() => dispatch({ type: 'minimize', id: win.id })} aria-label={`${zh ? '最小化' : 'Minimize'} ${names[win.id]}`}><span className="control-minimize" /></button>
            {!compact && <button className="maximize-control" onClick={() => dispatch({ type: 'maximize', id: win.id })} aria-label={`${win.maximized ? (zh ? '还原' : 'Restore') : (zh ? '最大化' : 'Maximize')} ${names[win.id]}`}><span className={win.maximized ? 'control-restore' : 'control-maximize'} /></button>}
            <button onClick={() => close(win.id)} aria-label={`${zh ? '关闭' : 'Close'} ${names[win.id]}`}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m2 2 10 10M12 2 2 12" stroke="currentColor" strokeWidth="2.5" /></svg></button>
          </div></div>
          {win.id === 'projects' ? <><div className="explorer-toolbar"><button onClick={() => close('projects')}><PixelIcon name="back" size={24} />{zh ? '返回桌面' : 'Back to desktop'}</button><span>{zh ? '按最近更新排列' : 'Recently updated first'}</span></div><div className="explorer-address"><span>{zh ? '位置：' : 'Location:'}</span><span className="inset"><PixelIcon name="folder" size={23} /><span>C:\Frank\Projects</span></span></div></> : win.id === 'hello' ? <div className="document-menuline">{zh ? '关于 Frank · 个人文档' : 'About Frank · Personal document'}</div> : null}
          <div className="window-body inset">
            {win.id === 'hello' ? <HomePage onNotes={() => open('notes')} /> : win.id === 'projects' ? <ProjectsPage /> : win.id === 'notes' ? <div className="notes-document"><ul>{notes.map((note) => <li key={note.url}><PixelIcon name="note" size={26} /><a href={note.url} target="_blank" rel="noreferrer" title={note.title}>{note.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul><a className="notes-destination" href={profileLinks.knowledge} target="_blank" rel="noreferrer">{zh ? '在知识库阅读' : 'Read in the knowledge base (Chinese)'} ↗</a></div> : <div className="contact-document"><div className="contact-intro"><PixelIcon name="mail" size={58} /><p>{zh ? '有项目想法，或想交流工具与笔记？欢迎来信。' : 'Have a project in mind, or a tool or note to talk about? Say hello.'}</p></div><div className="contact-actions"><a className="retro-button" href={profileLinks.email}><PixelIcon name="mail" size={27} />Email</a><a className="retro-button" href={profileLinks.telegram} target="_blank" rel="noreferrer"><PixelIcon name="telegram" size={27} />Telegram ↗</a></div></div>}
          </div>
        </section>
      })}
    </main>
    <footer className="taskbar bevel"><button id="start-button" className="start-button retro-button" aria-expanded={menu === 'start'} onClick={(event) => toggleMenu('start', event.currentTarget)}><PixelIcon name="start" size={30} />{zh ? '开始' : 'Start'}</button><div className="task-buttons" aria-label={zh ? '已打开的窗口' : 'Open windows'}>{valid && identities.map((id) => state.windows.find((win) => win.id === id)).filter((win): win is WindowState => !!win).map((win) => <button key={win.id} id={`task-${win.id}`} className={`retro-button task-button ${active === win.id ? 'is-current' : ''}`} aria-pressed={active === win.id} aria-label={`${zh ? '任务：' : 'Task: '}${names[win.id]}`} onClick={() => win.id === active ? dispatch({ type: 'minimize', id: win.id }) : open(win.id)}><PixelIcon name={icons[win.id]} size={25} /><span>{win.id === 'hello' ? 'hello.txt' : names[win.id]}</span></button>)}</div><span className="taskbar-signature inset">Frank</span></footer>
    {menu && <div ref={menuRef} className={`desktop-menu bevel menu-${menu}`} onKeyDown={menuKeys} aria-label={zh ? '快捷菜单' : 'Quick menu'}>{menu !== 'help' ? entries : <><p>{zh ? '单击打开，任务栏切换。也可拖动标题栏移动窗口。' : 'Click to open. Switch with the taskbar. You can also drag title bars.'}</p><p>{zh ? '键盘：Tab 切换控件，Enter 打开，Esc 关闭菜单。' : 'Keyboard: Tab between controls, Enter to open, Escape to close menus.'}</p>{!compact && <><button onClick={() => place('top')}>{zh ? '将当前窗口移到左上' : 'Move active window to top left'}</button><button onClick={() => place('center')}>{zh ? '将当前窗口居中' : 'Center active window'}</button><button onClick={() => place('bottom')}>{zh ? '将当前窗口移到右下' : 'Move active window to bottom right'}</button><button onClick={() => { dispatch({ type: 'reset' }); setMenu(null); menuTrigger.current?.focus() }}>{zh ? '复位所有窗口位置' : 'Reset all window positions'}</button></>}<button onClick={() => { setMenu(null); menuTrigger.current?.focus() }}>{zh ? '知道了' : 'Got it'}</button></>}</div>}
  </div>
}
