import Link from 'next/link'
import Tag from '@/components/Tag'
import Image from 'next/image'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { UnifiedPost } from '@/lib/unifiedContent'

interface PostCardProps {
  post: UnifiedPost
  variant?: 'hero' | 'featured' | 'grid' | 'list'
  className?: string
}

const categoryColors: Record<string, string> = {
  경제: 'bg-blue-600',
  자동차: 'bg-green-600',
  정치: 'bg-red-600',
  사회: 'bg-purple-600',
  문화: 'bg-orange-600',
  기술: 'bg-cyan-600',
  general: 'bg-gray-600',
}

export default function PostCard({ post, variant = 'grid', className = '' }: PostCardProps) {
  const categoryColor = categoryColors[post.category || 'general'] || 'bg-gray-600'
  const href = post.source === 'contentlayer' ? `/blog/${post.slug}` : `/post/${post.id}`

  // Hero 스타일 (메인 페이지 큰 카드)
  if (variant === 'hero') {
    return (
      <Link
        href={href}
        className={`group relative block overflow-hidden rounded-lg lg:col-span-2 ${className}`}
      >
        <article>
          <div className="relative h-[400px] overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            <div className="absolute right-0 bottom-0 left-0 p-6">
              <div className="mb-3">
                <span
                  className={`inline-block rounded px-3 py-1 text-sm font-medium text-white ${categoryColor}`}
                >
                  {post.category || '일반'}
                </span>
              </div>
              <h1 className="mb-3 text-2xl leading-tight font-bold text-white group-hover:text-blue-200 lg:text-3xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-200">{post.excerpt}</p>
              )}
              <time className="text-sm text-gray-300">
                {formatDate(post.publishedAt, siteMetadata.locale)}
              </time>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // Featured 스타일 (메인 페이지 작은 카드)
  if (variant === 'featured') {
    return (
      <Link href={href} className={`group relative block overflow-hidden rounded-lg ${className}`}>
        <article>
          <div className="relative h-[190px] overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 ${categoryColor.replace('bg-', 'from-').replace('-600', '-800')} to-gray-900`}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            <div className="absolute right-0 bottom-0 left-0 p-4">
              <div className="mb-2">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-medium text-white ${categoryColor}`}
                >
                  {post.category || '일반'}
                </span>
              </div>
              <h3 className="mb-2 text-sm leading-tight font-bold text-white group-hover:text-blue-200">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mb-2 line-clamp-2 text-xs text-gray-200">{post.excerpt}</p>
              )}
              <time className="text-xs text-gray-300">
                {formatDate(post.publishedAt, siteMetadata.locale)}
              </time>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // Grid 스타일 (그리드 뷰)
  if (variant === 'grid') {
    return (
      <Link href={href} className={`group block ${className}`}>
        <article>
          <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                <span className="text-2xl text-gray-500 dark:text-gray-400">📰</span>
              </div>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium text-white ${categoryColor}`}
            >
              {post.category || '일반'}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-3 text-sm leading-tight font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          <p className="mb-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.publishedAt, siteMetadata.locale)}
          </time>
        </article>
      </Link>
    )
  }

  // List 스타일 (리스트 뷰)
  if (variant === 'list') {
    return (
      <Link href={href} className={`group block ${className}`}>
        <article className="flex w-full gap-4">
          <div className="relative aspect-[4/3] w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">📰</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`inline-block rounded px-2 py-1 text-xs font-medium text-white ${categoryColor}`}
              >
                {post.category || '일반'}
              </span>
            </div>
            <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {post.title}
            </h3>
            <p className="mb-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {post.excerpt}
            </p>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.publishedAt, siteMetadata.locale)}
            </time>
          </div>
        </article>
      </Link>
    )
  }

  return null
}
