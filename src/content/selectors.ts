import type { ContentReference } from './adventure.schema'
import type {
  Education,
  Experience,
  Interest,
  Locale,
  LocalizedText,
  Project,
} from './portfolio.schema'
import { portfolio } from './portfolio.data'

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale]
}

export function getExperience(id: string): Experience {
  const experience = portfolio.experiences.find((candidate) => candidate.id === id)

  if (!experience) {
    throw new Error(`Unknown experience: ${id}`)
  }

  return experience
}

export function getEducation(id: string): Education {
  const education = portfolio.education.find((candidate) => candidate.id === id)
  if (!education) throw new Error(`Unknown education: ${id}`)
  return education
}

export function getProject(id: string): Project {
  const project = portfolio.projects.find((candidate) => candidate.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  return project
}

export function getInterest(id: string): Interest {
  const interest = portfolio.interests.find((candidate) => candidate.id === id)
  if (!interest) throw new Error(`Unknown interest: ${id}`)
  return interest
}

export type ContentDetail = {
  reference: ContentReference
  title: string
  kicker: string
  summary?: string
  bullets: string[]
  skillIds: string[]
}

export function getContentDetail(reference: ContentReference, locale: Locale): ContentDetail {
  if (reference.kind === 'experience') {
    const experience = getExperience(reference.id)
    return {
      reference,
      title: experience.company,
      kicker: `${localize(experience.role, locale)} · ${localize(experience.period, locale)}`,
      summary: localize(experience.summary, locale),
      bullets: experience.missions.map((mission) => localize(mission, locale)),
      skillIds: experience.skillIds,
    }
  }

  if (reference.kind === 'education') {
    const education = getEducation(reference.id)
    return {
      reference,
      title: education.institution,
      kicker: localize(education.program, locale),
      bullets: education.highlights.map((highlight) => localize(highlight, locale)),
      skillIds: education.skillIds,
    }
  }

  if (reference.kind === 'project') {
    const project = getProject(reference.id)
    return {
      reference,
      title: localize(project.title, locale),
      kicker: localize(project.context, locale),
      summary: localize(project.summary, locale),
      bullets: [],
      skillIds: project.skillIds,
    }
  }

  const interest = getInterest(reference.id)
  return {
    reference,
    title: localize(interest.label, locale),
    kicker: locale === 'fr' ? 'Centre d’intérêt' : 'Interest',
    bullets: [],
    skillIds: [],
  }
}

export function getSkillLabel(id: string, locale: Locale): string {
  const skill = portfolio.skills.find((candidate) => candidate.id === id)

  if (!skill) {
    throw new Error(`Unknown skill: ${id}`)
  }

  return localize(skill.label, locale)
}
