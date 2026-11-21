import React, { useEffect, useState } from 'react'
import './App.css'
import CommunityBoard from './CommunityBoard'

const INSTAGRAM = 'https://www.instagram.com/khu_runtime/'
const GITHUB = 'https://github.com/KHU-Runtime/Runtime-Main-Website'


const NAV = [
  { id: 'home', label: '홈' },
  { id: 'about', label: '동아리 소개', children: [
    { label: 'Runtime; 소개', section: 'overview' },
    { label: '활동 방식', section: 'process' },
    { label: '운영 안내', section: 'operation' },
  ] },
  { id: 'activities', label: '주요 활동', children: [
    { label: '프로그래밍 세미나', section: 'seminars' },
    { label: '자격증 스터디', section: 'certificates' },
    { label: '개발 실습', section: 'practice' },
  ] },
  { id: 'projects', label: '프로젝트', children: [
    { label: '활동 기록', section: 'archive' },
    { label: '글쓰기', section: 'manage' },
  ] },
  { id: 'study', label: '스터디룸', children: [
    { label: '세미나 복습', section: 'notes' },
    { label: '미니 퀴즈', section: 'quiz' },
    { label: '학습자료', section: 'resources' },
  ] },
  { id: 'join', label: '지원 안내', children: [
    { label: '모집 안내', section: 'guide' },
    { label: '자주 묻는 질문(FAQ)', section: 'faq' },
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

const PROJECT_HOME_EXAMPLES = [
  {
    id: 'home-example-math',
    category: '참가 리포트',
    title: '수식 하나로 해답을 찾다',
    subtitle: '응용수학 알고리즘 챌린지 · 참가 리포트',
    cover: import.meta.env.BASE_URL + 'images/project-math.webp',
  },
  {
    id: 'home-example-ai',
    category: '우수상 수상',
    title: '아이디어를 서비스로',
    subtitle: '2026 K-AI 오픈 이노베이션 해커톤 · 우수상',
    cover: import.meta.env.BASE_URL + 'images/project-ai.webp',
  },
  {
    id: 'home-example-chemistry',
    category: '본선 진출 및 수상',
    title: '실험실 밖으로 나간 화학',
    subtitle: '2026 차세대 친환경 화학 탐구대회 · 본선 진출 및 수상',
    cover: import.meta.env.BASE_URL + 'images/project-chemistry.webp',
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
    <a className="brand" href="#/home" onClick={onNavigate} aria-label="Runtime; 홈으로 이동">
      <span className="brand-symbol" aria-hidden="true">
        <img className="brand-mark" src={import.meta.env.BASE_URL + 'runtime-mark.svg'} alt="" />
      </span>
      <span className="brand-text"><strong>Runtime;</strong><small>KYUNG HEE UNIVERSITY</small></span>
    </a>
  )
}

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState('about')
  const [megaOpen, setMegaOpen] = useState(false)

  const closeMenus = () => { setMenuOpen(false); setMegaOpen(false) }
  useEffect(() => { setMenuOpen(false); setMegaOpen(false); setExpanded('about') }, [page])
  useEffect(() => {
    const escape = (e) => { if (e.key === 'Escape') closeMenus() }
    const clickOutside = (e) => { if (!e.target.closest('.site-header')) setMegaOpen(false) }
    window.addEventListener('keydown', escape)
    window.addEventListener('pointerdown', clickOutside)
    return () => { window.removeEventListener('keydown', escape); window.removeEventListener('pointerdown', clickOutside) }
  }, [])
  const toggleMobile = () => {
    const opening = !menuOpen
    setMenuOpen(opening)
    if (opening) { setExpanded('about'); setMegaOpen(false) }
  }

  return <header className="site-header" onMouseLeave={() => setMegaOpen(false)}
    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false) }}>
    <div className="header-inner container">
      <Brand onNavigate={closeMenus} />
      <nav className="desktop-nav" aria-label="주요 메뉴" onMouseEnter={() => setMegaOpen(true)}>
        {NAV.map(item => <div className={'nav-item ' + (page === item.id ? 'is-current' : '')} key={item.id}>
          <a className="nav-link" href={'#/' + item.id}
            aria-current={page === item.id ? 'page' : undefined}
            onFocus={() => setMegaOpen(true)} onClick={closeMenus}>{item.label}</a>
          {item.children && <button className="nav-chevron" type="button"
            aria-label="전체 하위 메뉴 열기" aria-expanded={megaOpen}
            aria-controls="mega-navigation" onFocus={() => setMegaOpen(true)}
            onClick={() => setMegaOpen(!megaOpen)}><span aria-hidden="true">⌄</span></button>}
        </div>)}
      </nav>
      <a className="header-social" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setMegaOpen(false)}>Instagram ↗</a>
      <button type="button" className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
        aria-controls="mobile-navigation" aria-expanded={menuOpen}
        aria-label={menuOpen ? '전체 메뉴 닫기' : '전체 메뉴 열기'}
        onClick={toggleMobile}><span /><span /><span /></button>
    </div>

    <nav className="mega-menu" id="mega-navigation" aria-label="전체 하위 메뉴"
      data-open={megaOpen ? 'true' : 'false'} aria-hidden={!megaOpen} inert={!megaOpen}>
      <div className="container mega-menu-grid">
        {NAV.filter(item => item.children).map(item => <section className="mega-menu-column" key={item.id}>
          <a className="mega-menu-heading" href={'#/' + item.id} onClick={closeMenus}>{item.label}</a>
          <div className="mega-menu-links">
            {item.children.map(child => <a key={child.section}
              href={'#/' + item.id + '/' + child.section} onClick={closeMenus}>{child.label}</a>)}
          </div>
        </section>)}
      </div>
    </nav>

    {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="모바일 주요 메뉴">
      {NAV.map(item => <div className="mobile-nav-group" key={item.id}>
        {item.children ? <>
          <button type="button" className="mobile-accordion-toggle"
            aria-expanded={expanded === item.id} aria-controls={'mobile-sub-' + item.id}
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
            <span>{item.label}</span><span className="mobile-chevron" aria-hidden="true">⌄</span>
          </button>
          <div className={'mobile-nav-sub ' + (expanded === item.id ? 'is-expanded' : '')}
            id={'mobile-sub-' + item.id} aria-hidden={expanded !== item.id} inert={expanded !== item.id}>
            <div className="mobile-nav-sub-inner">
              {item.children.map(child => <a key={child.section}
                href={'#/' + item.id + '/' + child.section} onClick={closeMenus}>{child.label}</a>)}
              <a className="mobile-category-link" href={'#/' + item.id} onClick={closeMenus}>{item.label} 전체 보기 →</a>
            </div>
          </div>
        </> : <a className="mobile-home-link" href={'#/' + item.id} onClick={closeMenus}>{item.label}</a>}
      </div>)}
      <a className="mobile-instagram" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">공식 인스타그램 ↗</a>
    </nav>}
  </header>
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span className="section-number">/{number}</span><span>{children}</span></div>
}

