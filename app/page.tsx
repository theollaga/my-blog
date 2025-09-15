import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import client from '@/lib/contentfulClient.ts'

// Contentful에서 Post 타입의 모든 글을 가져오는 함수
async function fetchContentfulPosts() {
  try {
    const entries = await client.getEntries({ content_type: 'post' })
    console.log('Contentful 글 수:', entries.items?.length || 0)
    return entries.items
  } catch (error) {
    console.error('Contentful 오류:', error)
    return []
  }
}

export default async function Page() {
  // 기존 contentlayer 데이터
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Contentful 데이터
  const contentfulPosts = await fetchContentfulPosts()

  return <Main posts={posts} contentfulPosts={contentfulPosts} />
}
