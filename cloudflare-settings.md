# 클라우드플레어 배포 최적화 가이드

## 1. 페이지 규칙 (Page Rules)

### 캐싱 설정

```
패턴: your-domain.com/static/*
설정: Cache Level = Cache Everything, Edge Cache TTL = 1 month

패턴: your-domain.com/_next/static/*
설정: Cache Level = Cache Everything, Edge Cache TTL = 1 year

패턴: your-domain.com/images/*
설정: Cache Level = Cache Everything, Edge Cache TTL = 1 month
```

### 보안 설정

```
패턴: your-domain.com/admin*
설정: Security Level = High, Disable Apps

패턴: your-domain.com/api/*
설정: Cache Level = Bypass
```

## 2. DNS 설정

### 필요한 레코드

```
A 레코드: @ → Cloudflare IP (오렌지 클라우드 켜짐)
CNAME 레코드: www → your-domain.com (오렌지 클라우드 켜짐)
CNAME 레코드: api → your-domain.com (오렌지 클라우드 켜짐)
```

## 3. SSL/TLS 설정

```
암호화 모드: Full (strict)
Always Use HTTPS: 켜기
HSTS 설정: 켜기
- Max Age: 12개월
- Include subdomains: 켜기
- No-Sniff 헤더 포함: 켜기
```

## 4. 속도 최적화

### Auto Minify 설정

```
JavaScript: 켜기
CSS: 켜기
HTML: 켜기
```

### Brotli 압축

```
Brotli: 켜기
```

### Rocket Loader (선택사항)

```
Rocket Loader: 끄기 (AdSense와 충돌 가능성 있음)
```

## 5. 방화벽 규칙

### Bot Protection

```
Bot Fight Mode: 켜기
Super Bot Fight Mode: Free plan의 경우 끄기
```

### Security Level

```
기본 보안 수준: Medium
Under Attack Mode: DDoS 공격시에만 사용
```

## 6. Workers (고급 설정)

### AdSense 최적화 Worker

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)

  // AdSense 스크립트 최적화
  if (request.url.includes('googlesyndication.com')) {
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Cache-Control': 'public, max-age=3600',
      },
    })
    return newResponse
  }

  return response
}
```

## 7. 환경 변수 설정

Next.js 환경 변수를 Cloudflare Pages에서 설정:

```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=xxxxxxxxxx
GOOGLE_VERIFICATION_ID=verification_code
```

## 8. 배포 설정

### Build 명령어

```
npm run build
```

### 출력 디렉토리

```
.next
```

### Node.js 버전

```
18 또는 20 LTS
```

## 9. 성능 모니터링

### Web Analytics 설정

```
Cloudflare Web Analytics: 켜기
- 페이지 뷰 추적
- 성능 메트릭 모니터링
- Core Web Vitals 추적
```

### Real User Monitoring (RUM)

```
RUM: 켜기 (유료 플랜에서 사용 가능)
```

## 10. 추가 최적화 팁

### 이미지 최적화

```
Polish: Lossy (유료 플랜)
Mirage: 켜기 (유료 플랜)
```

### Argo Smart Routing

```
Argo: 켜기 (유료, 성능 향상을 위해 권장)
```

### Load Balancing (다중 서버 사용시)

```
Load Balancer 설정으로 고가용성 확보
```

이 설정들을 적용하면 뉴스 사이트의 성능과 SEO가 크게 향상됩니다.
