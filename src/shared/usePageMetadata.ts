import { useEffect } from 'react'
import type { Locale } from '../content/portfolio.schema'

type AlternatePaths = Record<Locale, string>

type PageMetadata = {
  locale: Locale
  title: string
  description: string
  canonicalPath: string
  alternatePaths?: AlternatePaths
  structuredData?: Record<string, unknown>
}

export function usePageMetadata({
  locale,
  title,
  description,
  canonicalPath,
  alternatePaths,
  structuredData,
}: PageMetadata): void {
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : null
  const alternateFr = alternatePaths?.fr
  const alternateEn = alternatePaths?.en

  useEffect(() => {
    const absoluteUrl = (path: string) => new URL(path, window.location.origin).toString()
    const canonicalUrl = absoluteUrl(canonicalPath)

    document.documentElement.lang = locale
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:locale', locale === 'fr' ? 'fr_FR' : 'en_GB')
    setMeta('property', 'og:url', canonicalUrl)
    setLink('canonical', canonicalUrl)

    document.head.querySelectorAll('link[data-portfolio-alternate]').forEach((link) => link.remove())
    if (alternateFr && alternateEn) {
      setAlternateLink('fr', absoluteUrl(alternateFr))
      setAlternateLink('en', absoluteUrl(alternateEn))
      setAlternateLink('x-default', absoluteUrl(alternateFr))
    }

    const existingStructuredData = document.head.querySelector<HTMLScriptElement>(
      'script[data-portfolio-structured-data]',
    )
    if (structuredDataJson) {
      const script = existingStructuredData ?? document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.portfolioStructuredData = 'true'
      script.textContent = JSON.stringify({
        ...(JSON.parse(structuredDataJson) as Record<string, unknown>),
        url: canonicalUrl,
      })
      if (!existingStructuredData) document.head.append(script)
    } else {
      existingStructuredData?.remove()
    }
  }, [alternateEn, alternateFr, canonicalPath, description, locale, structuredDataJson, title])
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`
  const meta = document.head.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta')
  meta.setAttribute(attribute, key)
  meta.content = content
  meta.dataset.portfolioMetadata = 'true'
  if (!meta.isConnected) document.head.append(meta)
}

function setLink(rel: string, href: string): void {
  const link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    ?? document.createElement('link')
  link.rel = rel
  link.href = href
  link.dataset.portfolioMetadata = 'true'
  if (!link.isConnected) document.head.append(link)
}

function setAlternateLink(hreflang: string, href: string): void {
  const link = document.createElement('link')
  link.rel = 'alternate'
  link.hreflang = hreflang
  link.href = href
  link.dataset.portfolioAlternate = 'true'
  document.head.append(link)
}
