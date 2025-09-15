'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SiteConfig } from '@/lib/siteConfig'

export default function AdminPanel() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [activeTab, setActiveTab] = useState<'site' | 'categories' | 'footer' | 'company'>('site')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 설정 로드
  useEffect(() => {
    try {
      loadConfig()
    } catch (error) {
      console.error('useEffect 에러:', error)
      setLoading(false)
      setMessage({ type: 'error', text: 'useEffect 에러: ' + error.message })
    }
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      console.log('설정 로드 시작...')
      const response = await fetch('/api/admin/config')
      console.log('API 응답 상태:', response.status)
      if (!response.ok) throw new Error('설정을 불러올 수 없습니다.')
      const data = await response.json()
      console.log('로드된 설정:', data)
      setConfig(data)
      console.log('설정 상태 업데이트 완료')
    } catch (error) {
      console.error('설정 로드 오류:', error)
      setMessage({ type: 'error', text: '설정 로드 실패: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!config) return

    try {
      setSaving(true)
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) throw new Error('저장 실패')

      setMessage({ type: 'success', text: '설정이 저장되었습니다.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  const addCategory = () => {
    if (!config) return
    const newCategory = {
      id: `category-${Date.now()}`,
      name: '새 카테고리',
      slug: 'new-category',
      description: '',
    }
    setConfig({
      ...config,
      categories: [...config.categories, newCategory],
    })
  }

  const removeCategory = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      categories: config.categories.filter((_, i) => i !== index),
    })
  }

  const updateCategory = (index: number, field: string, value: string) => {
    if (!config) return
    const newCategories = [...config.categories]
    newCategories[index] = {
      ...newCategories[index],
      [field]: value,
      // slug는 name과 연동
      ...(field === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {}),
    }
    setConfig({
      ...config,
      categories: newCategories,
    })
  }

  const addFooterLink = (type: 'links' | 'socialLinks') => {
    if (!config) return
    const newLink =
      type === 'links' ? { name: '새 링크', url: '' } : { name: '새 소셜링크', url: '', icon: '🔗' }

    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: [...config.footer[type], newLink],
      },
    })
  }

  const removeFooterLink = (type: 'links' | 'socialLinks', index: number) => {
    if (!config) return
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: config.footer[type].filter((_, i) => i !== index),
      },
    })
  }

  const updateFooterLink = (
    type: 'links' | 'socialLinks',
    index: number,
    field: string,
    value: string
  ) => {
    if (!config) return
    const newLinks = [...config.footer[type]]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: newLinks,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl">설정 로딩 중...</div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">설정을 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 헤더 */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">사이트 관리자</h1>
            <div className="flex gap-4">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '설정 저장'}
              </button>
              <Link href="/" className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                사이트로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 */}
      {message && (
        <div className={`mx-auto max-w-7xl px-4 py-2`}>
          <div
            className={`rounded p-3 ${
              message.type === 'success'
                ? 'border border-green-200 bg-green-100 text-green-800'
                : 'border border-red-200 bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'site', label: '사이트 설정' },
                { key: 'categories', label: '카테고리 관리' },
                { key: 'footer', label: '푸터 설정' },
                { key: 'company', label: '회사 정보' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(tab.key as 'site' | 'categories' | 'footer' | 'company')
                  }
                  className={`border-b-2 px-1 py-2 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 사이트 설정 탭 */}
        {activeTab === 'site' && (
          <div className="rounded-lg bg-white p-6 text-gray-900 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">기본 사이트 설정</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="site-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  사이트 제목
                </label>
                <input
                  id="site-title"
                  type="text"
                  value={config.site.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      site: { ...config.site, title: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="header-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  헤더 제목
                </label>
                <input
                  id="header-title"
                  type="text"
                  value={config.site.headerTitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      site: { ...config.site, headerTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="site-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  사이트 설명
                </label>
                <textarea
                  id="site-description"
                  value={config.site.description}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      site: { ...config.site, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="site-author"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  작성자
                </label>
                <input
                  id="site-author"
                  type="text"
                  value={config.site.author}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      site: { ...config.site, author: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="site-url" className="mb-2 block text-sm font-medium text-gray-700">
                  사이트 URL
                </label>
                <input
                  id="site-url"
                  type="url"
                  value={config.site.siteUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      site: { ...config.site, siteUrl: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 관리 탭 */}
        {activeTab === 'categories' && (
          <div className="rounded-lg bg-white p-6 text-gray-900 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">카테고리 관리</h2>
              <button
                onClick={addCategory}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                카테고리 추가
              </button>
            </div>

            <div className="space-y-4">
              {config.categories.map((category, index) => (
                <div key={category.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                      <label
                        htmlFor={`category-name-${index}`}
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        카테고리명
                      </label>
                      <input
                        id={`category-name-${index}`}
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`category-slug-${index}`}
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        URL Slug
                      </label>
                      <input
                        id={`category-slug-${index}`}
                        type="text"
                        value={category.slug}
                        onChange={(e) => updateCategory(index, 'slug', e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`category-description-${index}`}
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        설명
                      </label>
                      <input
                        id={`category-description-${index}`}
                        type="text"
                        value={category.description || ''}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeCategory(index)}
                        className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 푸터 설정 탭 */}
        {activeTab === 'footer' && (
          <div className="rounded-lg bg-white p-6 text-gray-900 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">푸터 설정</h2>

            {/* 푸터 텍스트 */}
            <div className="mb-6">
              <label htmlFor="footer-text" className="mb-2 block text-sm font-medium text-gray-700">
                푸터 텍스트
              </label>
              <input
                id="footer-text"
                type="text"
                value={config.footer.text}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    footer: { ...config.footer, text: e.target.value },
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* 일반 링크 */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">일반 링크</h3>
                <button
                  onClick={() => addFooterLink('links')}
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                >
                  링크 추가
                </button>
              </div>

              <div className="space-y-2">
                {config.footer.links.map((link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 rounded border p-3 md:grid-cols-3"
                  >
                    <input
                      type="text"
                      placeholder="링크명"
                      value={link.name}
                      onChange={(e) => updateFooterLink('links', index, 'name', e.target.value)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateFooterLink('links', index, 'url', e.target.value)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => removeFooterLink('links', index)}
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 소셜 링크 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">소셜 미디어 링크</h3>
                <button
                  onClick={() => addFooterLink('socialLinks')}
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                >
                  소셜링크 추가
                </button>
              </div>

              <div className="space-y-2">
                {config.footer.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 rounded border p-3 md:grid-cols-4"
                  >
                    <input
                      type="text"
                      placeholder="서비스명"
                      value={link.name}
                      onChange={(e) =>
                        updateFooterLink('socialLinks', index, 'name', e.target.value)
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateFooterLink('socialLinks', index, 'url', e.target.value)
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="아이콘 (이모지)"
                      value={link.icon || ''}
                      onChange={(e) =>
                        updateFooterLink('socialLinks', index, 'icon', e.target.value)
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => removeFooterLink('socialLinks', index)}
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 회사 정보 탭 */}
        {activeTab === 'company' && (
          <div className="rounded-lg bg-white p-6 text-gray-900 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">회사 정보</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="company-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  회사명
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={config.company.name}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, name: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-publication"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  제호
                </label>
                <input
                  id="company-publication"
                  type="text"
                  value={config.company.publication}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, publication: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="company-address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  주소
                </label>
                <input
                  id="company-address"
                  type="text"
                  value={config.company.address}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, address: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  대표전화
                </label>
                <input
                  id="company-phone"
                  type="tel"
                  value={config.company.phone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, phone: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-registration"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  등록번호
                </label>
                <input
                  id="company-registration"
                  type="text"
                  value={config.company.registrationNumber}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, registrationNumber: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-registration-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  등록일
                </label>
                <input
                  id="company-registration-date"
                  type="date"
                  value={config.company.registrationDate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, registrationDate: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-publication-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  발행일
                </label>
                <input
                  id="company-publication-date"
                  type="date"
                  value={config.company.publicationDate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, publicationDate: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-editor"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  발행·편집인
                </label>
                <input
                  id="company-editor"
                  type="text"
                  value={config.company.editorInChief}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, editorInChief: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-youth-officer"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  청소년보호책임자
                </label>
                <input
                  id="company-youth-officer"
                  type="text"
                  value={config.company.youthProtectionOfficer}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, youthProtectionOfficer: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="company-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  문의 및 제보 이메일
                </label>
                <input
                  id="company-email"
                  type="email"
                  value={config.company.contactEmail}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      company: { ...config.company, contactEmail: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
