# SeungSik Hong

Astro 기반 개인 블로그입니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 글 작성

### 1. 새 포스트 만들기

```bash
npm run new-post -- --title "글 제목" --category AI
```

이 스크립트는 아래를 한 번에 만듭니다.
- `src/content/posts/<slug>.mdx`
- `public/images/posts/<slug>/`
- `public/og/posts/<slug>.svg`
- `public/og/posts/<slug>.png` (PNG 변환이 가능할 때)

`slug`는 글 파일명과 URL에 쓰이는 값입니다. 직접 지정하지 않으면 날짜와 제목을 기준으로 자동 생성됩니다. 한글 제목처럼 영문 slug를 만들기 어려운 경우에는 카테고리를 기준으로 `2026-06-24-ai.mdx` 같은 이름이 생성됩니다.

직접 정하고 싶을 때만 `--slug`를 추가합니다.

```bash
npm run new-post -- --title "글 제목" --category AI --slug my-post
```

### 2. 이미지 추가하기

```bash
npm run add-image -- --slug my-post "/absolute/path/to/image.png"
```

여러 장도 한 번에 넣을 수 있습니다.

```bash
npm run add-image -- --slug my-post "/path/one.png" "/path/two.jpg"
```

이 스크립트는 이미지를 `public/images/posts/<slug>/`로 복사하고, 본문에 붙여 넣을 마크다운 경로를 바로 출력합니다.

### 본문 이미지 규칙

포스트 이미지는 `public/images/posts/<slug>/` 아래에 두고, 본문에서는 절대 경로로 사용합니다.

```md
![설명](/images/posts/my-post/example.png)
```

### MDX 글쓰기

새 포스트는 기본적으로 `.mdx`로 생성됩니다. 아래 컴포넌트는 별도 import 없이 바로 쓸 수 있습니다.

```mdx
<Callout type="note" title="메모">
  남겨둘 판단이나 제약을 적습니다.
</Callout>

<PostImage
  src="/images/posts/my-post/example.png"
  alt="예시 이미지"
  caption="선택 캡션"
  size="wide"
  width={1200}
  height={675}
/>
```

`PostImage`의 `size`는 `narrow`, `wide`, `full`을 지원합니다.
대표 이미지처럼 화면 상단에 중요한 이미지는 `priority={true}`를 추가하고, 가능하면 `width`와 `height`를 함께 적습니다.

### 포스트 메타데이터

허용 카테고리는 `src/config/post-categories.json`에서 관리합니다.

```md
---
title: 글 제목
excerpt: 글 요약
category: AI
publishedAt: 2026-06-24
comments: false
tags:
  - AI
ogImage: /og/posts/my-post.png
---
```

## VS Code 추천

`.vscode/extensions.json`에 추천 확장을 넣어두었습니다.
- Astro
- MDX
- Front Matter
- Markdown All in One
- Paste Image

### VS Code에서 쓰는 흐름

1. `Cmd/Ctrl + Shift + P` → `Tasks: Run Task`
2. `blog:new-post` 실행
3. 제목과 카테고리 입력
4. 생성된 `src/content/posts/<slug>.mdx`에서 글 작성

### 이미지 붙여넣기

`Paste Image` 확장을 설치하면 현재 글의 slug 기준으로 이미지가 자동 저장됩니다.

- 저장 위치: `public/images/posts/<slug>/`
- 붙여넣기 결과: `PostImage` 컴포넌트 블록 자동 삽입

예:

```mdx
<PostImage
  src="/images/posts/my-post/my-post-20260411-133000.png"
  alt="my-post-20260411-133000"
  caption="my-post-20260411-133000"
  size="wide"
/>
```

## 운영 메모

- 메뉴 구성은 `src/config/navigation.ts`의 `navigationConfig`에서 관리합니다.
- `navigationConfig.groups`에 고정 메뉴를 추가할 수 있습니다.
- `navigationConfig.topics.enabled`로 카테고리 자동 메뉴를 켜고 끌 수 있습니다.
- `navigationConfig.topics.showCounts`로 카테고리별 글 수 표시를 제어할 수 있습니다.
- 허용 카테고리는 `src/config/post-categories.json`에서 관리합니다.
- RSS는 `/rss.xml`, 사이트맵은 `/sitemap.xml`에서 생성됩니다.
- 댓글은 `src/config/site.ts`의 Giscus 설정을 채우면 활성화됩니다.
- 방문자 집계는 같은 파일의 GoatCounter 설정을 사용합니다.
- 공유 채널 노출 여부도 `src/config/site.ts`에서 켜고 끕니다.
