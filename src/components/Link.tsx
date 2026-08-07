import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

export function SiteLink({ href, children, onNavigate, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; onNavigate?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0 })
    onNavigate?.()
  }
  return <a href={href} onClick={handleClick} {...props}>{children}</a>
}
