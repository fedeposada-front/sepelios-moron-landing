import { useEffect } from 'react'
import { cmsItem, cmsItems } from '../cms/parseCMS'
import { safeHref } from '../cms/parseCMS'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

export function useSEOMetadata(cms, data) {
  useEffect(() => {
    const seo = cmsItem(cms, 'seo', 'home')
    const title = seo?.titulo || data.seo_title
    const description = seo?.descripcion || data.seo_description
    const canonical = safeHref(data.canonical_url)
    const image = seo?.imagen || data.seo_image
    const imageURL = image && canonical ? new URL(image, canonical).href : ''
    const zones = cmsItems(cms, 'zona').map(zone => zone.nombre).filter(Boolean)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageURL)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageURL)

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.append(canonicalLink)
    }
    canonicalLink.href = canonical

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FuneralHome',
      name: data.brand_name,
      url: canonical,
      image: imageURL,
      logo: data.logo_url && canonical ? new URL(data.logo_url, canonical).href : '',
      telephone: data.telefono_principal_tel,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.direccion_calle,
        addressLocality: 'Morón',
        addressRegion: data.direccion_provincia,
        addressCountry: 'AR',
      },
      openingHours: 'Mo-Su 00:00-23:59',
      hasMap: data.maps_url,
      areaServed: zones,
      sameAs: data.instagram_url ? [data.instagram_url] : [],
    }
    const script = document.querySelector('script[type="application/ld+json"]')
    if (script) script.textContent = JSON.stringify(structuredData)
  }, [cms, data])
}
