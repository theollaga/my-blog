import { NextRequest, NextResponse } from 'next/server'
import { loadSiteConfig, saveSiteConfig } from '@/lib/siteConfig'

// Edge Runtime에서는 fs 모듈을 사용할 수 없으므로 기본 Node.js 런타임 사용

// GET: 설정 조회
export async function GET() {
  try {
    const config = loadSiteConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('설정 조회 오류:', error)
    return NextResponse.json({ error: '설정을 불러올 수 없습니다.' }, { status: 500 })
  }
}

// POST: 설정 저장
export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    // 기본 유효성 검사
    if (!config.site || !config.categories || !config.footer) {
      return NextResponse.json({ error: '올바른 설정 형식이 아닙니다.' }, { status: 400 })
    }

    saveSiteConfig(config)

    return NextResponse.json({ success: true, message: '설정이 저장되었습니다.' })
  } catch (error) {
    console.error('설정 저장 오류:', error)
    return NextResponse.json({ error: '설정을 저장할 수 없습니다.' }, { status: 500 })
  }
}
