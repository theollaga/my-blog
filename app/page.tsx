import { getAllUnifiedPosts } from '@/lib/unifiedContent'
import UnifiedMain from './UnifiedMain'

export default async function Page() {
  const posts = await getAllUnifiedPosts()

  return <UnifiedMain posts={posts} />
}
