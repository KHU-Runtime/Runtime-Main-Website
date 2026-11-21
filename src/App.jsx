import React, { useEffect, useState } from 'react'
import './App.css'
import CommunityBoard from './CommunityBoard'
import { PROJECT_EXAMPLES } from './data/projectExamples'
import { SEMINAR_WEEKS } from './data/seminarWeeks'

const INSTAGRAM = 'https://www.instagram.com/khu_runtime/'
const GITHUB = 'https://github.com/KHU-Runtime/Runtime-Main-Website'
// Add the members-only, access-restricted Drive folder URL when ready.
const MEMBER_DRIVE_URL = ''


const NAV = [
  { id: 'home', label: '홈' },
  { id: 'about', label: '동아리 소개', children: [
    { label: 'Runtime; 소개', section: 'overview' },
    { label: '임원진 소개', section: 'team' },
    { label: '운영 안내', section: 'operation' },
  ] },
  { id: 'activities', label: '주요 활동', children: [
    { label: '정기 활동 · 기초반', section: 'seminars' },
    { label: '정기 활동 · 심화반', section: 'practice' },
    { label: '자격증 스터디', section: 'certificates' },
    { label: '공모전 · 팀 프로젝트', section: 'competitions' },
  ] },
  { id: 'projects', label: '프로젝트', children: [
    { label: '활동 기록', section: 'archive' },
    { label: '글쓰기', section: 'manage' },
  ] },
  { id: 'study', label: '스터디룸', children: [
    { label: '세미나 미리보기', section: 'notes' },
    { label: '체험 퀴즈', section: 'quiz' },
    { label: '부원 전용 자료실', section: 'drive' },
  ] },
  { id: 'join', label: '지원 안내', children: [
    { label: '모집 안내', section: 'guide' },
    { label: '함께하는 순간', section: 'community' },
    { label: '자주 묻는 질문(FAQ)', section: 'faq' },
  ] },
]

const REGULAR_SESSIONS = [
  {
    id: 'seminars', n: '01', level: 'BASIC', time: '18:00–18:50',
    title: '기초반', subtitle: '프로그래밍 기초 세미나',
    description: 'Python과 R 등 프로그래밍 언어의 기본 개념을 익히고, 직접 코드를 작성하며 기초 실습을 진행합니다.',
    details: ['기본 문법과 핵심 개념', '실습을 통한 기초 다지기'],
  },
  {
    id: 'practice', n: '02', level: 'ADVANCED', time: '19:00–19:50',
    title: '심화반', subtitle: '응용 실습 · 바이브코딩',
    description: '기초 개념을 바탕으로 웹 개발, 바이브코딩 등 응용 주제를 실습하고 배운 내용을 직접 구현해 봅니다.',
    details: ['응용 주제 중심 세미나', '직접 만들며 익히는 실습'],
  },
]

