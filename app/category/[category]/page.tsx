import { genPageMetadata } from 'app/seo'
import { getPostsByCategory, getAllUnifiedPosts } from '@/lib/unifiedContent'
import UnifiedListLayout from '@/layouts/UnifiedListLayout'
import { notFound } from 'next/navigation'

// 카테고리 매핑
const categoryMapping: Record<string, string> = {
  economy: '경제',
  automotive: '자동차',
  politics: '정치',
  society: '사회',
  culture: '문화',
  tech: '기술',
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params
  const categoryName = categoryMapping[params.category] || params.category

  return genPageMetadata({
    title: `${categoryName} 뉴스`,
    description: `${categoryName} 관련 최신 뉴스와 정보를 확인해보세요.`,
  })
}

// 정적 경로 생성
export async function generateStaticParams() {
  return Object.keys(categoryMapping).map((category) => ({
    category,
  }))
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const category = params.category
  const categoryName = categoryMapping[category]

  if (!categoryName) {
    notFound()
  }

  const posts = await getPostsByCategory(category)

  const pagination = {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  }

  return <UnifiedListLayout posts={posts} pagination={pagination} title={`${categoryName} 뉴스`} />
}
