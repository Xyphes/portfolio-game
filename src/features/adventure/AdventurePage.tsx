import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adventureWorld, getAdventureScreen } from '../../content/adventure.data'
import { getContentReferenceKey, type ContentReference } from '../../content/adventure.schema'
import { portfolio } from '../../content/portfolio.data'
import { getContentDetail, getSkillLabel, localize } from '../../content/selectors'
import {
  ADVENTURE_FRAGMENT_IDS,
  addFlag,
  getNextProfessionalFragmentId,
  isAdventureComplete,
  isProfessionalJourneyComplete,
  PROFESSIONAL_FRAGMENT_IDS,
  setLastScreen,
  TUTORIAL_FLAG_ID,
  type ProgressState,
} from '../../domain/progression'
import { AdventureBridge } from '../../game/bridge/AdventureBridge'
import { createBrowserProgressRepository } from '../../infrastructure/progressRepository'
import { LanguageSwitch } from '../../shared/LanguageSwitch'
import { normalizeLocale, useLanguage } from '../../shared/language'
import { usePageMetadata } from '../../shared/usePageMetadata'
import { AdventureGuide } from './AdventureGuide'
import { collectContentProgress } from './collectContentProgress'
import { PhaserHost } from './PhaserHost'
import { QuestJournal } from './QuestJournal'
import { TouchControls } from './TouchControls'
import { releaseLandscapeOrientation, requestLandscapeOrientation } from './orientation'
import { useModalFocus } from './useModalFocus'

const copy = {
  fr: {
    mode: 'Mode aventure · monde ouvert',
    classic: 'Mode classique',
    objective: 'Objectif',
    fragment: 'Fragments du parcours',
    fragmentFound: 'Fragment obtenu',
    close: 'Fermer',
    rotate: 'Tournez votre téléphone',
    rotateText: 'L’aventure se joue en paysage. Le portfolio classique reste disponible immédiatement.',
    rotateAction: 'Passer en mode paysage',
    rotateUnavailable: 'La rotation automatique n’est pas disponible dans ce navigateur. Tournez l’appareil manuellement ou utilisez le mode classique.',
    keyboard: 'Flèches ou ZQSD / WASD · E ou Espace',
    proof: 'Cette fiche provient de la même donnée validée que le mode classique.',
    training: 'Initiation',
    trainingDone: 'Terminée',
    trainingTodo: 'À faire',
    dismiss: 'Masquer',
    map: 'Carte',
    discoveries: 'Découvertes dans cette zone',
    journal: 'Journal de quête',
    guide: 'Aide et commandes',
    information: 'Informations',
    closeInformation: 'Fermer les informations',
    nextStep: 'Prochaine étape',
    routeTarget: 'Parcours principal · 5–10 min',
    optionalStep: 'Épilogue facultatif',
    optionalTarget: 'Exploration libre · jusqu’à +5 min',
    explorationComplete: 'Exploration complète',
    completeTarget: 'Tous les fragments sont réunis',
    hubHint: 'Suivez la zone conseillée sur la carte ou choisissez librement un autre chemin.',
    completeHint: 'Tous les chemins restent ouverts si vous souhaitez revoir une partie du parcours.',
    resetDone: 'Nouvelle aventure prête dans la clairière d’initiation.',
    professionalProgress: 'Parcours professionnel',
    professionalStatus: 'Parcours professionnel terminé',
    professionalTitle: 'Le parcours est reconstitué',
    professionalText: 'Les trois fragments professionnels sont réunis. Mon profil complet, mon CV et mes coordonnées sont maintenant accessibles directement, sans explorer le sentier personnel.',
    personalStatus: 'Épilogue facultatif terminé',
    personalTitle: 'Exploration complète',
    personalText: 'Le fragment personnel complète le parcours avec mes centres d’intérêt. Cette étape reste distincte de la conclusion professionnelle.',
    done: 'Terminé',
    viewPortfolio: 'Voir le portfolio complet',
    downloadCv: 'Télécharger le CV',
    continueProfessional: 'Explorer l’épilogue facultatif',
    continueAdventure: 'Continuer à explorer',
    metaTitle: 'Aventure interactive — Portfolio de Willy Somkhit',
    metaDescription: 'Explorez le parcours professionnel de Willy Somkhit dans une courte aventure web rétro et accessible.',
  },
  en: {
    mode: 'Adventure mode · open world',
    classic: 'Classic mode',
    objective: 'Objective',
    fragment: 'Journey fragments',
    fragmentFound: 'Fragment collected',
    close: 'Close',
    rotate: 'Rotate your phone',
    rotateText: 'The adventure is played in landscape. The classic portfolio remains immediately available.',
    rotateAction: 'Switch to landscape',
    rotateUnavailable: 'Automatic rotation is not available in this browser. Rotate the device manually or use classic mode.',
    keyboard: 'Arrow keys or WASD · E or Space',
    proof: 'This profile comes from the same validated data as classic mode.',
    training: 'Training',
    trainingDone: 'Complete',
    trainingTodo: 'To do',
    dismiss: 'Dismiss',
    map: 'Map',
    discoveries: 'Discoveries in this area',
    journal: 'Quest journal',
    guide: 'Help and controls',
    information: 'Information',
    closeInformation: 'Close information',
    nextStep: 'Next step',
    routeTarget: 'Main journey · 5–10 min',
    optionalStep: 'Optional epilogue',
    optionalTarget: 'Free exploration · up to +5 min',
    explorationComplete: 'Exploration complete',
    completeTarget: 'All fragments collected',
    hubHint: 'Follow the suggested area on the map or freely choose another path.',
    completeHint: 'Every path remains open if you want to revisit part of the journey.',
    resetDone: 'A new adventure is ready in the training clearing.',
    professionalProgress: 'Professional journey',
    professionalStatus: 'Professional journey complete',
    professionalTitle: 'The journey is restored',
    professionalText: 'The three professional fragments are reunited. My full profile, résumé, and contact details are now directly available without exploring the personal trail.',
    personalStatus: 'Optional epilogue complete',
    personalTitle: 'Exploration complete',
    personalText: 'The personal fragment completes the journey with my interests. This step remains separate from the professional conclusion.',
    done: 'Complete',
    viewPortfolio: 'View the full portfolio',
    downloadCv: 'Download résumé',
    continueProfessional: 'Explore the optional epilogue',
    continueAdventure: 'Keep exploring',
    metaTitle: 'Interactive adventure — Willy Somkhit Portfolio',
    metaDescription: 'Explore Willy Somkhit’s professional journey through a short, accessible retro web adventure.',
  },
} as const

