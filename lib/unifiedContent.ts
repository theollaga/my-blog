import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import client from '@/lib/contentfulClient'
import { Entry, EntrySkeletonType } from 'contentful'

// Contentlayer 포스트 타입
interface ContentlayerPost {
  slug: string
  title: string
  summary?: string
  date: string
  tags?: string[]
  readingTime?: { text: string }
  [key: string]: unknown
}

// Rich Text 노드 타입
interface RichTextNode {
  nodeType: string
  content?: RichTextNode[]
  value?: string
}

interface RichTextDocument {
  content: RichTextNode[]
}

// Contentful 포스트 필드 타입
interface ContentfulPostFields {
  title?: string
  slug?: string
  content?: RichTextDocument
  publishedDate?: string
  tags?: string[]
  category?: string
  excerpt?: string
  description?: string
  coverImage?: {
    fields: {
      file: {
        url: string
      }
    }
  }
}

// Contentful 포스트 스켈레톤 타입
interface ContentfulPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'post'
  fields: {
    title: string
    slug?: string
    content?: RichTextDocument
    publishedDate?: string
    tags?: string[]
    category?: string
    excerpt?: string
    description?: string
    coverImage?: {
      fields: {
        file: {
          url: string
        }
      }
    }
  }
}

// 통합 포스트 타입 정의
export interface UnifiedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: Date
  tags: string[]
  source: 'contentful' | 'contentlayer'
  category?: string
  // 추가 필드들
  summary?: string
  date?: string
  coverImage?: string
  readingTime?: string
  // 원본 데이터 참조
  originalData?: ContentlayerPost | Entry<ContentfulPostSkeleton>
}

// 무작위 카테고리 할당을 위한 카테고리 배열
const availableCategories = ['경제', '자동차', '정치', '사회', '문화', '기술']

// Rich Text에서 일반 텍스트 추출 함수
function extractTextFromRichText(richTextContent: RichTextDocument): string {
  if (!richTextContent || !richTextContent.content) {
    return ''
  }

  function extractText(node: RichTextNode): string {
    if (node.nodeType === 'text') {
      return node.value || ''
    }

    if (node.content) {
      return node.content.map(extractText).join('')
    }

    return ''
  }

  return richTextContent.content.map(extractText).join(' ').trim()
}

// 제목 기반 카테고리 추론 함수
function inferCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase()

  // 키워드 기반 카테고리 매핑
  if (
    titleLower.includes('economy') ||
    titleLower.includes('경제') ||
    titleLower.includes('market') ||
    titleLower.includes('business')
  ) {
    return '경제'
  }
  if (
    titleLower.includes('car') ||
    titleLower.includes('자동차') ||
    titleLower.includes('vehicle') ||
    titleLower.includes('auto')
  ) {
    return '자동차'
  }
  if (
    titleLower.includes('tech') ||
    titleLower.includes('기술') ||
    titleLower.includes('technology') ||
    titleLower.includes('dev') ||
    titleLower.includes('code')
  ) {
    return '기술'
  }
  if (
    titleLower.includes('culture') ||
    titleLower.includes('문화') ||
    titleLower.includes('art') ||
    titleLower.includes('music')
  ) {
    return '문화'
  }
  if (
    titleLower.includes('society') ||
    titleLower.includes('사회') ||
    titleLower.includes('social')
  ) {
    return '사회'
  }
  if (
    titleLower.includes('politics') ||
    titleLower.includes('정치') ||
    titleLower.includes('government')
  ) {
    return '정치'
  }

  // 제목의 해시값을 기반으로 일관된 무작위 카테고리 할당
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32비트 정수로 변환
  }
  const index = Math.abs(hash) % availableCategories.length
  return availableCategories[index]
}

// Contentlayer 데이터를 UnifiedPost로 변환
export function transformContentlayerPost(post: ContentlayerPost): UnifiedPost {
  // 기존 태그에서 카테고리를 찾거나, 제목 기반으로 추론, 아니면 무작위 할당
  let category = 'general'

  if (post.tags && post.tags.length > 0) {
    // 기존 태그 중에서 카테고리 찾기
    const existingCategory = availableCategories.find((cat) =>
      post.tags!.some((tag: string) => tag.toLowerCase().includes(cat.toLowerCase()))
    )
    category = existingCategory || inferCategoryFromTitle(post.title)
  } else {
    category = inferCategoryFromTitle(post.title)
  }

  return {
    id: post.slug,
    title: post.title,
    slug: post.slug,
    excerpt: post.summary || '',
    publishedAt: new Date(post.date),
    tags: post.tags || [],
    source: 'contentlayer',
    category,
    summary: post.summary,
    date: post.date,
    readingTime: post.readingTime?.text,
    originalData: post,
  }
}

