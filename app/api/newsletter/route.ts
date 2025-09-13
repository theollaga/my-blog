// app/api/newsletter/route.ts
import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

// Cloudflare Pages(Workers)에서 API 라우트는 Edge Runtime이어야 합니다.
export const runtime = 'edge'

// 정적으로 고정하면 안 됩니다. (이전의 force-static은 제거)
// 필요하다면 다음 줄로 완전 동적 렌더링을 명시할 수도 있습니다.
// export const dynamic = 'force-dynamic'

const handler = NewsletterAPI({
  // @ts-ignore - starter 템플릿의 타입 정의 특성상 무시
  provider: siteMetadata.newsletter?.provider,
})

// Next.js App Router 형식대로 GET/POST 핸들러를 export
export { handler as GET, handler as POST }
