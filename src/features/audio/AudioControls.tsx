import { useEffect, useRef, useState } from 'react'
import { backgroundMusicPath, DEFAULT_MUSIC_VOLUME } from '../../config/audio'
import { AUDIO_PREFERENCES_VERSION } from '../../domain/audioPreferences'
import {
  loadAudioPreferences,
  saveAudioPreferences,
} from '../../infrastructure/audioPreferencesRepository'
import { useLanguage } from '../../shared/language'

const copy = {
  fr: { play: 'Lire la musique', pause: 'Mettre en pause', mute: 'Couper le son', unmute: 'Rétablir le son', volume: 'Volume de la musique' },
  en: { play: 'Play music', pause: 'Pause music', mute: 'Mute sound', unmute: 'Unmute sound', volume: 'Music volume' },
} as const

export function AudioControls() {
  const { locale } = useLanguage()
  const text = copy[locale]
  const audioRef = useRef<HTMLAudioElement>(null)
  const [available, setAvailable] = useState(Boolean(backgroundMusicPath))
  const [playing, setPlaying] = useState(false)
  const [preferences, setPreferences] = useState(() =>
    loadAudioPreferences(DEFAULT_MUSIC_VOLUME),
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = preferences.volume
    audio.muted = preferences.muted
    saveAudioPreferences(preferences)
  }, [preferences])

  if (!backgroundMusicPath || !available) return null

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const toggleMuted = () => {
    setPreferences((current) => ({ ...current, muted: !current.muted }))
  }

  return (
    <div className="audio-controls" aria-label={text.volume}>
      <audio
        ref={audioRef}
        src={backgroundMusicPath}
        loop
        preload="metadata"
        onError={() => setAvailable(false)}
        onEnded={() => setPlaying(false)}
      />
      <button type="button" onClick={togglePlayback} aria-label={playing ? text.pause : text.play}>
        {playing ? 'Ⅱ' : '▶'}
      </button>
      <button type="button" onClick={toggleMuted} aria-label={preferences.muted ? text.unmute : text.mute}>
        {preferences.muted ? '×' : '♪'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={preferences.volume}
        aria-label={text.volume}
        onChange={(event) => setPreferences({
          version: AUDIO_PREFERENCES_VERSION,
          volume: Number(event.target.value),
          muted: preferences.muted,
        })}
      />
    </div>
  )
}
