# Runtime; 커뮤니티 게시판 — 실제 글 저장 설정

Runtime; 프로젝트 페이지에는 **일반 회원이 직접 로그인하고 글을 공개하는 기능**이 구현되어 있습니다. GitHub Pages만으로는 서버에 글과 파일을 저장할 수 없어서 Supabase (Postgres, Auth, Storage) 연결이 필요합니다.

## 1. Supabase 프로젝트 생성과 데이터베이스

1. [Supabase](https://supabase.com/dashboard)에서 프로젝트를 새로 만듭니다.
2. Supabase Dashboard → **SQL Editor**에 [supabase/community.sql](supabase/community.sql) 전체를 입력해 실행합니다.
3. **Authentication → Providers → Email**에서 Email 가입을 사용하고 이메일 인증을 활성화합니다.
4. **Authentication → URL Configuration**의 Site URL을 `https://khu-runtime.github.io/Runtime-Main-Website/`로 설정합니다.
5. SQL 실행 후 `public.community_posts` 테이블과 `community-uploads` 저장소가 생성됐는지 확인합니다.

> 실명, 계정 이메일, 비밀번호 및 GitHub 개인 액세스 토큰을 공개 GitHub 저장소나 채팅에 붙여넣지 마세요.

## 2. GitHub Actions에서 공개 연결 정보 설정

Supabase Dashboard의 Project URL과 **publishable key (sb_publishable_...)**를 확인합니다.

GitHub → Runtime-Main-Website → Settings → Secrets and variables → Actions → **Variables**에 추가합니다.

| 변수 | 값 |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

GitHub Actions `deploy.yml`이 이 두 환경 변수를 Vite 빌드에 주입하도록 준비되어 있습니다. 둘 다 **브라우저용 공개 값**이며 권한 보호는 RLS 정책이 담당합니다. **Supabase secret key / service_role key는 절대로 GitHub Pages 프런트엔드에 넣지 마세요.**

설정 후 GitHub Actions에서 `Deploy Runtime Website` 작업을 `workflow_dispatch`로 다시 실행하거나 main에 변경을 푸시하면 됩니다.

## 3. 일반 사용자 게시 동작

- 회원가입: 이메일과 비밀번호 입력 → 이메일 인증 → 로그인
- 프로젝트·해커톤·공모전·경진대회: 로그인한 사람이 **즉시 공개**로 작성·저장 가능
- `수상·소식` 분류나 수상 내용이 들어간 글: **검토 대기**로 저장; 작성자만 자신의 대기 글을 볼 수 있음
- 공개 글: 로그인 없이 누구나 읽을 수 있음
- 작성자: 본인 글 삭제 가능
- 파일: JPG/PNG/WebP/GIF/PDF/PPTX/DOCX/ZIP/CSV/XLSX 등 최대 5개, 각각 8MB
- 업로드된 파일은 공개 저장소에 올라가므로 비공개 자료나 개인정보 포함 문서는 업로드하면 안 됩니다.

**수상글 승인 예시**: 운영진이 Supabase SQL Editor에서 확인 후 아래 SQL을 실행하면 공개됩니다.

```sql
update public.community_posts
set status = 'approved'
where id = '게시글-UUID'
  and (category = '수상·소식' or length(trim(award)) > 0)
  and status = 'pending';
```

실제 게시글 UUID는 Supabase Dashboard → Table Editor에서 확인하세요. 운영진 전용 승인 화면을 원하면 추후 확장할 수 있습니다.

## 4. 검증 체크리스트

1. 게시판에서 이메일로 회원가입 → 인증 후 로그인
2. 일반 프로젝트 글 등록 → 다른 브라우저에서 새로고침해도 공개 목록에 표시되는지 확인
3. 사진/PDF 첨부 → 공개 게시글에서 열리는지 확인
4. 수상·소식 글 등록 → 본인에게만 '검토 대기'로 보이는지 확인
5. SQL로 승인 → 비로그인 방문자에게도 나타나는지 확인
6. 다른 사용자 계정에서 남의 글을 삭제할 수 없는지 확인

## 5. 보안과 운영 주의사항

- Supabase SQL의 **RLS(Row Level Security)**가 DB의 작성자 소유권과 공개 조건을 강제합니다.
- 파일 업로드 권한은 로그인한 사용자의 UUID 폴더로 제한됩니다.
- 기본 가입 제한이 없는 만큼 스팸 방지를 위해 Supabase Authentication의 CAPTCHA와 이메일 전송 제한을 검토하세요.
- 현재 파일 저장소는 공개 버킷입니다. **수상글 승인 전이라도 업로드 파일 URL을 알고 있는 사람은 파일을 볼 수 있습니다.** 비공개 자료를 다루려면 비공개 버킷과 승인 후 접근 허가 구조로 재설계해야 합니다.
- 작성자 글 수정, 신고 접수, 운영진 대시보드, 이미지 최적화는 다음 단계로 확장 가능합니다.

## 기술 참고

현재 구현은 `src/lib/communityApi.js`에서 Supabase의 공개 REST/Auth/Storage API를 호출합니다. 별도의 로그인 비밀키를 프런트엔드에 저장하지 않습니다. DB를 아직 연결하지 않았다면 사이트에는 '실제 게시판 연결 준비 중' 문구가 보이고 저장 기능은 작동하지 않습니다.
