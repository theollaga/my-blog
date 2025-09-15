// lib/contentfulClient.js
import { createClient } from 'contentful'

// .env.local 파일에 저장한 키들을 불러옵니다.
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// Contentful 클라이언트를 생성합니다.
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
})

// 생성한 클라이언트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default client
