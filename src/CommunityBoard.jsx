import React, { useEffect, useState } from 'react'
import './CommunityBoard.css'
import {
  DEMO_POSTS_EVENT, getDemoPosts, saveDemoPost, deleteDemoPost,
  resetDemoPosts, loadSamplePosts, validateDemoFiles,
} from './lib/demoPosts'

const CATEGORIES = ['해커톤', '경진대회', '공모전', '개발 프로젝트', '수상·소식']
const TABS = [['all','전체 기록'], ['projects','프로젝트·대회'], ['awards','수상·소식']]
const EMPTY_FORM = {
  title: '', category: '해커톤', event_date: '', team: '',
  summary: '', body: '', award: '',
}
function prettyDate(value) {
  return (value || '').slice(0,10).replaceAll('-','.')
}
function ErrorMessage({message}) {
  return message ? <p className="cb-error" role="alert">{message}</p> : null
}
function EmptyIcon({awards}) {
  return <svg className="cb-empty-icon" viewBox="0 0 48 48" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    {awards ? <>
      <path d="M15 8h18v13a9 9 0 0 1-18 0V8ZM15 12H8v5a9 9 0 0 0 8 9M33 12h7v5a9 9 0 0 1-8 9M24 30v7M16 39h16"/>
    </> : <>
      <path d="M5 15v-4a4 4 0 0 1 4-4h11l4 5h15a4 4 0 0 1 4 4v4M5 20h38l-4 18a4 4 0 0 1-4 3H11a4 4 0 0 1-4-3L5 20Z"/>
      <path d="m19 27-4 4 4 4m10-8 4 4-4 4"/>
    </>}
  </svg>
}

function PostPreview({form,files,existing}) {
  return <aside className="cb-preview" aria-label="글 작성 실시간 미리보기">
    <span className="cb-eyebrow">LIVE PREVIEW · 시연 전용</span>
    <div className="cb-preview-banner"><strong>Runtime;</strong>
      <span>{form.category === '수상·소식' ? 'NEWS' : 'PROJECT LOG'}</span></div>
    <div className="cb-meta"><span>{form.category}</span><time>{prettyDate(form.event_date)}</time></div>
    <h3>{form.title || '제목을 입력해 보세요'}</h3>
    <p className="cb-preview-summary">{form.summary || '작성한 요약이 표시되는 자리입니다.'}</p>
    {form.award && <p className="cb-award">★ {form.award}</p>}
    {form.team && <p className="cb-small"><b>참여 팀</b> {form.team}</p>}
    {form.body && <p className="cb-description">{form.body}</p>}
    {(files.length > 0 || (existing?.attachments?.length && files.length === 0)) && <div className="cb-files">
      <b>첨부파일</b>
      {(files.length ? files : existing.attachments).map((file,index) =>
        <span key={index}>{file.name} · {(file.size/1024/1024).toFixed(2)}MB</span>)}
    </div>}
  </aside>
}

