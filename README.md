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

## 블로그 명령어

블로그 작성 관련 명령어는 `blog:*` 형태로 통일합니다.

```bash
npm run blog:meta
npm run blog:new
npm run blog:image -- --slug my-post "/absolute/path/to/image.png"
```

- `blog:meta`: 현재 등록된 카테고리, 태그, 메뉴 노출 상태를 조회합니다.
- `blog:new`: 새 글을 만듭니다. 옵션 없이 실행하면 대화형으로 제목, 카테고리, 태그를 물어봅니다.
- `blog:image`: 글에 넣을 이미지를 복사하고 `PostImage` 블록을 출력합니다.

기존 `new-post`, `list-post-meta`, `add-image` 명령도 호환용으로 남아 있지만, 새로 쓸 때는 `blog:*` 명령을 권장합니다.

## 글 작성 흐름

처음 글을 쓰기 전에는 카테고리와 태그를 먼저 정합니다.

- 카테고리: 글의 큰 분류입니다. 글마다 1개만 씁니다.
- 태그: 글의 주제 키워드입니다. 글마다 여러 개 쓸 수 있습니다.
- 메뉴: `navigation.json`의 `sections` 순서대로 화면에 표시됩니다. 태그에 `menu: true`를 주면 해당 태그가 메뉴에 자동 노출됩니다.

### 1. 카테고리 추가

카테고리는 `src/config/post-categories.json`에서 관리합니다.

처음 상태는 비어 있습니다.

```json
[]
```

예를 들어 `Notes` 카테고리를 쓰려면 아래처럼 추가합니다.

```json
[
  "Notes"
]
```

여러 개를 둘 수도 있습니다.

```json
[
  "Notes",
  "Implementation",
  "Architecture"
]
```

글을 작성할 때 `category`에는 여기에 등록된 값만 사용할 수 있습니다. 등록되지 않은 카테고리를 쓰면 빌드에서 실패합니다.

### 2. 태그 추가

태그는 `src/config/post-tags.json`에서 관리합니다.

처음 상태는 비어 있습니다.

```json
[]
```

태그를 추가하려면 아래처럼 작성합니다.

```json
[
  {
    "label": "AI"
  }
]
```

이 태그를 메뉴에도 노출하고 싶으면 `menu`를 `true`로 둡니다.

```json
[
  {
    "label": "AI",
    "menu": true
  }
]
```

글을 작성할 때 `tags`에는 여기에 등록된 값만 사용할 수 있습니다. 등록되지 않은 태그를 쓰면 빌드에서 실패합니다.

### 3. 메뉴 추가

메뉴 설정은 `src/config/navigation.json`에서 관리합니다. 이 파일은 화면에 보이는 사이드바 섹션과 순서를 정합니다.

먼저 역할을 분리해서 이해하면 됩니다.

- `post-categories.json`: 글 작성 시 사용할 수 있는 카테고리를 정합니다.
- `post-tags.json`: 글 작성 시 사용할 수 있는 태그를 정합니다.
- `navigation.json`: 화면에 어떤 메뉴 섹션을 보여줄지 정합니다.

즉 `navigation.json`에 메뉴를 추가한다고 해서 글 작성 시 사용할 카테고리나 태그가 생기지는 않습니다. 글에서 쓸 수 있는 값은 항상 `post-categories.json`, `post-tags.json`에 등록된 값만 가능합니다.

현재 기본 구조는 아래처럼 세 섹션으로 나뉩니다.

- `메뉴`: `/posts/`, `/about/`처럼 항상 보여줄 링크입니다.
- `주제`: `post-tags.json`에서 `menu: true`인 태그가 자동으로 들어옵니다.
- `카테고리`: 글이 있는 카테고리가 자동으로 들어옵니다.

예시는 아래와 같습니다.

