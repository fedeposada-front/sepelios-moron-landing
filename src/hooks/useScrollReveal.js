import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = Math.min(i * 40, 160) + 'ms'
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    reveals.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