function DemoEditor({initial, onCancel, onSaved}) {
  const [form,setForm] = useState(() => initial
    ? Object.fromEntries(Object.keys(EMPTY_FORM).map((key)=>[key,initial[key] || '']))
    : {...EMPTY_FORM, event_date:new Date().toLocaleDateString('en-CA')})
  const [files,setFiles] = useState([])
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const update = (key,value) => setForm((old)=>({...old,[key]:value}))
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.title.trim().length < 3 || form.summary.trim().length < 3 || form.body.trim().length < 3) {
      setError('제목, 요약, 본문을 각각 3자 이상 입력해 주세요.')
      return
    }
    try {
      validateDemoFiles(files)
      setBusy(true)
      await saveDemoPost(form,files,initial)
      onSaved(initial ? '수정한 내용이 이 브라우저에 저장됐어요.' : '글이 이 브라우저에 저장됐어요. 새로고침해도 유지됩니다.')
    } catch (e) {
      setError(e.message || '게시물을 저장하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }
  return <section className="cb-editor" id="community-write" aria-labelledby="demo-editor-title">
    <div className="cb-editor-head">
      <div>
        <span className="cb-eyebrow">DEMO EDITOR / LOCAL SAVE</span>
        <h2 id="demo-editor-title">{initial ? '게시물 수정' : '새 활동 기록 작성'}</h2>
        <p>입력 내용은 오른쪽에서 확인하고, 저장하면 이 브라우저의 게시판에 반영돼요.</p>
      </div>
      <button className="cb-close" type="button" onClick={onCancel} disabled={busy}>닫기 ×</button>
    </div>
    <div className="cb-editor-grid">
      <form className="cb-form" onSubmit={submit}>
        <label>제목 <span aria-hidden="true">*</span>
          <input required minLength={3} maxLength={120} value={form.title}
            placeholder="예: Python 데이터 분석 프로젝트"
            onChange={(e)=>update('title',e.target.value)}/></label>
        <div className="cb-form-row">
          <label>분류 <span aria-hidden="true">*</span>
            <select value={form.category} onChange={(e)=>update('category',e.target.value)}>
              {CATEGORIES.map((category)=><option key={category}>{category}</option>)}
            </select>
          </label>
          <label>활동 날짜 <span aria-hidden="true">*</span>
            <input type="date" required value={form.event_date}
              onChange={(e)=>update('event_date',e.target.value)}/></label>
        </div>
        <label>참여 팀 (선택)
          <input maxLength={120} value={form.team}
            onChange={(e)=>update('team',e.target.value)} placeholder="예: Runtime; 팀 A"/></label>
        <label>한 줄 요약 <span aria-hidden="true">*</span>
          <textarea required minLength={3} maxLength={300} rows={2} value={form.summary}
            onChange={(e)=>update('summary',e.target.value)}
            placeholder="어떤 문제를 해결하려고 했나요?"/></label>
        <label>아이디어 · 진행 과정 · 후기 <span aria-hidden="true">*</span>
          <textarea required minLength={3} maxLength={6000} rows={6} value={form.body}
            onChange={(e)=>update('body',e.target.value)} placeholder="무엇을 만들고 배웠는지 소개해 보세요."/></label>
        <label>수상 내역 (선택)
          <input maxLength={200} value={form.award}
            onChange={(e)=>update('award',e.target.value)} placeholder="발표 시연이라면 [시연 예시]라고 명시해 주세요."/></label>
        <label>사진 · PDF · 발표자료 등 첨부
          <input type="file" multiple
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.ppt,.pptx,.doc,.docx,.zip,.csv,.xlsx,.txt"
            onChange={(e)=>{setFiles(Array.from(e.target.files || []));setError('')}} />
          <small>최대 5개 · 파일당 15MB 이하 · 이 브라우저에만 저장됩니다.</small>
        </label>
        {initial?.attachments?.length > 0 && files.length === 0 &&
          <p className="cb-review-note">기존 첨부파일 {initial.attachments.length}개는 유지돼요. 새 파일을 선택하면 교체됩니다.</p>}
        <ErrorMessage message={error}/>
        <div className="cb-submit-row">
          <button type="submit" className="cb-primary" disabled={busy}>{busy?'저장 중…':'이 브라우저에 저장'}</button>
          <button type="button" className="cb-secondary" onClick={onCancel} disabled={busy}>취소</button>
        </div>
      </form>
      <PostPreview form={form} files={files} existing={initial}/>
    </div>
  </section>
}

function DemoPostCard({post,onEdit,onDelete}) {
  const [expanded,setExpanded] = useState(false)
  const [links,setLinks] = useState([])
  useEffect(() => {
    const entries = (post.attachments || []).map((entry) => ({
      ...entry, url:URL.createObjectURL(entry.blob),
    }))
    setLinks(entries)
    return ()=>entries.forEach((item)=>URL.revokeObjectURL(item.url))
  },[post])
  const cover = links.find((entry)=>entry.type.startsWith('image/'))
  return <article className="cb-post-card">
    <div className="cb-post-cover">
      {cover
        ? <img src={cover.url} loading="lazy" alt={post.title+' 사진'} />
        : <div><span>Runtime;</span><b>{post.category==='수상·소식'?'NEWS':'PROJECT'}</b></div>}
    </div>
    <div className="cb-post-body">
      <div className="cb-meta"><span>{post.category}</span><time>{prettyDate(post.event_date)}</time></div>
      <span className="cb-demo-tag">{post.sample?'샘플 콘텐츠':'이 브라우저에 저장된 글'}</span>
      <h3>{post.title}</h3>
      <p className="cb-post-summary">{post.summary}</p>
      {post.award && <p className="cb-award">★ {post.award}</p>}
      <button className="cb-text-action" type="button" aria-expanded={expanded}
        onClick={()=>setExpanded(!expanded)}>{expanded?'내용 접기 −':'자세히 보기 ↗'}</button>
      {expanded && <div className="cb-post-detail">
        {post.team && <p><b>팀</b> {post.team}</p>}
        <p className="cb-description">{post.body}</p>
        {links.length > 0 && <div className="cb-files">
          <b>첨부자료</b>
          {links.map((entry)=>
            <a key={entry.id} href={entry.url} download={entry.name}>↓ {entry.name} ({(entry.size/1024/1024).toFixed(2)}MB)</a>)}
        </div>}
      </div>}
      <div className="cb-post-actions">
        <button type="button" onClick={()=>onEdit(post)}>수정</button>
        <button type="button" onClick={()=>onDelete(post.id)}>삭제</button>
      </div>
    </div>
  </article>
}

function useDemoPostList() {
  const [posts,setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  const refresh = async () => {
    try {
      setError('')
      setPosts(await getDemoPosts())
    } catch(e) {
      setError(e.message || '로컬 게시물을 읽지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    refresh()
    window.addEventListener(DEMO_POSTS_EVENT,refresh)
    return () => window.removeEventListener(DEMO_POSTS_EVENT,refresh)
  },[])
  return {posts,loading,error,refresh}
}

export function CommunityNews() {
  const {posts} = useDemoPostList()
  const news = posts.filter((post)=>post.category==='수상·소식').slice(0,3)
  if(!news.length)return null
  return <section className="container cb-home-news">
    <div className="cb-home-news-heading">
      <div><h2>Runtime; 소식</h2><small>이 브라우저에서만 보이는 시연용 기록</small></div>
      <a href="#/projects/awards">모든 소식 보기 →</a>
    </div>
    {news.map((post)=><a href="#/projects/awards" className="cb-home-news-row" key={post.id}>
      <time>{prettyDate(post.event_date)}</time><span>{post.title}</span><span aria-hidden="true">↗</span>
    </a>)}
  </section>
}

export default function CommunityBoard({initialView=''}) {
  const {posts,loading,error,refresh} = useDemoPostList()
  const [filter,setFilter] = useState(initialView==='awards'?'awards':'all')
  const [search,setSearch] = useState('')
  const [editor,setEditor] = useState(false)
  const [editing,setEditing] = useState(null)
  const [notice,setNotice] = useState('')
  const [actionError,setActionError] = useState('')
  const [working,setWorking] = useState(false)
  useEffect(() => {
    if(initialView==='awards')setFilter('awards')
    if(initialView==='archive')setFilter('all')
    if(initialView==='manage')setEditor(true)
  },[initialView])

  const openEditor = (post=null) => {
    setEditing(post)
    setEditor(true)
    setNotice('')
    setActionError('')
    setTimeout(()=>document.getElementById('community-write')?.scrollIntoView({behavior:'smooth',block:'start'}),0)
  }
  const closeEditor = () => {setEditor(false);setEditing(null)}
  const afterSave = (message) => {
    setNotice(message)
    closeEditor()
    refresh()
  }
  const remove = async (id) => {
    if(!window.confirm('이 시연용 게시물을 삭제할까요?'))return
    try {
      await deleteDemoPost(id)
      setNotice('글을 삭제했어요.')
      refresh()
    }catch(e){setActionError(e.message)}
  }
  const insertSamples = async () => {
    try {
      setWorking(true)
      await loadSamplePosts()
      await refresh()
      setNotice('시연용 가상 게시물 3개를 불러왔어요. 실제 동아리 실적이 아닙니다.')
    }catch(e){setActionError(e.message)}
    finally{setWorking(false)}
  }
  const clearAll = async () => {
    if(!window.confirm('이 브라우저에 저장된 시연용 글과 첨부파일을 모두 삭제할까요?'))return
    try{
      setWorking(true)
      await resetDemoPosts()
      await refresh()
      closeEditor()
      setNotice('시연 데이터가 초기화됐어요.')
    }catch(e){setActionError(e.message)}
    finally{setWorking(false)}
  }
  const visible = posts.filter((post)=>{
    if(filter==='awards'&&post.category!=='수상·소식')return false
    if(filter==='projects'&&post.category==='수상·소식')return false
    return !search || [post.title,post.summary,post.team,post.category]
      .join(' ').toLowerCase().includes(search.toLowerCase())
  })
  return <>
    <section className="page-heading container">
      <div className="section-label"><span className="section-number">/04</span><span>프로젝트</span></div>
      <h1>함께 도전한 기록,<br/><em>함께 만든 결과.</em></h1>
      <p>글 작성부터 사진·자료 첨부, 검색과 수상 소식까지 발표에서 직접 시연해 보세요.</p>
    </section>
    <section className="container cb-board">
      <div className="cb-top">
        <div>
          <span className="cb-eyebrow">Runtime; COMMUNITY ARCHIVE</span>
          <h2>프로젝트 & 소식</h2>
          <p>동아리 부원들의 활동 기록을 모아보는 게시판입니다.</p>
        </div>
        <div className="cb-top-actions">
          <button type="button" className="cb-primary" onClick={()=>openEditor()}>+ 글쓰기</button>
        </div>
      </div>
      <div className="cb-demo-notice" role="note">
        <strong>발표용 데모</strong>
        <span>로그인·서버·비용 없이 작동해요. 글과 첨부파일은 현재 브라우저에만 저장되며 다른 사람에게 공유되지 않습니다.</span>
      </div>
      {notice && <p className="cb-notice" role="status">{notice}</p>}
      <ErrorMessage message={error || actionError}/>
      {editor && <DemoEditor key={editing?.id || 'new'} initial={editing}
        onCancel={closeEditor} onSaved={afterSave}/>}
      <div className="cb-toolbar">
        <div className="cb-segments" role="group" aria-label="게시물 필터">
          {TABS.map(([value,label])=><button type="button" key={value}
            className={filter===value?'active':''} aria-pressed={filter===value}
            onClick={()=>setFilter(value)}>{label}</button>)}
        </div>
        <input className="cb-search" type="search" aria-label="게시물 검색"
          value={search} placeholder="기록 검색" onChange={(e)=>setSearch(e.target.value)}/>
      </div>
      {loading ? <p className="cb-loading">로컬 게시물을 불러오는 중…</p>
        : visible.length>0 ? <div className="cb-card-grid">
          {visible.map((post)=><DemoPostCard key={post.id} post={post}
            onEdit={openEditor} onDelete={remove}/>)}
        </div> : <div className="cb-empty">
          <EmptyIcon awards={filter==='awards'} />
          <h3>{filter==='awards'?'수상·소식 게시물이 아직 없어요.':'아직 작성한 프로젝트 기록이 없어요.'}</h3>
          <p>{search ? '검색 결과가 없어요. 다른 검색어를 입력해 보세요.'
            : '직접 글을 작성하거나 아래 시연 예시를 불러와 기능을 확인할 수 있어요.'}</p>
          <button type="button" onClick={()=>openEditor()}>첫 글 작성하기 →</button>
        </div>}
      <div className="cb-demo-controls">
        <div><b>시연 도구</b><p>발표할 때 샘플 게시물을 넣거나 초기화할 수 있어요.</p></div>
        <div>
          <button className="cb-secondary" type="button" disabled={working} onClick={insertSamples}>예시 3건 불러오기</button>
          <button className="cb-secondary cb-reset" type="button" disabled={working} onClick={clearAll}>시연 데이터 초기화</button>
        </div>
      </div>
      <div className="cb-board-footnote"><b>참고</b>
        <p>본 게시판은 브라우저 안에서 동작하는 시연 버전입니다. 실제로 동아리 모든 부원이 같은 글을 보거나
          회원 인증을 하려면 추후 별도 서버·데이터베이스 연결이 필요합니다.</p>
      </div>
    </section>
  </>
}
