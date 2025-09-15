import { notFound } from 'next/navigation'
import client from '@/lib/contentfulClient'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { Entry } from 'contentful'

// Rich Text 렌더링 함수
function renderRichText(richTextContent: any): string {
  if (!richTextContent || !richTextContent.content) {
    return ''
  }

  function renderNode(node: any): string {
    if (node.nodeType === 'text') {
      let text = node.value || ''
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') {
            text = `<strong>${text}</strong>`
          }
          if (mark.type === 'italic') {
            text = `<em>${text}</em>`
          }
          if (mark.type === 'underline') {
            text = `<u>${text}</u>`
          }
          if (mark.type === 'code') {
            text = `<code>${text}</code>`
          }
        }
      }
      return text
    }

    if (node.nodeType === 'paragraph') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<p>${content}</p>`
    }

    if (node.nodeType === 'heading-1') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<h1>${content}</h1>`
    }

    if (node.nodeType === 'heading-2') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<h2>${content}</h2>`
    }

    if (node.nodeType === 'heading-3') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<h3>${content}</h3>`
    }

    if (node.nodeType === 'unordered-list') {
      const items = node.content ? node.content.map(renderNode).join('') : ''
      return `<ul>${items}</ul>`
    }

    if (node.nodeType === 'ordered-list') {
      const items = node.content ? node.content.map(renderNode).join('') : ''
      return `<ol>${items}</ol>`
    }

    if (node.nodeType === 'list-item') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<li>${content}</li>`
    }

    if (node.nodeType === 'hr') {
      return '<hr>'
    }

    if (node.nodeType === 'blockquote') {
      const content = node.content ? node.content.map(renderNode).join('') : ''
      return `<blockquote>${content}</blockquote>`
    }

    if (node.content) {
      return node.content.map(renderNode).join('')
    }

    return ''
  }

  return richTextContent.content.map(renderNode).join('')
}

// 특정 포스트 가져오기
async function getContentfulPost(id: string): Promise<Entry<any> | null> {
  try {
    const entry = await client.getEntry(id, {
      include: 2
    })
    return entry
  } catch (error) {
    console.error('Contentful 포스트 fetch 오류:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ContentfulPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getContentfulPost(id)

  if (!post) {
    notFound()
  }

  const { fields, sys } = post
  const content = renderRichText(fields.content)

  // coverImage 안전하게 처리
  let coverImageUrl = null
  try {
    if (fields.coverImage && fields.coverImage.fields && fields.coverImage.fields.file) {
      coverImageUrl = `https:${fields.coverImage.fields.file.url}`
    }
  } catch (e) {
    coverImageUrl = null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <article>
        {/* 헤더 */}
        <header className="mb-8">
          {coverImageUrl && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={coverImageUrl}
                alt={fields.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}


          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
            {fields.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time>
              {formatDate(fields.publishedDate || sys.createdAt, siteMetadata.locale)}
            </time>
            {fields.tags && fields.tags.length > 0 && (
              <div className="flex gap-2">
                {fields.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 본문 */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-headings:text-white dark:prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  )
}

// 메타데이터 생성
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const post = await getContentfulPost(id)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.fields.title,
    description: post.fields.excerpt || post.fields.description || '콘텐츠를 확인해보세요.'
  }
}