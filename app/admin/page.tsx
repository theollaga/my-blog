'use client'

import { useState, useEffect } from 'react'
import type { SiteConfig } from '@/lib/siteConfig'

interface AdminPanelProps {}

export default function AdminPanel({}: AdminPanelProps) {
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
        body: JSON.stringify(config)
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
      description: ''
    }
    setConfig({
      ...config,
      categories: [...config.categories, newCategory]
    })
  }

  const removeCategory = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      categories: config.categories.filter((_, i) => i !== index)
    })
  }

  const updateCategory = (index: number, field: string, value: string) => {
    if (!config) return
    const newCategories = [...config.categories]
    newCategories[index] = {
      ...newCategories[index],
      [field]: value,
      // slug는 name과 연동
      ...(field === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {})
    }
    setConfig({
      ...config,
      categories: newCategories
    })
  }

  const addFooterLink = (type: 'links' | 'socialLinks') => {
    if (!config) return
    const newLink = type === 'links'
      ? { name: '새 링크', url: '' }
      : { name: '새 소셜링크', url: '', icon: '🔗' }

    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: [...config.footer[type], newLink]
      }
    })
  }

  const removeFooterLink = (type: 'links' | 'socialLinks', index: number) => {
    if (!config) return
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: config.footer[type].filter((_, i) => i !== index)
      }
    })
  }

  const updateFooterLink = (type: 'links' | 'socialLinks', index: number, field: string, value: string) => {
    if (!config) return
    const newLinks = [...config.footer[type]]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [type]: newLinks
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">설정 로딩 중...</div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">설정을 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">사이트 관리자</h1>
            <div className="flex gap-4">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '설정 저장'}
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                사이트로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 py-2`}>
          <div className={`p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'site', label: '사이트 설정' },
                { key: 'categories', label: '카테고리 관리' },
                { key: 'footer', label: '푸터 설정' },
                { key: 'company', label: '회사 정보' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="bg-white rounded-lg shadow p-6 text-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">기본 사이트 설정</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 제목
                </label>
                <input
                  type="text"
                  value={config.site.title}
                  onChange={(e) => setConfig({
                    ...config,
                    site: { ...config.site, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  헤더 제목
                </label>
                <input
                  type="text"
                  value={config.site.headerTitle}
                  onChange={(e) => setConfig({
                    ...config,
                    site: { ...config.site, headerTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 설명
                </label>
                <textarea
                  value={config.site.description}
                  onChange={(e) => setConfig({
                    ...config,
                    site: { ...config.site, description: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작성자
                </label>
                <input
                  type="text"
                  value={config.site.author}
                  onChange={(e) => setConfig({
                    ...config,
                    site: { ...config.site, author: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 URL
                </label>
                <input
                  type="url"
                  value={config.site.siteUrl}
                  onChange={(e) => setConfig({
                    ...config,
                    site: { ...config.site, siteUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 관리 탭 */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-6 text-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">카테고리 관리</h2>
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                카테고리 추가
              </button>
            </div>

            <div className="space-y-4">
              {config.categories.map((category, index) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        카테고리명
                      </label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={category.slug}
                        onChange={(e) => updateCategory(index, 'slug', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <input
                        type="text"
                        value={category.description || ''}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeCategory(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
          <div className="bg-white rounded-lg shadow p-6 text-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">푸터 설정</h2>

            {/* 푸터 텍스트 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                푸터 텍스트
              </label>
              <input
                type="text"
                value={config.footer.text}
                onChange={(e) => setConfig({
                  ...config,
                  footer: { ...config.footer, text: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 일반 링크 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">일반 링크</h3>
                <button
                  onClick={() => addFooterLink('links')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  링크 추가
                </button>
              </div>

              <div className="space-y-2">
                {config.footer.links.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded">
                    <input
                      type="text"
                      placeholder="링크명"
                      value={link.name}
                      onChange={(e) => updateFooterLink('links', index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateFooterLink('links', index, 'url', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <button
                      onClick={() => removeFooterLink('links', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 소셜 링크 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">소셜 미디어 링크</h3>
                <button
                  onClick={() => addFooterLink('socialLinks')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  소셜링크 추가
                </button>
              </div>

              <div className="space-y-2">
                {config.footer.socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded">
                    <input
                      type="text"
                      placeholder="서비스명"
                      value={link.name}
                      onChange={(e) => updateFooterLink('socialLinks', index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateFooterLink('socialLinks', index, 'url', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="아이콘 (이모지)"
                      value={link.icon || ''}
                      onChange={(e) => updateFooterLink('socialLinks', index, 'icon', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <button
                      onClick={() => removeFooterLink('socialLinks', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
          <div className="bg-white rounded-lg shadow p-6 text-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">회사 정보</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사명
                </label>
                <input
                  type="text"
                  value={config.company.name}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제호
                </label>
                <input
                  type="text"
                  value={config.company.publication}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, publication: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <input
                  type="text"
                  value={config.company.address}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표전화
                </label>
                <input
                  type="tel"
                  value={config.company.phone}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등록번호
                </label>
                <input
                  type="text"
                  value={config.company.registrationNumber}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, registrationNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등록일
                </label>
                <input
                  type="date"
                  value={config.company.registrationDate}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, registrationDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행일
                </label>
                <input
                  type="date"
                  value={config.company.publicationDate}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, publicationDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행·편집인
                </label>
                <input
                  type="text"
                  value={config.company.editorInChief}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, editorInChief: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  청소년보호책임자
                </label>
                <input
                  type="text"
                  value={config.company.youthProtectionOfficer}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, youthProtectionOfficer: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  문의 및 제보 이메일
                </label>
                <input
                  type="email"
                  value={config.company.contactEmail}
                  onChange={(e) => setConfig({
                    ...config,
                    company: { ...config.company, contactEmail: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}