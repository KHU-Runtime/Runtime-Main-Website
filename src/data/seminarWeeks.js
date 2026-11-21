// Uploaded Runtime; Python seminar decks (weeks 1–4). All quizzes are derived from those decks.
export const SEMINAR_WEEKS = [
  {
    week: 1, title: 'Python 설치와 변수 생성', pages: 34,
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
    week: 2, title: '자료형과 연산자', pages: 41,
    summary: '스칼라 자료형과 Python 연산자를 익히고, 문자열·리스트·튜플 등 시퀀스 자료형의 기초를 살펴봅니다.',
    topics: ['스칼라 자료형', '연산자', '시퀀스', '문자열'],
    questions: [
      {tag:'스칼라 자료형',question:'True와 False를 표현하는 Python 자료형은?',code:'value = True',choices:['int','str','bool','list'],answer:2,explanation:'2주차 scalar 자료형에는 정수·실수·복소수·논리형(bool) 등이 소개됩니다.'},
      {tag:'진법 변환',question:'다음 코드의 출력 결과는 무엇일까요?',code:"print(int('101', 2))",choices:['101','5','2','오류 발생'],answer:1,explanation:'int(문자열, 2)는 이진수 문자열을 십진 정수로 변환합니다. 101₂는 5입니다.'},
      {tag:'대입 연산자',question:'다음 코드를 실행한 뒤 a의 값은?',code:'a = 3\na += 2\nprint(a)',choices:['2','3','5','6'],answer:2,explanation:'교안의 연산자 축약에서 a += 2는 a = a + 2와 같습니다.'},
      {tag:'논리 연산자',question:'다음 코드의 실행 결과는?',code:'print(True and False)',choices:['True','False','None','0과 1이 모두 출력됨'],answer:1,explanation:'and 연산자는 두 조건이 모두 True일 때만 True입니다.'},
      {tag:'시퀀스 자료형',question:'다음 코드가 만드는 자료형은?',code:"items = ('a', 'b')",choices:['리스트(list)','문자열(str)','딕셔너리(dict)','튜플(tuple)'],answer:3,explanation:'2주차 시퀀스 자료형에서 괄호 ()로 만든 요소 모음은 튜플입니다.'},
    ],
  },
  {
    week: 3, title: '시퀀스와 조건문·반복문', pages: 39,
    summary: 'list·tuple의 차이와 인덱싱·슬라이싱, dictionary, if·for·while 및 break·continue를 공부합니다.',
    topics: ['list·tuple','indexing','dictionary','if·for·while'],
    questions: [
      {tag:'list와 tuple',question:'다음 설명 중 옳은 것은 무엇일까요?',code:'',choices:['tuple은 요소를 변경할 수 있다','list는 요소를 변경할 수 있다','dictionary는 순서 번호로만 조회한다','list는 하나의 자료형만 담을 수 있다'],answer:1,explanation:'3주차 교안에서 list는 값 변경이 가능하고 tuple은 요소 변경이 불가능하다고 설명합니다.'},
      {tag:'인덱싱',question:'다음 코드의 출력 결과는?',code:'nums = [10, 20, 30]\nprint(nums[-1])',choices:['10','20','30','오류 발생'],answer:2,explanation:'음수 인덱스 -1은 시퀀스의 마지막 요소에 접근합니다.'},
      {tag:'슬라이싱',question:'다음 코드의 결과로 알맞은 것은?',code:'nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])',choices:['[1, 2, 3, 4]','[2, 3, 4]','[2, 3, 4, 5]','[1, 4]'],answer:1,explanation:'슬라이싱 [1:4]는 인덱스 1부터 4 직전까지의 요소를 선택합니다.'},
      {tag:'딕셔너리',question:'다음 코드의 실행 결과는?',code:"score = {'python': 90, 'r': 85}\nprint(score['python'])",choices:['python','90','85','0'],answer:1,explanation:'딕셔너리는 키(key)로 값을 조회하며 score[\'python\']은 90을 반환합니다.'},
      {tag:'반복문',question:'다음 코드에서 출력되는 수는?',code:'for i in range(1, 5):\n    if i % 2 == 0:\n        continue\n    print(i)',choices:['1, 3','2, 4','1, 2, 3, 4','4만 출력'],answer:0,explanation:'continue는 현재 반복의 나머지 부분을 건너뜁니다. 따라서 홀수 1과 3만 출력됩니다.'},
    ],
  },
  {
    week: 4, title: '함수와 모듈·패키지', pages: 44,
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
