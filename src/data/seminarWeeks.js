// Public demonstration only: selected examples from the existing Python week-1 and week-4 decks.
// The advanced example is not the official vibe-coding advanced-class handout.
// Keep only the two demo quiz sets in the public client bundle.
export const SEMINAR_WEEKS = [
  {
    week: 1, track: 'basic', trackName: '기초반', title: 'Python 설치와 변수 생성', pages: 34,
    summary: 'Python 실행 환경을 준비하고, 대화식 모드와 텍스트 에디터 모드의 차이부터 변수·주석·기본 자료형까지 복습합니다.',
    topics: ['Python 설치', 'IDLE', '변수·주석', '자료형'],
    questions: [
      {tag:'변수 생성',question:'Python 변수 이름에 사용할 수 있는 시작 문자는 무엇일까요?',code:'',choices:['숫자 2','밑줄 문자 _','하이픈 -','공백'],answer:1,explanation:'자료의 변수명 규칙에 따르면 첫 글자는 영문자 또는 밑줄(_)을 사용합니다.'},
      {tag:'출력 함수',question:'변수에 저장된 값을 화면에 출력할 때 사용하는 함수는?',code:'value = 10',choices:['input()','type()','print()','int()'],answer:2,explanation:'1주차 교안의 출력 실습에서 print()로 변수와 계산 결과를 표시합니다.'},
      {tag:'주석',question:'Python에서 한 줄 주석을 시작할 때 사용하는 기호는?',code:'a = 1  # 첫 번째 변수',choices:['//','#','<!--','/*'],answer:1,explanation:'한 줄 주석은 # 뒤부터 처리합니다. 교안의 04 주석 넣기 부분을 복습해 보세요.'},
      {tag:'파일 실행',question:'Python 소스 파일을 저장할 때 사용하는 확장자는?',code:'',choices:['.py','.txt','.exe','.docx'],answer:0,explanation:'1주차 텍스트 에디터 모드에서 저장할 때 Python 파일 확장자는 .py입니다.'},
      {tag:'자료형',question:'다음 값의 자료형으로 알맞은 것은?',code:'message = "Runtime;"',choices:['int (정수)','float (실수)','str (문자열)','bool (논리형)'],answer:2,explanation:'따옴표로 묶인 내용은 문자열 자료형(str)에 해당합니다.'},
    ],
  },
  {
    week: 2, track: 'advanced', trackName: '심화반',
    title: 'HTML·CSS와 바이브코딩 실습', pages: 30,
    summary: 'VS Code 환경을 준비하고 HTML 태그와 CSS 스타일을 복습한 뒤, Cline을 활용해 나만의 웹페이지를 만들어 봅니다.',
    topics: ['VS Code', 'HTML', 'CSS', 'Cline', '웹페이지 제작'],
    questions: [
      {
        tag: 'HTML 기본 구조',
        question: '웹 브라우저 화면에 실제로 보이는 내용을 담는 HTML 태그는?',
        code: '<!DOCTYPE html>\n<html>\n  <head><title>Runtime;</title></head>\n  <body>...</body>\n</html>',
        choices: ['<head>', '<title>', '<body>', '<style>'],
        answer: 2,
        explanation: '교안 11페이지에서 <body>는 글자, 그림, 버튼 등 화면에 표시되는 내용을 담는 영역이라고 소개합니다.',
      },
      {
        tag: 'HTML 태그와 속성',
        question: '다음 코드에서 링크의 이동 주소를 지정하는 속성은 무엇일까요?',
        code: '<a href="https://runtime.com">Runtime;</a>',
        choices: ['a', 'href', 'Runtime;', '/a'],
        answer: 1,
        explanation: '교안 10페이지의 예시에서 href는 링크가 가리킬 주소를 지정하는 HTML 속성입니다.',
      },
      {
        tag: 'CSS 기초',
        question: 'CSS에서 요소 바깥쪽의 여백을 설정하는 속성은?',
        code: 'h1 {\n  color: navy;\n  /* 여백을 추가하려면? */\n}',
        choices: ['padding', 'border', 'font-size', 'margin'],
        answer: 3,
        explanation: '교안 20페이지에서 margin은 요소 바깥쪽 여백, padding은 요소 안쪽 여백을 지정합니다.',
      },
      {
        tag: '스타일 연결',
        question: '여러 HTML 문서에서 같은 CSS 파일을 재사용하기에 적합한 방법은?',
        code: '',
        choices: ['각 태그에 style 속성 넣기', 'HTML의 <head>에 외부 CSS 파일 연결하기', '각 HTML 파일에 스타일 규칙 복사하기', '글자 크기를 HTML 태그 이름으로 지정하기'],
        answer: 1,
        explanation: '교안 19페이지는 외부 스타일 시트가 디자인과 내용을 분리하고 여러 문서에서 재사용과 유지보수에 유리하다고 설명합니다.',
      },
      {
        tag: '개발 환경',
        question: 'HTML 파일을 수정하면 웹 브라우저에서 변경 내용을 자동으로 새로고침해 주는 VS Code 확장 프로그램은?',
        code: '',
        choices: ['Prettier', 'Material Icon Theme', 'Live Server', 'Korean Language Pack'],
        answer: 2,
        explanation: '교안 6페이지에 따르면 Live Server는 변경한 HTML 파일을 브라우저에서 실시간으로 확인하도록 도와줍니다.',
      },
    ],
  },

]
