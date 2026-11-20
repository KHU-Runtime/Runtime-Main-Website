import React, { useEffect, useState } from 'react'
import './App.css'

const INSTAGRAM = 'https://www.instagram.com/khu_runtime/'
const GITHUB = 'https://github.com/KHU-Runtime/Runtime-Main-Website'

const NAV = [
  { id: 'home', label: '홈' },
  { id: 'about', label: '동아리 소개', children: [
    { label: '런타임 소개', section: 'overview' },
    { label: '활동 방식', section: 'process' },
  ] },
  { id: 'activities', label: '주요 활동', children: [
    { label: '세미나 · 스터디', section: 'seminars' },
    { label: '개발 · 협업 활동', section: 'collaboration' },
  ] },
  { id: 'projects', label: '프로젝트', children: [
    { label: '프로젝트 아카이브', section: 'archive' },
    { label: '기록 안내', section: 'recording' },
  ] },
  { id: 'study', label: '스터디룸', children: [
    { label: '세미나 복습', section: 'notes' },
    { label: '미니 퀴즈', section: 'quiz' },
    { label: '학습자료', section: 'resources' },
  ] },
  { id: 'join', label: '지원 안내', children: [
    { label: '모집 안내', section: 'guide' },
    { label: '자주 묻는 질문', section: 'faq' },
  ] },
]

const ACTIVITY_LIST = [
  {
    n: '01', tag: 'LEARN', title: '언어 세미나',
    description: 'Python, R 등 프로그래밍 언어의 개념을 함께 익히고 직접 코드를 작성합니다.',
    detail: '프로그래밍 기초 · 실습 · 코드 리뷰',
  },
  {
    n: '02', tag: 'STUDY', title: '함께하는 스터디',
    description: '데이터 관련 자격증과 관심 주제를 정해 공부하고, 서로의 학습 과정을 공유합니다.',
    detail: '데이터 활용 · 자격증 · 스터디 자료',
  },
  {
    n: '03', tag: 'BUILD', title: '실전 개발',
    description: '배운 내용을 직접 활용해 웹사이트와 작은 프로그램을 만드는 경험을 쌓습니다.',
    detail: '웹 개발 · 미니 프로젝트 · 협업',
  },
  {
    n: '04', tag: 'CHALLENGE', title: '대회와 공모전',
    description: '팀을 이루어 공모전, 경진대회, 해커톤에 참여하며 아이디어를 구체화합니다.',
    detail: '문제 정의 · 팀 프로젝트 · 결과 공유',
  },
]

const NOTES = [
  {
    title: 'Python · 반복문 복습', label: 'PYTHON / SAMPLE',
    summary: 'for 문은 시퀀스의 요소를 순회하고, range()는 정수 범위를 만듭니다.',
    code: `for i in range(3):\n    print(i)\n\n# 0, 1, 2가 차례로 출력됩니다.`,
    takeaway: 'range(3)은 0, 1, 2를 생성하며 끝값 3은 포함하지 않습니다.',
  },
  {
    title: 'R · 데이터 프레임 복습', label: 'R / SAMPLE',
    summary: 'data.frame()으로 열 단위 데이터를 구성하고, $로 특정 열을 참조할 수 있습니다.',
    code: `scores <- data.frame(\n  name = c("A", "B", "C"),\n  score = c(90, 85, 95)\n)\nmean(scores$score)`,
    takeaway: 'mean(scores$score)은 score 열의 산술평균 90을 반환합니다.',
  },
  {
    title: '데이터 · 결측치 확인하기', label: 'DATA / SAMPLE',
    summary: '데이터 분석을 시작할 때 결측치를 확인하면 전처리 방향을 결정하는 데 도움이 됩니다.',
    code: `import pandas as pd\n\ndf = pd.DataFrame({"value": [1, None, 3]})\nprint(df.isna().sum())`,
    takeaway: 'isna().sum()을 이용하면 열별 결측치 개수를 확인할 수 있습니다.',
  },
]

