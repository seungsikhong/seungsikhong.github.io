# SeungSik Hong - Developer Blog

개발자 홍승식의 기술 블로그입니다. Next.js 15, TypeScript, Tailwind CSS를 사용하여 구축되었습니다.

## 🚀 주요 기능

- **MDX 기반 콘텐츠 시스템**: 마크다운과 React 컴포넌트를 함께 사용
- **동적 메뉴 시스템**: 사용자가 원하는 메뉴를 자유롭게 구성
- **완전한 반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크모드 지원**: 사용자 선호도에 따른 테마 전환
- **실시간 검색 및 필터링**: 제목, 내용, 태그 기반 검색
- **페이지네이션**: 대량의 포스트를 효율적으로 표시
- **네비게이션 시스템**: 브레드크럼과 뒤로가기 버튼으로 편리한 탐색
- **읽기 최적화**: 목차, 진행률 표시, 읽기 시간 계산
- **SEO 최적화**: 메타데이터, Open Graph 태그 자동 생성
- **자동화된 워크플로우**: 포스트 생성, 메뉴 관리 스크립트

## 📝 포스팅 가이드

### 새로운 포스트 작성하기

#### 1. 스크립트 사용 (권장)

```bash
# 스크립트에 실행 권한 부여
chmod +x scripts/create-post.sh

# 새로운 포스트 생성
./scripts/create-post.sh "포스트 제목" "메뉴/카테고리"

# 예시
./scripts/create-post.sh "Next.js 15 새로운 기능" "tutorial"
./scripts/create-post.sh "개발 팁 모음" "tips"
./scripts/create-post.sh "도구 리뷰" "review"
```

#### 2. 수동으로 생성

1. `src/content/posts/` 디렉토리에 `.mdx` 파일 생성
2. 파일명은 영문 소문자와 하이픈 사용 (예: `my-new-post.mdx`)
3. 프론트매터 작성:

```mdx
---
title: "포스트 제목"
excerpt: "포스트 요약"
date: "2025-01-15"
category: "tutorial"
tags: ["Next.js", "React"]
readTime: "5분"
views: 0
---

# 포스트 내용

여기에 마크다운으로 포스트를 작성하세요.
```

## 🎛️ 메뉴 관리

### 메뉴 설정 스크립트 사용법

```bash
# 스크립트에 실행 권한 부여
chmod +x scripts/manage-menu.sh

# 현재 메뉴 상태 확인
./scripts/manage-menu.sh show

# 메뉴 활성화
./scripts/manage-menu.sh enable tutorial
./scripts/manage-menu.sh enable tips
./scripts/manage-menu.sh enable review

# 메뉴 비활성화
./scripts/manage-menu.sh disable review

# 메뉴 설명 수정
./scripts/manage-menu.sh desc tutorial "단계별 학습 가이드와 실습 예제"

# 메뉴 아이콘 수정
./scripts/manage-menu.sh icon project Rocket

# 사용 가능한 아이콘 목록 확인
./scripts/manage-menu.sh icons
```

### 사용 가능한 메뉴

| 메뉴 ID | 메뉴명 | 설명 | 기본 아이콘 |
|---------|--------|------|-------------|
| `tutorial` | 튜토리얼 | 단계별 학습 가이드와 실습 예제 | BookOpen |
| `tips` | 팁 & 트릭 | 개발하면서 발견한 유용한 팁들 | Lightbulb |
| `review` | 리뷰 | 사용해본 도구와 서비스 리뷰 | Star |
| `project` | 프로젝트 | 개인 프로젝트 개발 과정과 결과 | Code |
| `study` | 스터디 | 새로운 기술 학습 노트 | BookOpen |

### 사용 가능한 아이콘

기본 아이콘: `Home`, `FileText`, `User`, `FolderOpen`, `Mail`, `BookOpen`, `Code`, `Heart`, `Star`, `Lightbulb`, `Database`, `Wrench`, `GitBranch`, `Rocket`, `Globe`, `Settings`, `Zap`, `Target`, `Palette`, `Camera`, `Music`, `Gamepad2`, `Coffee`, `Gift`

### 메뉴 설정 파일

메뉴 설정은 `src/config/menuSettings.json` 파일에서 관리됩니다:

```json
{
  "activeMenus": ["project"],
  "menuOrder": ["home", "posts", "project"],
  "menuDescriptions": {
    "project": "개인 프로젝트 개발 과정과 결과"
  },
  "menuIcons": {
    "project": "Code"
  }
}
```

### 프론트매터 필드 설명

| 필드 | 설명 | 예시 |
|------|------|------|
| `title` | 포스트 제목 | "Next.js 15 새로운 기능" |
| `excerpt` | 포스트 요약 | "App Router와 Server Components 소개" |
| `date` | 작성 날짜 | "2025-01-15" |
| `category` | 카테고리 | "tutorial", "tips", "review", "project", "study" |
| `tags` | 태그 배열 | `["Next.js", "React", "TypeScript"]` |
| `readTime` | 예상 읽기 시간 | "5분", "10분" |
| `views` | 조회수 (초기값 0) | 0 |

