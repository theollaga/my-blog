import { genPageMetadata } from 'app/seo'
import { getPostsWithPagination } from '@/lib/unifiedContent'
import UnifiedListLayout from '@/layouts/UnifiedListLayout'

const POSTS_PER_PAGE = 5

// Edge Runtime 제거 - Cloudflare 배포를 위해 기본 Node.js Runtime 사용
export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const pageNumber = Number(searchParams.page) || 1

  const { posts, totalPages, currentPage, hasNextPage, hasPrevPage } = await getPostsWithPagination(
    pageNumber,
    POSTS_PER_PAGE
  )

  const pagination = {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  }

  return <UnifiedListLayout posts={posts} pagination={pagination} title="모든 포스트" />
}
