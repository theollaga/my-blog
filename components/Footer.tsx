import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 로고 및 회사 정보 */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center">
              <div className="mr-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                  <span className="text-sm font-bold text-white">🏢</span>
                </div>
              </div>
              <div className="text-xl font-bold text-white">이코노믹글</div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>회사소개</p>
              <p>기자제보 및 문의</p>
              <p>개인정보처리방침</p>
              <p>청소년보호정책</p>
              <p>편집 지침</p>
              <p>이용약관</p>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">카테고리</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/tags/economy" className="block hover:text-white">
                경제
              </Link>
              <Link href="/tags/automotive" className="block hover:text-white">
                자동차
              </Link>
              <Link href="/tags/politics" className="block hover:text-white">
                정치
              </Link>
              <Link href="/tags/society" className="block hover:text-white">
                사회
              </Link>
              <Link href="/tags/culture" className="block hover:text-white">
                문화
              </Link>
              <Link href="/tags/tech" className="block hover:text-white">
                기술
              </Link>
            </div>
          </div>

          {/* 소셜 미디어 */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">팔로우하기</h3>
            <div className="flex space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600">
                <span className="text-sm">📧</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600">
                <span className="text-sm">📱</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600">
                <span className="text-sm">📘</span>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="md:col-span-1">
            <div className="text-sm text-gray-400">
              <div className="mb-2">
                <span className="text-white">주소:</span> 서울특별시 구로구 구로동 197-17
              </div>
              <div className="mb-2">
                <span className="text-white">대표전화:</span> 070-8065-3076
              </div>
              <div className="mb-2">
                <span className="text-white">회사명:</span> 주식회사 파팩스
              </div>
              <div className="mb-2">
                <span className="text-white">제호:</span> 이코노믹글
              </div>
              <div className="mb-2">
                <span className="text-white">등록번호:</span> 서울, 아05580
              </div>
              <div className="mb-2">
                <span className="text-white">등록일:</span> 2024-08-11
              </div>
              <div className="mb-2">
                <span className="text-white">발행일:</span> 2023-11-12
              </div>
              <div className="mb-2">
                <span className="text-white">발행·편집인:</span> 김광호
              </div>
              <div className="mb-2">
                <span className="text-white">청소년보호책임자:</span> 김광호
              </div>
              <div>
                <span className="text-white">문의 및 제보:</span> info@econmingle.com
              </div>
            </div>
          </div>
        </div>

        {/* 저작권 및 면책조항 */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            © 이 콘텐츠 모든 콘텐츠(기사·사진)는 저작권법의 보호를 받은 바, 무단 전재, 복사, 배포
            등을 금합니다. 이를 어길 시 법적 제재를 받을 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  )
}
