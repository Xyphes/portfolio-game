import { z } from 'zod'

export const localeSchema = z.enum(['fr', 'en'])
export type Locale = z.infer<typeof localeSchema>

export const localizedTextSchema = z.object({
  fr: z.string().trim().min(1),
  en: z.string().trim().min(1),
})

const linkSchema = z.object({
  label: localizedTextSchema,
  href: z.string().trim().min(1),
  kind: z.enum(['email', 'phone', 'github', 'linkedin', 'discord']),
})

const documentSchema = z.object({
  id: z.string().trim().min(1),
  label: localizedTextSchema,
  href: z.string().startsWith('/'),
})

const experienceSchema = z.object({
  id: z.string().trim().min(1),
  company: z.string().trim().min(1),
  role: localizedTextSchema,
  period: localizedTextSchema,
  summary: localizedTextSchema,
  missions: z.array(localizedTextSchema).min(1),
  skillIds: z.array(z.string().trim().min(1)).min(1),
  publicationApproved: z.literal(true),
})

const educationSchema = z.object({
  id: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  program: localizedTextSchema,
  highlights: z.array(localizedTextSchema).min(1),
  skillIds: z.array(z.string().trim().min(1)),
  publicationApproved: z.literal(true),
})

const projectSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedTextSchema,
  context: localizedTextSchema,
  summary: localizedTextSchema,
  skillIds: z.array(z.string().trim().min(1)).min(1),
  publicationApproved: z.literal(true),
})

const interestSchema = z.object({
  id: z.string().trim().min(1),
  label: localizedTextSchema,
  publicationApproved: z.literal(true),
})

export const portfolioSchema = z
  .object({
    profile: z.object({
      name: z.string().trim().min(1),
      title: localizedTextSchema,
      introduction: localizedTextSchema,
      availability: localizedTextSchema,
      portrait: z.object({
        src: z.string().startsWith('/'),
        alt: localizedTextSchema,
      }),
    }),
    experiences: z.array(experienceSchema).min(1),
    education: z.array(educationSchema).min(1),
    projects: z.array(projectSchema).min(1),
    interests: z.array(interestSchema).min(1),
    skills: z.array(
      z.object({
        id: z.string().trim().min(1),
        label: localizedTextSchema,
        category: z.enum(['language', 'framework', 'domain', 'tool']),
      }),
    ),
    languages: z.array(z.object({
      id: z.string().trim().min(1),
      label: localizedTextSchema,
      level: localizedTextSchema,
    })).min(1),
    softSkills: z.array(z.object({
      id: z.string().trim().min(1),
      label: localizedTextSchema,
    })).min(1),
    links: z.array(linkSchema),
    documents: z.array(documentSchema).min(2),
  })
  .superRefine((portfolio, context) => {
    const experienceIds = portfolio.experiences.map(({ id }) => id)
    const educationIds = portfolio.education.map(({ id }) => id)
    const projectIds = portfolio.projects.map(({ id }) => id)
    const interestIds = portfolio.interests.map(({ id }) => id)
    const skillIds = portfolio.skills.map(({ id }) => id)
    const languageIds = portfolio.languages.map(({ id }) => id)
    const softSkillIds = portfolio.softSkills.map(({ id }) => id)

    for (const [label, ids] of [
      ['experience', experienceIds],
      ['education', educationIds],
      ['project', projectIds],
      ['interest', interestIds],
      ['skill', skillIds],
      ['language', languageIds],
      ['soft skill', softSkillIds],
    ] as const) {
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
      for (const duplicate of new Set(duplicates)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate ${label} id: ${duplicate}`,
        })
      }
    }

    const knownSkills = new Set(skillIds)
    for (const experience of portfolio.experiences) {
      for (const skillId of experience.skillIds) {
        if (!knownSkills.has(skillId)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown skill id "${skillId}" in experience "${experience.id}"`,
          })
        }
      }
    }

    for (const entity of [...portfolio.education, ...portfolio.projects]) {
      for (const skillId of entity.skillIds) {
        if (!knownSkills.has(skillId)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown skill id "${skillId}" in content "${entity.id}"`,
          })
        }
      }
    }
  })

export type Portfolio = z.infer<typeof portfolioSchema>
export type Experience = Portfolio['experiences'][number]
export type Education = Portfolio['education'][number]
export type Project = Portfolio['projects'][number]
export type Interest = Portfolio['interests'][number]
export type LocalizedText = z.infer<typeof localizedTextSchema>
