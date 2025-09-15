import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { loadSiteConfig } from '@/lib/siteConfig'

const Header = () => {
  // 동적 설정 로드
  const config = loadSiteConfig()

  const categories = config.categories.map(cat => ({
    name: cat.name,
    href: `/category/${cat.slug}`
  }))

  return (
    <>
      {/* 상단 헤더 */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-4">
            {/* 로고 */}
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center">
                <div className="mr-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                    <span className="text-sm font-bold text-white">🏢</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{config.site.headerTitle}</div>
              </div>
            </Link>

            {/* 우측 유틸리티 */}
            <div className="flex items-center space-x-4">
              <SearchButton />
              <ThemeSwitch />
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 메뉴 */}
      <nav className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="hidden text-sm text-gray-500 md:flex dark:text-gray-400">
              <span>
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
