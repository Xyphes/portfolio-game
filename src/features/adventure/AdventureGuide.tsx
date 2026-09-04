import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../../content/portfolio.schema'
import { useModalFocus } from './useModalFocus'

type AdventureGuideProps = {
  locale: Locale
  onClose: () => void
}

const copy = {
  fr: {
    kicker: 'Aide et commandes',
    title: 'L’essentiel en quelques secondes',
    intro: 'Aucun combat ni échec : explorez librement et rassemblez trois fragments pour terminer le parcours professionnel.',
    steps: [
      ['1', 'Choisissez une voie', 'Depuis la clairière centrale, prenez l’une des trois voies professionnelles dans l’ordre que vous préférez.'],
      ['2', 'Découvrez un récit', 'Approchez-vous d’un livre ou d’un personnage, puis utilisez l’action pour consulter une expérience, une étude ou un projet. Le fragment de la zone est obtenu immédiatement.'],
      ['3', 'Explorez à votre rythme', 'Les autres récits de la zone restent accessibles, mais ils ne sont pas obligatoires pour poursuivre.'],
      ['4', 'Concluez ou prolongez', 'Un récit dans chacune des trois zones termine le parcours professionnel. La voie personnelle est un épilogue entièrement facultatif.'],
    ],
    controls: 'Commandes',
    move: 'Se déplacer',
    moveKeys: 'Flèches · ZQSD · WASD',
    action: 'Interagir',
    actionKeys: 'E · Espace · bouton A',
    mouse: 'Souris',
    mouseKeys: 'Cliquer une destination ou un élément',
    touch: 'Écran tactile',
    touchKeys: 'Croix directionnelle · A',
    windows: 'Fermer une fenêtre',
    windowsKeys: 'Échap',
    accessibility: 'Toutes les informations, le CV et les coordonnées restent accessibles sans jouer.',
    classic: 'Ouvrir le mode classique',
    close: 'Commencer l’exploration',
  },
  en: {
    kicker: 'Help and controls',
    title: 'The essentials in a few seconds',
    intro: 'There is no combat or failure: explore freely and collect three fragments to complete the professional journey.',
    steps: [
      ['1', 'Choose a path', 'From the central clearing, take any of the three professional paths in whichever order you prefer.'],
      ['2', 'Discover a story', 'Walk near a book or character, then use the action control to read about an experience, education, or project. The area fragment is awarded immediately.'],
      ['3', 'Explore at your own pace', 'The area’s other stories remain available, but they are not required to continue.'],
      ['4', 'Conclude or continue', 'One story in each of the three areas completes the professional journey. The personal path is an entirely optional epilogue.'],
    ],
    controls: 'Controls',
    move: 'Move',
    moveKeys: 'Arrow keys · WASD · ZQSD',
    action: 'Interact',
    actionKeys: 'E · Space · A button',
    mouse: 'Mouse',
    mouseKeys: 'Click a destination or an item',
    touch: 'Touchscreen',
    touchKeys: 'Directional pad · A',
    windows: 'Close a window',
    windowsKeys: 'Escape',
    accessibility: 'All information, the résumé, and contact details remain available without playing.',
    classic: 'Open classic mode',
    close: 'Start exploring',
  },
} as const

export function AdventureGuide({ locale, onClose }: AdventureGuideProps) {
  const text = copy[locale]
  const dialogRef = useRef<HTMLElement>(null)
  useModalFocus(true, dialogRef, onClose)

  return (
    <div className="dialogue-backdrop guide-backdrop" role="presentation">
      <section
        id="adventure-guide-dialog"
        ref={dialogRef}
        className="dialogue-panel guide-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adventure-guide-title"
        aria-describedby="adventure-guide-description"
        tabIndex={-1}
      >
        <p className="mode-kicker">{text.kicker}</p>
        <h2 id="adventure-guide-title">{text.title}</h2>
        <p id="adventure-guide-description" className="guide-intro">{text.intro}</p>

        <ol className="guide-steps">
          {text.steps.map(([number, title, description]) => (
            <li key={number}>
              <span aria-hidden="true">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="guide-controls-title">{text.controls}</h3>
        <dl className="guide-controls">
          <div><dt>{text.move}</dt><dd>{text.moveKeys}</dd></div>
          <div><dt>{text.action}</dt><dd>{text.actionKeys}</dd></div>
          <div><dt>{text.mouse}</dt><dd>{text.mouseKeys}</dd></div>
          <div><dt>{text.touch}</dt><dd>{text.touchKeys}</dd></div>
          <div><dt>{text.windows}</dt><dd>{text.windowsKeys}</dd></div>
        </dl>

        <p className="guide-accessibility">{text.accessibility}</p>
        <div className="dialogue-actions guide-actions">
          <button type="button" className="primary-link" aria-keyshortcuts="Escape" onClick={onClose}>
            {text.close}
          </button>
          <Link className="ghost-button" to={`/${locale}/classic`}>{text.classic}</Link>
        </div>
      </section>
    </div>
  )
}
