'use client'

import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

interface ArticleStructuredDataProps {
  title: string
  description: string
  publishedTime: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  image?: string
}

export function ArticleStructuredData({
  title,
  description,
  publishedTime,
  modifiedTime,
  tags = [],
  author = siteMetadata.author,
  image,
}: ArticleStructuredDataProps) {
  const pathname = usePathname()
  const url = `${siteMetadata.siteUrl}${pathname}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: image ? [image] : [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
    articleSection: 'News',
    inLanguage: siteMetadata.language,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
    },
    inLanguage: siteMetadata.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function NewsMediaStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
    },
    sameAs: [
      siteMetadata.github,
      siteMetadata.facebook,
      siteMetadata.youtube,
      siteMetadata.instagram,
    ].filter(Boolean),
    founder: {
      '@type': 'Person',
      name: siteMetadata.author,
    },
    foundingDate: '2024',
    description: siteMetadata.description,
    inLanguage: siteMetadata.language,
    diversityPolicy: `${siteMetadata.siteUrl}/diversity-policy`,
    ethicsPolicy: `${siteMetadata.siteUrl}/ethics-policy`,
    correctionsPolicy: `${siteMetadata.siteUrl}/corrections-policy`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