const QUESTIONS = [
  {
    tag: 'PYTHON · 기초', question: '다음 코드의 출력 결과는 무엇일까요?', code: 'print(len([10, 20, 30]))',
    choices: ['2', '3', '30', '오류 발생'], answer: 1,
    explanation: 'len()은 리스트에 담긴 요소의 개수를 반환하므로 정답은 3입니다.',
  },
  {
    tag: 'PYTHON · 반복문', question: 'range(4)를 순회했을 때 마지막 값은 무엇일까요?', code: 'for i in range(4):\n    print(i)',
    choices: ['2', '3', '4', '5'], answer: 1,
    explanation: 'range(4)는 0부터 3까지의 정수를 생성합니다. 끝값 4는 포함되지 않습니다.',
  },
  {
    tag: 'R · 데이터 분석', question: 'R에서 수치형 벡터의 평균을 구하는 함수는?', code: 'x <- c(2, 4, 6)',
    choices: ['avg(x)', 'sum(x)', 'mean(x)', 'length(x)'], answer: 2,
    explanation: 'R에서는 mean(x) 함수를 사용해 수치형 벡터의 평균을 구합니다.',
  },
  {
    tag: 'DATA · 전처리', question: 'pandas에서 결측치 여부를 확인하는 메서드는?', code: 'df = pd.DataFrame({"a": [1, None]})',
    choices: ['df.sort_values()', 'df.isna()', 'df.head()', 'df.drop_duplicates()'], answer: 1,
    explanation: 'isna()는 각 데이터가 결측치인지 여부를 불리언 값으로 반환합니다.',
  },
]

function currentLocation() {
  const [path, section = ''] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { page: NAV.some((item) => item.id === path) ? path : 'home', section }
}

function Brand({ onNavigate }) {
  return (
    <a className="brand" href="#/home" onClick={onNavigate} aria-label="RUNTIME 홈으로 이동">
      <span className="brand-symbol" aria-hidden="true"><span>R</span><span className="brand-dot" /></span>
      <span className="brand-text"><strong>RUNTIME</strong><small>KYUNG HEE UNIVERSITY</small></span>
    </a>
  )
}

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [desktopOpen, setDesktopOpen] = useState(null)
  useEffect(() => { setMenuOpen(false); setExpanded(null); setDesktopOpen(null) }, [page])
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') { setDesktopOpen(null); setMenuOpen(false); setExpanded(null) }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand onNavigate={() => { setMenuOpen(false); setDesktopOpen(null) }} />
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <div
              key={item.id}
              className={'nav-item ' + (page === item.id ? 'is-current' : '')}
              onMouseEnter={() => setDesktopOpen(item.children ? item.id : null)}
              onMouseLeave={() => setDesktopOpen(null)}
              onFocus={() => setDesktopOpen(item.children ? item.id : null)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDesktopOpen(null) }}
            >
              <a className="nav-link" href={'#/' + item.id} aria-current={page === item.id ? 'page' : undefined} onClick={() => setDesktopOpen(null)}>{item.label}</a>
              {item.children && <button className="nav-chevron" type="button" aria-expanded={desktopOpen === item.id} aria-controls={'dropdown-' + item.id} aria-label={item.label + ' 하위 메뉴 펼치기'} onClick={() => setDesktopOpen(desktopOpen === item.id ? null : item.id)}>⌄</button>}
              {item.children && desktopOpen === item.id && <div className="dropdown-panel" id={'dropdown-' + item.id}>
                {item.children.map((child) => <a key={child.section} href={'#/' + item.id + '/' + child.section} onClick={() => setDesktopOpen(null)}>{child.label}</a>)}
              </div>}
            </div>
          ))}
        </nav>
        <a className="header-social" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        <button type="button" className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'} aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="모바일 주요 메뉴">
          {NAV.map((item) => <div className="mobile-nav-group" key={item.id}>
            <div className="mobile-nav-row">
              <a href={'#/' + item.id} onClick={() => setMenuOpen(false)} aria-current={page === item.id ? 'page' : undefined}>{item.label}</a>
              {item.children && <button type="button" aria-expanded={expanded === item.id} aria-controls={'mobile-sub-' + item.id} onClick={() => setExpanded(expanded === item.id ? null : item.id)} aria-label={item.label + ' 하위 메뉴'}>{expanded === item.id ? '−' : '+'}</button>}
            </div>
            {item.children && expanded === item.id && <div className="mobile-nav-sub" id={'mobile-sub-' + item.id}>
              {item.children.map((child) => <a href={'#/' + item.id + '/' + child.section} key={child.section} onClick={() => setMenuOpen(false)}>{child.label}</a>)}
            </div>}
          </div>)}
          <a className="mobile-instagram" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">공식 인스타그램 ↗</a>
        </nav>
      )}
    </header>
  )
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span className="section-number">/{number}</span><span>{children}</span></div>
}

