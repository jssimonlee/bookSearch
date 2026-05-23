# 📖 LuminaBook - 프리미엄 도서 검색 서비스

Google Books API를 활용하여 전 세계 모든 작가와 도서를 실시간으로 검색하고, 인기순(평점), 댓글순(리뷰수), 최신 출판년도순으로 스마트하게 탐색할 수 있는 세련된 글래스모피즘(Glassmorphism) 기반 다크 테마 웹 애플리케이션입니다.

---

## ⚡ 주요 기능
1. **분기 선택 검색**: ✍️작가명 검색과 📖책 제목 검색 조건을 필터로 선택하여 타겟 검색이 가능합니다.
2. **지능형 다국어 필터**: 🌐 모든 언어, 한국어, 영어, 일본어 등 8개 다국어를 메뉴에서 필터링 조작할 수 있습니다.
3. **클라이언트 사이드 하이브리드 정렬**: API가 지원하지 않는 평점(averageRating), 리뷰 수(ratingsCount) 기준의 정밀한 동적 인기/댓글 정렬을 클라이언트 연산으로 지원합니다.
4. **무제한 더 불러오기 (Load More)**: 구글 API가 익명 요청 시 한 번에 10~20개로 도서 수를 강제 제한(Capping)하는 문제를 우회하여 무중단으로 계속 데이터를 추가 확장 로딩합니다.
5. **Vercel 서버리스 프록시 탑재**: API Key의 브라우저 유출을 100% 원천 차단하기 위한 백엔드 프록시 라우트(`/api/search.js`)를 통합 설계하여 보안을 강화했습니다.

---

## 🚨 Git 계정 설정 트러블슈팅 가이드 (Troubleshooting)

프로젝트별로 Git 저자(Author) 정보가 꼬이거나, OS 계정명으로 잘못 커밋이 들어갈 때 **언제든지 이 문서를 열어 대처법을 참고**하세요.

### 1. 현재 이 프로젝트 폴더가 어떤 계정을 쓰고 있는지 확인하기
새로운 프로젝트를 시작했을 때, 지금 어떤 이름과 이메일로 깃 커밋이 잡혀있는지 먼저 조회하는 습관을 들이면 안전합니다.
```bash
git config user.name
git config user.email
```

### 2. 임시 덮어쓰기(로컬 설정)가 들어가 있다면 강제 해제하기
이전 작성자 명의가 다르게 나오는 원인은 대부분 특정 폴더에 강제 덮어쓰기(`--local`) 설정이 먹혀있기 때문입니다. 아래 명령어로 로컬 서랍을 완전히 삭제해 주면, 컴퓨터에 기본 등록된 내 원래 글로벌 계정(`jssimonlee`)으로 즉각 정상 복구됩니다.
```bash
git config --local --unset user.name
git config --local --unset user.email
```

### 3. 내 컴퓨터 본래의 글로벌 기본 계정이 무엇인지 점검하기
컴퓨터 시스템 자체에 안전하게 박혀 있는 기본값은 아래 명령어로 확인할 수 있습니다.
```bash
git config --global user.name   # (jssimonlee 출력)
git config --global user.email  # (jssimonlee@gmail.com 출력)
```

### 4. [마법의 치트키] 이미 잘못 들어간 이전 커밋 명의들 한 번에 일괄 수정하기
커밋을 올렸는데 닉네임이나 이메일이 잘못 박혀 잔디가 안 심어지거나 경고가 뜰 때, 터미널에 아래 스크립트를 그대로 복사해서 실행하시면 **이전 커밋들의 저자 메타데이터가 올바른 jssimonlee 명의로 단번에 소급 적용**됩니다.
```bash
git filter-branch -f --env-filter '
export GIT_AUTHOR_NAME="jssimonlee"
export GIT_AUTHOR_EMAIL="jssimonlee@gmail.com"
export GIT_COMMITTER_NAME="jssimonlee"
export GIT_COMMITTER_EMAIL="jssimonlee@gmail.com"
' HEAD
```
*작업 후 `git push -f origin main`으로 깃허브 원격을 동기화(강제 푸시)해 주면 깃허브 잔디가 정상적으로 싹 복구됩니다.*

---

## 💻 로컬 개발 서버 구동 방법
```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 환경 서버 구동 (http://localhost:5173)
npm run dev
```

## 🚀 배포 가이드
* **Vercel**: Vercel 대시보드에 일반 환경변수 **`GOOGLE_BOOKS_API_KEY`** 명칭(VITE_를 뺀 이름!)으로 구글 API 키를 등록하면, 서버리스 함수를 통해 안전하게 보안 배포가 완료됩니다.
* **GitHub Pages**: 코드를 리포지토리에 푸시하는 즉시 내장된 GitHub Actions 워크플로우에 의해 자동으로 빌드 및 무료 정적 사이트 호스팅이 활성화됩니다.