const cvDocument = portfolio.documents.find(({ id }) => id === 'cv')
type CompletionKind = 'professional' | 'personal'

export function AdventurePage() {
  const params = useParams()
  const routeLocale = normalizeLocale(params.locale)
  const { locale, setLocale } = useLanguage()
  const text = copy[routeLocale]
  const repository = useMemo(() => createBrowserProgressRepository(), [])
  const initialProgress = useMemo(() => repository.load(), [repository])
  const [progress, setProgress] = useState<ProgressState>(initialProgress)
  const bridge = useMemo(() => new AdventureBridge({
    discoveredContentKeys: initialProgress.discoveredContentKeys,
    tutorialCompleted: initialProgress.flags.includes(TUTORIAL_FLAG_ID),
    lastScreenId: getAdventureScreen(initialProgress.lastScreenId).id,
  }), [initialProgress])
  const [selectedContent, setSelectedContent] = useState<ContentReference | null>(null)
  const [currentScreenId, setCurrentScreenId] = useState(
    getAdventureScreen(initialProgress.lastScreenId).id,
  )
  const [notice, setNotice] = useState<string | null>(null)
  const [showJournal, setShowJournal] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [orientationRequestPending, setOrientationRequestPending] = useState(false)
  const [orientationMessage, setOrientationMessage] = useState<string | null>(null)
  const [gameSessionKey, setGameSessionKey] = useState(0)
  const [completionDialog, setCompletionDialog] = useState<CompletionKind | null>(null)
  const contentDialogRef = useRef<HTMLElement>(null)
  const completionDialogRef = useRef<HTMLElement>(null)
  const infoDialogRef = useRef<HTMLElement>(null)
  const professionalCompletionWasReached = useRef(
    isProfessionalJourneyComplete(initialProgress),
  )
  const adventureCompletionWasReached = useRef(isAdventureComplete(initialProgress))
  const orientationLockRef = useRef({ locked: false, enteredFullscreen: false })

  useEffect(() => {
    if (locale !== routeLocale) setLocale(routeLocale)
  }, [locale, routeLocale, setLocale])

  usePageMetadata({
    locale: routeLocale,
    title: text.metaTitle,
    description: text.metaDescription,
    canonicalPath: `/${routeLocale}/adventure`,
    alternatePaths: { fr: '/fr/adventure', en: '/en/adventure' },
  })

  const commitProgress = useCallback((update: (current: ProgressState) => ProgressState) => {
    setProgress((current) => {
      const next = update(current)
      repository.save(next)
      return next
    })
  }, [repository])

  useEffect(() => bridge.onEvent((event) => {
    if (event.type === 'content') {
      setSelectedContent(event.reference)
      commitProgress((current) => collectContentProgress(current, event.reference))
    }
    else if (event.type === 'screen-changed') {
      setCurrentScreenId(event.screenId)
      commitProgress((current) => setLastScreen(current, event.screenId))
    } else if (event.type === 'tutorial-completed') {
      commitProgress((current) => addFlag(current, TUTORIAL_FLAG_ID))
      setNotice(localize(adventureWorld.canvasCopy.tutorialComplete, routeLocale))
    } else if (event.type === 'notice') setNotice(event.message)
  }), [bridge, commitProgress, routeLocale])
  useEffect(() => () => bridge.dispose(), [bridge])
  useEffect(() => () => {
    if (orientationLockRef.current.locked) {
      releaseLandscapeOrientation(orientationLockRef.current.enteredFullscreen)
    }
  }, [])

  const rotateToLandscape = useCallback(async () => {
    setOrientationRequestPending(true)
    setOrientationMessage(null)
    const result = await requestLandscapeOrientation()
    orientationLockRef.current = {
      locked: result.status === 'locked',
      enteredFullscreen: result.enteredFullscreen,
    }
    if (result.status === 'unsupported') setOrientationMessage(text.rotateUnavailable)
    setOrientationRequestPending(false)
  }, [text.rotateUnavailable])

  const tutorialCompleted = progress.flags.includes(TUTORIAL_FLAG_ID)
  const currentScreen = getAdventureScreen(currentScreenId)
  const dialogueContent = selectedContent
    ? getContentDetail(selectedContent, routeLocale)
    : null
  const currentFragment = currentScreen.fragment
  const hasCurrentFragment = currentFragment
    ? progress.fragments.includes(currentFragment.id)
    : false
  const fragmentCount = ADVENTURE_FRAGMENT_IDS.filter((fragmentId) =>
    progress.fragments.includes(fragmentId)).length
  const professionalFragmentCount = PROFESSIONAL_FRAGMENT_IDS.filter((fragmentId) =>
    progress.fragments.includes(fragmentId)).length
  const professionalCompletionReached = isProfessionalJourneyComplete(progress)
  const adventureCompletionReached = isAdventureComplete(progress)
  const nextProfessionalFragmentId = getNextProfessionalFragmentId(progress)
  const nextProfessionalScreen = nextProfessionalFragmentId
    ? adventureWorld.screens.find((screen) => screen.fragment?.id === nextProfessionalFragmentId)
    : undefined
  const personalScreen = adventureWorld.screens.find(({ kind }) => kind === 'personal')
  const recommendedScreen = !tutorialCompleted
    ? getAdventureScreen(adventureWorld.startScreenId)
    : nextProfessionalScreen ?? (!adventureCompletionReached ? personalScreen : undefined)
  const recommendationLabel = professionalCompletionReached
    ? adventureCompletionReached ? text.explorationComplete : text.optionalStep
    : text.nextStep
  const recommendationTiming = professionalCompletionReached
    ? adventureCompletionReached ? text.completeTarget : text.optionalTarget
    : text.routeTarget
  const zoneDiscoveryCount = currentScreen.contentRefs.filter((reference) =>
    progress.discoveredContentKeys.includes(getContentReferenceKey(reference))).length
  const objectiveScreen = tutorialCompleted
    ? currentScreen
    : getAdventureScreen(adventureWorld.startScreenId)
  const objectiveHint = tutorialCompleted && currentScreen.kind === 'training'
    ? adventureCompletionReached ? text.completeHint : text.hubHint
    : localize(objectiveScreen.hint, routeLocale)

  useEffect(() => {
    if (professionalCompletionReached && !professionalCompletionWasReached.current) {
      professionalCompletionWasReached.current = true
      setCompletionDialog('professional')
      return
    }

    if (adventureCompletionReached && !adventureCompletionWasReached.current) {
      adventureCompletionWasReached.current = true
      setCompletionDialog('personal')
    }
  }, [adventureCompletionReached, professionalCompletionReached])

  const closeCompletion = useCallback(() => {
    setSelectedContent(null)
    if (
      completionDialog === 'professional'
      && adventureCompletionReached
      && !adventureCompletionWasReached.current
    ) {
      adventureCompletionWasReached.current = true
      setCompletionDialog('personal')
      return
    }
    setCompletionDialog(null)
  }, [adventureCompletionReached, completionDialog])

  const closeContent = useCallback(() => setSelectedContent(null), [])
  const closeJournal = useCallback(() => setShowJournal(false), [])
  const closeGuide = useCallback(() => setShowGuide(false), [])
  const closeInfo = useCallback(() => setShowInfo(false), [])
  const resetAdventure = useCallback(() => {
    const initial = repository.reset()
    bridge.setRuntimeState({
      discoveredContentKeys: initial.discoveredContentKeys,
      tutorialCompleted: false,
      lastScreenId: initial.lastScreenId,
      inputEnabled: true,
    })
    professionalCompletionWasReached.current = false
    adventureCompletionWasReached.current = false
    setProgress(initial)
    setCurrentScreenId(initial.lastScreenId)
    setSelectedContent(null)
    setCompletionDialog(null)
    setShowJournal(false)
    setShowGuide(false)
    setShowInfo(false)
    setGameSessionKey((current) => current + 1)
    setNotice(text.resetDone)
  }, [bridge, repository, text.resetDone])

  useModalFocus(Boolean(dialogueContent && !completionDialog && !showJournal && !showGuide && !showInfo), contentDialogRef, closeContent)
  useModalFocus(Boolean(showInfo && !completionDialog && !showJournal && !showGuide), infoDialogRef, closeInfo)
  useModalFocus(Boolean(completionDialog), completionDialogRef, closeCompletion)

  useEffect(() => {
    bridge.setRuntimeState({
      discoveredContentKeys: progress.discoveredContentKeys,
      tutorialCompleted,
      lastScreenId: currentScreen.id,
      inputEnabled: !dialogueContent && !completionDialog && !showJournal && !showGuide && !showInfo,
    })
  }, [bridge, completionDialog, currentScreen.id, dialogueContent, progress.discoveredContentKeys, progress.fragments, showGuide, showInfo, showJournal, tutorialCompleted])

  const completionContent = completionDialog === 'personal'
    ? {
        count: '4 / 4',
        status: text.personalStatus,
        title: text.personalTitle,
        body: text.personalText,
        continueLabel: text.continueAdventure,
      }
    : {
        count: '3 / 3',
        status: text.professionalStatus,
        title: text.professionalTitle,
        body: text.professionalText,
        continueLabel: text.continueProfessional,
      }

  return (
    <main className="adventure-shell">
      <header className="adventure-header">
        <div className="adventure-header-primary">
          <Link className="adventure-brand" to="/" aria-label={text.mode}>
            <span className="monogram" aria-hidden="true">WS</span>
          </Link>
          <button
            type="button"
            className="information-button"
            aria-haspopup="dialog"
            aria-expanded={showInfo}
            aria-controls="adventure-information-dialog"
            onClick={() => setShowInfo(true)}
          >
            <span aria-hidden="true">i</span>
            {text.information}
          </button>
        </div>
        <div className="adventure-actions">
          <LanguageSwitch />
          <Link className="classic-exit" to={`/${routeLocale}/classic`}>{text.classic}</Link>
        </div>
      </header>

      <section className="portrait-gate">
        <button
          type="button"
          className="rotate-button"
          aria-label={text.rotateAction}
          aria-busy={orientationRequestPending}
          disabled={orientationRequestPending}
          onClick={() => void rotateToLandscape()}
        >
          <span className="rotate-icon" aria-hidden="true">↻</span>
        </button>
        <h1>{text.rotate}</h1>
        <p>{text.rotateText}</p>
        {orientationMessage && <p className="orientation-message" role="status">{orientationMessage}</p>}
        <Link className="primary-link" to={`/${routeLocale}/classic`}>{text.classic}</Link>
      </section>

      <section className="game-layout">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {localize(currentScreen.name, routeLocale)}. {text.discoveries}: {zoneDiscoveryCount} / {currentScreen.contentRefs.length}. {text.professionalProgress}: {professionalFragmentCount} / 3.
        </p>
        {showInfo && (
          <button
            type="button"
            className="info-scrim"
            tabIndex={-1}
            aria-hidden="true"
            onClick={closeInfo}
          />
        )}
        <aside
          id="adventure-information-dialog"
          ref={infoDialogRef}
          className="quest-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adventure-information-title"
          hidden={!showInfo}
          tabIndex={-1}
        >
          <div className="info-panel-heading">
            <p className="mode-kicker">{text.objective}</p>
            <button type="button" className="info-close" aria-keyshortcuts="Escape" onClick={closeInfo}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">{text.closeInformation}</span>
            </button>
          </div>
          <h1 id="adventure-information-title">{localize(currentScreen.name, routeLocale)}</h1>
          <p>{objectiveHint}</p>
          <div className={[
            'route-guide',
            professionalCompletionReached ? 'is-optional' : '',
            adventureCompletionReached ? 'is-complete' : '',
          ].filter(Boolean).join(' ')}>
            <span>{recommendationLabel}</span>
            <strong>
              {recommendedScreen
                ? localize(recommendedScreen.name, routeLocale)
                : text.completeTarget}
            </strong>
            {!adventureCompletionReached && <small>{recommendationTiming}</small>}
          </div>
          <div className={tutorialCompleted ? 'tutorial-status is-complete' : 'tutorial-status'}>
            <span>{text.training}</span>
            <strong>{tutorialCompleted ? text.trainingDone : text.trainingTodo}</strong>
          </div>
          {currentScreen.contentRefs.length > 0 && (
            <div className="discovery-status">
              <span>{text.discoveries}</span>
              <strong>{zoneDiscoveryCount} / {currentScreen.contentRefs.length}</strong>
            </div>
          )}
          <div className={fragmentCount > 0 ? 'fragment-status is-found' : 'fragment-status'}>
            <span aria-hidden="true">◆</span>
            <div>
              <strong>{currentFragment ? localize(currentFragment.label, routeLocale) : text.fragment}</strong>
              <small>
                {hasCurrentFragment
                  ? `${text.fragmentFound} · ${fragmentCount} / 4`
                  : `${fragmentCount} / 4`}
              </small>
            </div>
          </div>
          <div className={professionalCompletionReached ? 'professional-progress is-complete' : 'professional-progress'}>
            <span>{text.professionalProgress}</span>
            <strong>{professionalFragmentCount} / 3</strong>
          </div>
          {adventureCompletionReached && (
            <div className="completion-status">
              <span>{text.personalStatus}</span>
              <strong>{text.done}</strong>
            </div>
          )}
          <button
            type="button"
            className="journal-button"
            aria-haspopup="dialog"
            aria-expanded={showJournal}
            aria-controls="quest-journal-dialog"
            onClick={() => {
              setShowInfo(false)
              setShowJournal(true)
            }}
          >
            <span>{text.journal}</span>
            <strong>{professionalFragmentCount} / 3</strong>
          </button>
          <button
            type="button"
            className="journal-button guide-button"
            aria-haspopup="dialog"
            aria-expanded={showGuide}
            aria-controls="adventure-guide-dialog"
            onClick={() => {
              setShowInfo(false)
              setShowGuide(true)
            }}
          >
            <span>{text.guide}</span>
            <strong aria-hidden="true">?</strong>
          </button>
          <small className="keyboard-help">{text.keyboard}</small>
        </aside>

        <div className="game-column">
          <div className="game-frame">
            <PhaserHost
              key={gameSessionKey}
              bridge={bridge}
              locale={routeLocale}
              screenId={currentScreen.id}
              tutorialCompleted={tutorialCompleted}
            />
            <div
              className="game-map-overlay"
              role="img"
              aria-label={`${text.map} · ${localize(currentScreen.name, routeLocale)}${recommendedScreen ? ` · ${text.nextStep}: ${localize(recommendedScreen.name, routeLocale)}` : ''}`}
            >
              <span>{text.map}</span>
              <div className="world-map" aria-hidden="true">
                {adventureWorld.screens.map((screen) => (
                  <i
                    key={screen.id}
                    className={[
                      screen.id === currentScreen.id ? 'is-current' : '',
                      screen.id === recommendedScreen?.id ? 'is-recommended' : '',
                      screen.fragment && progress.fragments.includes(screen.fragment.id) ? 'is-complete' : '',
                      screen.contentStatus === 'awaiting-user-content' ? 'is-pending' : '',
                    ].filter(Boolean).join(' ')}
                    style={{
                      gridColumn: screen.coordinate.x + 2,
                      gridRow: screen.coordinate.y + 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <TouchControls bridge={bridge} locale={routeLocale} />
        </div>
      </section>

      {notice && (
        <div className="adventure-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>{text.dismiss}</button>
        </div>
      )}

      {showJournal && !completionDialog && !showGuide && !showInfo && (
        <QuestJournal
          locale={routeLocale}
          progress={progress}
          currentScreenId={currentScreen.id}
          onClose={closeJournal}
          onReset={resetAdventure}
        />
      )}

      {showGuide && !completionDialog && !showJournal && !showInfo && (
        <AdventureGuide locale={routeLocale} onClose={closeGuide} />
      )}

      {dialogueContent && !completionDialog && !showJournal && !showGuide && !showInfo && (
        <div className="dialogue-backdrop" role="presentation">
          <section
            ref={contentDialogRef}
            className="dialogue-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialogue-title"
            aria-describedby={dialogueContent.summary ? 'dialogue-summary dialogue-proof' : 'dialogue-proof'}
            tabIndex={-1}
          >
            <p className="mode-kicker">{dialogueContent.kicker}</p>
            <h2 id="dialogue-title">{dialogueContent.title}</h2>
            {dialogueContent.summary && <p id="dialogue-summary">{dialogueContent.summary}</p>}
            {dialogueContent.bullets.length > 0 && (
              <ul className="dialogue-list">
                {dialogueContent.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
            {dialogueContent.skillIds.length > 0 && (
              <div className="dialogue-skills">
                {dialogueContent.skillIds.map((skillId) => (
                  <span key={skillId}>{getSkillLabel(skillId, routeLocale)}</span>
                ))}
              </div>
            )}
            <small id="dialogue-proof">{text.proof}</small>
            <div className="dialogue-actions">
              <button type="button" className="ghost-button" aria-keyshortcuts="Escape" onClick={closeContent}>
                {text.close}
              </button>
            </div>
          </section>
        </div>
      )}

      {completionDialog && (
        <div className="completion-backdrop" role="presentation">
          <section
            ref={completionDialogRef}
            className="completion-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-title"
            aria-describedby="completion-description"
            tabIndex={-1}
          >
            <p className="mode-kicker">{completionContent.count} · {completionContent.status}</p>
            <h2 id="completion-title">{completionContent.title}</h2>
            <p id="completion-description">{completionContent.body}</p>
            <div className="completion-actions">
              <Link className="primary-link gold" to={`/${routeLocale}/classic`}>
                {text.viewPortfolio}
              </Link>
              {cvDocument && (
                <a className="primary-link" href={cvDocument.href} download>
                  {text.downloadCv}
                </a>
              )}
              <button
                type="button"
                className="ghost-button"
                aria-keyshortcuts="Escape"
                onClick={closeCompletion}
              >
                {completionContent.continueLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