### 마크다운 문법

```mdx
# 제목 1
## 제목 2
### 제목 3

**굵은 글씨**
*기울임 글씨*

- 리스트 항목 1
- 리스트 항목 2

1. 번호 리스트 1
2. 번호 리스트 2

> 인용문

[링크 텍스트](https://example.com)

![이미지 설명](image-url)

```javascript
// 코드 블록
function hello() {
  console.log("Hello World");
}
```

| 테이블 | 헤더 |
|--------|------|
| 셀 1   | 셀 2 |
```

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (MDX 자동 빌드 포함)
npm run dev-full

# 일반 개발 서버 실행
npm run dev

# MDX 데이터 빌드
npm run build-data

# MDX 파일 변경 감시
npm run watch-mdx

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### Node.js 설치 (macOS)

#### Homebrew 사용 (권장)

```bash
# Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node

# 설치 확인
node --version
npm --version
```

#### 공식 웹사이트에서 다운로드

1. [Node.js 공식 웹사이트](https://nodejs.org/) 방문
2. LTS 버전 다운로드 및 설치

## 📁 프로젝트 구조

```
seungsikhong.github.io/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── posts/             # 포스트 페이지
│   │   │   ├── [slug]/        # 동적 포스트 페이지
│   │   │   └── page.tsx       # 포스트 목록 페이지
│   │   ├── menu/              # 메뉴별 페이지
│   │   │   └── [menu]/        # 동적 메뉴 페이지
│   │   ├── category/          # 카테고리별 페이지
│   │   │   └── [category]/    # 동적 카테고리 페이지
│   │   └── page.tsx           # 메인 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── ReadingLayout.tsx  # 읽기 레이아웃
│   │   ├── LeftSidebar.tsx    # 좌측 사이드바
│   │   ├── SearchBar.tsx      # 검색바
│   │   ├── FilterBar.tsx      # 필터바
│   │   ├── Pagination.tsx     # 페이지네이션
│   │   └── ...
│   ├── content/               # MDX 콘텐츠
│   │   └── posts/            # 포스트 파일들
│   ├── config/               # 설정 파일
│   │   └── menuSettings.json # 메뉴 설정
│   ├── data/                 # 정적 데이터
│   │   └── posts.json        # 빌드된 포스트 데이터
│   └── utils/                # 유틸리티 함수
│       ├── mdx.ts           # MDX 처리 함수
│       ├── staticData.ts    # 정적 데이터 로더
│       ├── menuConfig.ts    # 메뉴 구성
│       └── menuLoader.ts    # 메뉴 로더
├── scripts/                  # 유틸리티 스크립트
│   ├── create-post.sh       # 포스트 생성 스크립트
│   ├── manage-menu.sh       # 메뉴 관리 스크립트
│   ├── simple-markdown.js   # MDX to HTML 변환
│   ├── watch-mdx.js         # MDX 파일 감시
│   ├── dev.js               # 통합 개발 서버
│   └── post-template.mdx    # 포스트 템플릿
└── public/                  # 정적 파일
```

## 🔄 개발 워크플로우

### 1. 포스트 작성 워크플로우

```bash
# 1. 새 포스트 생성
./scripts/create-post.sh "포스트 제목" "메뉴ID"

# 2. 포스트 내용 작성 (VS Code에서 자동으로 열림)

# 3. 개발 서버 실행 (MDX 자동 빌드)
npm run dev-full

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 2. 메뉴 관리 워크플로우

```bash
# 1. 현재 메뉴 상태 확인
./scripts/manage-menu.sh show

# 2. 메뉴 활성화/비활성화
./scripts/manage-menu.sh enable tutorial
./scripts/manage-menu.sh disable review

# 3. 메뉴 설명 수정
./scripts/manage-menu.sh desc tutorial "새로운 설명"

# 4. 변경사항 확인 (개발 서버 재시작)
npm run dev-full
```

### 3. 배포 워크플로우

```bash
# 1. 포스트 작성 및 테스트
npm run dev-full

# 2. 변경사항 커밋
git add .
git commit -m "새 포스트 추가: 포스트 제목"

# 3. GitHub에 푸시 (자동 배포)
git push origin main
```

## 🎨 커스터마이징

### 테마 변경

`tailwind.config.ts`에서 색상 팔레트를 수정할 수 있습니다.

### 컴포넌트 수정

각 컴포넌트는 `src/components/` 디렉토리에 있으며, 필요에 따라 수정 가능합니다.

### 스타일 수정

글로벌 스타일은 `src/app/globals.css`에서 수정할 수 있습니다.

## 📚 사용된 기술

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Deployment**: GitHub Pages

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

- **이름**: 홍승식
- **직업**: Full Stack Developer
- **기술 스택**: Next.js, React, TypeScript, Node.js

---

**참고**: 이 블로그는 읽기에 집중할 수 있는 인터페이스를 목표로 설계되었습니다.
