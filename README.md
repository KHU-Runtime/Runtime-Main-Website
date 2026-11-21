# Runtime;

경희대학교 이과대학 코딩 동아리 **Runtime;** 공식 홈페이지 프로젝트

사이트: https://khu-runtime.github.io/Runtime-Main-Website/

React + Vite + GitHub Pages 기반 반응형 웹사이트입니다.

## 시연 기능

- 전체 펼침 내비게이션 / 모바일 아코디언 메뉴
- 기초반·심화반 체험용 세미나 PDF 미리보기 각 1개 및 체험 퀴즈 각 1세트(5문항)
- 부원 전용 Google Drive 진입 버튼 시연(링크는 아직 미연결)
- 프로젝트 게시판: 글 작성·수정·삭제·검색·필터·파일 첨부
- 수상·소식이 홈 화면에 연동되는 시연
- 동아리 모집 안내 (지원 제출 기능 없음)

**프로젝트 게시판은 발표용**이며 IndexedDB를 사용해 데이터를 현재 브라우저에만 저장합니다. 실제 서버 게시판이 아닙니다. [시연 방법](COMMUNITY_SETUP.md)을 참고하세요.


## 배포

`main` 브랜치에 변경사항을 푸시하면 GitHub Actions의 `Deploy Runtime Website` 워크플로가 실행되어 GitHub Pages에 빌드 결과물을 배포합니다. 워크플로의 마지막 단계는 공개 페이지에 배포 커밋의 리비전이 반영되었는지도 확인하도록 설정되어 있습니다.

## 스터디룸 자료 접근 범위

스터디룸은 기초반 Python 1주차 공개 예시와 심화반 W2 HTML·CSS·바이브코딩 실습 교안을 기준으로 구성되었습니다. 두 과정의 체험 퀴즈는 각각 5문항입니다. 심화반 교안과 5문항 퀴즈는 실제 업로드된 「Runtime; 심화반 W2」(30페이지) 자료에 맞게 구성했습니다.

- 기존 2·3·4주차 Python PDF는 공개 배포 폴더에서 제거했습니다. 현재 체험 공개 PDF는 기초반 1개, 심화반 1개입니다.
- 심화반 원본 PDF의 Base64 보관본은 `assets/Runtime_advanced_W2.pdf.base64`에 있습니다. 빌드 전에 `scripts/restore-advanced-pdf.mjs`가 SHA-256을 검증한 뒤 `public/seminars/Runtime_심화반_W2.pdf`로 원본 바이트를 복원합니다. `npm run dev`, `npm run build`에서 자동 실행됩니다.
- 공개 PDF의 전용 다운로드 버튼과 새 탭 열기 링크는 제공하지 않습니다. 하지만 **PDF URL 자체가 공개되므로 브라우저 저장·다운로드까지 기술적으로 차단할 수는 없습니다.**
- 부원 전용 자료실은 현재 연결 안내만 표시하는 버튼이며, 실제 Google Drive 폴더 URL은 `src/App.jsx`의 `MEMBER_DRIVE_URL`에 추후 설정할 수 있습니다.
- 비회원 접근을 실제로 차단하려면 공개 GitHub 저장소/Pages 폴더에 해당 파일을 두지 않고, 접근 권한이 제한된 스토리지나 Google Drive 폴더로 옮겨야 합니다. 공개 Git 이력에도 이전 PDF가 남아 있을 수 있습니다.
