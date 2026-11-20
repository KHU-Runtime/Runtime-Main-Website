// Runtime; community data client. No npm dependency: uses Supabase HTTP APIs.
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '')
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()
const sessionKey = 'runtime-community-session-v1'
export const communityReady = Boolean(url && publishableKey && /^https:\/\//.test(url))
export const COMMUNITY_BUCKET = 'community-uploads'

let activeSession = null
try {
  if (typeof window !== 'undefined') activeSession = JSON.parse(localStorage.getItem(sessionKey) || 'null')
} catch {
  activeSession = null
}
function persistSession(value) {
  activeSession = value
  try {
    if (value) localStorage.setItem(sessionKey, JSON.stringify(value))
    else localStorage.removeItem(sessionKey)
  } catch { /* Private browsing may disallow local storage */ }
}
export function communitySession() { return activeSession }
function config() {
  if (!communityReady) throw new Error('게시판 서버 연결을 먼저 완료해야 합니다.')
}
async function parseResponse(response) {
  const text = await response.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!response.ok) {
    const message = typeof data === 'object' && data
      ? data.msg || data.message || data.error_description || data.error || data.hint
      : String(data || '')
    throw new Error(message || '서버 요청에 실패했습니다. (' + response.status + ')')
  }
  return data
}
async function authRequest(path, body) {
  config()
  const r = await fetch(url + '/auth/v1/' + path, {
    method:'POST',
    headers:{'apikey':publishableKey,'Content-Type':'application/json'},
    body:JSON.stringify(body),
  })
  return parseResponse(r)
}
function saveAuth(data) {
  if (data?.access_token && data?.refresh_token) {
    persistSession({
      access_token:data.access_token,
      refresh_token:data.refresh_token,
      expires_at:Math.floor(Date.now()/1000) + (data.expires_in || 3600),
      user:data.user,
    })
  }
  return data
}
export async function communitySignUp(email,password) {
  const data = await authRequest('signup',{email,password})
  return saveAuth(data)
}
export async function communityLogin(email,password) {
  const data = await authRequest('token?grant_type=password',{email,password})
  return saveAuth(data)
}
export async function communityLogout() {
  const token = activeSession?.access_token
  persistSession(null)
  if (token && communityReady) {
    try {
      await fetch(url + '/auth/v1/logout', {
        method:'POST',
        headers:{apikey:publishableKey,Authorization:'Bearer ' + token},
      })
    } catch { /* Clear local session even if remote logout fails */ }
  }
}
async function currentToken() {
  config()
  if (!activeSession) return null
  if (activeSession.expires_at > Math.floor(Date.now()/1000)+90) return activeSession.access_token
  if (!activeSession.refresh_token) {persistSession(null);return null}
  try {
    const data=await authRequest('token?grant_type=refresh_token',{refresh_token:activeSession.refresh_token})
    saveAuth(data)
    return data.access_token
  } catch {
    persistSession(null)
    return null
  }
}
async function request(path,{method='GET',body,authRequired=false,headers={}}={}) {
  config()
  const token = await currentToken()
  if (authRequired && !token) throw new Error('로그인 후 이용해 주세요.')
  const response = await fetch(url + path,{
    method,
    headers:{
      apikey:publishableKey,
      ...(token ? {Authorization:'Bearer '+token} : {}),
      ...(body!==undefined && !(body instanceof Blob) ? {'Content-Type':'application/json'} : {}),
      ...headers,
    },
    ...(body!==undefined ? {body:body instanceof Blob ? body : JSON.stringify(body)} : {}),
  })
  return parseResponse(response)
}
export async function communityPosts() {
  const query='?select=*&order=created_at.desc&limit=150'
  const rows=await request('/rest/v1/community_posts'+query)
  return Array.isArray(rows) ? rows : []
}
export async function communitySavePost(values, attachments=[]) {
  const token=await currentToken()
  const user=activeSession?.user
  if (!token || !user?.id) throw new Error('로그인이 만료됐습니다. 다시 로그인해 주세요.')
  const needsReview=values.category==='수상·소식'||Boolean(values.award?.trim())
  const payload={
    author_id:user.id,
    title:values.title.trim(),
    category:values.category,
    event_date:values.event_date,
    team:values.team.trim(),
    summary:values.summary.trim(),
    body:values.body.trim(),
    award:values.award.trim(),
    status:needsReview?'pending':'approved',
  }
  const created=await request('/rest/v1/community_posts?select=*',{
    method:'POST', authRequired:true, body:payload,
    headers:{Prefer:'return=representation'},
  })
  const post=Array.isArray(created)?created[0]:null
  if(!post?.id)throw new Error('글 저장 결과를 확인할 수 없습니다.')
  let uploaded=[]
  try {
    for(const file of attachments){
      const p=await uploadFile(user.id,post.id,file)
      uploaded.push({path:p, name:file.name, mime:file.type, size:file.size})
    }
    if(uploaded.length){
      const cover=uploaded.find((file)=>file.mime.startsWith('image/'))
      await request('/rest/v1/community_posts?id=eq.'+encodeURIComponent(post.id),{
        method:'PATCH',authRequired:true,
        body:{attachments:uploaded, cover_path:cover?.path||null},
        headers:{Prefer:'return=minimal'},
      })
    }
  } catch(error) {
    throw new Error('글은 저장됐지만 첨부파일을 처리하지 못했습니다: '+error.message)
  }
  return {post,needsReview}
}
export async function communityRemovePost(post) {
  await request('/rest/v1/community_posts?id=eq.'+encodeURIComponent(post.id),{
    method:'DELETE',authRequired:true,headers:{Prefer:'return=minimal'},
  })
  // Storage cleanup is best-effort; policy permits deleting only uploads belonging to the user.
  const files=Array.isArray(post.attachments)?post.attachments:[]
  for(const entry of files){
    if(entry?.path){
      try {
        await request('/storage/v1/object/'+COMMUNITY_BUCKET+'/'+entry.path,{method:'DELETE',authRequired:true})
      } catch { /* Orphaned upload can be removed by site owner */ }
    }
  }
}
const allowedExtensions=['jpg','jpeg','png','webp','gif','pdf','ppt','pptx','doc','docx','zip','csv','xlsx']
export function validateUpload(file) {
  const extension=file.name.split('.').pop().toLowerCase()
  if(!allowedExtensions.includes(extension))throw new Error('허용되지 않은 파일 형식: '+file.name)
  if(file.size>8*1024*1024)throw new Error('파일은 개당 8MB 이하만 첨부할 수 있습니다.')
  if(file.size===0)throw new Error('빈 파일은 첨부할 수 없습니다.')
}
async function uploadFile(userId,postId,file){
  validateUpload(file)
  const ext=file.name.split('.').pop().toLowerCase()
  const filename=crypto.randomUUID()+'.'+ext
  const objectPath=userId+'/'+postId+'/'+filename
  const token=await currentToken()
  if(!token)throw new Error('로그인이 만료됐습니다.')
  const response=await fetch(url+'/storage/v1/object/'+COMMUNITY_BUCKET+'/'+objectPath,{
    method:'POST',
    headers:{
      apikey:publishableKey,
      Authorization:'Bearer '+token,
      'Content-Type':file.type||'application/octet-stream',
      'x-upsert':'false',
    },
    body:file,
  })
  await parseResponse(response)
  return objectPath
}
export function communityFileUrl(path) {
  if(!communityReady || typeof path!=='string' || !/^[a-zA-Z0-9/_.-]+$/.test(path))return ''
  return url+'/storage/v1/object/public/'+COMMUNITY_BUCKET+'/'+path
}
