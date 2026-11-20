// Runtime; presentation mode. All posts and attachments stay in this browser.
// IndexedDB handles file Blobs without a paid backend. No login or network needed.
const DATABASE = 'runtime-presentation-posts-v1'
const STORE = 'posts'
const VERSION = 1
export const DEMO_POSTS_EVENT = 'runtime-demo-posts-updated'
let opening = null

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('이 브라우저에서는 로컬 게시물 저장을 지원하지 않습니다.'))
  }
  if (!opening) {
    opening = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE, VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => {
        const db = request.result
        db.onversionchange = () => db.close()
        resolve(db)
      }
      request.onerror = () => reject(request.error || new Error('로컬 저장소를 열지 못했습니다.'))
      request.onblocked = () => reject(new Error('다른 탭에서 사이트를 닫고 다시 시도해 주세요.'))
    }).catch((error) => {
      opening = null
      throw error
    })
  }
  return opening
}

async function withStore(mode, operation) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode)
    const store = transaction.objectStore(STORE)
    let result
    let request
    try {
      request = operation(store)
      request.onsuccess = () => { result = request.result }
    } catch (error) {
      transaction.abort()
      reject(error)
      return
    }
    transaction.oncomplete = () => resolve(result)
    transaction.onerror = () => reject(transaction.error || new Error('브라우저 저장에 실패했습니다.'))
    transaction.onabort = () => reject(transaction.error || new Error('저장 작업이 취소됐습니다.'))
  })
}

function broadcast() {
  window.dispatchEvent(new Event(DEMO_POSTS_EVENT))
}

export async function getDemoPosts() {
  const posts = await withStore('readonly', (store) => store.getAll())
  return (posts || []).sort((a,b) =>
    String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')))
}

export async function saveDemoPost(draft, files = [], existing = null) {
  const now = new Date().toISOString()
  const id = existing?.id || crypto.randomUUID()
  const attachments = files.length > 0
    ? files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        blob: file,
      }))
    : (existing?.attachments || [])
  const post = {
    id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    title: draft.title.trim(),
    category: draft.category,
    event_date: draft.event_date,
    team: draft.team.trim(),
    summary: draft.summary.trim(),
    body: draft.body.trim(),
    award: draft.award.trim(),
    attachments,
    demo: true,
  }
  await withStore('readwrite', (store) => store.put(post))
  broadcast()
  return post
}

export async function deleteDemoPost(id) {
  await withStore('readwrite', (store) => store.delete(id))
  broadcast()
}

export async function resetDemoPosts() {
  await withStore('readwrite', (store) => store.clear())
  broadcast()
}

const samples = [
  {
    title: '[시연 예시] 데이터 분석 해커톤 참가',
    category: '해커톤',
    event_date: '2026-10-17',
    team: '예시 팀 A',
    summary: '가상의 참가 사례입니다. 프로젝트 게시판에서 아이디어와 과정이 어떻게 소개되는지 보여줍니다.',
    body: '※ 이 게시물은 기능 시연을 위해 제작한 가상의 예시이며 Runtime;의 실제 활동 실적이 아닙니다.\n\n문제: 공개 데이터를 활용한 분석 과제\n방법: Python으로 데이터 전처리 및 시각화\n결과: 발표 자료와 프로젝트 기록 구성',
    award: '',
  },
  {
    title: '[시연 예시] 개발 프로젝트 발표',
    category: '개발 프로젝트',
    event_date: '2026-10-22',
    team: '예시 팀 B',
    summary: '동아리 부원이 만든 프로젝트를 소개할 때 사용할 수 있는 샘플 카드입니다.',
    body: '※ 시연용 가상 프로젝트입니다. 실제 동아리 프로젝트가 아닙니다.\n\n기획 · 기능 구현 · 테스트 · 발표 과정을 소개할 수 있습니다.',
    award: '',
  },
  {
    title: '[시연 예시] 경진대회 수상 소식',
    category: '수상·소식',
    event_date: '2026-11-01',
    team: '예시 팀 C',
    summary: '수상 내역과 사진, 발표자료를 함께 소개하는 화면을 시연하기 위한 예시입니다.',
    body: '※ 실제 Runtime;의 수상 사실이 아닙니다. 시연 화면의 뉴스 기능을 확인하는 용도입니다.',
    award: '시연용 가상 우수상 (실제 수상 아님)',
  },
]

export async function loadSamplePosts() {
  const previous = await getDemoPosts()
  const sampleIds = new Set(samples.map((_, index) => 'runtime-example-' + (index+1)))
  const existing = new Set(previous.map((post) => post.id))
  const now = new Date().toISOString()
  for (const [index, sample] of samples.entries()) {
    const id = 'runtime-example-' + (index+1)
    if (!existing.has(id)) {
      await withStore('readwrite', (store) => store.put({
        ...sample, id, createdAt: now, updatedAt: now, demo: true, sample: true, attachments: [],
      }))
    }
  }
  broadcast()
  return sampleIds.size
}

export function validateDemoFiles(files) {
  const allowed = new Set(['jpg','jpeg','png','webp','gif','pdf','ppt','pptx','doc','docx','zip','csv','xlsx','txt'])
  if (files.length > 5) throw new Error('첨부파일은 최대 5개까지 선택할 수 있습니다.')
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!allowed.has(ext)) throw new Error('지원하지 않는 파일 형식입니다: ' + file.name)
    if (!file.size) throw new Error('빈 파일은 첨부할 수 없습니다.')
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('첨부파일은 개당 15MB 이하만 저장할 수 있습니다.')
    }
  }
}
