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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('把重复工作，做成可复用的工具。')
    expect(screen.getByText('我是 Frank，做 AI Agent、Codex 工具和自动化。')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '由纸张、金属模块和连线组成的自动化工作台' })).toHaveAttribute('src', '/images/agent-workbench-hero.webp')
    expect(screen.getByText('我在做的三件事')).toBeInTheDocument()
    expect(screen.getByText(/反复改配置、Agent 结果难验收、常用入口太散/)).toBeInTheDocument()
    expect(document.title).toBe('Frank | AI Agent、Codex 工具与自动化')
    expect(screen.getByRole('link', { name: '在 GitHub 查看 Frank' })).toHaveAttribute('href', 'https://github.com/frank9306')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('I turn repeated work into reusable tools.')
    expect(screen.getByText("I'm Frank. I build AI agents, Codex tools, and automation.")).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'An automation workbench made from paper, metal modules, and connecting lines' })).toBeInTheDocument()
    expect(screen.getByText('Three things I work on')).toBeInTheDocument()
    expect(screen.getByText(/repeated configuration, agent work that is hard to verify/)).toBeInTheDocument()
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
