import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { LanguageProvider } from './context/LanguageContext'
import { projects as definitions } from './data/projects'

const projectState = vi.hoisted(() => ({ loading: false, source: 'fallback', count: 4 }))
vi.mock('./hooks/useProjects', () => ({
  useProjects: () => ({
    projects: Array.from({ length: projectState.count }, (_, index) => {
      const definition = definitions[index % definitions.length]
      return { ...definition, ...definition.fallback, slug: `${definition.slug}-${index}`, url: `https://github.com/frank9306/${definition.repo}` }
    }), loading: projectState.loading, source: projectState.source,
  }),
}))

function renderApp(path = '/', width = 1440) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
  window.history.replaceState({}, '', path)
  return render(<LanguageProvider><App /></LanguageProvider>)
}

describe('desktop public behavior', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    window.scrollTo = vi.fn()
    projectState.count = 4
    projectState.loading = false
    projectState.source = 'fallback'
  })

  it('restores an existing document, minimizes it to the taskbar and closes with useful focus', () => {
    renderApp()
    const shortcut = screen.getByRole('button', { name: '开发笔记' })
    fireEvent.click(shortcut)
    expect(screen.getAllByRole('region', { name: 'notes.txt' })).toHaveLength(1)
    fireEvent.click(shortcut)
    expect(screen.getAllByRole('region', { name: 'notes.txt' })).toHaveLength(1)
    const notes = screen.getByRole('region', { name: 'notes.txt' })
    expect(notes).toHaveFocus()
    fireEvent.click(within(notes).getByRole('button', { name: '最小化 notes.txt' }))
    expect(screen.queryByRole('region', { name: 'notes.txt' })).not.toBeInTheDocument()
    const task = screen.getByRole('button', { name: '任务：notes.txt' })
    expect(task).toHaveFocus()
    fireEvent.click(task)
    expect(screen.getByRole('region', { name: 'notes.txt' })).toHaveFocus()
    fireEvent.click(within(screen.getByRole('region', { name: 'notes.txt' })).getByRole('button', { name: '关闭 notes.txt' }))
    expect(screen.queryByRole('button', { name: '任务：notes.txt' })).not.toBeInTheDocument()
    expect(shortcut).toHaveFocus()
  })

  it('maximizes within the workspace, restores, and offers keyboard placement and reset', () => {
    renderApp()
    const hello = screen.getByRole('region', { name: 'hello.txt — 记事本' })
    const originalLeft = hello.style.left
    fireEvent.click(within(hello).getByRole('button', { name: '最大化 hello.txt — 记事本' }))
    expect(hello.style.left).toBe('0px')
    expect(hello.style.top).toBe('0px')
    expect(hello.style.width).toBe('1440px')
    fireEvent.click(within(hello).getByRole('button', { name: '还原 hello.txt — 记事本' }))
    expect(hello.style.left).toBe(originalLeft)
    fireEvent.click(screen.getByRole('button', { name: '帮助' }))
    fireEvent.click(screen.getByRole('button', { name: '将当前窗口移到左上' }))
    expect(hello.style.left).toBe('0px')
    fireEvent.click(screen.getByRole('button', { name: '帮助' }))
    fireEvent.click(screen.getByRole('button', { name: '复位所有窗口位置' }))
    expect(hello.style.left).toBe(originalLeft)
    Object.defineProperty(window, 'innerWidth', { value: 1100, configurable: true })
    fireEvent(window, new Event('resize'))
    expect(Number.parseFloat(hello.style.left) + Number.parseFloat(hello.style.width)).toBeLessThanOrEqual(1100)
  })

  it('keeps the project route on minimize, closes to home and follows route history events', () => {
    renderApp('/projects')
    const projects = screen.getByRole('region', { name: '我的项目' })
    fireEvent.click(within(projects).getByRole('button', { name: '最小化 我的项目' }))
    expect(location.pathname).toBe('/projects')
    expect(screen.queryByRole('region', { name: '我的项目' })).not.toBeInTheDocument()
    const shortcut = screen.getByRole('link', { name: '我的项目' })
    let nativeClickAllowed = false
    document.addEventListener('click', (event) => { nativeClickAllowed = !event.defaultPrevented; event.preventDefault() }, { once: true })
    fireEvent.click(shortcut, { ctrlKey: true })
    expect(nativeClickAllowed).toBe(true)
    expect(screen.queryByRole('region', { name: '我的项目' })).not.toBeInTheDocument()
    fireEvent.click(shortcut)
    expect(screen.getByRole('region', { name: '我的项目' })).toHaveFocus()
    fireEvent.click(within(screen.getByRole('region', { name: '我的项目' })).getByRole('button', { name: '关闭 我的项目' }))
    expect(location.pathname).toBe('/')
    expect(screen.queryByRole('button', { name: '任务：我的项目' })).not.toBeInTheDocument()
    window.history.replaceState({}, '', '/projects')
    fireEvent(window, new PopStateEvent('popstate'))
    expect(screen.getByRole('region', { name: '我的项目' })).toHaveFocus()
    window.history.replaceState({}, '', '/')
    fireEvent(window, new PopStateEvent('popstate'))
    expect(screen.queryByRole('region', { name: '我的项目' })).not.toBeInTheDocument()
  })

  it('focuses the project document when entering its route directly', () => {
    renderApp('/projects')
    expect(screen.getByRole('region', { name: '我的项目' })).toHaveFocus()
  })

  it('synchronizes the route when restoring projects through its task button', () => {
    renderApp()
    const projects = screen.getByRole('region', { name: '我的项目' })
    fireEvent.click(within(projects).getByRole('button', { name: '最小化 我的项目' }))
    fireEvent.click(screen.getByRole('button', { name: '任务：我的项目' }))
    expect(location.pathname).toBe('/projects')
    expect(screen.getByRole('region', { name: '我的项目' })).toHaveFocus()
  })

  it('renders just one focusable foreground document on mobile and switches through Start', () => {
    renderApp('/', 375)
    expect(screen.getAllByRole('region')).toHaveLength(1)
    expect(screen.queryByRole('button', { name: /最大化/ })).not.toBeInTheDocument()
    const start = screen.getByRole('button', { name: '开始' })
    fireEvent.click(start)
    expect(start).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(screen.getByLabelText('快捷菜单'), { key: 'Escape' })
    expect(start).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: '开发笔记' }))
    expect(screen.getAllByRole('region')).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'notes.txt' })).toHaveFocus()
    expect(screen.queryByRole('link', { name: '打开我的项目' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /在知识库阅读/ })).toHaveAttribute('href', 'https://knowledge.webfrank.top/')
  })

  it('explains an empty repository list and its recovery destination', () => {
    projectState.count = 0
    projectState.source = 'live'
    renderApp('/projects')
    expect(screen.getByText('这个文件夹暂时没有项目。')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往 GitHub 查看' })).toHaveAttribute('href', 'https://github.com/frank9306')
  })

  it('shows four projects, expands to ten and preserves expansion through minimization', () => {
    projectState.count = 12
    renderApp('/projects')
    const list = () => within(screen.getByRole('region', { name: '我的项目' }))
    expect(list().getAllByRole('article')).toHaveLength(4)
    fireEvent.click(list().getByRole('button', { name: '展开更多项目（最多 10 项）' }))
    expect(list().getAllByRole('article')).toHaveLength(10)
    fireEvent.click(list().getByRole('button', { name: '最小化 我的项目' }))
    fireEvent.click(screen.getByRole('button', { name: '任务：我的项目' }))
    expect(list().getAllByRole('article')).toHaveLength(10)
  })

  it('announces loading and cached data, retains verified contact links and localizes metadata', () => {
    projectState.loading = true
    const view = renderApp('/projects')
    expect(screen.getByRole('status')).toHaveTextContent('正在读取 GitHub 项目')
    projectState.loading = false
    projectState.source = 'cache'
    view.rerender(<LanguageProvider><App /></LanguageProvider>)
    expect(screen.getByRole('status')).toHaveTextContent('一小时内缓存')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(document.title).toBe("My projects | Frank's desktop")
    expect(localStorage.getItem('webfrank-locale')).toBe('en')
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:liufrank621@gmail.com')
    expect(screen.getByRole('link', { name: 'Telegram ↗' })).toHaveAttribute('href', 'https://t.me/frankl0622')
    expect(screen.getByRole('link', { name: 'Read in the knowledge base (Chinese) ↗' })).toBeInTheDocument()
  })

  it('recovers an unknown route through an actual desktop link', () => {
    renderApp('/missing')
    expect(screen.getByRole('heading', { name: '这个文件不在桌面上。' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: '返回桌面' }))
    expect(location.pathname).toBe('/')
    expect(screen.getByRole('region', { name: 'hello.txt — 记事本' })).toBeInTheDocument()
  })
})