function TextLink({ to, children, white = false }) {
  return <a href={`#/${to}`} className={`text-link ${white ? 'text-link-white' : ''}`}>{children}<span aria-hidden="true">↗</span></a>
}

function ActivityIcon({ name }) {
  return (
    <svg className="overview-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'seminar' && <><rect x="8" y="8" width="24" height="19" rx="2" /><path d="M5 32h30l-4-5H9l-4 5Z" /></>}
      {name === 'study' && <><circle cx="20" cy="13" r="5" /><path d="M10 31v-4a10 10 0 0 1 20 0v4M7 15a4 4 0 0 0 0 8M33 15a4 4 0 0 1 0 8M2 29v-2a6 6 0 0 1 6-6M38 29v-2a6 6 0 0 0-6-6" /></>}
      {name === 'code' && <><path d="M14 11 5 20l9 9M26 11l9 9-9 9M23 7l-6 26" /></>}
      {name === 'trophy' && <><path d="M12 7h16v11a8 8 0 0 1-16 0V7ZM20 26v7M13 34h14M12 10H6v5a7 7 0 0 0 7 7M28 10h6v5a7 7 0 0 1-7 7" /></>}
    </svg>
  )
}

function Home() {
  const highlights = [
    { key: 'seminar', title: '세미나', sub: 'Python · R', to: '#/activities/seminars' },
    { key: 'code', title: '심화 실습', sub: 'HTML · CSS · JavaScript · 바이브코딩', to: '#/activities/practice' },
    { key: 'study', title: '스터디', sub: 'ADsP · SQLD', to: '#/activities/certificates' },
    { key: 'trophy', title: '대회 참여', sub: '공모전 · 해커톤 · 경진대회', to: '#/projects/archive' },
  ]
  const seminarImage = import.meta.env.BASE_URL + 'images/seminar-edited-presenter.webp'

  return <>
    <div className="home-showcase">
      <section className="home-hero" aria-labelledby="runtime-hero-title">
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="hero-kicker">KYUNG HEE UNIVERSITY</p>
            <h1 id="runtime-hero-title">경희대학교 이과대학<br />코딩 동아리 Runtime;</h1>
            <p className="hero-description"><span className="hero-hello">Hello, world!</span><br className="desktop-break" /> 첫 줄의 코드부터 팀 프로젝트까지.</p>
            <p className="hero-activity-summary">Python · R 세미나 <span aria-hidden="true">/</span> 데이터 스터디 <span aria-hidden="true">/</span> 개발 실습</p>
            <div className="hero-buttons">
              <a href="#/about/overview" className="button button-cream">동아리 알아보기 <span aria-hidden="true">→</span></a>
              <a href="#/join/guide" className="button button-outline-light">지원 안내 <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <img className="hero-rabbit-outline" src={import.meta.env.BASE_URL + 'runtime-watermark.svg'} alt="" aria-hidden="true" />
        </div>
      </section>
      <section className="home-overview" aria-labelledby="runtime-overview-title">
        <div className="container overview-layout">
          <div className="overview-intro">
            <h2 id="runtime-overview-title">Runtime;에서는 무엇을 하나요?</h2>
            <p className="overview-slogan"><span>세미나, 스터디, 실습, 프로젝트까지</span><span>함께 배우고 성장하는 <strong>learn-time !</strong></span></p>
          </div>
          <div className="overview-highlights">
            {highlights.map((item) => (
              <a className="overview-highlight" key={item.key} href={item.to}>
                <ActivityIcon name={item.key} />
                <strong>{item.title}</strong>
                <span>{item.sub}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>

    <section className="home-project-section" aria-labelledby="home-project-title">
      <div className="container">
        <div className="home-section-heading">
          <div>
            <p className="home-section-eyebrow">01 / PROJECTS</p>
            <h2 id="home-project-title">프로젝트, 기록으로 남기다.</h2>
            <p>해커톤과 경진대회에서 나눈 아이디어부터 그 결과까지.</p>
          </div>
          <a className="home-more-link" href="#/projects/archive">자세히 알아보기 <span aria-hidden="true">↗</span></a>
        </div>
        <div className="home-project-grid">
          {PROJECT_HOME_EXAMPLES.map((project) => (
            <article className="home-project-card home-project-card-static" key={project.id}>
              <div className="home-project-image">
                <img src={project.cover} alt="" loading="lazy" />
              </div>
              <div className="home-project-body">
                <span className="home-project-label">시연용 예시 <span aria-hidden="true">·</span> {project.category}</span>
                <h3>{project.title}</h3>
                <p className="home-project-subtitle">{project.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="home-project-disclaimer">※ 홈페이지 구성 시연을 위한 예시 게시물이며, 실제 동아리 참가·수상 실적을 나타내지 않습니다.</p>
      </div>
    </section>

    <section className="home-study-section" aria-labelledby="home-study-title"
      style={{ backgroundImage: 'linear-gradient(90deg, rgba(1,7,54,.88) 0%, rgba(13,28,66,.60) 53%, rgba(1,7,54,.28) 100%), url(' + seminarImage + ')' }}>
      <div className="container home-study-inner">
        <p className="home-section-eyebrow">02 / STUDY ROOM</p>
        <h2 id="home-study-title">배운 내용은 다시 꺼내볼 수 있게.</h2>
        <p>세미나 복습, 미니 퀴즈, 학습자료까지.<br />Runtime;의 공부를 이어가는 공간입니다.</p>
        <a className="home-more-link home-more-light" href="#/study/notes">자세히 알아보기 <span aria-hidden="true">↗</span></a>
      </div>
      <span className="home-study-image-note">AI 편집 이미지</span>
    </section>

    <section className="home-join-section" aria-labelledby="home-join-title">
      <div className="container home-join-inner">
        <div>
          <p className="home-section-eyebrow">03 / JOIN US</p>
          <h2 id="home-join-title">다음 learn-time을 함께할 사람을 기다립니다.</h2>
          <p>모집 안내와 자주 묻는 질문을 확인해 보세요.</p>
        </div>
        <a className="home-more-link" href="#/join/guide">자세히 알아보기 <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </>
}

function PageHeading({ number, eyebrow, title, description }) {
  return <div className="page-heading container"><SectionLabel number={number}>{eyebrow}</SectionLabel><h1>{title}</h1><p>{description}</p></div>
}

function About() {
  return <>
    <PageHeading number="02" eyebrow="동아리 소개" title={<>Runtime;을<br /><em>소개합니다.</em></>} description="Runtime;은 프로그래밍 언어를 공부하는 데서 멈추지 않고, 학습한 기술을 실제 결과물로 연결하는 코딩 동아리입니다." />
    <section id="overview" className="container about-overview"><div className="about-aside">Runtime;<br /><span>CODING CLUB.</span></div><div className="about-content"><h2>함께 배우고, 직접 만들어 봅니다.</h2><p>Runtime;은 Python과 R 등의 프로그래밍 언어를 세미나와 스터디로 공부합니다. 배운 내용을 직접 실습하고, 관심사가 맞는 부원들과 팀을 꾸려 공모전이나 해커톤에도 참여합니다.</p><div className="about-tags"><span>PROGRAMMING</span><span>DATA</span><span>COLLABORATION</span></div></div></section>
    <section className="container about-name-story" aria-labelledby="runtime-name-meaning">
      <div className="name-story-symbol" aria-hidden="true"><span>Runtime;</span><small>RUN + LEARN</small></div>
      <div className="name-story-copy">
        <span className="name-story-label">OUR NAME</span>
        <h2 id="runtime-name-meaning">Runtime;이라는 이름의 의미</h2>
        <p>컴퓨터 프로그램이 실행되는 동안의 동작을 의미하는 <strong>Runtime</strong>과 프로그래밍 언어에서 구문이 끝날 때 붙이는 기호인 <strong>;</strong>을 결합했습니다.</p>
        <p>코드의 실행부터 종결까지 함께 배우는 <strong>learn time</strong> 동아리라는 의미를 담고 있습니다.</p>
      </div>
    </section>
    <section id="process" className="about-steps"><div className="container"><SectionLabel number="02.1">HOW WE GROW</SectionLabel><h2>Runtime;의 활동 방식</h2><div className="step-grid"><div><span>01</span><h3>세미나</h3><p>프로그래밍 기초를 함께 공부하기</p></div><div><span>02</span><h3>실습</h3><p>배운 내용으로 코드를 작성해 보기</p></div><div><span>03</span><h3>프로젝트</h3><p>팀을 꾸려 아이디어를 구체화하기</p></div><div><span>04</span><h3>공유</h3><p>결과와 배운 내용을 함께 나누기</p></div></div></div></section>
    <section id="operation" className="container about-operation">
      <h2>운영 안내</h2>
      <p>Runtime;의 활동 일정과 모집 관련 공지는 공식 인스타그램에서 확인할 수 있습니다.</p>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">공식 인스타그램 확인하기 ↗</a>
    </section>
    <section className="container about-cta"><h2>Runtime;이 어떤 활동을 하는지<br />조금 더 궁금해졌나요?</h2><TextLink to="activities">활동 확인하기</TextLink></section>
  </>
}

function Activities() {
  return <>
    <PageHeading number="03" eyebrow="주요 활동" title={<>세미나부터 프로젝트까지,<br /><em>Runtime;의 활동</em></>} description="세미나와 스터디로 익힌 지식을 실제 개발과 팀 활동에 적용해 봅니다." />
    <section id="seminars" className="container activity-list" aria-label="Runtime; 주요 활동">
      {ACTIVITY_LIST.map((activity) => <article id={activity.n === '02' ? 'certificates' : activity.n === '03' ? 'practice' : activity.n === '04' ? 'competition' : undefined} className="activity-row" key={activity.n}><div className="activity-no">{activity.n} <span>↗</span></div><div><span className="activity-tag">{activity.tag}</span><h2>{activity.title}</h2></div><div className="activity-body"><p>{activity.description}</p><small>{activity.detail}</small></div></article>)}
    </section>
    <section id="collaboration" className="container activity-bottom"><div><SectionLabel number="03.1">AFTER LEARNING</SectionLabel><h2>배운 내용을 활용하는<br />프로젝트와 대회 참여</h2></div><div><p>같은 관심사를 가진 부원들과 팀을 이루고, 각자의 아이디어를 실제 프로젝트로 발전시킬 수 있습니다.</p><TextLink to="projects">프로젝트 살펴보기</TextLink></div></section>
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
    <PageHeading number="06" eyebrow="지원 안내" title={<>Runtime;과<br /><em>함께하고 싶다면.</em></>} description="Runtime;의 활동과 모집 안내를 확인하고, 함께할 기회를 살펴보세요. 자세한 모집 일정은 공식 인스타그램을 통해 안내합니다." />
    <section id="guide" className="container join-grid"><div className="join-panel"><SectionLabel number="06.1">GET STARTED</SectionLabel><h2>궁금하다면,<br />먼저 알아보세요.</h2><p>모집 일정과 지원 방법은 공식 인스타그램 공지를 통해 확인해 주세요. 아래 지원 버튼은 디자인 시연용이며 실제 지원서는 연결되어 있지 않습니다.</p><div className="join-actions"><button type="button" className="button button-primary application-placeholder" disabled title="지원서 연결 전입니다">지원하기 <span aria-hidden="true">↗</span></button><a className="button button-light" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">모집 공지 확인 <span aria-hidden="true">↗</span></a></div><span className="join-note">* 지원하기 버튼은 의도적으로 비활성화되어 있습니다.</span></div><div className="join-side"><span>Runtime; / KHU</span><div className="join-side-art" aria-hidden="true">R<span>↗</span></div><p>LEARN TO CODE.<br />CODE TO CREATE.</p></div></section>
    <section id="faq" className="container faq-section"><div className="faq-heading"><SectionLabel number="06.2">FREQUENTLY ASKED</SectionLabel><h2>자주 궁금해할 질문</h2></div><div className="faq-list"><details><summary>Runtime;에서는 주로 어떤 활동을 하나요?<span>+</span></summary><p>Python과 R 등 프로그래밍 언어를 공부하는 세미나·스터디를 진행하고, 실습이나 자격증 공부, 공모전 및 해커톤 등에 함께 참여합니다.</p></details><details><summary>코딩을 처음 배우는 사람도 지원할 수 있나요?<span>+</span></summary><p>활동에는 세미나와 스터디가 포함되어 있습니다. 다만 지원 자격과 요구되는 선수 지식은 해당 학기 공식 모집 공지를 통해 확인해 주세요.</p></details><details><summary>모집 시기와 지원 방법은 어디서 확인하나요?<span>+</span></summary><p>공식 인스타그램 <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@khu_runtime ↗</a>에서 최신 모집 안내를 확인할 수 있습니다. 현재 이 웹사이트에서는 지원서를 접수하지 않습니다.</p></details></div></section>
  </>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-simple"><div><Brand /><p>경희대학교 이과대학 코딩 동아리</p></div><div className="footer-links"><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="#/join">지원 안내 →</a></div><small>© 2026 Runtime;</small></div></footer>
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
      {location.page === 'projects' && <CommunityBoard initialView={location.section} />}
      {location.page === 'study' && <StudyRoom initialTab={location.section} />}
      {location.page === 'join' && <Join />}
    </main>
    <Footer />
  </>
}

export default App