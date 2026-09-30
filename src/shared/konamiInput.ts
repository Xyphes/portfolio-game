import type { KonamiDirection } from '../domain/konamiCode'

export const konamiDirectionEventName = 'portfolio:konami-direction'

export function dispatchKonamiDirection(direction: KonamiDirection) {
  window.dispatchEvent(new CustomEvent<KonamiDirection>(konamiDirectionEventName, {
    detail: direction,
  }))
}
