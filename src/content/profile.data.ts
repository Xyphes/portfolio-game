import type { Portfolio } from './portfolio.schema'

export const portfolioProfile = {
  name: 'Willy Somkhit',
  title: {
    fr: 'Ingénieur logiciel full-stack',
    en: 'Full-stack Software Engineer',
  },
  introduction: {
    fr: "Ingénieur logiciel en fin de cursus à l'EPITA, après trois ans d'alternance chez Thales et un stage en cybersécurité chez Ekino au Vietnam. Mon parcours relie développement full-stack, cartographie, tests automatisés et sécurité web ; je me spécialise désormais en sécurité offensive.",
    en: 'Final-year Software Engineering student at EPITA, following a three-year apprenticeship at Thales and a cybersecurity internship with Ekino in Vietnam. My background combines full-stack development, mapping, automated testing, and web security; I am now specializing in offensive security.',
  },
  availability: {
    fr: "À la recherche d'un CDI à partir de septembre 2026.",
    en: 'Seeking a full-time position from September 2026.',
  },
  highlights: [
    {
      fr: "Trois ans d'expérience chez Thales sur un SDK cartographique partagé par plus de 100 développeurs.",
      en: 'Three years of experience at Thales on a mapping SDK shared by more than 100 developers.',
    },
    {
      fr: 'Une pratique couvrant le développement logiciel, les tests end-to-end, les PWA et la sécurité des applications web.',
      en: 'Hands-on work spanning software development, end-to-end testing, PWAs, and web application security.',
    },
    {
      fr: "Un laboratoire personnel consacré à la sécurité offensive, au pentest physique, aux technologies RF et au prototypage matériel.",
      en: 'A personal lab focused on offensive security, physical pentesting, RF technologies, and hardware prototyping.',
    },
  ],
  recommendation: {
    summary: {
      fr: "Mon responsable chez Thales souligne ma curiosité, ma rigueur, ma persévérance, mon autonomie croissante, ma capacité à prendre des initiatives et mon intégration naturelle au sein d'une équipe.",
      en: 'My manager at Thales highlights my curiosity, diligence, perseverance, growing autonomy, ability to take initiative, and natural integration within a team.',
    },
    author: 'Julien Mullet',
    role: {
      fr: 'Project Manager · Thales SIX GTS France',
      en: 'Project Manager · Thales SIX GTS France',
    },
  },
  portrait: {
    src: '/assets/profile/willy-somkhit-portrait.jpg',
    alt: {
      fr: 'Portrait de Willy Somkhit',
      en: 'Portrait of Willy Somkhit',
    },
  },
} satisfies Portfolio['profile']
