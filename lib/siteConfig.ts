import fs from 'fs'
import path from 'path'

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

const configPath = path.join(process.cwd(), 'config', 'site-config.json')

// 기본 설정
const defaultConfig: SiteConfig = {
  site: {
    title: '뉴스볼 - 세상의 모든 뉴스와 정보',
    description: '최신 뉴스, 트렌드, 기술 정보를 빠르고 정확하게 전달하는 종합 뉴스 플랫폼입니다.',
    author: 'The Ollaga',
    headerTitle: '이코노믹글',
    language: 'ko-kr',
    locale: 'ko-kr',
    siteUrl: 'https://tailwind-nextjs-starter-blog.vercel.app'
  },
  categories: [
    { id: 'economy', name: '경제', slug: 'economy', description: '경제 관련 뉴스와 정보' },
    { id: 'automotive', name: '자동차', slug: 'automotive', description: '자동차 산업 뉴스' },
    { id: 'politics', name: '정치', slug: 'politics', description: '정치 및 정부 관련 뉴스' },
    { id: 'society', name: '사회', slug: 'society', description: '사회 이슈와 트렌드' },
    { id: 'culture', name: '문화', slug: 'culture', description: '문화, 예술 관련 소식' },
    { id: 'tech', name: '기술', slug: 'tech', description: '기술, IT, 개발 관련 뉴스' }
  ],
  footer: {
    text: '© 2024 뉴스볼. 모든 권리 보유.',
    links: [
      { name: '회사소개', url: '/about' },
      { name: '이용약관', url: '/terms' },
      { name: '개인정보처리방침', url: '/privacy' },
      { name: '문의하기', url: '/contact' }
    ],
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
      { name: 'Facebook', url: 'https://facebook.com', icon: '📘' },
      { name: 'YouTube', url: 'https://youtube.com', icon: '📺' }
    ]
  },
  company: {
    address: '서울특별시 구로구 구로동 197-17',
    phone: '070-8065-3076',
    name: '주식회사 파팩스',
    publication: '이코노믹글',
    registrationNumber: '서울, 아05580',
    registrationDate: '2024-08-11',
    publicationDate: '2023-11-12',
    editorInChief: '김광호',
    youthProtectionOfficer: '김광호',
    contactEmail: 'info@econmingle.com'
  }
}

// 설정 디렉토리 생성
function ensureConfigDir() {
  const configDir = path.dirname(configPath)
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
}

// 설정 파일 로드
export function loadSiteConfig(): SiteConfig {
  try {
    ensureConfigDir()

    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf-8')
      const parsedConfig = JSON.parse(configData)
      // 기본 설정과 병합하여 누락된 필드 보완
      return {
        ...defaultConfig,
        ...parsedConfig,
        site: { ...defaultConfig.site, ...parsedConfig.site },
        footer: { ...defaultConfig.footer, ...parsedConfig.footer }
      }
    } else {
      // 설정 파일이 없으면 기본 설정으로 생성
      saveSiteConfig(defaultConfig)
      return defaultConfig
    }
  } catch (error) {
    console.error('설정 파일 로드 오류:', error)
    return defaultConfig
  }
}

// 설정 파일 저장
export function saveSiteConfig(config: SiteConfig): void {
  try {
    ensureConfigDir()
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf8' })
  } catch (error) {
    console.error('설정 파일 저장 오류:', error)
    throw error
  }
}