const EXTRA_ACTIVITIES = [
  {
    id: 'certificates', n: '01', tag: 'CERTIFICATION',
    title: '자격증 스터디',
    image: 'runtime-cert-study.webp',
    imageAlt: '온라인으로 함께 학습하는 화상 스터디 화면',
    description: 'SQLD, ADsP 등 데이터 관련 자격증에 관심 있는 부원들이 함께 학습 목표를 세우고 문제를 풀며 시험을 준비합니다.',
    caption: '함께 계획하고 준비하는 자율 스터디',
  },
  {
    id: 'competitions', n: '02', tag: 'TEAM PROJECT',
    title: '공모전 · 팀 프로젝트',
    image: 'runtime-team-project.webp',
    imageAlt: '한 테이블에서 자료를 살펴보고 의견을 나누는 팀원들',
    description: '공모전, 해커톤, 데이터 분석 및 개발 프로젝트 등에 팀으로 참여하며 배운 기술을 실제 문제 해결에 적용합니다.',
    caption: '아이디어에서 결과물까지, 팀으로 도전',
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
    <PageHeading number="03" eyebrow="주요 활동" title={<>배우고, 만들며<br /><em>함께 성장하는 Runtime;</em></>}
      description="매주 화요일 정기 세미나로 기초부터 응용까지 배우고, 자격증 스터디와 공모전·팀 프로젝트로 경험을 넓혀갑니다." />

    <section className="container activities-program" id="regular" aria-labelledby="activities-program-title">
      <div className="activities-section-head">
        <div>
          <span className="activities-eyebrow">WEEKLY PROGRAM · EVERY TUESDAY</span>
          <h2 id="activities-program-title">기초부터 탄탄히.</h2>
        </div>
        <p>매주 화요일, 기초반과 심화반으로 나누어 배우고 직접 실습하는 정기 활동을 진행합니다.</p>
      </div>
      <div className="activities-timetable-wrap">
        <div className="activities-timetable-day">
          <span>REGULAR SESSION</span>
          <strong>매주 화요일</strong>
          <span>18:00 — 19:50</span>
        </div>
        <table className="activities-timetable">
          <caption>Runtime; 매주 화요일 정기 활동 시간표</caption>
          <thead><tr><th scope="col">시간</th><th scope="col">과정</th><th scope="col">활동 내용</th></tr></thead>
          <tbody>
            {REGULAR_SESSIONS.map(item=><tr key={item.id} id={item.id}>
              <td className="activities-time"><strong>{item.time}</strong><span>매주 화요일</span></td>
              <td className="activities-track">
                <span className="activities-tag">{item.n} / {item.level}</span>
                <h3>{item.title}</h3>
                <span>{item.subtitle}</span>
              </td>
              <td className="activities-description">
                <p>{item.description}</p>
                <ul>{item.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="activities-schedule-note">* 세미나 세부 주제와 운영 일정은 활동 상황에 따라 조정될 수 있습니다.</p>
    </section>

    <section className="activities-extras" id="beyond" aria-labelledby="activities-extras-title">
      <div className="container">
        <div className="activities-section-head">
          <div>
            <span className="activities-eyebrow">BEYOND THE WEEKLY SEMINAR</span>
            <h2 id="activities-extras-title">배움을 실제 경험으로.</h2>
          </div>
          <p>정기 활동에서 얻은 지식을 스터디와 협업 프로젝트로 확장합니다.</p>
        </div>
        <div className="activities-extras-grid">
          {EXTRA_ACTIVITIES.map(item=><article className="activities-extra-card" key={item.id} id={item.id}>
            <div className="activities-extra-top"><span>{item.n} / {item.tag}</span><span aria-hidden="true">↗</span></div>
            <div className="activities-extra-media"><img src={import.meta.env.BASE_URL + 'images/' + item.image} alt={item.imageAlt} loading="lazy" decoding="async" /></div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="activities-extra-caption">{item.caption}</span>
          </article>)}
        </div>
      </div>
    </section>

    <section className="container activity-bottom">
      <div><SectionLabel number="03.1">FROM STUDY TO PROJECT</SectionLabel><h2>배운 내용을 함께<br />직접 구현해 보는 경험.</h2></div>
      <div><p>세미나에서 배운 것을 프로젝트로 연결합니다. Runtime;이 만들어가는 활동과 결과물을 프로젝트 페이지에서 만나보세요.</p>
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
    <div className="study-subheading">
      <span className="quiz-kicker">TRY A QUIZ · PREVIEW</span>
      <h3>기초반과 심화반, 한 세트씩 풀어보기.</h3>
      <p>기초반 Python 예시와 심화반 HTML·CSS 교안에 맞춘 체험 퀴즈입니다. 과정별 5문제를 풀고 해설을 확인해 보세요.</p>
    </div>
    <div className="seminar-week-tabs" role="tablist" aria-label="체험 퀴즈 과정 선택">
      {SEMINAR_WEEKS.map((week,i)=><button type="button" role="tab" key={week.track}
        aria-selected={weekIndex===i} className={weekIndex===i?'active':''}
        onClick={()=>changeWeek(i)}>
        <strong>{week.trackName}</strong><small>{week.title}</small>
      </button>)}
    </div>
    {complete ? <div className="quiz-complete weekly-quiz-complete">
      <span className="quiz-kicker">{activeWeek.trackName} · QUIZ COMPLETE</span>
      <span className="quiz-score">{score}<small> / {questions.length}</small></span>
      <h3>{activeWeek.trackName} 체험 퀴즈 완료!</h3>
      <p>관련 내용을 {activeWeek.trackName} 세미나 미리보기에서 복습해 보세요.</p>
      <button className="button button-primary" type="button" onClick={reset}>이 퀴즈 다시 풀기 <span aria-hidden="true">↻</span></button>
    </div> : <div className="quiz-layout">
      <div className="quiz-sidebar">
        <span className="quiz-kicker">{activeWeek.trackName.toUpperCase()} · {activeWeek.track==='basic'?'PYTHON SAMPLE':'HTML / CSS'}</span>
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
  const [selectedTrack,setSelectedTrack]=useState('basic')
  const [showPreview,setShowPreview]=useState(true)
  const [advancedFileReady,setAdvancedFileReady]=useState(false)
  const week=SEMINAR_WEEKS.find(item=>item.track===selectedTrack)||SEMINAR_WEEKS[0]
  const pdfUrl=import.meta.env.BASE_URL+'seminars/'+(week.track==='advanced'?'Runtime_심화반_W2.pdf':'week-1.pdf')
  useEffect(()=>{
    const controller=new AbortController()
    fetch(import.meta.env.BASE_URL+'seminars/Runtime_심화반_W2.pdf',{method:'HEAD',signal:controller.signal})
      .then(response=>setAdvancedFileReady(response.ok && (response.headers.get('content-type')||'').includes('pdf')))
      .catch(()=>setAdvancedFileReady(false))
    return ()=>controller.abort()
  },[])
  return <div className="seminar-archive">
    <div className="study-subheading">
      <span className="quiz-kicker">SEMINAR PREVIEW · OPEN TO ALL</span>
      <h3>기초반부터 심화반까지, 미리 만나보세요.</h3>
      <p>기초반 Python 예시 교안과 심화반 2주차 HTML·CSS 실습 교안을 소개합니다. 전체 학습자료는 부원 전용 자료실에서 제공할 예정입니다.</p>
    </div>
    <div className="seminar-archive-layout">
      <div className="seminar-archive-list" aria-label="세미나 체험 자료 과정 선택">
        {SEMINAR_WEEKS.map(item=><button type="button" key={item.track} aria-pressed={selectedTrack===item.track}
          className={selectedTrack===item.track?'active':''}
          onClick={()=>{setSelectedTrack(item.track);setShowPreview(true)}}>
          <span className="seminar-week-index">{item.track==='basic'?'01 / BASIC':'02 / ADVANCED'}</span>
          <strong>{item.trackName}</strong>
          <small>{item.title}</small>
          <small>{item.pages}페이지 · {item.track==='advanced'&&!advancedFileReady?'업로드 준비 중':'미리보기'}</small>
          <span className="seminar-week-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className="seminar-archive-detail">
        <div className="seminar-detail-header">
          <span className="quiz-kicker">{week.trackName} · {week.track==='basic'?'PYTHON SAMPLE':'HTML / CSS / VIBE CODING'}</span>
          <h4>{week.title}</h4>
          <div className="seminar-topic-tags">{week.topics.map(topic=><span key={topic}>{topic}</span>)}</div>
          <div className="seminar-actions">
            {(week.track==='basic'||advancedFileReady)
              ? <button type="button" className="seminar-action-btn" onClick={()=>setShowPreview(current=>!current)}
                  aria-expanded={showPreview}>{showPreview?'미리보기 접기':'PDF 미리보기 열기'}</button>
              : <span className="seminar-action-btn seminar-file-pending">심화반 교안 파일 연결 준비 중</span>}
          </div>
        </div>
        {showPreview&&(week.track==='basic'||advancedFileReady)&&<div className="seminar-pdf-preview">
          <iframe key={week.track} src={pdfUrl+'#toolbar=0&navpanes=0'} title={`Runtime; ${week.trackName} 공개 세미나 교안 미리보기`} loading="lazy"/>
          <p>브라우저에 따라 PDF 표시 방식이 다를 수 있습니다. 별도의 다운로드 버튼은 제공하지 않습니다.</p>
        </div>}
      </div>
    </div>
    <p className="seminar-sample-disclaimer">※ 기초반은 Python 1주차 공개 예시입니다. 심화반은 「Runtime; 심화반 W2」(HTML·CSS·바이브코딩 실습) 교안으로 교체되며 PDF 파일 연결을 준비하고 있습니다.</p>
  </div>
}

function StudyRoom({ initialTab = 'notes' }) {
  const [tab,setTab] = useState(['notes','quiz'].includes(initialTab)?initialTab:'notes')
  const [driveMessage,setDriveMessage] = useState(false)
  useEffect(()=>{if(['notes','quiz'].includes(initialTab))setTab(initialTab)},[initialTab])
  return <>
    <PageHeading number="05" eyebrow="스터디룸" title={<>먼저 경험해 보는,<br /><em>Runtime;의 배움.</em></>}
      description="세미나 자료와 미니 퀴즈를 기초반·심화반별로 한 번씩 체험해 보세요. 전체 학습자료는 부원에게 제공됩니다." />
    <section className="container study-section">
      <div className="study-switch" role="tablist" aria-label="스터디룸 기능">
        {[{id:'notes',label:'세미나 미리보기',en:'SEMINAR'},{id:'quiz',label:'체험 퀴즈',en:'QUIZ'}].map(item=>
          <button type="button" role="tab" aria-selected={tab===item.id} key={item.id}
            className={tab===item.id?'selected':''} onClick={()=>setTab(item.id)}>
            <small>{item.en}</small><span>{item.label}</span>
          </button>)}
      </div>
      <div className="study-content" role="tabpanel">
        {tab==='notes'&&<Notes/>}
        {tab==='quiz'&&<Quiz/>}
      </div>
    </section>
    <section id="drive" className="container study-drive-section" aria-labelledby="study-drive-title">
      <div className="study-drive-copy">
        <span className="quiz-kicker">FOR RUNTIME; MEMBERS</span>
        <h2 id="study-drive-title">더 깊이 배우고 싶다면,<br/>부원 전용 자료실에서.</h2>
        <p>전체 세미나 교안과 실습 자료는 부원 전용 Google Drive에서 확인할 수 있도록 준비하고 있습니다.</p>
      </div>
      <div className="study-drive-action">
        {MEMBER_DRIVE_URL
          ? <a className="study-drive-button" href={MEMBER_DRIVE_URL} target="_blank" rel="noopener noreferrer">부원 전용 Google Drive 열기 <span aria-hidden="true">↗</span></a>
          : <button type="button" className="study-drive-button" onClick={()=>setDriveMessage(true)}>부원 전용 Google Drive <span aria-hidden="true">↗</span></button>}
        <small>부원 인증 후 열람할 수 있는 자료실로 연결할 예정입니다.</small>
        {driveMessage&&!MEMBER_DRIVE_URL&&<p className="study-drive-notice" role="status">Google Drive 연결을 준비 중입니다. 현재는 체험용 버튼입니다.</p>}
      </div>
    </section>
  </>
}

const JOIN_FAQ = [
  {
    question: 'Runtime;에서는 어떤 활동을 하나요?',
    answer: '매주 화요일 기초반·심화반 정기 세미나에서 Python, R 등 프로그래밍을 배우고, 응용 실습과 바이브코딩으로 직접 구현하는 경험을 쌓습니다. 이외에도 데이터 관련 자격증 스터디, 공모전, 해커톤 및 팀 프로젝트 등에 참여하며 배움을 확장합니다.',
  },
  {
    question: '코딩을 처음 배우는 사람도 지원할 수 있나요?',
    answer: '기초 문법과 핵심 개념부터 학습하는 기초반이 마련되어 있어 프로그래밍을 처음 접하는 학생도 활동 내용을 살펴볼 수 있습니다. 다만 실제 모집 대상과 선수 지식 요건은 모집 시기마다 달라질 수 있으므로 공식 모집 공지의 지원 자격을 우선 확인해 주세요.',
  },
  {
    question: '기초반과 심화반은 무엇이 다른가요?',
    answer: '기초반은 프로그래밍 언어의 문법과 기본 개념을 익히고 간단한 코드를 작성하는 과정입니다. 심화반은 배운 개념을 웹 개발, 응용 프로그래밍, 바이브코딩 등 실습 중심의 주제에 적용합니다. 각 세미나의 실제 주제와 난이도는 운영 상황에 따라 조정될 수 있습니다.',
  },
  {
    question: '정기 활동은 언제 진행되나요?',
    answer: '정기 세미나는 매주 화요일에 진행됩니다. 기초반은 18:00–18:50, 심화반은 19:00–19:50입니다. 세부 운영 일정과 장소, 휴강 여부는 동아리 공지를 통해 확인해 주세요.',
  },
  {
    question: '자격증 스터디와 팀 프로젝트는 어떻게 참여하나요?',
    answer: 'SQLD·ADsP 등 자격증 스터디와 공모전·해커톤·팀 프로젝트는 정기 세미나 외에 진행하는 확장 활동입니다. 관심 분야와 활동 상황에 맞춰 참여 기회를 살펴볼 수 있으며, 모집 방식·팀 구성·필수 참여 여부 등은 각 활동 공지를 기준으로 안내합니다.',
  },
  {
    question: '전공이나 학년 제한이 있나요?',
    answer: 'Runtime;은 경희대학교 이과대학 코딩 동아리입니다. 학과·학년·전공 관련 지원 자격을 포함한 최종 모집 조건은 해당 모집 공고를 확인해 주세요. 웹사이트는 개별 모집 차수의 지원 자격을 확정해 안내하지 않습니다.',
  },
  {
    question: '세미나 자료는 어디에서 확인하나요?',
    answer: '웹사이트 스터디룸에서는 기초반과 심화반의 공개 예시 교안 및 체험 퀴즈를 확인할 수 있습니다. 전체 학습 자료는 부원 전용 공간을 통해 제공할 예정이며, 전용 Google Drive 연결은 현재 준비 중입니다.',
  },
  {
    question: '동아리에서는 공부 외에 교류할 기회도 있나요?',
    answer: '세미나와 팀 활동을 함께하며 자연스럽게 교류할 수 있습니다. 부원들끼리 식사하거나 모임에 참여하는 등 친목 활동도 동아리 생활의 한 부분이 될 수 있습니다. 구체적인 행사 및 MT 개최 여부와 일정은 공식 공지로 확인해 주세요.',
  },
  {
    question: '모집 일정과 지원 방법은 어디서 확인하나요?',
    answer: '모집 시기, 지원 자격, 선발 절차, 실제 지원 링크는 공식 인스타그램 @khu_runtime의 최신 모집 공지를 확인해 주세요. 현재 웹사이트의 지원하기 버튼은 연결 전인 안내용 버튼이며 웹사이트 자체에서는 지원서를 접수하지 않습니다.',
  },
]

function Join() {
  const base = import.meta.env.BASE_URL
  return <div className="join-page">
    <PageHeading number="06" eyebrow="지원 안내" title={<>Runtime;과<br /><em>함께하고 싶다면.</em></>}
      description="처음 시작하는 코드부터 함께 만드는 프로젝트까지. Runtime;의 활동과 분위기를 알아보고, 모집 공지에서 지원 방법을 확인해 보세요." />

    <section id="guide" className="container join-grid">
      <div className="join-panel">
        <SectionLabel number="06.1">GET STARTED</SectionLabel>
        <h2>새로운 배움을,<br />함께 시작하세요.</h2>
        <p>Runtime;의 정기 세미나와 프로젝트에 관심이 있다면 공식 인스타그램을 통해 모집 일정과 지원 방법을 확인해 주세요. 지원 자격과 선발 방식은 모집 공지에 따라 안내됩니다.</p>
        <div className="join-actions">
          <button type="button" className="button button-primary application-placeholder" disabled title="지원서 연결 전입니다">지원하기 <span aria-hidden="true">↗</span></button>
          <a className="button button-light" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">모집 공지 확인 <span aria-hidden="true">↗</span></a>
        </div>
        <span className="join-note">* 현재 웹사이트에서 직접 지원서를 접수하지 않습니다. 지원 버튼은 연결 준비 중입니다.</span>
      </div>
      <div className="join-side">
        <span className="join-side-kicker">KYUNG HEE UNIVERSITY · RUNTIME;</span>
        <div className="join-side-logo">
          <img src={base + 'runtime-mark.svg'} alt="Runtime; 동아리 공식 로고" />
        </div>
        <p>LEARN TO CODE.<br />BUILD WITH PEOPLE.</p>
      </div>
    </section>

    <section id="community" className="join-community" aria-labelledby="join-community-title">
      <div className="container">
        <div className="join-community-head">
          <div>
            <span className="join-community-eyebrow">PEOPLE & MOMENTS</span>
            <h2 id="join-community-title">함께 배우고,<br />함께 가까워지는 시간.</h2>
          </div>
          <p>세미나와 프로젝트로 시작된 인연은 일상 속 대화와 모임으로도 이어집니다. 함께하는 Runtime;의 분위기를 만나보세요.</p>
        </div>
        <div className="join-community-grid">
          <figure className="join-community-photo join-community-photo-wide">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85" alt="친구들이 야외에서 함께 시간을 보내는 모습" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            <figcaption><strong>함께하는 모임</strong><span>ACTIVITIES & FRIENDSHIP</span></figcaption>
          </figure>
          <figure className="join-community-photo">
            <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=850&q=85" alt="음식을 함께 나누는 식사 자리의 분위기" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            <figcaption><strong>함께 나누는 식사</strong><span>MEALS & CONVERSATIONS</span></figcaption>
          </figure>
          <figure className="join-community-photo">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=850&q=85" alt="함께 여행을 떠나는 분위기를 표현한 여행 사진" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            <figcaption><strong>여행과 MT의 추억</strong><span>TRIPS & MEMORIES</span></figcaption>
          </figure>
        </div>
        <p className="join-community-disclaimer">* 위 이미지는 친목 활동 분위기를 전달하기 위한 Unsplash 참고 사진이며, Runtime;의 실제 행사 사진은 아닙니다. MT 및 모임 운영 여부는 공식 공지를 확인해 주세요.</p>
      </div>
    </section>

    <section id="faq" className="container faq-section join-faq-section">
      <div className="faq-heading">
        <SectionLabel number="06.2">FREQUENTLY ASKED</SectionLabel>
        <h2>궁금한 점을<br />확인해 보세요.</h2>
        <p>지원 전 알아두면 좋은 활동 내용과 안내를 모았습니다.</p>
      </div>
      <div className="faq-list">
        {JOIN_FAQ.map((item, index)=>
          <details key={item.question}>
            <summary><span className="join-faq-number">{String(index+1).padStart(2,'0')}</span><span className="join-faq-question">{item.question}</span><span className="join-faq-toggle" aria-hidden="true">+</span></summary>
            <p>{item.answer}</p>
          </details>
        )}
        <div className="join-faq-footer">
          <strong>더 궁금한 내용이 있나요?</strong>
          <p>모집과 활동에 관한 최신 내용은 공식 인스타그램 공지를 확인해 주세요.</p>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Runtime; 공식 인스타그램 <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </div>
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