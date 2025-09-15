import { UnifiedPost } from '@/lib/unifiedContent'
import PostCard from '@/components/PostCard'
import PostCardSimple from '@/components/PostCardSimple'

interface UnifiedMainProps {
  posts: UnifiedPost[]
}

export default function UnifiedMain({ posts }: UnifiedMainProps) {
  console.log('UnifiedMain - posts:', posts)
  console.log('UnifiedMain - posts length:', posts?.length)

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts: {posts ? posts.length : 'null'} - Loading...
            </h1>
            <div className="mx-auto mt-4 max-w-md text-left">
              <pre className="rounded bg-gray-100 p-4 text-xs">
                {JSON.stringify(posts, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 메인 히어로 섹션 */}
      <div className="bg-white py-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 큰 메인 기사 (2칸 차지) */}
            {posts[0] && <PostCard post={posts[0]} variant="hero" />}

            {/* 우측 작은 카드들 */}
            <div className="space-y-6">
              {posts[1] && <PostCardSimple post={posts[1]} variant="featured" />}
              {posts[2] && <PostCardSimple post={posts[2]} variant="featured" />}
            </div>
          </div>
        </div>
      </div>

      {/* 뉴스 그리드 섹션 */}
      <div className="bg-gray-50 py-12 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">최신 뉴스</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {posts.slice(3, 7).map((post) => (
              <PostCard key={post.id} post={post} variant="grid" />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 뉴스 리스트 섹션 */}
      <div className="bg-white py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">더 많은 뉴스</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {posts.slice(7, 19).map((post) => (
              <PostCard key={post.id} post={post} variant="list" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
