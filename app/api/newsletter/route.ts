// app/api/newsletter/route.ts
import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

// Cloudflare Pages(Workers)에서 API 라우트는 Edge Runtime이어야 합니다.
export const runtime = 'edge'

// force-static은 제거 (동적 핸들러이므로)
const handler = NewsletterAPI({
  // @ts-ignore - starter 템플릿 타입 특성상 무시
  provider: siteMetadata.newsletter?.provider,
})

export { handler as GET, handler as POST }
