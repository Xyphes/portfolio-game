import { useEffect, useRef } from 'react'
import {
  advanceArrowKonamiSequence,
  arrowKonamiSequence,
  konamiRedirectUrl,
} from '../domain/konamiCode'

type KonamiRedirectProps = {
  onComplete?: () => void
}

function redirectToSecretVideo() {
  window.location.assign(konamiRedirectUrl)
}

export function KonamiRedirect({ onComplete = redirectToSecretVideo }: KonamiRedirectProps) {
  const progressRef = useRef(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return

      progressRef.current = advanceArrowKonamiSequence(progressRef.current, event.key)

      if (progressRef.current === arrowKonamiSequence.length) {
        progressRef.current = 0
        onComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])

  return null
}
