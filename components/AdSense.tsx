'use client'

import { useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface AdSenseProps {
  slot: string
  style?: React.CSSProperties
  format?: string
  responsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdSense({
  slot,
  style = { display: 'block' },
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && siteMetadata.adsense?.adClient) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [])

  if (!siteMetadata.adsense?.adClient || process.env.NODE_ENV !== 'production') {
    return (
      <div
        className={`border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center dark:border-gray-600 dark:bg-gray-800 ${className}`}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          [광고 영역 - 개발 모드에서는 표시되지 않습니다]
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={siteMetadata.adsense.adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

// 다양한 광고 유형 컴포넌트들
export function HeaderAd() {
  return (
    <AdSense
      slot={siteMetadata.adsense?.adSlots?.header || ''}
      className="mb-6"
      style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
    />
  )
}

export function SidebarAd() {
  return (
    <AdSense
      slot={siteMetadata.adsense?.adSlots?.sidebar || ''}
      className="mb-6"
      style={{ display: 'block', minHeight: '250px' }}
    />
  )
}

export function ArticleAd() {
  return (
    <AdSense
      slot={siteMetadata.adsense?.adSlots?.article || ''}
      className="my-8"
      style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
    />
  )
}

export function FooterAd() {
  return (
    <AdSense
      slot={siteMetadata.adsense?.adSlots?.footer || ''}
      className="mt-6"
      style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
    />
  )
}
