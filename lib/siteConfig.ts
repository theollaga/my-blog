// Edge Runtime 호환 - fs 모듈 사용 안함
export interface SiteConfig {
  site: {
    title: string
    description: string
    author: string
    headerTitle: string
    language: string
    locale: string
    siteUrl: string
  }
  categories: Array<{
    id: string
    name: string
    slug: string
    description?: string
  }>
  footer: {
    text: string
    links: Array<{
      name: string
      url: string
    }>
    socialLinks: Array<{
      name: string
      url: string
      icon?: string
    }>
  }
  company: {
    address: string
    phone: string
    name: string
    publication: string
    registrationNumber: string
    registrationDate: string
    publicationDate: string
    editorInChief: string
    youthProtectionOfficer: string
    contactEmail: string
  }
}

// 기본 설정 (Edge Runtime 호환)
const defaultConfig: SiteConfig = {
  site: {
    title: process.env.SITE_TITLE || '뉴스볼 - 세상의 모든 뉴스와 정보',
    description:
      process.env.SITE_DESCRIPTION ||
      '최신 뉴스, 트렌드, 기술 정보를 빠르고 정확하게 전달하는 종합 뉴스 플랫폼입니다.',
    author: process.env.SITE_AUTHOR || 'The Ollaga',
    headerTitle: process.env.SITE_HEADER_TITLE || '이코노믹글',
    language: process.env.SITE_LANGUAGE || 'ko-kr',
    locale: process.env.SITE_LOCALE || 'ko-kr',
    siteUrl: process.env.SITE_URL || 'https://tailwind-nextjs-starter-blog.vercel.app',
  },
  categories: [
    { id: 'economy', name: '경제', slug: 'economy', description: '경제 관련 뉴스와 정보' },
    { id: 'automotive', name: '자동차', slug: 'automotive', description: '자동차 산업 뉴스' },
    { id: 'politics', name: '정치', slug: 'politics', description: '정치 및 정부 관련 뉴스' },
    { id: 'society', name: '사회', slug: 'society', description: '사회 이슈와 트렌드' },
    { id: 'culture', name: '문화', slug: 'culture', description: '문화, 예술 관련 소식' },
    { id: 'tech', name: '기술', slug: 'tech', description: '기술, IT, 개발 관련 뉴스' },
  ],
  footer: {
    text: process.env.FOOTER_TEXT || '© 2024 뉴스볼. 모든 권리 보유.',
    links: [
      { name: '회사소개', url: '/about' },
      { name: '이용약관', url: '/terms' },
      { name: '개인정보처리방침', url: '/privacy' },
      { name: '문의하기', url: '/contact' },
    ],
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
      { name: 'Facebook', url: 'https://facebook.com', icon: '📘' },
      { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
    ],
  },
  company: {
    address: process.env.COMPANY_ADDRESS || '서울특별시 구로구 구로동 197-17',
    phone: process.env.COMPANY_PHONE || '070-8065-3076',
    name: process.env.COMPANY_NAME || '주식회사 파팩스',
    publication: process.env.COMPANY_PUBLICATION || '이코노믹글',
    registrationNumber: process.env.COMPANY_REG_NUMBER || '서울, 아05580',
    registrationDate: process.env.COMPANY_REG_DATE || '2024-08-11',
    publicationDate: process.env.COMPANY_PUB_DATE || '2023-11-12',
    editorInChief: process.env.COMPANY_EDITOR || '김광호',
    youthProtectionOfficer: process.env.COMPANY_YOUTH_OFFICER || '김광호',
    contactEmail: process.env.COMPANY_EMAIL || 'info@econmingle.com',
  },
}

// 설정 로드 (Edge Runtime 호환)
export function loadSiteConfig(): SiteConfig {
  return defaultConfig
}

// 설정 저장 (Edge Runtime 호환 - 메모리에만 저장)
let runtimeConfig: SiteConfig = defaultConfig

export function saveSiteConfig(config: SiteConfig): void {
  runtimeConfig = { ...config }
}

export function getRuntimeConfig(): SiteConfig {
  return runtimeConfig
}
