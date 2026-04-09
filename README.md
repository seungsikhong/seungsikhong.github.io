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
npm run new-post -- --title "글 제목" --category Notes --slug my-post
```

이 스크립트는 아래를 한 번에 만듭니다.
- `src/content/posts/<slug>.md`
- `public/images/posts/<slug>/`
- `public/og/posts/<slug>.svg`
- `public/og/posts/<slug>.png`

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

### 포스트 메타데이터

허용 카테고리는 `src/content/categories.ts`에서 관리합니다.

```md
---
title: 글 제목
excerpt: 글 요약
category: Notes
publishedAt: 2026-04-07
comments: false
tags:
  - Notes
ogImage: /og/posts/my-post.png
---
```

## 운영 메모

- 댓글은 `src/config/site.ts`의 Giscus 설정을 채우면 활성화됩니다.
- 방문자 집계는 같은 파일의 GoatCounter 설정을 사용합니다.
- 공유 채널 노출 여부도 `src/config/site.ts`에서 켜고 끕니다.
