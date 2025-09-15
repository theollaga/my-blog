'use client'

import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface Post {
  slug: string
  title: string
  date: string
  summary?: string
  tags?: string[]
}

interface SidebarProps {
  recentPosts?: Post[]
  trendingPosts?: Post[]
}

export default function Sidebar({ recentPosts = [], trendingPosts = [] }: SidebarProps) {
  const categories = [
    { name: '경제', href: '/tags/economy', count: 12 },
    { name: '정치', href: '/tags/politics', count: 8 },
    { name: '사회', href: '/tags/society', count: 15 },
    { name: '기술', href: '/tags/tech', count: 9 },
    { name: '문화', href: '/tags/culture', count: 6 },
  ]

  return (
    <div className="space-y-8">
      {/* 카테고리 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold text-[#0b2536] dark:text-white">카테고리</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex items-center justify-between rounded px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
              <span className="text-gray-500 dark:text-gray-400">({category.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 글 */}
      {recentPosts.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold text-[#0b2536] dark:text-white">최근 글</h3>
          <div className="space-y-3">
            {recentPosts.slice(0, 5).map((post) => (
              <article
                key={post.slug}
                className="border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-700"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-[#0b2536] dark:text-white dark:hover:text-blue-400"
                >
                  {post.title}
                </Link>
                <time className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.date, siteMetadata.locale)}
                </time>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* 인기 글 */}
      {trendingPosts.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold text-[#0b2536] dark:text-white">인기 글</h3>
          <div className="space-y-3">
            {trendingPosts.slice(0, 5).map((post, index) => (
              <article
                key={post.slug}
                className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-700"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[#0b2536] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-[#0b2536] dark:text-white dark:hover:text-blue-400"
                  >
                    {post.title}
                  </Link>
                  <time className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* 태그 클라우드 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold text-[#0b2536] dark:text-white">인기 태그</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'React',
            'Next.js',
            'TypeScript',
            'JavaScript',
            'CSS',
            'Node.js',
            '웹개발',
            '프론트엔드',
          ].map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-[#0b2536] hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-white dark:hover:text-[#0b2536]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
