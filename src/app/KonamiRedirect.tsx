import { useEffect, useRef } from 'react'
import {
  advanceKonamiSequence,
  konamiDirectionSequence,
  konamiRedirectUrl,
  type KonamiDirection,
} from '../domain/konamiCode'
import { konamiDirectionEventName } from '../shared/konamiInput'

type KonamiRedirectProps = {
  onComplete?: () => void
}

function redirectToSecretVideo() {
  window.location.assign(konamiRedirectUrl)
}

export function KonamiRedirect({ onComplete = redirectToSecretVideo }: KonamiRedirectProps) {
  const progressRef = useRef(0)

  useEffect(() => {
    const registerInput = (input: string) => {
      progressRef.current = advanceKonamiSequence(progressRef.current, input)

      if (progressRef.current === konamiDirectionSequence.length) {
        progressRef.current = 0
        onComplete()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      registerInput(event.key)
    }
    const handlePadDirection = (event: Event) => {
      registerInput((event as CustomEvent<KonamiDirection>).detail)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener(konamiDirectionEventName, handlePadDirection)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener(konamiDirectionEventName, handlePadDirection)
    }
  }, [onComplete])

  return null
}
