import type { Portfolio } from './portfolio.schema'

export const portfolioProfile = {
  name: 'Willy Somkhit',
  title: {
    fr: 'Ingénieur logiciel full-stack',
    en: 'Full-stack Software Engineer',
  },
  introduction: {
    fr: "Étudiant en dernière année du cycle ingénieur à l'EPITA, je développe des expériences web, mobiles et cartographiques avec un soin particulier pour la qualité et la fiabilité.",
    en: 'Final-year Computer Engineering student at EPITA, I build web, mobile, and mapping experiences with a strong focus on quality and reliability.',
  },
  availability: {
    fr: 'Disponible pour un CDI à partir de septembre 2026.',
    en: 'Available for a full-time position from September 2026.',
  },
  portrait: {
    src: '/assets/profile/willy-somkhit-portrait.jpg',
    alt: {
      fr: 'Portrait de Willy Somkhit',
      en: 'Portrait of Willy Somkhit',
    },
  },
} satisfies Portfolio['profile']
