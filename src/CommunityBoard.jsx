import React,{useEffect,useState} from 'react'
import './CommunityBoard.css'
import {
  communityReady, communitySession, communitySignUp, communityLogin,
  communityLogout, communityPosts, communitySavePost, communityRemovePost,
  communityFileUrl, validateUpload,
} from './lib/communityApi'

const CATEGORIES=['해커톤','경진대회','공모전','개발 프로젝트','수상·소식']
const EMPTY_FORM={title:'',category:'해커톤',event_date:'',team:'',summary:'',body:'',award:''}
const TYPE_TABS=[['all','전체 기록'],['projects','프로젝트·대회'],['awards','수상·소식']]

function shortDate(date) {
  if(typeof date!=='string')return ''
  return date.slice(0,10).replace(/-/g,'.')
}
function EmptyIcon({awards=false}) {
  return <svg className="cb-empty-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {awards?<>
      <path d="M15 8h18v13a9 9 0 0 1-18 0V8ZM15 12H8v5a9 9 0 0 0 8 9M33 12h7v5a9 9 0 0 1-8 9M24 30v7M16 39h16"/>
    </>:<>
      <path d="M5 15v-4a4 4 0 0 1 4-4h11l4 5h15a4 4 0 0 1 4 4v4M5 20h38l-4 18a4 4 0 0 1-4 3H11a4 4 0 0 1-4-3L5 20Z"/>
      <path d="m19 27-4 4 4 4m10-8 4 4-4 4"/>
    </>}
  </svg>
}
function PostPreview({form,files}) {
  return <section className="cb-preview" aria-label="게시글 미리보기">
    <span className="cb-eyebrow">LIVE PREVIEW</span>
    <div className="cb-preview-banner"><strong>Runtime;</strong><span>{form.category==='수상·소식'?'NEWS':'PROJECT LOG'}</span></div>
    <div className="cb-meta"><span>{form.category}</span><time>{shortDate(form.event_date)}</time></div>
    <h3>{form.title||'제목을 입력하세요'}</h3>
    <p className="cb-preview-summary">{form.summary||'게시물 요약이 여기에 표시됩니다.'}</p>
    {form.award.trim()&&<p className="cb-award">★ {form.award}</p>}
    {form.team&&<p className="cb-small"><b>참여 팀</b> {form.team}</p>}
    {form.body&&<p className="cb-description">{form.body}</p>}
    {files.length>0&&<div className="cb-files"><b>첨부할 파일</b>
      {files.map((file,index)=><span key={index}>{file.name} · {(file.size/1024/1024).toFixed(1)} MB</span>)}
    </div>}
  </section>
}

