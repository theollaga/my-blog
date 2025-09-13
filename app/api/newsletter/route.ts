// app/api/newsletter/route.ts

// Cloudflare Pages + next-on-pages는 비정적 라우트에 Edge 런타임을 요구합니다.
export const runtime = 'edge'
// 프리렌더/프리캐시를 피해서 항상 런타임 처리
export const dynamic = 'force-dynamic'

type ReqBody = { email?: string }

export async function POST(req: Request) {
  let email: string | undefined

  try {
    const body = (await req.json()) as ReqBody
    email = body?.email
  } catch {
    // body가 없거나 JSON 파싱 실패해도 그냥 진행
  }

  // 실제 구독 처리는 비활성화. 빌드/런타임 에러 방지용 더미 응답.
  return new Response(
    JSON.stringify({
      ok: true,
      message: '뉴스레터 구독이 임시로 비활성화되었습니다.',
      email: email ?? null,
    }),
    {
      status: 201, // 기존 폼의 기대 상태코드와 최대한 호환
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  )
}

export async function GET() {
  // 상태 확인용(선택). 필요 없으면 삭제해도 됨.
  return new Response(
    JSON.stringify({
      ok: true,
      message: '뉴스레터 API는 현재 임시 비활성화 모드입니다.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
