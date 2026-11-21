import React, { useEffect, useState } from 'react'
import './App.css'
import CommunityBoard from './CommunityBoard'
import { PROJECT_EXAMPLES } from './data/projectExamples'
import { SEMINAR_WEEKS } from './data/seminarWeeks'

const INSTAGRAM = 'https://www.instagram.com/khu_runtime/'
const GITHUB = 'https://github.com/KHU-Runtime/Runtime-Main-Website'


const NAV = [
  { id: 'home', label: '홈' },
  { id: 'about', label: '동아리 소개', children: [
    { label: 'Runtime; 소개', section: 'overview' },
    { label: '임원진 소개', section: 'team' },
    { label: '운영 안내', section: 'operation' },
  ] },
  { id: 'activities', label: '주요 활동', children: [
    { label: 'R 기초 세미나', section: 'seminars' },
    { label: '바이브코딩 심화반', section: 'practice' },
    { label: 'SQLD 스터디', section: 'certificates' },
    { label: 'MT · 번개 모임', section: 'community' },
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
    n: '01', id: 'seminars', tag: 'R / FOUNDATIONS',
    title: 'R 기초 세미나', schedule: '9월 15일 – 11월 24일',
    description: 'R 프로그래밍의 기본 개념을 차근차근 익히고, 직접 코드를 작성하며 간단한 데이터 분석까지 경험합니다.',
    details: ['R의 기본 개념 학습', '실습 및 간단한 데이터 분석'],
  },
  {
    n: '02', id: 'practice', tag: 'PYTHON / VIBE CODING',
    title: '파이썬 바이브코딩 심화반', schedule: '9월 15일 – 11월 24일',
    description: '바이브코딩에 필요한 이론을 배우는 데서 시작해, 팀을 이루어 Runtime;만의 프로젝트를 진행합니다.',
    details: ['바이브코딩을 위한 이론 세미나', '팀으로 진행하는 Runtime; 프로젝트'],
  },
  {
    n: '03', id: 'certificates', tag: 'SQLD / CERTIFICATION',
    title: '제63회 SQLD 자격증 대비 스터디', schedule: '10월 27일 – 11월 13일',
    extra: '시험일 · 11월 14일',
    description: 'SQLD 자격증 시험을 준비하는 부원들이 함께 공부하는 2~3주 집중 스터디입니다.',
    details: ['2~3주 집중 학습', '제63회 SQLD 시험 대비'],
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
  useEffect(() => {
    // Only reveal when JavaScript and IntersectionObserver are both ready.
    // Without these features, content stays visible rather than disappearing.
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return undefined

    const elements = document.querySelectorAll(
      '.home-project-section .home-section-heading, ' +
      '.home-project-section .home-project-card, ' +
      '.home-study-section .home-study-inner, ' +
      '.home-join-section .home-join-inner'
    )
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })

    elements.forEach((element) => {
      element.classList.add('home-scroll-reveal')
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach((element) => element.classList.remove('home-scroll-reveal', 'is-visible'))
    }
  }, [])

  const highlights = [
    { key: 'seminar', title: '세미나', sub: 'Python · R', to: '#/activities/seminars' },
    { key: 'code', title: '심화 실습', sub: 'HTML · CSS · JavaScript · 바이브코딩', to: '#/activities/practice' },
    { key: 'study', title: '스터디', sub: 'ADsP · SQLD', to: '#/activities/certificates' },
    { key: 'trophy', title: '대회 참여', sub: '공모전 · 해커톤 · 경진대회', to: '#/projects/archive' },
  ]
  const seminarImage = import.meta.env.BASE_URL + 'images/seminar-students-casual.webp'

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
          {PROJECT_EXAMPLES.map((project) => (
            <a className="home-project-card home-project-card-static home-project-card-link" href="#/projects/archive" key={project.id} aria-label={project.title + " 프로젝트 기록 보기"}>
              <div className="home-project-image">
                <img src={project.cover} alt="" loading="lazy" />
              </div>
              <div className="home-project-body">
                <span className="home-project-label">시연용 예시 <span aria-hidden="true">·</span> {project.label}</span>
                <h3>{project.title}</h3>
                <p className="home-project-subtitle">{project.subtitle}</p>
              </div>
            </a>
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
          <h2 id="home-join-title">Runtime;과 함께할 사람을 기다립니다.</h2>
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
  const executives = [
    {
      role: '회장', en: 'PRESIDENT', name: '임승희', major: '생물학과 · 23학번',
      history: [
        { date: '2025.03 ~', text: 'Runtime; 동아리 활동' },
        { date: '2026.03 – 08', text: 'Runtime; 3기 회장' },
        { date: '2026.09 ~', text: 'Runtime; 4기 회장' },
      ],
    },
    {
      role: '부회장', en: 'VICE PRESIDENT', name: '남효상', major: '미래정보디스플레이학부 · 25학번',
      history: [
        { date: '2026.03 ~', text: 'Runtime; 동아리 활동' },
        { date: '2026.06 ~', text: 'Runtime; 4기 부회장' },
      ],
    },
    {
      role: '총무', en: 'GENERAL AFFAIRS', name: '김민준', major: '화학과 · 25학번',
      history: [
        { date: '2026.03 ~', text: 'Runtime; 동아리 활동' },
        { date: '2026.03 – 05', text: 'Runtime; 부회장' },
        { date: '2026.06 ~', text: 'Runtime; 4기 총무' },
      ],
    },
  ]

  return <div className="about-page">
    <PageHeading number="02" eyebrow="동아리 소개" title={<>Runtime;을<br /><em>소개합니다.</em></>} description="프로그래밍 언어를 공부하는 데서 멈추지 않고, 학습한 기술을 실제 결과물로 연결하는 코딩 동아리" />

    <section id="overview" className="container about-name-story" aria-label="Runtime; 로고와 이름에 담긴 의미">
      <div className="name-story-symbol">
        <img className="name-story-mark" src={import.meta.env.BASE_URL + 'runtime-mark.svg'} alt="Runtime; 동아리 로고" />
        <strong className="name-story-wordmark">Runtime;</strong>
      </div>
      <div className="name-story-copy">
        <p className="name-story-lead">배움을 실행하고,<br />함께 결과를 만들어가는 시간.</p>
        <p>컴퓨터 프로그램이 실행되는 시간을 뜻하는 <strong>Runtime</strong>과 여러 프로그래밍 언어에서 명령문의 끝을 나타내는 <strong>세미콜론(;)</strong>을 결합한 이름입니다.</p>
        <p>코드를 배우는 시간을 실제 실행과 결과물로 이어가자는 마음을 <strong>Runtime;</strong>에 담았습니다.</p>
      </div>
    </section>

    <section id="team" className="container about-team" aria-labelledby="about-team-heading">
      <div className="about-team-heading">
        <div>
          <span className="about-team-kicker">PEOPLE OF RUNTIME; / 4TH EXECUTIVES</span>
          <h2 id="about-team-heading">4기 임원진 소개</h2>
          <p>Runtime;을 함께 운영하는 회장, 부회장, 총무를 소개합니다.</p>
        </div>
      </div>
      <div className="about-team-grid">
        {executives.map((member,index)=><article className="about-team-person" key={member.role}>
          <div className="about-executive-photo">
            <img src={import.meta.env.BASE_URL + 'images/executive-rabbit-navy.svg'} alt="Runtime; 토끼 로고가 그려진 네이비 이미지" loading="lazy" />
            <span className="about-executive-index">{String(index+1).padStart(2,'0')} / 03</span>
          </div>
          <div className="about-executive-body">
            <span className="about-team-role">{member.en}</span>
            <div className="about-executive-name"><h3>{member.name}</h3><strong>{member.role}</strong></div>
            <p className="about-executive-major">{member.major}</p>
            <ul className="about-executive-history">
              {member.history.map(item=><li key={item.date+item.text}><time>{item.date}</time><span>{item.text}</span></li>)}
            </ul>
          </div>
        </article>)}
      </div>
    </section>
    <section id="operation" className="container about-operation">
      <h2>운영 안내</h2>
      <p>Runtime;의 활동 일정과 모집 관련 공지는 공식 인스타그램에서 확인할 수 있습니다.</p>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">공식 인스타그램 확인하기 ↗</a>
    </section>
    <section className="container about-cta"><h2>Runtime;이 어떤 활동을 하는지<br />조금 더 궁금해졌나요?</h2><TextLink to="activities">활동 확인하기</TextLink></section>
  </div>
}

function Activities() {
  return <div className="activities-page">
    <PageHeading number="03" eyebrow="주요 활동" title={<>2026년 2학기,<br /><em>Runtime;의 활동.</em></>}
      description="프로그래밍 세미나와 팀 프로젝트, 자격증 스터디부터 MT와 번개 모임까지. 함께 배우고 교류하는 한 학기." />

    <section className="container activities-program" aria-labelledby="activities-program-title">
      <div className="activities-section-head">
        <div>
          <span className="activities-eyebrow">2026 FALL · LEARNING &amp; BUILDING</span>
          <h2 id="activities-program-title">배움을 실제 경험으로.</h2>
        </div>
        <p>배우는 시간과 만드는 시간을 연결하는 Runtime;의 정기 학습 활동입니다.</p>
      </div>
      <div className="activities-program-list">
        {ACTIVITY_LIST.map(item=><article className="activities-program-item" key={item.id} id={item.id}>
          <div className="activities-program-index">{item.n}<span aria-hidden="true">/ 03</span></div>
          <div className="activities-program-title">
            <span className="activities-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p className="activities-period"><span aria-hidden="true">◷</span> {item.schedule}</p>
            {item.extra&&<p className="activities-extra">{item.extra}</p>}
          </div>
          <div className="activities-program-detail">
            <p>{item.description}</p>
            <ul>{item.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
          </div>
        </article>)}
      </div>
      <p className="activities-schedule-note">* 2026학년도 2학기 오리엔테이션 자료 기준 안내입니다. 세부 운영 일정은 변경될 수 있습니다.</p>
    </section>

    <section id="community" className="activities-community" aria-labelledby="activities-community-title">
      <div className="container">
        <div className="activities-section-head">
          <div>
            <span className="activities-eyebrow">BEYOND THE CLASSROOM</span>
            <h2 id="activities-community-title">공부 밖에서도, 함께.</h2>
          </div>
          <p>스터디 밖에서 서로의 관심사를 나누고 더 가까워질 수 있는 모임도 마련합니다.</p>
        </div>
        <div className="activities-community-grid">
          <article className="activities-community-card" id="mt">
            <div className="activities-community-top"><span>04 / COMMUNITY</span><span aria-hidden="true">↗</span></div>
            <h3>겨울 MT</h3>
            <p>겨울 바다나 글램핑처럼 특별한 장소에서 함께 보내는 친목 활동을 기대해 주세요. 레크리에이션과 맛있는 음식도 빼놓을 수 없죠.</p>
            <span className="activities-community-caption">장소와 일정은 추후 안내</span>
          </article>
          <article className="activities-community-card" id="meetups">
            <div className="activities-community-top"><span>05 / COMMUNITY</span><span aria-hidden="true">↗</span></div>
            <h3>자유로운 번개 모임</h3>
            <p>방탈출, 클라이밍, 보드게임, 러닝, 놀이공원 등 다양한 활동을 계기로 가볍게 모여요. 새로운 모임 제안도 언제든 환영합니다.</p>
            <span className="activities-community-caption">관심사에 따라 자유롭게 참여</span>
          </article>
        </div>
      </div>
    </section>

    <section className="container activity-bottom">
      <div><SectionLabel number="03.1">FROM STUDY TO PROJECT</SectionLabel><h2>배운 내용을 함께<br />직접 구현해 보는 경험.</h2></div>
      <div><p>세미나와 심화반에서 배운 것을 팀 프로젝트로 연결합니다. Runtime;이 만들어가는 활동과 결과물을 프로젝트 페이지에서 만나보세요.</p>
        <TextLink to="projects">프로젝트 페이지 살펴보기</TextLink></div>
    </section>
  </div>
}


function Quiz() {
  const [weekIndex,setWeekIndex] = useState(0)
  const [idx,setIdx] = useState(0)
  const [selected,setSelected] = useState(null)
  const [submitted,setSubmitted] = useState(false)
  const [score,setScore] = useState(0)
  const [complete,setComplete] = useState(false)
  const activeWeek=SEMINAR_WEEKS[weekIndex]
  const questions=activeWeek.questions
  const q=questions[idx]
  const isRight=selected===q.answer
  const reset=()=>{setIdx(0);setSelected(null);setSubmitted(false);setScore(0);setComplete(false)}
  const changeWeek=(value)=>{setWeekIndex(value);reset()}
  const next=()=>{
    if(idx+1===questions.length){setComplete(true);return}
    setIdx(idx+1);setSelected(null);setSubmitted(false)
  }

  return <div className="weekly-quiz">
    <div className="study-subheading"><span className="quiz-kicker">WEEKLY QUIZ</span>
      <h3>이번 주에 배운 만큼, 직접 풀어보기.</h3>
      <p>첨부된 Python 세미나 교안에 맞춰 주차별 5문제를 준비했습니다. 정답을 선택하면 해설을 확인할 수 있어요.</p>
    </div>
    <div className="seminar-week-tabs" role="tablist" aria-label="퀴즈 주차 선택">
      {SEMINAR_WEEKS.map((week,i)=><button type="button" role="tab" key={week.week}
        aria-selected={weekIndex===i} className={weekIndex===i?'active':''}
        onClick={()=>changeWeek(i)}><strong>{week.week}주차</strong><small>{week.title}</small></button>)}
    </div>
    {complete ? <div className="quiz-complete weekly-quiz-complete">
      <span className="quiz-kicker">WEEK {activeWeek.week} · QUIZ COMPLETE</span>
      <span className="quiz-score">{score}<small> / {questions.length}</small></span>
      <h3>{activeWeek.week}주차 복습 완료!</h3>
      <p>틀린 문제는 {activeWeek.week}주차 세미나 PDF에서 다시 확인해 보세요.</p>
      <button className="button button-primary" type="button" onClick={reset}>이 주차 다시 풀기 <span aria-hidden="true">↻</span></button>
    </div> : <div className="quiz-layout">
      <div className="quiz-sidebar">
        <span className="quiz-kicker">WEEK {String(activeWeek.week).padStart(2,'0')} · PYTHON</span>
        <h3>{activeWeek.title}<br />5문제 복습</h3>
        <p>{activeWeek.topics.join(' · ')}</p>
        <div className="quiz-progress-dots" aria-label={`${idx+1}번째 문제, 총 ${questions.length}개`}>
          {questions.map((_,i)=><span className={i<idx?'finished':i===idx?'current':''} key={i}/>)}
        </div>
        <span className="quiz-count">{String(idx+1).padStart(2,'0')} <span>/ {String(questions.length).padStart(2,'0')}</span></span>
      </div>
      <div className="quiz-main">
        <span className="quiz-topic">{q.tag}</span><h3>{q.question}</h3>
        {q.code && <pre className="quiz-code"><code>{q.code}</code></pre>}
        <div className="quiz-choices" role="group" aria-label="정답 선택">
          {q.choices.map((choice,i)=><button key={i} type="button" disabled={submitted}
            aria-pressed={selected===i} className={`quiz-choice ${selected===i?'selected':''} ${submitted&&i===q.answer?'correct':''} ${submitted&&selected===i&&i!==q.answer?'incorrect':''}`}
            onClick={()=>setSelected(i)}><span>{String.fromCharCode(65+i)}</span>{choice}</button>)}
        </div>
        {submitted && <div className={`quiz-explanation ${isRight?'right':'wrong'}`} role="status">
          <strong>{isRight?'정답입니다.':'정답과 해설을 확인해 보세요.'}</strong><p>{q.explanation}</p>
        </div>}
        <div className="quiz-action">
          {!submitted
            ? <button className="button button-primary" type="button" disabled={selected===null}
                onClick={()=>{setSubmitted(true);if(isRight)setScore(previous=>previous+1)}}>정답 확인 <span aria-hidden="true">→</span></button>
            : <button className="button button-primary" type="button" onClick={next}>{idx===questions.length-1?'결과 보기':'다음 문제'} <span aria-hidden="true">→</span></button>}
        </div>
      </div>
    </div>}
  </div>
}

function Notes() {
  const [selectedWeek,setSelectedWeek]=useState(1)
  const [showPreview,setShowPreview]=useState(true)
  const week=SEMINAR_WEEKS.find(item=>item.week===selectedWeek)||SEMINAR_WEEKS[0]
  const pdfUrl=import.meta.env.BASE_URL+'seminars/week-'+week.week+'.pdf'
  return <div className="seminar-archive">
    <div className="study-subheading"><span className="quiz-kicker">SEMINAR ARCHIVE</span>
      <h3>세미나 자료, 주차별로 모아보기.</h3>
      <p>Runtime;에서 사용한 Python 세미나 교안 4개입니다. 목록에서 주차를 선택하면 자료를 열어보거나 다운로드할 수 있어요.</p>
    </div>
    <div className="seminar-archive-layout">
      <div className="seminar-archive-list" aria-label="세미나 주차 선택">
        {SEMINAR_WEEKS.map(item=><button type="button" key={item.week} aria-pressed={selectedWeek===item.week}
          className={selectedWeek===item.week?'active':''}
          onClick={()=>{setSelectedWeek(item.week);setShowPreview(true)}}>
          <span className="seminar-week-index">{String(item.week).padStart(2,'0')} / WEEK</span>
          <strong>{item.title}</strong>
          <small>{item.pages}페이지 · PDF</small><span className="seminar-week-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className="seminar-archive-detail">
        <div className="seminar-detail-header">
          <span className="quiz-kicker">PYTHON CONCEPT · WEEK {String(week.week).padStart(2,'0')}</span>
          <h4>{week.week}주차 · {week.title}</h4>
          <div className="seminar-topic-tags">{week.topics.map(topic=><span key={topic}>{topic}</span>)}</div>
          <div className="seminar-actions">
            <button type="button" className="seminar-action-btn" onClick={()=>setShowPreview(current=>!current)}
              aria-expanded={showPreview}>{showPreview?'미리보기 접기':'PDF 미리보기'}</button>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="seminar-action-btn">새 탭에서 열기 ↗</a>
            <a href={pdfUrl} download={`Runtime_${week.week}주차_세미나.pdf`} className="seminar-action-btn seminar-download">PDF 다운로드 ↓</a>
          </div>
        </div>
        {showPreview&&<div className="seminar-pdf-preview">
          <iframe key={week.week} src={pdfUrl+'#toolbar=1&navpanes=0'} title={`Runtime; ${week.week}주차 세미나 PDF 미리보기`} loading="lazy"/>
          <p>브라우저에서 미리보기가 지원되지 않으면 ‘새 탭에서 열기’를 사용해 주세요.</p>
        </div>}
      </div>
    </div>
  </div>
}

function Resources() {
  return <div className="resources"><div className="resource-intro">
    <span className="quiz-kicker">RESOURCE LIBRARY</span><h3>코딩 공부에 필요한<br />자료를 한곳에서.</h3>
    <p>공식 학습 문서들을 소개합니다. 주차별 실제 세미나 PDF는 ‘세미나 복습’ 탭에서 볼 수 있어요.</p>
  </div><div className="resource-list">
    <a href="https://docs.python.org/ko/3/tutorial/" target="_blank" rel="noopener noreferrer"><div><span>01 / DOCUMENTATION</span><h4>Python 공식 튜토리얼</h4><p>문법과 기본 개념을 공부하는 공식 문서</p></div><b aria-hidden="true">↗</b></a>
    <a href="https://cran.r-project.org/manuals.html" target="_blank" rel="noopener noreferrer"><div><span>02 / DOCUMENTATION</span><h4>R 공식 매뉴얼</h4><p>R 언어와 데이터 분석 환경에 관한 문서</p></div><b aria-hidden="true">↗</b></a>
    <a href="https://docs.github.com/ko" target="_blank" rel="noopener noreferrer"><div><span>03 / DOCUMENTATION</span><h4>GitHub 공식 문서</h4><p>버전 관리와 협업 기본기 익히기</p></div><b aria-hidden="true">↗</b></a>
  </div></div>
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