import { adventureWorldSchema } from './adventure.schema'
import { portfolio } from './portfolio.data'

const adventureWorldCandidate = {
  startScreenId: 'training-clearing',
  canvasCopy: {
    action: { fr: 'Interagir : clic, toucher, Espace ou A', en: 'Interact: click, tap, Space or A' },
    tutorialEnemy: { fr: 'Lueur d’essai', en: 'Practice wisp' },
    tutorialRequired: {
      fr: 'Touchez la lueur avec le bouton d’action avant d’explorer.',
      en: 'Touch the wisp with the action button before exploring.',
    },
    tutorialComplete: {
      fr: 'Initiation terminée · les chemins sont ouverts.',
      en: 'Training complete · the paths are open.',
    },
    nothingNearby: {
      fr: 'Rien à examiner ici. Approchez-vous d’un repère.',
      en: 'Nothing to inspect here. Move closer to a marker.',
    },
  },
  screens: [
    {
      id: 'training-clearing',
      coordinate: { x: 0, y: 0 },
      kind: 'training',
      name: { fr: 'Clairière d’initiation', en: 'Training clearing' },
      hint: {
        fr: 'Approchez la lueur puis utilisez une fois le bouton d’action.',
        en: 'Walk near the wisp, then use the action button once.',
      },
      exits: {
        up: 'study-ruins',
        down: 'personal-trail',
        left: 'project-workshop',
        right: 'thales-grove',
      },
      contentRefs: [],
      contentStatus: 'ready',
    },
    {
      id: 'thales-grove',
      coordinate: { x: 1, y: 0 },
      kind: 'experience',
      name: { fr: 'Bosquet de la rigueur', en: 'Grove of rigor' },
      hint: {
        fr: 'Rencontrez un guide pour obtenir le fragment ; les cinq autres récits sont facultatifs.',
        en: 'Meet one guide to collect the fragment; the other five stories are optional.',
      },
      exits: { left: 'training-clearing' },
      contentRefs: [
        { kind: 'experience', id: 'thales' },
        { kind: 'experience', id: 'ekino-vietnam' },
        { kind: 'experience', id: 'agence3d' },
        { kind: 'experience', id: 'region-idf' },
        { kind: 'experience', id: 'sleepless' },
        { kind: 'experience', id: 'ecp' },
      ],
      fragment: {
        id: 'thales-rigor',
        label: { fr: 'Fragment de rigueur', en: 'Rigor fragment' },
      },
      contentStatus: 'ready',
    },
    {
      id: 'study-ruins',
      coordinate: { x: 0, y: -1 },
      kind: 'studies',
      name: { fr: 'Archives des études', en: 'Study archives' },
      hint: {
        fr: 'Consultez une archive pour obtenir le fragment ; les deux autres complètent le parcours.',
        en: 'Read one archive to collect the fragment; the other two complete the journey.',
      },
      exits: { down: 'training-clearing' },
      contentRefs: [
        { kind: 'education', id: 'epita' },
        { kind: 'education', id: 'heriot-watt' },
        { kind: 'education', id: 'francs-bourgeois' },
      ],
      fragment: {
        id: 'learning-curiosity',
        label: { fr: 'Fragment de curiosité', en: 'Curiosity fragment' },
      },
      contentStatus: 'ready',
    },
    {
      id: 'project-workshop',
      coordinate: { x: -1, y: 0 },
      kind: 'projects',
      name: { fr: 'Atelier des projets', en: 'Project workshop' },
      hint: {
        fr: 'Inspectez un projet pour obtenir le fragment ; cinq autres réalisations restent à découvrir.',
        en: 'Inspect one project to collect the fragment; five more builds remain to discover.',
      },
      exits: { right: 'training-clearing' },
      contentRefs: [
        { kind: 'project', id: 'csharp-game' },
        { kind: 'project', id: 'xaml-launcher' },
        { kind: 'project', id: 'ocr' },
        { kind: 'project', id: '42sh' },
        { kind: 'project', id: 'heriot-web' },
        { kind: 'project', id: 'heriot-flutter' },
      ],
      fragment: {
        id: 'builder-craft',
        label: { fr: 'Fragment de création', en: 'Builder fragment' },
      },
      contentStatus: 'ready',
    },
    {
      id: 'personal-trail',
      coordinate: { x: 0, y: 1 },
      kind: 'personal',
      name: { fr: 'Sentier personnel', en: 'Personal trail' },
      hint: {
        fr: 'Épilogue facultatif : découvrez un intérêt pour obtenir le fragment, ou explorez les quatre souvenirs.',
        en: 'Optional epilogue: discover one interest to collect the fragment, or explore all four memories.',
      },
      exits: { up: 'training-clearing' },
      contentRefs: [
        { kind: 'interest', id: 'climbing' },
        { kind: 'interest', id: 'crafting' },
        { kind: 'interest', id: 'swimming' },
        { kind: 'interest', id: 'traveling' },
      ],
      fragment: {
        id: 'personal-balance',
        label: { fr: 'Fragment d’équilibre', en: 'Balance fragment' },
      },
      contentStatus: 'ready',
    },
  ],
} as const

export const adventureWorld = adventureWorldSchema.parse(adventureWorldCandidate)

const knownContentIds = {
  experience: new Set(portfolio.experiences.map(({ id }) => id)),
  education: new Set(portfolio.education.map(({ id }) => id)),
  project: new Set(portfolio.projects.map(({ id }) => id)),
  interest: new Set(portfolio.interests.map(({ id }) => id)),
}
for (const screen of adventureWorld.screens) {
  for (const reference of screen.contentRefs) {
    if (!knownContentIds[reference.kind].has(reference.id)) {
      throw new Error(`Unknown portfolio ${reference.kind} "${reference.id}" in screen "${screen.id}"`)
    }
  }
}

export function getAdventureScreen(screenId: string) {
  return adventureWorld.screens.find(({ id }) => id === screenId)
    ?? adventureWorld.screens.find(({ id }) => id === adventureWorld.startScreenId)!
}
