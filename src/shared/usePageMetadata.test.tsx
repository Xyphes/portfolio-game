// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePageMetadata } from './usePageMetadata'

function MetadataHarness({ locale }: { locale: 'fr' | 'en' }) {
  usePageMetadata({
    locale,
    title: locale === 'fr' ? 'Titre français' : 'English title',
    description: locale === 'fr' ? 'Description française' : 'English description',
    canonicalPath: `/${locale}/classic`,
    alternatePaths: { fr: '/fr/classic', en: '/en/classic' },
    structuredData: { '@context': 'https://schema.org', '@type': 'Person', name: 'Willy Somkhit' },
  })
  return null
}

afterEach(() => {
  document.head.innerHTML = ''
  document.documentElement.lang = ''
})

describe('usePageMetadata', () => {
  it('updates localized metadata, canonical links, alternates, and structured data', () => {
    const { rerender } = render(<MetadataHarness locale="fr" />)

    expect(document.title).toBe('Titre français')
    expect(document.documentElement.lang).toBe('fr')
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost:3000/fr/classic',
    )
    expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(3)
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent)
      .toContain('Willy Somkhit')

    rerender(<MetadataHarness locale="en" />)
    expect(document.title).toBe('English title')
    expect(document.documentElement.lang).toBe('en')
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute('content', 'en_GB')
  })
})
