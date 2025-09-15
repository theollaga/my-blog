import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import { loadSiteConfig } from '@/lib/siteConfig'

export default function Footer() {
  const config = loadSiteConfig()
  return (
    <footer className="border-t border-gray-700 bg-gray-900 text-white">
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
              <div className="text-xl font-bold text-white">{config.site.headerTitle}</div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              {config.footer.links.map((link, index) => (
                <Link key={index} href={link.url} className="block hover:text-white">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">카테고리</h3>
            <div className="space-y-2 text-sm text-gray-400">
              {config.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 소셜 미디어 */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">팔로우하기</h3>
            <div className="flex space-x-4">
              {config.footer.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600"
                  title={social.name}
                >
                  <span className="text-sm">{social.icon || '🔗'}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="md:col-span-1">
            <div className="text-sm text-gray-400">
              <div className="mb-2">
                <span className="text-white">주소:</span> {config.company.address}
              </div>
              <div className="mb-2">
                <span className="text-white">대표전화:</span> {config.company.phone}
              </div>
              <div className="mb-2">
                <span className="text-white">회사명:</span> {config.company.name}
              </div>
              <div className="mb-2">
                <span className="text-white">제호:</span> {config.company.publication}
              </div>
              <div className="mb-2">
                <span className="text-white">등록번호:</span> {config.company.registrationNumber}
              </div>
              <div className="mb-2">
                <span className="text-white">등록일:</span> {config.company.registrationDate}
              </div>
              <div className="mb-2">
                <span className="text-white">발행일:</span> {config.company.publicationDate}
              </div>
              <div className="mb-2">
                <span className="text-white">발행·편집인:</span> {config.company.editorInChief}
              </div>
              <div className="mb-2">
                <span className="text-white">청소년보호책임자:</span>{' '}
                {config.company.youthProtectionOfficer}
              </div>
              <div>
                <span className="text-white">문의 및 제보:</span> {config.company.contactEmail}
              </div>
            </div>
          </div>
        </div>

        {/* 저작권 및 면책조항 */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>{config.footer.text}</p>
        </div>
      </div>
    </footer>
  )
}
