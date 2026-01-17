import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export const useHeroTitleAnimation = (firstLineRef, secondLineRef, displayName) => {
  useIsomorphicLayoutEffect(() => {
    const lines = [firstLineRef.current, secondLineRef.current].filter(Boolean)
    if (!lines.length) {
      return undefined
    }

    const motionQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    if (motionQuery?.matches) {
      lines.forEach((line) => {
        line.style.removeProperty('opacity')
        line.style.removeProperty('transform')
      })
      return undefined
    }

    const easing = 'cubic-bezier(0.25, 1, 0.5, 1)'

    lines.forEach((line) => {
      line.style.opacity = '0'
      line.style.transform = 'translateY(32px)'
    })

    const animations = lines.map((line, index) =>
      line.animate(
        [
          { transform: 'translateY(32px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        {
          duration: 640,
          delay: index * 140,
          easing,
          fill: 'forwards',
        }
      )
    )

    return () => {
      animations.forEach((animation) => animation.cancel())
      lines.forEach((line) => {
        line.style.removeProperty('opacity')
        line.style.removeProperty('transform')
      })
    }
  }, [displayName])
}
