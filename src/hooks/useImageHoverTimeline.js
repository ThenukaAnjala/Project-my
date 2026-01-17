import { useEffect } from 'react'

export const useImageHoverTimeline = ({ frameRef, imageRef, overlayRef, infoRef }) => {
  useEffect(() => {
    const frameEl = frameRef?.current
    const imageEl = imageRef?.current
    const overlayEl = overlayRef?.current
    const infoEl = infoRef?.current

    if (!frameEl || !imageEl || !overlayEl || !infoEl) {
      return undefined
    }

    const ensureTimeline = () => {
      if (frameEl._hoverTimeline) {
        return frameEl._hoverTimeline
      }

      const easingIn = 'cubic-bezier(0.33, 1, 0.68, 1)'
      const easingInfo = 'cubic-bezier(0.16, 1, 0.3, 1)'

      const imageAnimation = imageEl.animate(
        [
          { transform: 'scale(1)', filter: 'saturate(0.82) contrast(1)' },
          { transform: 'scale(1.06)', filter: 'saturate(1.15) contrast(1.08)' },
        ],
        { duration: 620, fill: 'forwards', easing: easingIn }
      )

      const overlayAnimation = overlayEl.animate(
        [
          { opacity: 0.72, transform: 'translateY(0%)' },
          { opacity: 0.25, transform: 'translateY(0%)' },
        ],
        { duration: 520, fill: 'forwards', easing: easingIn }
      )

      const infoAnimation = infoEl.animate(
        [
          { transform: 'translateY(18%)', opacity: 0 },
          { transform: 'translateY(0%)', opacity: 1 },
        ],
        { duration: 480, delay: 120, fill: 'forwards', easing: easingInfo }
      )

      const animations = [imageAnimation, overlayAnimation, infoAnimation]

      animations.forEach((animation) => {
        animation.pause()
        animation.currentTime = 0
      })

      const timeline = {
        animations,
        play() {
          animations.forEach((animation) => {
            animation.playbackRate = 1
            animation.play()
          })
        },
        reverse() {
          animations.forEach((animation) => {
            const timing = animation.effect?.getTiming?.()
            if (animation.playState === 'idle' && timing && typeof timing.duration === 'number') {
              animation.currentTime = timing.duration
            }
            animation.playbackRate = 1.75
            animation.reverse()
          })
        },
        cancel() {
          animations.forEach((animation) => {
            animation.cancel()
          })
        },
      }

      frameEl._hoverTimeline = timeline
      return timeline
    }

    const handlePointerEnter = () => {
      const timeline = ensureTimeline()
      timeline.play()
    }

    const handlePointerLeave = () => {
      const timeline = frameEl._hoverTimeline
      if (!timeline) {
        return
      }
      timeline.reverse()
    }

    frameEl.addEventListener('pointerenter', handlePointerEnter)
    frameEl.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      frameEl.removeEventListener('pointerenter', handlePointerEnter)
      frameEl.removeEventListener('pointerleave', handlePointerLeave)
      if (frameEl._hoverTimeline) {
        frameEl._hoverTimeline.cancel()
        delete frameEl._hoverTimeline
      }
    }
  }, [frameRef, imageRef, overlayRef, infoRef])
}
