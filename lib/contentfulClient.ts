// lib/contentfulClient.js
import { createClient } from 'contentful'

// .env.local 파일에 저장한 키들을 불러옵니다.
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// 환경변수가 없는 경우 더미 클라이언트 생성 (배포 환경 대응)
const client =
  spaceId && accessToken
    ? createClient({
        space: spaceId,
        accessToken: accessToken,
      })
    : createClient({
        space: 'dummy',
        accessToken: 'dummy',
      })

// 생성한 클라이언트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default client