function TextLink({ to, children, white = false }) {
  return <a href={`#/${to}`} className={`text-link ${white ? 'text-link-white' : ''}`}>{children}<span aria-hidden="true">↗</span></a>
}

function Home() {
  return <>
    <section className="home-hero container">
      <div className="hero-copy">
        <p className="eyebrow">경희대학교 이과대학 코딩 동아리</p>
        <h1>코드를 배우고,<br /><em>함께 만들어갑니다.</em></h1>
        <p className="hero-description">RUNTIME은 Python과 R을 함께 공부하고, 데이터 스터디와 개발 실습을 통해 배운 것을 직접 활용하는 동아리입니다.</p>
        <div className="hero-buttons">
          <a href="#/activities/seminars" className="button button-primary">주요 활동 살펴보기 <span aria-hidden="true">→</span></a>
          <a href="#/join/guide" className="button button-outline">지원 안내 <span aria-hidden="true">↗</span></a>
        </div>
        <p className="hero-keywords">PYTHON <span>·</span> R <span>·</span> DATA <span>·</span> PROJECTS</p>
      </div>
      <aside className="hero-brief" aria-label="런타임 주요 활동 요약">
        <div className="brief-top"><strong>RUNTIME</strong><span>경희대학교 이과대학</span></div>
        <div className="brief-lead"><span>WHAT WE DO</span><h2>배움에서<br />실전으로.</h2><p>세미나와 스터디에서 시작해 팀 프로젝트와 대회 참여로 경험을 넓힙니다.</p></div>
        <div className="brief-item"><span>01</span><strong>프로그래밍 세미나</strong><small>Python · R</small></div>
        <div className="brief-item"><span>02</span><strong>데이터 · 자격증 스터디</strong><small>함께 공부하기</small></div>
        <div className="brief-item"><span>03</span><strong>프로젝트 · 대회 참여</strong><small>직접 구현하기</small></div>
      </aside>
    </section>
    <section className="container home-pillars">
      <div className="pillars-heading"><SectionLabel number="01">주요 활동</SectionLabel><h2>런타임에서는 무엇을 하나요?</h2></div>
      <div className="pillars-grid">
        <div><span className="pillar-index">01</span><h3>프로그래밍 세미나</h3><p>Python과 R의 기초 개념을 배우고 직접 코드를 작성합니다.</p></div>
        <div><span className="pillar-index">02</span><h3>스터디와 실습</h3><p>데이터 관련 자격증을 공부하고 배운 내용으로 실습합니다.</p></div>
        <div><span className="pillar-index">03</span><h3>팀 프로젝트</h3><p>공모전과 해커톤에 팀을 이루어 도전하고 경험을 공유합니다.</p></div>
      </div>
      <TextLink to="activities">전체 활동 보기</TextLink>
    </section>
    <section className="container home-directory">
      <div className="directory-item"><div><SectionLabel number="02">프로젝트</SectionLabel><h2>팀이 함께 만든 결과물</h2><p>아이디어, 사용한 기술, 구현 과정과 대회 참여 기록을 차곡차곡 모읍니다.</p></div><TextLink to="projects">프로젝트 보기</TextLink></div>
      <div className="directory-item"><div><SectionLabel number="03">스터디룸</SectionLabel><h2>세미나 복습과 미니 퀴즈</h2><p>배운 내용을 다시 읽고, 간단한 문제를 풀고, 공식 자료를 찾아볼 수 있습니다.</p></div><TextLink to="study">스터디룸 들어가기</TextLink></div>
    </section>
    <section className="home-cta"><div className="container home-cta-inner"><div><SectionLabel number="04">지원 안내</SectionLabel><h2>런타임의 활동이 궁금하다면?</h2><p>모집 일정과 자세한 안내는 공식 인스타그램에서 확인할 수 있습니다.</p></div><TextLink to="join">지원 안내 보기</TextLink></div></section>
  </>
}

