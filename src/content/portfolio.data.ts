import { portfolioSchema } from './portfolio.schema'
import { portfolioProfile } from './profile.data'

const portfolioCandidate = {
  profile: portfolioProfile,
  skills: [
    { id: 'typescript', label: { fr: 'TypeScript', en: 'TypeScript' }, category: 'language' },
    { id: 'python', label: { fr: 'Python', en: 'Python' }, category: 'language' },
    { id: 'php', label: { fr: 'PHP', en: 'PHP' }, category: 'language' },
    { id: 'csharp', label: { fr: 'C#', en: 'C#' }, category: 'language' },
    { id: 'c', label: { fr: 'C', en: 'C' }, category: 'language' },
    { id: 'cpp', label: { fr: 'C++', en: 'C++' }, category: 'language' },
    { id: 'java', label: { fr: 'Java', en: 'Java' }, category: 'language' },
    { id: 'javascript', label: { fr: 'JavaScript', en: 'JavaScript' }, category: 'language' },
    { id: 'sql', label: { fr: 'SQL', en: 'SQL' }, category: 'language' },
    { id: 'bash', label: { fr: 'Bash', en: 'Bash' }, category: 'language' },
    { id: 'kotlin', label: { fr: 'Kotlin', en: 'Kotlin' }, category: 'language' },
    { id: 'dart', label: { fr: 'Dart', en: 'Dart' }, category: 'language' },
    { id: 'xaml', label: { fr: 'XAML', en: 'XAML' }, category: 'language' },
    { id: 'react', label: { fr: 'React', en: 'React' }, category: 'framework' },
    { id: 'angular', label: { fr: 'Angular', en: 'Angular' }, category: 'framework' },
    { id: 'vite', label: { fr: 'Vite', en: 'Vite' }, category: 'framework' },
    { id: 'flutter', label: { fr: 'Flutter', en: 'Flutter' }, category: 'framework' },
    { id: 'unity', label: { fr: 'Unity', en: 'Unity' }, category: 'framework' },
    { id: 'spring-boot', label: { fr: 'Spring Boot', en: 'Spring Boot' }, category: 'framework' },
    { id: 'tailwind', label: { fr: 'Tailwind', en: 'Tailwind' }, category: 'framework' },
    { id: 'mapping', label: { fr: 'Cartographie logicielle', en: 'Software mapping' }, category: 'domain' },
    { id: 'testing', label: { fr: 'Tests end-to-end', en: 'End-to-end testing' }, category: 'domain' },
    { id: 'architecture', label: { fr: 'Architecture PWA', en: 'PWA architecture' }, category: 'domain' },
    { id: 'cybersecurity', label: { fr: 'Cybersécurité web', en: 'Web cybersecurity' }, category: 'domain' },
    { id: 'devops', label: { fr: 'DevOps', en: 'DevOps' }, category: 'domain' },
    { id: 'project-management', label: { fr: 'Gestion de projet', en: 'Project management' }, category: 'domain' },
    { id: 'codex', label: { fr: 'Codex', en: 'Codex' }, category: 'tool' },
    { id: 'git', label: { fr: 'Git / GitHub', en: 'Git / GitHub' }, category: 'tool' },
    { id: 'mysql', label: { fr: 'MySQL', en: 'MySQL' }, category: 'tool' },
    { id: 'android-studio', label: { fr: 'Android Studio', en: 'Android Studio' }, category: 'tool' },
    { id: 'jira', label: { fr: 'Jira', en: 'Jira' }, category: 'tool' },
    { id: 'catia', label: { fr: 'Catia', en: 'Catia' }, category: 'tool' },
    { id: 'docker', label: { fr: 'Docker', en: 'Docker' }, category: 'tool' },
    { id: 'linux', label: { fr: 'Linux', en: 'Linux' }, category: 'tool' },
    { id: 'office-365', label: { fr: 'Suite Office 365', en: 'Office 365 suite' }, category: 'tool' },
  ],
  languages: [
    { id: 'french', label: { fr: 'Français', en: 'French' }, level: { fr: 'Natif', en: 'Native' } },
    { id: 'english', label: { fr: 'Anglais', en: 'English' }, level: { fr: 'Courant', en: 'Fluent' } },
    { id: 'mandarin', label: { fr: 'Mandarin', en: 'Mandarin' }, level: { fr: 'Courant', en: 'Fluent' } },
    { id: 'spanish', label: { fr: 'Espagnol', en: 'Spanish' }, level: { fr: 'Néophyte', en: 'Beginner' } },
  ],
  softSkills: [
    { id: 'teamwork', label: { fr: 'Travail d’équipe', en: 'Teamwork' } },
    { id: 'versatility', label: { fr: 'Polyvalence', en: 'Versatility' } },
    { id: 'communication', label: { fr: 'Communication', en: 'Communication' } },
    { id: 'analysis', label: { fr: 'Esprit d’analyse', en: 'Analytical thinking' } },
    { id: 'problem-solving', label: { fr: 'Résolution de problèmes', en: 'Problem solving' } },
    { id: 'agile', label: { fr: 'Méthode agile', en: 'Agile methodology' } },
    { id: 'creativity', label: { fr: 'Créativité', en: 'Creativity' } },
    { id: 'rigor', label: { fr: 'Rigueur', en: 'Rigor' } },
    { id: 'autonomy', label: { fr: 'Autonomie', en: 'Autonomy' } },
  ],
  experiences: [
    {
      id: 'thales',
      company: 'Thales',
      role: { fr: 'Software Engineer en alternance', en: 'Software Engineer Apprentice' },
      period: { fr: '2023–2026 · 3 ans', en: '2023–2026 · 3 years' },
      summary: {
        fr: "Développement et évolution de TIMS.JS, un SDK cartographique TypeScript mutualisé utilisé par plus de 100 développeurs.",
        en: 'Development and evolution of TIMS.JS, a shared TypeScript mapping SDK used by more than 100 developers.',
      },
      missions: [
        {
          fr: 'Conception de capacités conformes aux standards NVG Binding, MIL-STD-2525 et APP-6E.',
          en: 'Designed capabilities compliant with NVG Binding, MIL-STD-2525, and APP-6E standards.',
        },
        {
          fr: 'Pilotage du chantier APP-6E : analyse d’impact, estimation, priorisation et coordination des releases.',
          en: 'Led the APP-6E workstream: impact analysis, estimation, prioritization, and release coordination.',
        },
        {
          fr: 'Automatisation de tests end-to-end pour sécuriser les évolutions et détecter les régressions.',
          en: 'Automated end-to-end tests to secure changes and detect regressions.',
        },
        {
          fr: "Étude préliminaire et proposition d'une architecture PWA pour Atlas Lite.",
          en: 'Conducted the preliminary study and proposed a PWA architecture for Atlas Lite.',
        },
      ],
      skillIds: ['typescript', 'mapping', 'testing', 'architecture'],
      publicationApproved: true,
    },
    {
      id: 'ekino-vietnam',
      company: 'Ekino - Vietnam',
      role: { fr: 'Stagiaire ingénieur cybersécurité', en: 'Cybersecurity Engineer Intern' },
      period: { fr: 'Juin–juillet 2026 · 2 mois', en: 'June–July 2026 · 2 months' },
      summary: {
        fr: "Analyse de la sécurité d'applications web et automatisation de la détection de vulnérabilités.",
        en: 'Web application security analysis and automation of vulnerability detection.',
      },
      missions: [
        {
          fr: 'Identification de vulnérabilités telles que les XSS et injections SQL.',
          en: 'Identified vulnerabilities including XSS and SQL injection.',
        },
        {
          fr: 'Développement de scripts d’automatisation pour accélérer la détection et la vérification.',
          en: 'Developed automation scripts to accelerate vulnerability detection and verification.',
        },
        {
          fr: 'Analyse des résultats et proposition de pistes de correction, avec contributions DevOps ponctuelles.',
          en: 'Analyzed results and proposed remediation approaches, with occasional DevOps contributions.',
        },
      ],
      skillIds: ['cybersecurity', 'python', 'devops'],
      publicationApproved: true,
    },
    {
      id: 'agence3d',
      company: "L'Agence3D",
      role: { fr: 'Développeur', en: 'Developer' },
      period: { fr: 'Février–juillet 2023 · 6 mois', en: 'February–July 2023 · 6 months' },
      summary: {
        fr: 'Développement d’une PWA et contribution à plusieurs projets web, de la conception à la mise en production.',
        en: 'Developed a PWA and contributed to several web projects, from design through production deployment.',
      },
      missions: [
        {
          fr: 'Conception et suivi de fonctionnalités full-stack avec React et PHP.',
          en: 'Designed and oversaw full-stack features using React and PHP.',
        },
        {
          fr: 'Collaboration avec les équipes créatives pour assurer la cohérence technique et visuelle.',
          en: 'Worked with creative teams to ensure technical and visual consistency.',
        },
      ],
      skillIds: ['react', 'php', 'architecture'],
      publicationApproved: true,
    },
    {
      id: 'region-idf',
      company: 'Région Île-de-France',
      role: { fr: 'Chef de projet et développeur', en: 'Project Manager and Developer' },
      period: { fr: 'Juillet–décembre 2022 · 6 mois', en: 'July–December 2022 · 6 months' },
      summary: {
        fr: 'Développement d’une application mobile pour la promotion de la région Île-de-France.',
        en: 'Developed a mobile application promoting the Île-de-France region.',
      },
      missions: [
        {
          fr: 'Suivi des objectifs et du planning du projet.',
          en: 'Tracked project objectives and schedules.',
        },
        {
          fr: 'Conception d’interfaces et développement full-stack avec React, Flutter, PHP, C#, Java et MySQL.',
          en: 'Designed interfaces and delivered full-stack work using React, Flutter, PHP, C#, Java, and MySQL.',
        },
      ],
      skillIds: ['project-management', 'react', 'flutter', 'php', 'csharp', 'java', 'sql'],
      publicationApproved: true,
    },
    {
      id: 'sleepless',
      company: 'Sleepless',
      role: { fr: 'Chef de projet et développeur', en: 'Project Manager and Developer' },
      period: { fr: 'Janvier–juin 2022 · 6 mois', en: 'January–June 2022 · 6 months' },
      summary: {
        fr: 'Gestion de projet, conception d’interfaces et développement full-stack.',
        en: 'Project management, interface design, and full-stack development.',
      },
      missions: [
        {
          fr: 'Suivi des objectifs et du planning.',
          en: 'Tracked objectives and schedules.',
        },
        {
          fr: 'Travail avec React, Flutter, HTML/CSS, PHP, C#, Java et MySQL.',
          en: 'Worked with React, Flutter, HTML/CSS, PHP, C#, Java, and MySQL.',
        },
      ],
      skillIds: ['project-management', 'react', 'flutter', 'php', 'csharp', 'java', 'sql'],
      publicationApproved: true,
    },
    {
      id: 'ecp',
      company: "Europ' Computer Performance",
      role: { fr: 'Développeur', en: 'Developer' },
      period: { fr: 'Mai–août 2021 · 4 mois', en: 'May–August 2021 · 4 months' },
      summary: {
        fr: 'Maintenance et optimisation du site web de l’entreprise pour améliorer performances et expérience utilisateur.',
        en: 'Maintained and optimized the company website to improve performance and user experience.',
      },
      missions: [
        {
          fr: 'Diagnostic et correction d’anomalies techniques.',
          en: 'Diagnosed and fixed technical issues.',
        },
        {
          fr: 'Développement de nouvelles fonctionnalités répondant aux besoins métiers.',
          en: 'Developed new features to meet business needs.',
        },
      ],
      skillIds: ['javascript', 'php', 'sql'],
      publicationApproved: true,
    },
  ],
  education: [
    {
      id: 'epita',
      institution: 'EPITA',
      program: {
        fr: "École d'ingénieurs en informatique",
        en: 'Graduate School of Computer Science',
      },
      highlights: [
        { fr: 'Jeu vidéo en C# développé pendant six mois.', en: 'Developed a C# video game over six months.' },
        { fr: 'Launcher de jeux vidéo en XAML.', en: 'Developed a video game launcher in XAML.' },
        { fr: 'Logiciel de reconnaissance de caractères en C.', en: 'Developed optical character recognition software in C.' },
        { fr: 'Shell conforme POSIX en C (42SH).', en: 'Developed a POSIX-compliant shell in C (42SH).' },
        { fr: 'Projets intensifs en C, C++, SQL, Java et JavaScript.', en: 'Intensive projects in C, C++, SQL, Java, and JavaScript.' },
      ],
      skillIds: ['c', 'cpp', 'csharp', 'java', 'javascript', 'sql', 'xaml'],
      publicationApproved: true,
    },
    {
      id: 'heriot-watt',
      institution: 'Heriot-Watt University',
      program: { fr: 'Semestre international', en: 'International semester' },
      highlights: [
        { fr: 'Ambassadeur étudiant de l’EPITA en Écosse.', en: 'EPITA student ambassador in Scotland.' },
        { fr: 'Création d’un site dynamique en HTML, CSS et PHP.', en: 'Built a dynamic website using HTML, CSS, and PHP.' },
        { fr: 'Développement d’une application en Flutter.', en: 'Developed an application in Flutter.' },
      ],
      skillIds: ['php', 'flutter', 'javascript'],
      publicationApproved: true,
    },
    {
      id: 'francs-bourgeois',
      institution: 'Lycée des Francs-Bourgeois',
      program: {
        fr: 'Baccalauréat scientifique avec mention',
        en: 'French Scientific Baccalaureate with honors',
      },
      highlights: [
        { fr: 'Formation scientifique générale.', en: 'General scientific education.' },
      ],
      skillIds: [],
      publicationApproved: true,
    },
  ],
  projects: [
    {
      id: 'csharp-game',
      title: { fr: 'Jeu vidéo en C#', en: 'C# video game' },
      context: { fr: 'EPITA · projet de six mois', en: 'EPITA · six-month project' },
      summary: { fr: 'Programmation d’un jeu vidéo en C#.', en: 'Development of a video game in C#.' },
      skillIds: ['csharp'],
      publicationApproved: true,
    },
    {
      id: 'xaml-launcher',
      title: { fr: 'Launcher de jeux vidéo', en: 'Video game launcher' },
      context: { fr: 'EPITA · projet académique', en: 'EPITA · academic project' },
      summary: { fr: 'Programmation d’un launcher de jeux vidéo en XAML.', en: 'Development of a video game launcher in XAML.' },
      skillIds: ['xaml', 'csharp'],
      publicationApproved: true,
    },
    {
      id: 'ocr',
      title: { fr: 'Reconnaissance de caractères', en: 'Optical character recognition' },
      context: { fr: 'EPITA · projet académique', en: 'EPITA · academic project' },
      summary: { fr: 'Programmation d’un logiciel OCR en C.', en: 'Development of OCR software in C.' },
      skillIds: ['c'],
      publicationApproved: true,
    },
    {
      id: '42sh',
      title: { fr: 'Shell POSIX 42SH', en: '42SH POSIX shell' },
      context: { fr: 'EPITA · projet académique', en: 'EPITA · academic project' },
      summary: { fr: 'Programmation d’un shell conforme POSIX en C.', en: 'Development of a POSIX-compliant shell in C.' },
      skillIds: ['c'],
      publicationApproved: true,
    },
    {
      id: 'heriot-web',
      title: { fr: 'Site web dynamique', en: 'Dynamic website' },
      context: { fr: 'Heriot-Watt · semestre international', en: 'Heriot-Watt · international semester' },
      summary: { fr: 'Création d’un site dynamique en HTML, CSS et PHP.', en: 'Built a dynamic website using HTML, CSS, and PHP.' },
      skillIds: ['php', 'javascript'],
      publicationApproved: true,
    },
    {
      id: 'heriot-flutter',
      title: { fr: 'Application Flutter', en: 'Flutter application' },
      context: { fr: 'Heriot-Watt · semestre international', en: 'Heriot-Watt · international semester' },
      summary: { fr: 'Programmation d’une application en Flutter.', en: 'Development of an application in Flutter.' },
      skillIds: ['flutter'],
      publicationApproved: true,
    },
  ],
  interests: [
    { id: 'climbing', label: { fr: 'Escalade', en: 'Climbing' }, publicationApproved: true },
    { id: 'crafting', label: { fr: 'Création manuelle', en: 'Crafting' }, publicationApproved: true },
    { id: 'swimming', label: { fr: 'Natation', en: 'Swimming' }, publicationApproved: true },
    { id: 'traveling', label: { fr: 'Voyage', en: 'Traveling' }, publicationApproved: true },
  ],
  links: [
    {
      kind: 'phone',
      label: { fr: 'Téléphone', en: 'Phone' },
      href: 'tel:+33695523317',
    },
    {
      kind: 'email',
      label: { fr: 'E-mail', en: 'Email' },
      href: 'mailto:willy.somkhit@epita.fr',
    },
    {
      kind: 'github',
      label: { fr: 'GitHub', en: 'GitHub' },
      href: 'https://github.com/Xyphes',
    },
    {
      kind: 'linkedin',
      label: { fr: 'LinkedIn', en: 'LinkedIn' },
      href: 'https://www.linkedin.com/in/willy-somkhit/',
    },
  ],
  documents: [
    {
      id: 'cv',
      label: { fr: 'Télécharger mon CV', en: 'Download my resume' },
      href: '/documents/CV-Somkhit-Willy-2026-FR-ENG.pdf',
    },
    {
      id: 'recommendation',
      label: { fr: 'Lettre de recommandation', en: 'Recommendation letter' },
      href: '/documents/Lettre-recommandation-Julien-Mullet-FR-EN.pdf',
    },
  ],
} as const

export const portfolio = portfolioSchema.parse(portfolioCandidate)
