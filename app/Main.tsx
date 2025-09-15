import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 12

interface BlogPost {
  slug: string
  title: string
  date?: string
  [key: string]: unknown
}

interface ContentfulPost {
  sys: {
    id: string
    createdAt: string
  }
  fields: {
    title: string
    excerpt?: string
    [key: string]: unknown
  }
}

interface MainProps {
  posts: BlogPost[]
  contentfulPosts?: ContentfulPost[]
}

export default function Home({ posts, contentfulPosts = [] }: MainProps) {
  console.log('Main 컴포넌트 - Contentful 글 수:', contentfulPosts?.length || 0)

  // posts 배열이 없거나 빈 경우 처리
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 메인 히어로 섹션 - 1개 큰 카드 + 2개 작은 카드 */}
      <div className="bg-white py-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 큰 메인 기사 (2칸 차지) */}
            {posts[0] && (
              <article className="group relative overflow-hidden rounded-lg lg:col-span-2">
                <div className="relative h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <div className="mb-3">
                      <span className="inline-block rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                        경제
                      </span>
                    </div>
                    <h1 className="mb-3 text-2xl leading-tight font-bold text-white lg:text-3xl">
                      <Link href={`/blog/${posts[0].slug}`} className="hover:text-blue-200">
                        {posts[0].title}
                      </Link>
                    </h1>
                    <time className="text-sm text-gray-300">
                      {posts[0].date ? formatDate(posts[0].date, siteMetadata.locale) : ''}
                    </time>
                  </div>
                </div>
              </article>
            )}

            {/* 우측 작은 카드들 */}
            <div className="space-y-6">
              {/* 첫 번째 작은 카드 */}
              {posts.length > 1 && posts[1] && (
                <article className="group relative overflow-hidden rounded-lg">
                  <div className="relative h-[190px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900">
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <div className="mb-2">
                        <span className="inline-block rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">
                          자동차
                        </span>
                      </div>
                      <h3 className="mb-2 text-sm leading-tight font-bold text-white">
                        <Link href={`/blog/${posts[1].slug}`} className="hover:text-green-200">
                          {posts[1].title}
                        </Link>
                      </h3>
                      <time className="text-xs text-gray-300">
                        {posts[1].date ? formatDate(posts[1].date, siteMetadata.locale) : ''}
                      </time>
                    </div>
                  </div>
                </article>
              )}

              {/* 두 번째 작은 카드 */}
              {posts.length > 2 && posts[2] && (
                <article className="group relative overflow-hidden rounded-lg">
                  <div className="relative h-[190px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-800 to-orange-900">
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <div className="mb-2">
                        <span className="inline-block rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white">
                          경제
                        </span>
                      </div>
                      <h3 className="mb-2 text-sm leading-tight font-bold text-white">
                        <Link href={`/blog/${posts[2].slug}`} className="hover:text-orange-200">
                          {posts[2].title}
                        </Link>
                      </h3>
                      <time className="text-xs text-gray-300">
                        {posts[2].date ? formatDate(posts[2].date, siteMetadata.locale) : ''}
                      </time>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 뉴스 그리드 섹션 */}
      <div className="bg-gray-50 py-12 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {posts.slice(3, Math.min(7, posts.length)).map((post) => {
              const { slug, date, title, tags } = post
              return (
                <article key={slug} className="group">
                  <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                      <span className="text-2xl text-gray-500 dark:text-gray-400">📰</span>
                    </div>
                  </div>
                  {tags && tags.length > 0 && (
                    <span className="mb-2 inline-block rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                      {tags[0]}
                    </span>
                  )}
                  <h3 className="mb-2 line-clamp-3 text-sm leading-tight font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    <Link href={`/blog/${slug}`}>{title}</Link>
                  </h3>
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(date, siteMetadata.locale)}
                  </time>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 뉴스 리스트 섹션 */}
      <div className="bg-white py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {posts.slice(7, Math.min(19, posts.length)).map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <article key={slug} className="group flex gap-4">
                  <div className="aspect-[4/3] w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">📰</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    {tags && tags.length > 0 && (
                      <span className="mb-1 inline-block text-xs font-medium text-blue-600 dark:text-blue-400">
                        {tags[0]}
                      </span>
                    )}
                    <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      <Link href={`/blog/${slug}`}>{title}</Link>
                    </h3>
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contentful 데이터 섹션 */}
      {contentfulPosts && contentfulPosts.length > 0 ? (
        <div className="bg-blue-50 py-12 dark:bg-blue-900/20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
              Contentful 뉴스
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contentfulPosts.map((post) => (
                <article
                  key={post.sys.id}
                  className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
                >
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {post.fields.title}
                  </h3>
                  {post.fields.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300">{post.fields.excerpt}</p>
                  )}
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    발행일: {new Date(post.sys.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 py-8 dark:bg-yellow-900/20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-xl text-gray-600 dark:text-gray-300">
              Contentful 데이터가 없거나 로딩 중입니다.
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              contentfulPosts 길이: {contentfulPosts?.length || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