function PageHeading({ number, eyebrow, title, description }) {
  return <div className="page-heading container"><SectionLabel number={number}>{eyebrow}</SectionLabel><h1>{title}</h1><p>{description}</p></div>
}

function About() {
  return <>
    <PageHeading number="02" eyebrow="동아리 소개" title={<>런타임을<br /><em>소개합니다.</em></>} description="런타임은 프로그래밍 언어를 공부하는 데서 멈추지 않고, 학습한 기술을 실제 결과물로 연결하는 코딩 동아리입니다." />
    <section id="overview" className="container about-overview"><div className="about-aside">RUNTIME IS<br /><span>MORE THAN<br />A STUDY.</span></div><div className="about-content"><h2>배움의 다음 단계를 향해.</h2><p>코딩에 대한 관심에서 출발해 세미나와 스터디로 지식을 쌓고, 실습과 팀 활동으로 직접 구현해 보는 경험을 중요하게 생각합니다. 서로의 아이디어를 나누고 함께 문제를 해결하는 과정 역시 런타임의 활동입니다.</p><div className="about-tags"><span>PROGRAMMING</span><span>DATA</span><span>COLLABORATION</span></div></div></section>
    <section id="process" className="about-steps"><div className="container"><SectionLabel number="02.1">HOW WE GROW</SectionLabel><h2>런타임의 학습 사이클</h2><div className="step-grid"><div><span>01</span><h3>Learn</h3><p>세미나와 스터디에서 배우기</p></div><div><span>02</span><h3>Practice</h3><p>작은 문제를 직접 해결하기</p></div><div><span>03</span><h3>Build</h3><p>아이디어를 프로젝트로 구현하기</p></div><div><span>04</span><h3>Share</h3><p>결과와 시행착오를 나누기</p></div></div></div></section>
    <section className="container about-cta"><h2>런타임이 어떤 활동을 하는지<br />조금 더 궁금해졌나요?</h2><TextLink to="activities">활동 확인하기</TextLink></section>
  </>
}

function Activities() {
  return <>
    <PageHeading number="03" eyebrow="주요 활동" title={<>세미나부터 프로젝트까지,<br /><em>런타임의 활동</em></>} description="세미나와 스터디로 익힌 지식을 실제 개발과 팀 활동에 적용해 봅니다." />
    <section id="seminars" className="container activity-list" aria-label="런타임 주요 활동">
      {ACTIVITY_LIST.map((activity) => <article className="activity-row" key={activity.n}><div className="activity-no">{activity.n} <span>↗</span></div><div><span className="activity-tag">{activity.tag}</span><h2>{activity.title}</h2></div><div className="activity-body"><p>{activity.description}</p><small>{activity.detail}</small></div></article>)}
    </section>
    <section id="collaboration" className="container activity-bottom"><div><SectionLabel number="03.1">AFTER LEARNING</SectionLabel><h2>이제 배운 것을<br />직접 만들어볼 차례.</h2></div><div><p>같은 관심사를 가진 부원들과 팀을 이루고, 각자의 아이디어를 실제 프로젝트로 발전시킬 수 있습니다.</p><TextLink to="projects">프로젝트 살펴보기</TextLink></div></section>
  </>
}