```json
{
  "sections": [
    {
      "label": "메뉴",
      "items": [
        { "type": "link", "label": "글", "href": "/posts/", "icon": "writing" },
        { "type": "link", "label": "소개", "href": "/about/", "icon": "about" }
      ]
    },
    {
      "label": "주제",
      "items": [
        {
          "type": "tags",
          "source": "menu",
          "showCounts": true,
          "includeEmpty": true,
          "icon": "tag"
        }
      ]
    },
    {
      "label": "카테고리",
      "items": [
        {
          "type": "categories",
          "showCounts": true,
          "includeEmpty": false,
          "icon": "topic"
        }
      ]
    }
  ]
}
```

각 `items`의 `type`은 아래처럼 이해하면 됩니다.

- `link`: 직접 지정한 링크를 보여줍니다.
- `tags`: 등록된 태그를 메뉴로 보여줍니다.
- `categories`: 등록된 카테고리를 메뉴로 보여줍니다.

`type: "tags"`는 `source: "menu"`일 때 `post-tags.json`에서 `menu: true`인 태그만 보여줍니다. 즉 `navigation.json`에 `AI` 같은 실제 태그명을 다시 적지 않습니다.

`type: "categories"`는 글이 있는 카테고리를 자동으로 보여줍니다. 현재 설정은 `includeEmpty: false`라서 글이 없는 카테고리는 메뉴에 나오지 않습니다.

예를 들어 `AI`를 글 태그로 쓰고 메뉴에도 보여주려면 `navigation.json`을 고치지 않고 `post-tags.json`에만 아래처럼 추가합니다.

```json
[
  {
    "label": "AI",
    "menu": true
  }
]
```

이후 글에서는 아래처럼 씁니다.

```md
---
category: Notes
tags:
  - AI
---
```

단, 위 예시의 `Notes`도 `post-categories.json`에 먼저 등록되어 있어야 합니다.

SEO 기준으로 빈 태그/카테고리 페이지는 `noindex,follow`가 적용됩니다. 글이 1개 이상 생기면 자동으로 `index,follow`가 됩니다.

### 4. 작성 전 설정 조회

현재 등록된 카테고리, 태그, 메뉴 노출 상태는 아래 명령으로 확인합니다.

```bash
npm run blog:meta
```

출력에서 확인할 것:

- `Categories`: 글의 `category`에 쓸 수 있는 값
- `Tags`: 글의 `tags`에 쓸 수 있는 값
- `(menu)`: 메뉴에 노출되는 태그
- `New post example`: 현재 설정 기준으로 바로 실행 가능한 글 생성 예시

### 5. 글 목록 필터링

`/posts/` 글 목록에는 카테고리와 태그 필터가 표시됩니다.

- 카테고리 필터는 글의 `category` 값을 기준으로 동작합니다.
- 태그 필터는 글의 `tags` 값을 기준으로 동작합니다.
- 필터를 선택하면 현재 목록에서 조건에 맞는 글만 보여줍니다.
- 필터 상태는 `/posts/?category=...&tag=...` 형태로 URL에 반영됩니다.

이 필터는 사용자가 글 목록을 빠르게 탐색하기 위한 UI 기능입니다. SEO 색인용 페이지는 별도로 생성되는 `/topics/...`, `/tags/...` 페이지가 담당합니다.

### 6. 새 포스트 만들기

가장 쉬운 방법은 대화형 명령을 쓰는 것입니다.

```bash
npm run blog:new
```

명령을 실행하면 제목, 카테고리, 태그를 순서대로 물어봅니다. 카테고리와 태그는 번호로 선택할 수 있고, 태그는 쉼표로 여러 개를 입력할 수 있습니다.

직접 한 줄로 만들고 싶으면 아래처럼 옵션을 넣습니다.

```bash
npm run blog:new -- --title "글 제목" --category "카테고리"
```

이 스크립트는 아래를 한 번에 만듭니다.
- `src/content/posts/<slug>.mdx`
- `public/images/posts/<slug>/`
- `public/og/posts/<slug>.svg`
- `public/og/posts/<slug>.png` (PNG 변환이 가능할 때)

