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
    week: 4, track: 'advanced', trackName: '심화반', title: '함수와 모듈·패키지', pages: 44,
    summary: '이전 내용을 복습한 뒤 def·return·매개변수, 지역/전역변수, module·package와 import 사용법을 익힙니다.',
    topics: ['def·return','함수 인자','지역·전역변수','module·package'],
    questions: [
      {tag:'함수 정의',question:'Python에서 함수를 정의할 때 사용하는 키워드는?',code:'',choices:['class','function','def','import'],answer:2,explanation:'4주차 함수 정의하기 부분에서는 def 키워드를 사용합니다.'},
      {tag:'return',question:'다음 코드의 출력 결과는?',code:'def add(a, b):\n    return a + b\nprint(add(2, 3))',choices:['2','3','5','None'],answer:2,explanation:'return은 함수의 계산 결과를 호출한 곳으로 돌려줍니다.'},
      {tag:'기본 인자',question:'기본 인자가 있는 함수를 다음과 같이 호출하면 출력되는 값은?',code:'def hello(name="Runtime;"):\n    return name\nprint(hello())',choices:['name','Runtime;','None','오류 발생'],answer:1,explanation:'4주차 함수 인자 설명처럼 인자를 생략하면 기본값이 사용됩니다.'},
      {tag:'가변 인자',question:'함수 정의에서 *args가 의미하는 것은?',code:'def collect(*args):\n    return args',choices:['전역변수를 선언한다','위치 인자를 여러 개 받아 튜플로 묶는다','키워드 인자만 받을 수 있다','모듈을 불러온다'],answer:1,explanation:'교안에서는 *를 가변 인자, **를 미정 키워드 인자로 소개하며 *args는 전달된 위치 인자를 튜플로 모읍니다.'},
      {tag:'모듈 가져오기',question:'다음 코드가 하는 일로 알맞은 것은?',code:'from mymodule import add_txt',choices:['모듈 파일을 삭제한다','add_txt라는 함수를 현재 코드에서 사용하도록 가져온다','모듈을 새로 만든다','모든 Python 파일을 실행한다'],answer:1,explanation:'4주차 Module & Package 부분에서 from ... import ... 형태로 모듈의 함수 이름을 직접 가져오는 방법을 설명합니다.'},
    ],
  },
]