function Projects() {
  return <>
    <PageHeading number="04" eyebrow="프로젝트" title={<>프로젝트와<br /><em>대회 참여 기록</em></>} description="팀을 이루어 참여한 공모전, 경진대회, 해커톤의 아이디어와 구현 과정을 기록하는 공간입니다." />
    <section id="archive" className="container project-section">
      <div className="project-topline"><div><SectionLabel number="04.1">프로젝트 아카이브</SectionLabel><h2>런타임의 활동 기록</h2></div></div>
      <div className="archive-placeholder">
        <span className="archive-status">프로젝트 기록 준비 중</span>
        <h3>이곳에 실제 프로젝트가 소개됩니다.</h3>
        <p>현재 공개된 프로젝트·수상 자료가 없어 가상의 실적을 대신 게시하지 않았습니다. 동아리에서 확인한 활동 자료부터 차례로 채워갈 예정입니다.</p>
      </div>
      <div className="archive-guideline" id="recording">
        <h3>앞으로 기록할 내용</h3>
        <div><span>01</span><p>대회 및 프로젝트 이름 · 참여 시기</p></div>
        <div><span>02</span><p>팀의 아이디어와 해결하려는 문제</p></div>
        <div><span>03</span><p>사용 기술과 구현 결과</p></div>
        <div><span>04</span><p>수상 내역 또는 참가 후기 (확인된 경우)</p></div>
      </div>
    </section>
  </>
}

function Quiz() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [complete, setComplete] = useState(false)
  const q = QUESTIONS[idx]
  const isRight = selected === q.answer

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) { setComplete(true); return }
    setIdx(idx + 1); setSelected(null); setSubmitted(false)
  }
  const restart = () => { setIdx(0); setSelected(null); setSubmitted(false); setScore(0); setComplete(false) }

  if (complete) {
    return <div className="quiz-complete"><span className="quiz-kicker">QUIZ COMPLETE</span><span className="quiz-score">{score}<small> / {QUESTIONS.length}</small></span><h3>복습 완료!</h3><p>샘플 퀴즈를 모두 풀었습니다. 이해가 부족했던 부분은 세미나 노트에서 다시 확인해 보세요.</p><button className="button button-primary" type="button" onClick={restart}>다시 풀기 <span aria-hidden="true">↻</span></button></div>
  }

  return <div className="quiz-layout"><div className="quiz-sidebar"><span className="quiz-kicker">MINI QUIZ</span><h3>직접 풀어보는<br />4문제 복습</h3><p>Python · R · 데이터 기초</p><div className="quiz-progress-dots" aria-label={`${idx + 1}번째 문제, 총 ${QUESTIONS.length}개`}>{QUESTIONS.map((_, i) => <span className={i < idx ? 'finished' : i === idx ? 'current' : ''} key={i} />)}</div><span className="quiz-count">{String(idx + 1).padStart(2, '0')} <span>/ {String(QUESTIONS.length).padStart(2, '0')}</span></span></div><div className="quiz-main"><span className="quiz-topic">{q.tag}</span><h3>{q.question}</h3><pre className="quiz-code"><code>{q.code}</code></pre><div className="quiz-choices" role="group" aria-label="정답 선택">{q.choices.map((choice, i) => <button key={i} type="button" disabled={submitted} aria-pressed={selected === i} className={`quiz-choice ${selected === i ? 'selected' : ''} ${submitted && i === q.answer ? 'correct' : ''} ${submitted && selected === i && i !== q.answer ? 'incorrect' : ''}`} onClick={() => setSelected(i)}><span>{String.fromCharCode(65 + i)}</span>{choice}</button>)}</div>{submitted && <div className={`quiz-explanation ${isRight ? 'right' : 'wrong'}`} role="status"><strong>{isRight ? '정답입니다.' : '다시 확인해 보세요.'}</strong><p>{q.explanation}</p></div>}<div className="quiz-action">{!submitted ? <button className="button button-primary" type="button" disabled={selected === null} onClick={() => { setSubmitted(true); if (isRight) setScore(s => s + 1) }}>정답 확인 <span aria-hidden="true">→</span></button> : <button className="button button-primary" type="button" onClick={next}>{idx === QUESTIONS.length - 1 ? '결과 보기' : '다음 문제'} <span aria-hidden="true">→</span></button>}</div></div></div>
}