`slug`는 글 파일명과 URL에 쓰이는 값입니다. 직접 지정하지 않으면 날짜와 제목을 기준으로 자동 생성됩니다. 한글 제목처럼 영문 slug를 만들기 어려운 경우에는 카테고리를 기준으로 `2026-06-24-ai.mdx` 같은 이름이 생성됩니다.

직접 정하고 싶을 때만 `--slug`를 추가합니다.

```bash
npm run blog:new -- --title "글 제목" --category "카테고리" --slug my-post
```

태그를 함께 넣고 싶으면 쉼표로 구분합니다.

```bash
npm run blog:new -- --title "글 제목" --category "카테고리" --tags "태그1,태그2"
```

`blog:new`는 등록되지 않은 카테고리나 태그를 받으면 실패합니다. 이때는 `npm run blog:meta`로 사용할 수 있는 값을 확인한 뒤 다시 실행합니다.

### 7. 이미지 추가하기

```bash
npm run blog:image -- --slug my-post "/absolute/path/to/image.png"
```

여러 장도 한 번에 넣을 수 있습니다.

```bash
npm run blog:image -- --slug my-post "/path/one.png" "/path/two.jpg"
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

```md
---
title: 글 제목
excerpt: 글 요약
category: 카테고리
publishedAt: 2026-06-24
comments: false
tags:
  - 태그
ogImage: /og/posts/my-post.png
---
```

메타데이터 작성 기준:

- `title`: 글 제목입니다.
- `excerpt`: 목록, 검색 결과, SNS 미리보기에 쓰일 한 문장 요약입니다.
- `category`: `post-categories.json`에 등록된 값 중 하나만 씁니다.
- `publishedAt`: 게시 날짜입니다.
- `comments`: 댓글을 열면 `true`, 닫으면 `false`입니다.
- `tags`: `post-tags.json`에 등록된 값을 여러 개 쓸 수 있습니다.
- `ogImage`: SNS 공유 이미지 경로입니다. `blog:new`가 기본값을 자동 생성합니다.

## VS Code 추천

`.vscode/extensions.json`에 추천 확장을 넣어두었습니다.
- Astro
- MDX
- Front Matter
- Markdown All in One
- Paste Image

### VS Code에서 쓰는 흐름

1. `Cmd/Ctrl + Shift + P` → `Tasks: Run Task`
2. `blog:meta` 실행
3. 사용 가능한 카테고리와 태그 확인
4. `blog:new` 실행
5. 제목, 카테고리, 태그 입력
6. 생성된 `src/content/posts/<slug>.mdx`에서 글 작성
7. 이미지 파일을 추가할 때는 `blog:image` 실행

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

- 메뉴 구성은 `src/config/navigation.json`에서 관리합니다.
- 메뉴는 `sections` 순서대로 화면에 표시됩니다.
- 직접 링크는 `type: "link"`로 추가합니다.
- 카테고리/태그 메뉴는 `type: "categories"`, `type: "tags"`로 추가합니다.
- 특정 태그 메뉴를 노출하려면 `src/config/post-tags.json`에서 해당 태그에 `"menu": true`를 추가합니다.
- 허용 카테고리는 `src/config/post-categories.json`에서 관리합니다.
- 허용 태그는 `src/config/post-tags.json`에서 관리합니다.
- 작성 전 조회는 `npm run blog:meta`로 합니다.
- RSS는 `/rss.xml`, 사이트맵은 `/sitemap.xml`에서 생성됩니다.
- 댓글은 `src/config/site.ts`의 Giscus 설정을 채우면 활성화됩니다.
- 방문자 집계는 같은 파일의 GoatCounter 설정을 사용합니다.
- 공유 채널 노출 여부도 `src/config/site.ts`에서 켜고 끕니다.
