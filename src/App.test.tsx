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

  it('renders the home page and switches language persistently', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('你好，我是 Frank')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hi, I’m Frank')
    expect(localStorage.getItem('webfrank-locale')).toBe('en')
  })

  it('renders the projects route', () => {
    renderApp('/projects')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('项目与实验')
  })

  it('renders a useful 404 route', () => {
    renderApp('/does-not-exist')
    expect(screen.getByText('404 / NOT FOUND')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /返回首页/ })).toHaveAttribute('href', '/')
  })
})
