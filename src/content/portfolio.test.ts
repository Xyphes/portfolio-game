import { describe, expect, it } from 'vitest'
import { portfolio } from './portfolio.data'
import { portfolioSchema } from './portfolio.schema'
import { getContentDetail, getExperience, getSkillLabel, localize } from './selectors'

describe('portfolio content', () => {
  it('is valid, bilingual and shared by stable identifiers', () => {
    expect(portfolioSchema.parse(portfolio)).toBeDefined()
    expect(getExperience('thales').company).toBe('Thales')
    expect(portfolio.experiences).toHaveLength(6)
    expect(portfolio.education).toHaveLength(3)
    expect(portfolio.projects).toHaveLength(6)
    expect(portfolio.interests).toHaveLength(4)
    expect(portfolio.profile.portrait.src).toBe('/assets/profile/willy-somkhit-portrait.jpg')
    expect(localize(portfolio.profile.portrait.alt, 'fr')).toBe('Portrait de Willy Somkhit')
    expect(getSkillLabel('typescript', 'fr')).toBe('TypeScript')
    expect(localize(portfolio.profile.title, 'en')).toBe('Full-stack Software Engineer')
    expect(getContentDetail({ kind: 'education', id: 'epita' }, 'en').title).toBe('EPITA')
    expect(getContentDetail({ kind: 'project', id: '42sh' }, 'fr').skillIds).toContain('c')
  })

  it('rejects an experience that references an unknown skill', () => {
    const candidate = structuredClone(portfolio)
    const experience = candidate.experiences[0]
    if (!experience) throw new Error('The witness experience is missing')
    experience.skillIds.push('unknown-skill')

    const result = portfolioSchema.safeParse(candidate)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(({ message }) => message.includes('Unknown skill id'))).toBe(true)
    }
  })
})
