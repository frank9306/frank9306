import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { LanguageProvider } from './context/LanguageContext'

vi.mock('./hooks/useProjects', () => ({
  useProjects: () => ({ projects: [], loading: false, source: 'fallback' }),
}))

function renderApp(path = '/') {
  window.history.replaceState({}, '', path)
  return render(<LanguageProvider><App /></LanguageProvider>)
}

describe('App routing and localization', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
  })

  it('renders direct first-person home copy and switches language persistently', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('这里放我的项目、笔记，还有一些没做完的想法。')
    expect(screen.getByText('我是 Frank，做 AI Agent、Codex 工具和自动化。')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '由纸张、金属模块和连线组成的自动化工作台' })).toHaveAttribute('src', '/images/agent-workbench-hero.webp')
    expect(screen.getByText('我在做的三件事')).toBeInTheDocument()
    expect(screen.getByText(/反复改配置、检查 Agent 的结果、到处找常用链接/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '我做的东西' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /查看项目/ })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('heading', { name: '联系我' })).toBeInTheDocument()
    expect(screen.getByText('有事找我，或者聊聊也行。')).toBeInTheDocument()
    expect(document.title).toBe('Frank | AI Agent、Codex 工具与自动化')
    expect(screen.getByRole('link', { name: '在 GitHub 查看 Frank' })).toHaveAttribute('href', 'https://github.com/frank9306')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Here are my projects, notes, and a few unfinished ideas.')
    expect(screen.getByText("I'm Frank. I build AI agents, Codex tools, and automation.")).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'An automation workbench made from paper, metal modules, and connecting lines' })).toBeInTheDocument()
    expect(screen.getByText('Three things I work on')).toBeInTheDocument()
    expect(screen.getByText(/changing settings, checking agent results/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Things I’ve made' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact me' })).toBeInTheDocument()
    expect(screen.getByText('Get in touch, or just say hello.')).toBeInTheDocument()
    expect(document.title).toBe('Frank | AI agents, Codex tools, and automation')
    expect(localStorage.getItem('webfrank-locale')).toBe('en')
  })

  it('renders the projects route', () => {
    renderApp('/projects')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('项目')
  })

  it('renders a useful 404 route', () => {
    renderApp('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('这个页面不存在。')
    expect(screen.getByRole('link', { name: /返回首页/ })).toHaveAttribute('href', '/')
  })
})