function CommunityEditor({onClose,onSaved}) {
  const [form,setForm]=useState(EMPTY_FORM)
  const [files,setFiles]=useState([])
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const update=(key,value)=>setForm((old)=>({...old,[key]:value}))
  const submit=async(event)=>{
    event.preventDefault()
    setError('')
    if(form.title.trim().length<3||form.summary.trim().length<3||form.body.trim().length<3){
      setError('제목, 요약, 본문은 각각 3자 이상 작성해 주세요.');return
    }
    try{
      if(files.length>5)throw new Error('첨부파일은 최대 5개까지 가능합니다.')
      files.forEach(validateUpload)
      setBusy(true)
      const result=await communitySavePost(form,files)
      onSaved(result.needsReview?
        '글을 저장했어요. 수상 관련 글은 확인 후 공개됩니다.':'글을 저장하고 공개했어요.')
      onClose()
    }catch(e){setError(e.message)}
    finally{setBusy(false)}
  }
  return <section className="cb-editor" id="community-write" aria-labelledby="community-editor-title">
    <div className="cb-editor-head"><div>
      <span className="cb-eyebrow">NEW POST / Runtime;</span>
      <h2 id="community-editor-title">활동 기록 작성하기</h2>
      <p>함께한 프로젝트를 소개하고 사진이나 자료를 올려보세요.</p>
    </div><button type="button" className="cb-close" onClick={onClose}>닫기 ×</button></div>
    <div className="cb-editor-grid">
      <form className="cb-form" onSubmit={submit}>
        <label>제목 <span aria-hidden="true">*</span><input required minLength={3} maxLength={120} value={form.title}
          placeholder="예: 데이터 분석 해커톤 참가 후기" onChange={(e)=>update('title',e.target.value)}/></label>
        <div className="cb-form-row">
          <label>분류 <span aria-hidden="true">*</span><select value={form.category} onChange={(e)=>update('category',e.target.value)}>
            {CATEGORIES.map(category=><option key={category}>{category}</option>)}
          </select></label>
          <label>활동 날짜 <span aria-hidden="true">*</span><input required type="date" value={form.event_date}
            onChange={(e)=>update('event_date',e.target.value)}/></label>
        </div>
        <label>참여 팀 · 부원 (선택)<input maxLength={120} value={form.team} onChange={(e)=>update('team',e.target.value)}
          placeholder="실명 공개 전에는 팀원 동의를 받아 주세요"/></label>
        <label>한 줄 요약 <span aria-hidden="true">*</span><textarea required minLength={3} maxLength={300} rows={2}
          value={form.summary} onChange={(e)=>update('summary',e.target.value)}
          placeholder="어떤 주제와 아이디어로 참가했나요?"/></label>
        <label>프로젝트 소개 · 후기 <span aria-hidden="true">*</span><textarea required minLength={3} maxLength={6000} rows={6}
          value={form.body} onChange={(e)=>update('body',e.target.value)}
          placeholder="아이디어, 구현 과정, 사용 기술, 배운 점을 자유롭게 적어 주세요."/></label>
        <label>수상 내용 (선택)<input maxLength={200} value={form.award}
          onChange={(e)=>update('award',e.target.value)} placeholder="수상 확인이 가능한 경우에만 입력해 주세요"/></label>
        <label>사진 · PDF · 발표자료 등 첨부
          <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.ppt,.pptx,.doc,.docx,.zip,.csv,.xlsx"
            onChange={(e)=>setFiles(Array.from(e.target.files||[]))}/>
          <small>최대 5개, 파일당 8MB · 공개해도 되는 자료만 첨부</small>
        </label>
        {(form.category==='수상·소식'||form.award.trim())&&
          <p className="cb-review-note">수상·소식 글은 확인을 거쳐 공개돼요. 내 글 목록에서는 검토 상태를 확인할 수 있습니다.</p>}
        {error&&<p role="alert" className="cb-error">{error}</p>}
        <div className="cb-submit-row">
          <button type="submit" className="cb-primary" disabled={busy}>{busy?'게시하는 중…':'글 저장 및 게시'}</button>
          <button type="button" className="cb-secondary" onClick={onClose} disabled={busy}>취소</button>
        </div>
      </form>
      <PostPreview form={form} files={files}/>
    </div>
  </section>
}
function AuthPanel({onSuccess}) {
  const [mode,setMode]=useState('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const handleSubmit=async(e)=>{
    e.preventDefault();setMessage('');setBusy(true)
    try{
      if(mode==='login'){
        await communityLogin(email.trim(),password)
        onSuccess('로그인했습니다. 글을 작성할 수 있어요.')
      }else{
        const data=await communitySignUp(email.trim(),password)
        if(data?.access_token){onSuccess('가입과 로그인이 완료됐어요.')}
        else setMessage('가입 신청을 받았어요. 이메일 인증 링크를 확인한 뒤 로그인해 주세요.')
      }
    }catch(error){setMessage(error.message)}
    finally{setBusy(false)}
  }
  return <div className="cb-auth" id="community-login">
    <div><h3>Runtime; 커뮤니티에 참여하기</h3>
      <p>이메일로 가입하거나 로그인하면 프로젝트 글을 직접 저장하고 게시할 수 있습니다.</p>
      <p className="cb-auth-note">방문자는 로그인 없이 공개된 글을 읽을 수 있어요.</p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="cb-auth-tabs">
        <button type="button" className={mode==='login'?'selected':''} onClick={()=>{setMode('login');setMessage('')}}>로그인</button>
        <button type="button" className={mode==='signup'?'selected':''} onClick={()=>{setMode('signup');setMessage('')}}>회원가입</button>
      </div>
      <label>이메일<input type="email" autoComplete="email" required value={email}
        placeholder="name@example.com" onChange={(e)=>setEmail(e.target.value)}/></label>
      <label>비밀번호<input type="password" required minLength={6}
        autoComplete={mode==='login'?'current-password':'new-password'} value={password}
        placeholder="6자 이상" onChange={(e)=>setPassword(e.target.value)}/></label>
      <button className="cb-primary" type="submit" disabled={busy}>{busy?'처리 중…':mode==='login'?'로그인':'이메일로 회원가입'}</button>
      {message&&<p className="cb-auth-message" role="status">{message}</p>}
    </form>
  </div>
}
function PostCard({post,owned,onDelete}) {
  const [open,setOpen]=useState(false)
  const cover=communityFileUrl(post.cover_path)
  const attachments=Array.isArray(post.attachments)?post.attachments:[]
  return <article className="cb-post-card">
    <div className="cb-post-cover">
      {cover ? <img src={cover} loading="lazy" alt={post.title+' 관련 사진'}/>:
        <div><span>Runtime;</span><b>{post.category==='수상·소식'?'NEWS':'PROJECT'}</b></div>}
    </div>
    <div className="cb-post-body">
      <div className="cb-meta"><span>{post.category}</span><time>{shortDate(post.event_date)}</time></div>
      {post.status!=='approved'&&<span className="cb-pending">{post.status==='rejected'?'보류':'검토 대기'}</span>}
      <h3>{post.title}</h3><p className="cb-post-summary">{post.summary}</p>
      {post.award&&<p className="cb-award">★ {post.award}</p>}
      <button className="cb-text-action" type="button" aria-expanded={open} onClick={()=>setOpen(!open)}>
        {open?'내용 접기 −':'자세히 보기 ↗'}</button>
      {open&&<div className="cb-post-detail">
        {post.team&&<p><b>팀</b> {post.team}</p>}
        <p className="cb-description">{post.body}</p>
        {attachments.length>0&&<div className="cb-files"><b>첨부자료</b>
          {attachments.map((entry,index)=>{const u=communityFileUrl(entry.path);return u&&
            <a key={index} href={u} target="_blank" rel="noopener noreferrer">↓ {entry.name||'첨부파일'}</a>})}
        </div>}
      </div>}
      {owned&&<button type="button" className="cb-delete" onClick={()=>onDelete(post)}>내 글 삭제</button>}
    </div>
  </article>
}
export function CommunityNews() {
  const [news,setNews]=useState([])
  useEffect(()=>{
    if(!communityReady)return
    let alive=true
    communityPosts().then((posts)=>{
      if(alive)setNews(posts.filter((p)=>p.category==='수상·소식'&&p.status==='approved').slice(0,3))
    }).catch(()=>{})
    return ()=>{alive=false}
  },[])
  if(!news.length)return null
  return <section className="container cb-home-news">
    <div className="cb-home-news-heading"><h2>Runtime; 소식</h2><a href="#/projects/awards">소식 전체 보기 →</a></div>
    {news.map((post)=><a href="#/projects/awards" className="cb-home-news-row" key={post.id}>
      <time>{shortDate(post.event_date)}</time><span>{post.title}</span><span aria-hidden="true">↗</span></a>)}
  </section>
}
export default function CommunityBoard({initialView=''}) {
  const [filter,setFilter]=useState(initialView==='awards'?'awards':'all')
  const [posts,setPosts]=useState([])
  const [session,setSession]=useState(()=>communitySession())
  const [busy,setBusy]=useState(false)
  const [notice,setNotice]=useState('')
  const [error,setError]=useState('')
  const [editor,setEditor]=useState(false)
  const [authOpen,setAuthOpen]=useState(false)
  const [search,setSearch]=useState('')
  const load=async()=>{
    if(!communityReady)return
    setBusy(true);setError('')
    try{setPosts(await communityPosts())}
    catch(e){setError('게시물을 불러오지 못했습니다: '+e.message)}
    finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]) // Initial fetch, then manual refresh after auth or editing.
  useEffect(()=>{
    if(initialView==='awards')setFilter('awards')
    else if(initialView==='archive')setFilter('all')
    if(initialView==='manage'){
      if(communityReady&&communitySession()?.user)setEditor(true)
      else setAuthOpen(true)
    }
  },[initialView])
  const onAuthSuccess=(message)=>{
    setNotice(message);setSession(communitySession());setAuthOpen(false);setEditor(true);load()
  }
  const signOut=async()=>{await communityLogout();setSession(null);setEditor(false);setNotice('로그아웃했습니다.');load()}
  const remove=async(post)=>{
    if(!window.confirm('이 게시물을 삭제할까요? 삭제 후 복구할 수 없습니다.'))return
    try{await communityRemovePost(post);setNotice('글을 삭제했습니다.');load()}
    catch(e){setError(e.message)}
  }
  const openComposer=()=>{setNotice(''); if(!communityReady)return; if(session?.user)setEditor(true);else setAuthOpen(true)}
  const visible=posts.filter((post)=>{
    if(filter==='awards'&&post.category!=='수상·소식')return false
    if(filter==='projects'&&post.category==='수상·소식')return false
    if(search&&!((post.title+' '+post.summary+' '+post.team).toLowerCase().includes(search.toLowerCase())))return false
    return true
  })
  return <>
    <section className="page-heading container"><div className="section-label"><span className="section-number">/04</span><span>프로젝트</span></div>
      <h1>함께 도전한 기록,<br/><em>함께 만든 결과.</em></h1>
      <p>해커톤과 경진대회의 아이디어, 작업 과정, 수상 소식까지 직접 남겨보세요.</p>
    </section>
    <section className="container cb-board">
      <div className="cb-top">
        <div><span className="cb-eyebrow">Runtime; COMMUNITY ARCHIVE</span><h2>프로젝트 & 소식</h2>
          <p>글을 직접 작성하고, 사진과 발표자료도 첨부할 수 있어요.</p></div>
        <div className="cb-top-actions">
          {session?.user?<button className="cb-account" type="button" onClick={signOut}>로그아웃</button>:null}
          <button className="cb-primary" type="button" disabled={!communityReady} onClick={openComposer}>+ 글쓰기</button>
        </div>
      </div>
      {!communityReady&&<div className="cb-setup" role="status">
        <b>실제 게시판 연결 준비 중</b>
        <p>작성 화면은 준비됐지만 데이터베이스 연결 정보가 아직 설정되지 않았습니다.
          서버 연결 전에는 글을 저장할 수 없어요. 저장소의 COMMUNITY_SETUP.md를 참고해 주세요.</p>
      </div>}
      {notice&&<p className="cb-notice" role="status">{notice}</p>}
      {error&&<p className="cb-error" role="alert">{error}</p>}
      {communityReady&&authOpen&&!session?.user&&<AuthPanel onSuccess={onAuthSuccess}/>}
      {communityReady&&editor&&session?.user&&<CommunityEditor
        onClose={()=>setEditor(false)} onSaved={(message)=>{setNotice(message);load()}}/>}
      <div className="cb-toolbar">
        <div className="cb-segments" role="group" aria-label="기록 분류">
          {TYPE_TABS.map(([value,label])=><button key={value} type="button"
            className={filter===value?'active':''} aria-pressed={filter===value}
            onClick={()=>setFilter(value)}>{label}</button>)}
        </div>
        <input className="cb-search" type="search" aria-label="게시물 검색" value={search}
          onChange={(e)=>setSearch(e.target.value)} placeholder="기록 검색"/>
      </div>
      {busy&&<p className="cb-loading">게시물 불러오는 중…</p>}
      {!busy&&visible.length>0?<div className="cb-card-grid">
        {visible.map((post)=><PostCard key={post.id} post={post} owned={session?.user?.id===post.author_id}
          onDelete={remove}/>)}
      </div>:!busy&&<div className="cb-empty">
        <EmptyIcon awards={filter==='awards'}/>
        <h3>{filter==='awards'?'첫 번째 수상 소식을 기다리고 있어요.':'첫 번째 활동 기록을 기다리고 있어요.'}</h3>
        <p>{search?'검색 결과가 없습니다. 다른 검색어를 입력해 보세요.':
          filter==='awards'?'실제로 확인된 대회 수상 기록을 이곳에서 만나볼 수 있어요.':
          '프로젝트 참여 후기와 결과물을 Runtime; 게시판에 남겨주세요.'}</p>
        {communityReady&&<button type="button" onClick={openComposer}>첫 글 작성하기 →</button>}
      </div>}
      <div className="cb-board-footnote">
        <b>게시 안내</b>
        <p>이메일 인증을 마친 사용자는 글을 직접 게시할 수 있습니다. 수상 소식은 운영진 검토 후 공개됩니다.
          게시물 작성자는 자신의 글을 삭제할 수 있고, 허위 정보·개인정보·무단 공유 자료는 게시하지 말아 주세요.</p>
      </div>
    </section>
  </>
}
