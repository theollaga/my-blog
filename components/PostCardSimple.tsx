import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { UnifiedPost } from '@/lib/unifiedContent'

interface PostCardSimpleProps {
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

export default function PostCardSimple({
  post,
  variant = 'grid',
  className = '',
}: PostCardSimpleProps) {
  const categoryColor = categoryColors[post.category || 'general'] || 'bg-gray-600'
  const href = post.source === 'contentlayer' ? `/blog/${post.slug}` : `/post/${post.id}`

  // 간단한 Hero 스타일
  if (variant === 'hero') {
    return (
      <div className={`${className} lg:col-span-2`}>
        <Link
          href={href}
          className="relative block h-[400px] w-full overflow-hidden rounded-lg bg-gray-800 transition-opacity hover:opacity-90"
        >
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            <span
              className={`inline-block rounded px-3 py-1 text-sm font-medium ${categoryColor} mb-3 text-white`}
            >
              {post.category || '일반'}
            </span>
            <h1 className="mb-2 text-2xl leading-tight font-bold lg:text-3xl">{post.title}</h1>
            {post.excerpt && (
              <p className="mb-2 line-clamp-2 text-sm text-gray-200">{post.excerpt}</p>
            )}
            <time className="text-sm text-gray-300">
              {formatDate(post.publishedAt.toString(), siteMetadata.locale)}
            </time>
          </div>
        </Link>
      </div>
    )
  }

  // 간단한 Featured 스타일
  if (variant === 'featured') {
    return (
      <div className={className}>
        <Link
          href={href}
          className="relative block h-[190px] w-full overflow-hidden rounded-lg bg-gray-800 transition-opacity hover:opacity-90"
        >
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${categoryColor} mb-2 text-white`}
            >
              {post.category || '일반'}
            </span>
            <h3 className="mb-1 text-sm leading-tight font-bold">{post.title}</h3>
            {post.excerpt && <p className="line-clamp-2 text-xs text-gray-200">{post.excerpt}</p>}
          </div>
        </Link>
      </div>
    )
  }

  // 간단한 Grid 스타일
  if (variant === 'grid') {
    return (
      <div className={className}>
        <Link href={href} className="group block transition-opacity hover:opacity-90">
          <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={300}
                height={225}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-2xl">📰</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${categoryColor} text-white`}
            >
              {post.category || '일반'}
            </span>
            <h3 className="line-clamp-3 text-sm leading-tight font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{post.excerpt}</p>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.publishedAt.toString(), siteMetadata.locale)}
            </time>
          </div>
        </Link>
      </div>
    )
  }

  return null
}