function Notes() {
  const [open, setOpen] = useState(0)
  const [copied, setCopied] = useState(null)
  const copyCode = async (code, index) => {
    try { await navigator.clipboard.writeText(code); setCopied(index); window.setTimeout(() => setCopied(null), 1600) }
    catch { setCopied(null) }
  }
  return <div className="notes-layout"><div className="notes-intro"><span className="quiz-kicker">REVIEW NOTES</span><h3>핵심만 다시,<br />직접 확인하기.</h3><p>세미나 노트 기능을 미리 체험할 수 있도록 만든 학습용 예시 콘텐츠입니다.</p><span className="demo-chip">SAMPLE NOTES</span></div><div className="notes-list">{NOTES.map((note, i) => <div className={`note-item ${open === i ? 'open' : ''}`} key={note.title}><button type="button" className="note-toggle" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span className="note-number">0{i + 1}</span><span>{note.title}</span><span className="note-icon" aria-hidden="true">{open === i ? '−' : '+'}</span></button>{open === i && <div className="note-content"><p>{note.summary}</p><div className="note-code-bar"><span>{note.label}</span><button type="button" onClick={() => copyCode(note.code, i)}>{copied === i ? '복사 완료 ✓' : '코드 복사 ↗'}</button></div><pre><code>{note.code}</code></pre><p className="note-takeaway"><strong>KEY POINT</strong>{note.takeaway}</p></div>}</div>)}</div></div>
}