// Contentful 데이터를 UnifiedPost로 변환
export function transformContentfulPost(entry: Entry<ContentfulPostSkeleton>): UnifiedPost {
  const { fields, sys } = entry

  // Contentful 포스트에도 카테고리 추론 로직 적용
  let category = 'general'

  if (fields.category) {
    // Contentful에서 카테고리가 직접 설정된 경우
    category = fields.category as unknown as string
  } else if (fields.tags && (fields.tags as unknown as string[]).length > 0) {
    // 태그에서 카테고리 찾기
    const existingCategory = availableCategories.find((cat) =>
      (fields.tags as unknown as string[]).some((tag: string) =>
        tag.toLowerCase().includes(cat.toLowerCase())
      )
    )
    category = existingCategory || inferCategoryFromTitle((fields.title as unknown as string) || '')
  } else {
    // 제목 기반 카테고리 추론
    category = inferCategoryFromTitle((fields.title as unknown as string) || '')
  }

  // excerpt 생성 - content에서 텍스트 추출하여 요약 생성
  let excerpt =
    (fields.excerpt as unknown as string) || (fields.description as unknown as string) || ''
  if (!excerpt && fields.content) {
    // Rich Text에서 일반 텍스트 추출하여 요약 생성
    try {
      const textContent = extractTextFromRichText(fields.content as unknown as RichTextDocument)
      excerpt = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '')
    } catch (e) {
      excerpt = fields.title ? `${fields.title}에 대한 내용입니다.` : '내용을 확인해보세요.'
    }
  }

  // coverImage 안전하게 처리
  let coverImageUrl: string | null = null
  try {
    if (
      fields.coverImage &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fields.coverImage as any).fields &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fields.coverImage as any).fields.file
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      coverImageUrl = `https:${(fields.coverImage as any).fields.file.url}`
    }
  } catch (e) {
    console.log('coverImage 처리 오류:', e)
    coverImageUrl = null
  }

  return {
    id: sys.id,
    title: (fields.title as unknown as string) || '',
    slug: (fields.slug as unknown as string) || sys.id,
    excerpt,
    publishedAt: new Date((fields.publishedDate as unknown as string) || sys.createdAt),
    tags: (fields.tags as unknown as string[]) || [],
    source: 'contentful',
    category,
    coverImage: coverImageUrl || undefined,
    originalData: entry,
  }
}

// Contentful에서 포스트 가져오기
export async function fetchContentfulPosts(): Promise<UnifiedPost[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'post',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: '-sys.createdAt' as any,
      include: 2, // Asset과 참조 해결을 위해 include 레벨 설정
    })

    return entries.items.map((entry) =>
      transformContentfulPost(entry as unknown as Entry<ContentfulPostSkeleton>)
    )
  } catch (error) {
    console.error('Contentful 데이터 fetch 오류:', error)
    return []
  }
}

// Contentlayer에서 포스트 가져오기
export function getContentlayerPosts(): UnifiedPost[] {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return posts.map(transformContentlayerPost)
}

// 모든 포스트 통합하여 가져오기
export async function getAllUnifiedPosts(): Promise<UnifiedPost[]> {
  const [contentfulPosts, contentlayerPosts] = await Promise.all([
    fetchContentfulPosts(),
    Promise.resolve(getContentlayerPosts()),
  ])

  // 발행일 기준으로 정렬
  const allPosts = [...contentfulPosts, ...contentlayerPosts]
  return allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

// 카테고리별 포스트 가져오기 (개선된 매칭 로직)
export async function getPostsByCategory(category: string): Promise<UnifiedPost[]> {
  const allPosts = await getAllUnifiedPosts()

  // URL에서 받은 영어 카테고리를 한글로 변환
  const categoryMapping: Record<string, string> = {
    economy: '경제',
    automotive: '자동차',
    politics: '정치',
    society: '사회',
    culture: '문화',
    tech: '기술',
  }

  const targetCategory = categoryMapping[category] || category

  return allPosts.filter((post) => {
    // 1. 정확한 카테고리 매치
    if (post.category === targetCategory) {
      return true
    }

    // 2. 태그에서 매치
    if (
      post.tags.some(
        (tag) =>
          tag.toLowerCase().includes(targetCategory.toLowerCase()) ||
          tag.toLowerCase().includes(category.toLowerCase())
      )
    ) {
      return true
    }

    // 3. 제목에서 키워드 매치
    const title = post.title.toLowerCase()
    if (
      category === 'economy' &&
      (title.includes('economy') || title.includes('경제') || title.includes('market'))
    ) {
      return true
    }
    if (
      category === 'tech' &&
      (title.includes('tech') ||
        title.includes('기술') ||
        title.includes('code') ||
        title.includes('dev'))
    ) {
      return true
    }
    if (
      category === 'automotive' &&
      (title.includes('car') || title.includes('자동차') || title.includes('vehicle'))
    ) {
      return true
    }
    if (
      category === 'culture' &&
      (title.includes('culture') || title.includes('문화') || title.includes('art'))
    ) {
      return true
    }
    if (
      category === 'society' &&
      (title.includes('society') || title.includes('사회') || title.includes('social'))
    ) {
      return true
    }
    if (
      category === 'politics' &&
      (title.includes('politics') || title.includes('정치') || title.includes('government'))
    ) {
      return true
    }

    return false
  })
}

// 특정 개수만큼 최신 포스트 가져오기
export async function getLatestPosts(limit: number): Promise<UnifiedPost[]> {
  const allPosts = await getAllUnifiedPosts()
  return allPosts.slice(0, limit)
}

// 페이지네이션을 위한 포스트 가져오기
export async function getPostsWithPagination(page: number = 1, postsPerPage: number = 5) {
  const allPosts = await getAllUnifiedPosts()
  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  const offset = (page - 1) * postsPerPage
  const paginatedPosts = allPosts.slice(offset, offset + postsPerPage)

  return {
    posts: paginatedPosts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
