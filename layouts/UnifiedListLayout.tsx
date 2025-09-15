import Link from '@/components/Link'
import { UnifiedPost } from '@/lib/unifiedContent'
import PostCard from '@/components/PostCard'

interface UnifiedListLayoutProps {
  posts: UnifiedPost[]
  title: string
  pagination?: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function UnifiedListLayout({ posts, title, pagination }: UnifiedListLayoutProps) {
  const displayPosts = posts

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {title}
        </h1>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="pt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">포스트가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 포스트 그리드 */}
          <div className="container py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="grid" />
              ))}
            </div>
          </div>

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between pt-6">
              <div>
                {pagination.hasPrevPage && (
                  <Link
                    href={`/blog${pagination.currentPage - 1 === 1 ? '' : `?page=${pagination.currentPage - 1}`}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    &larr; 이전 페이지
                  </Link>
                )}
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/blog${page === 1 ? '' : `?page=${page}`}`}
                    className={`px-3 py-2 text-sm font-medium ${
                      page === pagination.currentPage
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
              <div>
                {pagination.hasNextPage && (
                  <Link
                    href={`/blog?page=${pagination.currentPage + 1}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    다음 페이지 &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
