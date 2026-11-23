import { useEffect } from 'react'

/**
 * 接管页面内 href="#xxx" 锚点的点击：
 * 阻止浏览器改写 hash，改为平滑滚动 + 移动焦点。
 * HashRouter 下 hash 承载路由，必须避免锚点将其覆盖。
 */
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const origin = event.target instanceof Element ? event.target : null
      const anchor = origin?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return

      const href = anchor.getAttribute('href') ?? ''
      const id = decodeURIComponent(href.slice(1))
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      event.preventDefault()

      target.scrollIntoView({ behavior: 'smooth', block: 'start' })

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }
      target.focus({ preventScroll: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
