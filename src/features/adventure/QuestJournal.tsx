import { useEffect, useRef, useState } from 'react'
import { adventureWorld } from '../../content/adventure.data'
import { getContentReferenceKey } from '../../content/adventure.schema'
import { localize } from '../../content/selectors'
import { PERSONAL_FRAGMENT_ID, type ProgressState } from '../../domain/progression'
import type { Locale } from '../../content/portfolio.schema'
import { useModalFocus } from './useModalFocus'

type QuestJournalProps = {
  locale: Locale
  progress: ProgressState
  currentScreenId: string
  onClose: () => void
  onReset: () => void
}

const copy = {
  fr: {
    kicker: 'Journal de quête',
    title: 'Fragments du parcours',
    intro: 'Le chemin principal demande un fragment dans chacune des trois zones professionnelles. Les récits supplémentaires et le sentier personnel restent facultatifs.',
    main: 'Quête principale',
    optional: 'Épilogue facultatif',
    current: 'Zone actuelle',
    discoveries: 'Récits consultés',
    secured: 'Fragment obtenu',
    missing: 'Fragment à retrouver',
    close: 'Fermer le journal',
    reset: 'Recommencer l’aventure',
    resetTitle: 'Effacer la progression du jeu ?',
    resetWarning: 'Les fragments, découvertes et l’initiation seront effacés. La langue et les préférences audio resteront inchangées.',
    confirmReset: 'Oui, recommencer',
    cancelReset: 'Annuler',
  },
  en: {
    kicker: 'Quest journal',
    title: 'Journey fragments',
    intro: 'The main path requires one fragment from each of the three professional areas. Extra stories and the personal trail remain optional.',
    main: 'Main quest',
    optional: 'Optional epilogue',
    current: 'Current area',
    discoveries: 'Stories discovered',
    secured: 'Fragment collected',
    missing: 'Fragment to find',
    close: 'Close journal',
    reset: 'Restart adventure',
    resetTitle: 'Clear game progress?',
    resetWarning: 'Fragments, discoveries, and training will be cleared. Language and audio preferences will remain unchanged.',
    confirmReset: 'Yes, restart',
    cancelReset: 'Cancel',
  },
} as const

const questScreens = adventureWorld.screens.filter((screen) => screen.fragment)

export function QuestJournal({ locale, progress, currentScreenId, onClose, onReset }: QuestJournalProps) {
  const text = copy[locale]
  const dialogRef = useRef<HTMLElement>(null)
  const resetTriggerRef = useRef<HTMLButtonElement>(null)
  const confirmResetRef = useRef<HTMLButtonElement>(null)
  const resetInteractionStarted = useRef(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  useModalFocus(true, dialogRef, onClose)

  useEffect(() => {
    if (confirmingReset) {
      resetInteractionStarted.current = true
      confirmResetRef.current?.focus()
    } else if (resetInteractionStarted.current) {
      resetTriggerRef.current?.focus()
    }
  }, [confirmingReset])

  return (
    <div className="dialogue-backdrop journal-backdrop" role="presentation">
      <section
        id="quest-journal-dialog"
        ref={dialogRef}
        className="dialogue-panel journal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-title"
        aria-describedby="journal-description"
        tabIndex={-1}
      >
        <div className="journal-heading">
          <div>
            <p className="mode-kicker">{text.kicker}</p>
            <h2 id="journal-title">{text.title}</h2>
          </div>
          <button type="button" className="ghost-button" aria-keyshortcuts="Escape" onClick={onClose}>
            {text.close}
          </button>
        </div>
        <p id="journal-description" className="journal-intro">{text.intro}</p>

        <div className="journal-quests">
          {questScreens.map((screen) => {
            const fragment = screen.fragment!
            const fragmentCollected = progress.fragments.includes(fragment.id)
            const discoveryCount = screen.contentRefs.filter((reference) =>
              progress.discoveredContentKeys.includes(getContentReferenceKey(reference))).length
            const optional = fragment.id === PERSONAL_FRAGMENT_ID
            const current = screen.id === currentScreenId

            return (
              <article
                key={screen.id}
                className={[
                  'journal-quest',
                  fragmentCollected ? 'is-complete' : '',
                  optional ? 'is-optional' : '',
                  current ? 'is-current' : '',
                ].filter(Boolean).join(' ')}
                aria-current={current ? 'location' : undefined}
              >
                <div className="journal-quest-heading">
                  <span>{optional ? text.optional : text.main}</span>
                  {current && <strong>{text.current}</strong>}
                </div>
                <h3>{localize(screen.name, locale)}</h3>
                <p>{localize(screen.hint, locale)}</p>
                <div className="journal-quest-status">
                  <span>{text.discoveries}: {discoveryCount} / {screen.contentRefs.length}</span>
                  <strong>{fragmentCollected ? text.secured : text.missing}</strong>
                </div>
                <progress
                  value={discoveryCount}
                  max={screen.contentRefs.length}
                  aria-label={`${text.discoveries} · ${localize(screen.name, locale)}`}
                />
              </article>
            )
          })}
        </div>

        <div className="journal-reset">
          {!confirmingReset ? (
            <button
              ref={resetTriggerRef}
              type="button"
              className="ghost-button"
              onClick={() => setConfirmingReset(true)}
            >
              {text.reset}
            </button>
          ) : (
            <div className="journal-reset-confirmation" role="group" aria-labelledby="journal-reset-title">
              <div>
                <h3 id="journal-reset-title">{text.resetTitle}</h3>
                <p>{text.resetWarning}</p>
              </div>
              <div className="journal-reset-actions">
                <button ref={confirmResetRef} type="button" className="danger-button" onClick={onReset}>
                  {text.confirmReset}
                </button>
                <button type="button" className="ghost-button" onClick={() => setConfirmingReset(false)}>
                  {text.cancelReset}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