function Resources() {
  const saveCsv = () => {
    const rows = 'name,score,category\nAlpha,85,A\nBeta,92,B\nGamma,78,A\n'
    const blob = new Blob(['\uFEFF', rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'runtime-practice-sample.csv'; document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }
  return <div className="resources"><div className="resource-intro"><span className="quiz-kicker">RESOURCE LIBRARY</span><h3>코딩 공부에 필요한<br />자료를 한곳에서.</h3><p>공식 학습 문서와 다운로드 가능한 예제 데이터를 제공합니다. 실제 세미나 자료는 추후 추가할 수 있습니다.</p></div><div className="resource-list"><a href="https://docs.python.org/ko/3/tutorial/" target="_blank" rel="noopener noreferrer"><div><span>01 / DOCUMENTATION</span><h4>Python 공식 튜토리얼</h4><p>문법과 기본 개념을 공부하는 공식 문서</p></div><b aria-hidden="true">↗</b></a><a href="https://cran.r-project.org/manuals.html" target="_blank" rel="noopener noreferrer"><div><span>02 / DOCUMENTATION</span><h4>R 공식 매뉴얼</h4><p>R 언어와 데이터 분석 환경에 관한 문서</p></div><b aria-hidden="true">↗</b></a><a href="https://docs.github.com/ko" target="_blank" rel="noopener noreferrer"><div><span>03 / DOCUMENTATION</span><h4>GitHub 공식 문서</h4><p>버전 관리와 협업 기본기 익히기</p></div><b aria-hidden="true">↗</b></a><button type="button" onClick={saveCsv}><div><span>04 / PRACTICE DATA</span><h4>연습용 CSV 데이터 다운로드</h4><p>간단한 표 형태의 샘플 데이터를 직접 활용하기</p></div><b aria-hidden="true">↓</b></button></div></div>
}

function StudyRoom({ initialTab = 'notes' }) {
  const [tab, setTab] = useState(['notes', 'quiz', 'resources'].includes(initialTab) ? initialTab : 'notes')
  useEffect(() => { if (['notes', 'quiz', 'resources'].includes(initialTab)) setTab(initialTab) }, [initialTab])
  return <>
    <PageHeading number="05" eyebrow="스터디룸" title={<>복습하고, 풀어보고,<br /><em>다시 익히는 공간.</em></>} description="세미나 내용 복습부터 간단한 퀴즈, 코딩 자료까지. 부담 없이 다시 찾아볼 수 있는 학습 도구를 모았습니다." />
    <section className="container study-section"><div className="study-switch" role="tablist" aria-label="스터디룸 기능">{[{ id: 'notes', label: '세미나 복습', en: 'REVIEW' }, { id: 'quiz', label: '미니 퀴즈', en: 'QUIZ' }, { id: 'resources', label: '자료실', en: 'LIBRARY' }].map((item) => <button role="tab" aria-selected={tab === item.id} type="button" key={item.id} className={tab === item.id ? 'selected' : ''} onClick={() => setTab(item.id)}><small>{item.en}</small><span>{item.label}</span></button>)}</div><div className="study-content" role="tabpanel">{tab === 'notes' && <Notes />}{tab === 'quiz' && <Quiz />}{tab === 'resources' && <Resources />}</div></section>
  </>
}

function Join() {
  return <>
    <PageHeading number="06" eyebrow="지원 안내" title={<>런타임과<br /><em>함께하고 싶다면.</em></>} description="코드를 배우는 순간부터 함께 프로젝트를 만드는 경험까지. 런타임의 다음 활동을 함께할 새로운 부원을 기다립니다." />
    <section id="guide" className="container join-grid"><div className="join-panel"><SectionLabel number="06.1">GET STARTED</SectionLabel><h2>궁금하다면,<br />먼저 알아보세요.</h2><p>모집 일정과 지원 방법은 공식 인스타그램 공지를 통해 확인해 주세요. 아래 지원 버튼은 디자인 시연용이며 실제 지원서는 연결되어 있지 않습니다.</p><div className="join-actions"><button type="button" className="button button-primary application-placeholder" disabled title="지원서 연결 전입니다">지원하기 <span aria-hidden="true">↗</span></button><a className="button button-light" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">모집 공지 확인 <span aria-hidden="true">↗</span></a></div><span className="join-note">* 지원하기 버튼은 의도적으로 비활성화되어 있습니다.</span></div><div className="join-side"><span>RUNTIME / KHU</span><div className="join-side-art" aria-hidden="true">R<span>↗</span></div><p>LEARN TO CODE.<br />CODE TO CREATE.</p></div></section>
    <section id="faq" className="container faq-section"><div className="faq-heading"><SectionLabel number="06.2">FREQUENTLY ASKED</SectionLabel><h2>자주 궁금해할 질문</h2></div><div className="faq-list"><details><summary>런타임에서는 주로 어떤 활동을 하나요?<span>+</span></summary><p>Python과 R 등 프로그래밍 언어를 공부하는 세미나·스터디를 진행하고, 실습이나 자격증 공부, 공모전 및 해커톤 등에 함께 참여합니다.</p></details><details><summary>코딩을 처음 배우는 사람도 지원할 수 있나요?<span>+</span></summary><p>활동에는 세미나와 스터디가 포함되어 있습니다. 다만 지원 자격과 요구되는 선수 지식은 해당 학기 공식 모집 공지를 통해 확인해 주세요.</p></details><details><summary>모집 시기와 지원 방법은 어디서 확인하나요?<span>+</span></summary><p>공식 인스타그램 <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@khu_runtime ↗</a>에서 최신 모집 안내를 확인할 수 있습니다. 현재 이 웹사이트에서는 지원서를 접수하지 않습니다.</p></details></div></section>
  </>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-simple"><div><Brand /><p>경희대학교 이과대학 코딩 동아리</p></div><div className="footer-links"><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="#/join">지원 안내 →</a></div><small>© 2026 RUNTIME</small></div></footer>
}

function App() {
  const [location, setLocation] = useState(currentLocation)
  useEffect(() => {
    const onHashChange = () => setLocation(currentLocation())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  useEffect(() => {
    const section = location.section
    if (section && !['notes', 'quiz', 'resources'].includes(section)) {
      const target = document.getElementById(section)
      if (target) { target.scrollIntoView({ block: 'start', behavior: 'auto' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location])
  return <>
    <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>본문으로 건너뛰기</a>
    <Header page={location.page} />
    <main id="main" tabIndex="-1" key={location.page}>
      {location.page === 'home' && <Home />}
      {location.page === 'about' && <About />}
      {location.page === 'activities' && <Activities />}
      {location.page === 'projects' && <Projects />}
      {location.page === 'study' && <StudyRoom initialTab={location.section} />}
      {location.page === 'join' && <Join />}
    </main>
    <Footer />
  </>
}

export default App