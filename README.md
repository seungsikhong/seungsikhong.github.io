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
npm run blog:category:add -- --name "AI"
npm run blog:tag:add -- --name "인공신경망" --menu false
npm run blog:collection:add -- --name "AI Basics" --category "AI"
npm run blog:new
npm run blog:image -- --slug ai/01-artificial-intelligence "/absolute/path/to/image.png"
```

- `blog:meta`: 현재 등록된 카테고리, 태그, 컬렉션, 메뉴 노출 상태를 조회합니다.
- `blog:category:add`: 글에서 사용할 카테고리를 추가합니다.
- `blog:tag:add`: 글에서 사용할 태그를 추가합니다. `--menu true`를 주면 사이드바 주제 메뉴에도 노출합니다.
- `blog:collection:add`: 카테고리 안에서 글을 묶어 보여줄 컬렉션을 추가합니다.
- `blog:new`: 새 글을 만듭니다. 옵션 없이 실행하면 대화형으로 제목, 카테고리, 컬렉션, 태그를 물어봅니다.
- `blog:image`: 글에 넣을 이미지를 복사하고 `PostImage` 블록을 출력합니다.

기존 `new-post`, `list-post-meta`, `add-image` 명령도 호환용으로 남아 있지만, 새로 쓸 때는 `blog:*` 명령을 권장합니다.

## 조회수

방문 통계와 화면 조회수는 역할을 분리합니다.

- GoatCounter: 관리자 화면에서 방문 통계를 확인하는 용도입니다.
- Cloudflare Worker + D1: 블로그 화면에 표시하는 게시글별 조회수 용도입니다.

게시글 상세 페이지는 `POST /views`로 조회수를 증가시키고, 홈/목록/태그/카테고리 페이지는 `GET /views`로 현재 조회수만 읽습니다. 같은 방문자와 같은 게시글은 기본 1시간 동안 1회만 카운트합니다.

Cloudflare 설정은 `workers/view-counter`에 있습니다.

```bash
npm run views:d1:create
npm run views:d1:migrate
npm run views:secret
npm run views:deploy
```

배포 후 Worker URL을 GitHub Actions 변수에 등록합니다.

```txt
PUBLIC_VIEW_COUNTER_ENDPOINT=https://<worker-name>.<account>.workers.dev
```

이 값이 없으면 사이트는 빌드되지만 화면 조회수 API는 호출하지 않습니다.

게시글 URL은 D1 조회수 key로 쓰입니다. URL을 바꾸면 새 URL 기준으로 조회수가 다시 집계되므로, 글을 공개한 뒤에는 slug를 가능한 유지합니다.

## 글 작성 흐름

처음 글을 쓰기 전에는 카테고리와 태그를 먼저 정합니다.

- 카테고리: 글의 큰 분류입니다. 글마다 1개만 씁니다.
- 태그: 글의 주제 키워드입니다. 글마다 여러 개 쓸 수 있습니다.
- 컬렉션: 한 카테고리 안에서 이어지는 글 묶음입니다. 예를 들어 `AI` 카테고리 안의 `AI Basics`처럼 씁니다.
- 메뉴: `navigation.json`의 `sections` 순서대로 화면에 표시됩니다. 태그에 `menu: true`를 주면 해당 태그가 메뉴에 자동 노출됩니다.

### 1. 카테고리 추가

카테고리는 명령으로 추가하는 것을 권장합니다.

```bash
npm run blog:category:add -- --name "AI"
```

VS Code에서는 `Cmd/Ctrl + Shift + P` -> `Tasks: Run Task` -> `Blog: 카테고리 추가`를 실행하고 카테고리 이름을 입력합니다.

카테고리는 내부적으로 `src/config/post-categories.json`에서 관리합니다. 직접 수정해도 되지만, 중복이나 형식 실수를 줄이려면 명령을 쓰는 편이 낫습니다.

처음 상태는 비어 있습니다.

```json
[]
```

예를 들어 `AI` 카테고리를 쓰면 아래처럼 저장됩니다.

```json
[
  "AI"
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

글을 직접 수정할 때 `category`에는 여기에 등록된 값만 사용할 수 있습니다. 등록되지 않은 카테고리를 직접 쓰면 빌드에서 실패합니다.

`blog:new`으로 새 글을 만들 때는 등록되지 않은 카테고리를 입력해도 자동으로 추가됩니다. 단, 비슷한 기존 카테고리가 있으면 오타일 수 있으므로 기존 값을 쓸지 새로 추가할지 먼저 물어봅니다.

### 2. 태그 추가

태그도 명령으로 추가하는 것을 권장합니다.

```bash
npm run blog:tag:add -- --name "인공신경망" --menu false
```

VS Code에서는 `Cmd/Ctrl + Shift + P` -> `Tasks: Run Task` -> `Blog: 태그 추가`를 실행하고 태그 이름과 메뉴 노출 여부를 입력합니다.

- `--menu false`: 글에는 쓸 수 있지만 사이드바 주제 메뉴에는 숨깁니다.
- `--menu true`: 글에도 쓸 수 있고 사이드바 주제 메뉴에도 보여줍니다.

태그는 내부적으로 `src/config/post-tags.json`에서 관리합니다.

처음 상태는 비어 있습니다.

```json
[]
```

태그를 추가하면 아래처럼 저장됩니다.

```json
[
  {
    "label": "인공신경망",
    "menu": false
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

글을 직접 수정할 때 `tags`에는 여기에 등록된 값만 사용할 수 있습니다. 등록되지 않은 태그를 직접 쓰면 빌드에서 실패합니다.

`blog:new`으로 새 글을 만들 때는 등록되지 않은 태그를 입력해도 자동으로 추가됩니다. 단, 비슷한 기존 태그가 있으면 오타일 수 있으므로 기존 값을 쓸지 새로 추가할지 먼저 물어봅니다. 자동 추가된 태그는 기본적으로 `menu: false`입니다. 메뉴에 노출하려면 나중에 `Blog: 태그 추가`에서 같은 태그 이름을 입력하고 메뉴 노출을 `true`로 바꾸면 됩니다.

### 3. 컬렉션 추가

컬렉션은 같은 카테고리 안에서 이어지는 글을 묶을 때 사용합니다.

예를 들어 `AI` 카테고리 안에 인공신경망 기초 글을 계속 쓴다면 `AI Basics` 컬렉션을 만들 수 있습니다.

```bash
npm run blog:collection:add -- --name "AI Basics" --category "AI" --description "AI와 인공신경망의 기초 개념을 차근차근 정리합니다."
```

VS Code에서는 `Cmd/Ctrl + Shift + P` -> `Tasks: Run Task` -> `Blog: 컬렉션 추가`를 실행합니다.

컬렉션은 내부적으로 `src/config/post-collections.json`에서 관리합니다.

```json
[
  {
    "id": "ai-basics",
    "label": "AI Basics",
    "category": "AI",
    "description": "AI와 인공신경망의 기초 개념을 차근차근 정리합니다.",
    "order": 1
  }
]
```

글에서는 아래처럼 연결합니다.

```md
---
category: AI
collection: ai-basics
collectionOrder: 1
---
```

컬렉션을 사용하면 카테고리 페이지에서 해당 글들이 `Collection` 카드로 묶여 보입니다. 컬렉션이 없는 글은 같은 카테고리 페이지 아래의 `Other Posts` 영역에 표시됩니다.

상세 글 페이지의 컬렉션 네비게이션은 기본적으로 자동 노출됩니다. 같은 컬렉션에 글이 2개 이상 있으면 본문 하단에 표시되고, 글이 1개뿐이면 숨깁니다.

글마다 강제로 보이거나 숨기고 싶으면 frontmatter에 `showCollection`을 추가합니다.

```md
---
collection: ai-basics
collectionOrder: 1
showCollection: false
---
```

- `showCollection` 없음: 자동입니다. 컬렉션 글이 2개 이상일 때만 상세 글 하단에 표시합니다.
- `showCollection: true`: 컬렉션 글이 1개뿐이어도 상세 글 하단에 표시합니다.
- `showCollection: false`: 해당 상세 글에서는 컬렉션 네비게이션을 숨깁니다.

URL은 컬렉션 이름을 직접 넣지 않고 글 파일 위치와 slug를 기준으로 만듭니다.

```txt
src/content/posts/ai/01-artificial-intelligence.mdx
-> /posts/ai/01-artificial-intelligence/
```

이 방식은 URL이 너무 깊어지는 것을 막으면서도, 글 목록 UI에서는 컬렉션별 묶음과 순서를 보여줄 수 있습니다.

### 4. 메뉴 추가

메뉴 설정은 `src/config/navigation.json`에서 관리합니다. 이 파일은 화면에 보이는 사이드바 섹션과 순서를 정합니다.

먼저 역할을 분리해서 이해하면 됩니다.

- `post-categories.json`: 글 작성 시 사용할 수 있는 카테고리를 정합니다.
- `post-tags.json`: 글 작성 시 사용할 수 있는 태그를 정합니다.
- `post-collections.json`: 카테고리 안에서 글을 묶을 컬렉션을 정합니다.
- `navigation.json`: 화면에 어떤 메뉴 섹션을 보여줄지 정합니다.

즉 `navigation.json`에 메뉴를 추가한다고 해서 글 작성 시 사용할 카테고리, 태그, 컬렉션이 생기지는 않습니다. 글에서 쓸 수 있는 값은 각각 `post-categories.json`, `post-tags.json`, `post-collections.json`에 등록된 값만 가능합니다.

현재 기본 구조는 아래처럼 세 섹션으로 나뉩니다.

- `Menu`: `/posts/`, `/about/`처럼 항상 보여줄 링크입니다.
- `Tags`: `post-tags.json`에서 `menu: true`인 태그가 자동으로 들어옵니다.
- `Categories`: 글이 있는 카테고리가 자동으로 들어옵니다.

예시는 아래와 같습니다.

```json
{
  "sections": [
    {
      "label": "Menu",
      "items": [
        { "type": "link", "label": "Posts", "href": "/posts/", "icon": "writing" },
        { "type": "link", "label": "About", "href": "/about/", "icon": "about" }
      ]
    },
    {
      "label": "Tags",
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
      "label": "Categories",
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

예를 들어 `인공신경망` 태그를 주제 메뉴에도 보여주려면 `navigation.json`을 고치지 않고 태그만 아래처럼 등록합니다.

```json
[
  {
    "label": "인공신경망",
    "menu": true
  }
]
```

이후 글에서는 아래처럼 씁니다.

```md
---
category: AI
tags:
  - 인공신경망
---
```

단, 위 예시의 `AI`도 카테고리로 먼저 등록되어 있어야 합니다.

SEO 기준으로 빈 태그/카테고리 페이지는 `noindex,follow`가 적용됩니다. 글이 1개 이상 생기면 자동으로 `index,follow`가 됩니다.

### 5. 작성 전 설정 조회

현재 등록된 카테고리, 태그, 컬렉션, 메뉴 노출 상태는 아래 명령으로 확인합니다.

```bash
npm run blog:meta
```

출력에서 확인할 것:

- `Categories`: 글의 `category`에 쓸 수 있는 값
- `Tags`: 글의 `tags`에 쓸 수 있는 값
- `Collections`: 글의 `collection`에 쓸 수 있는 값
- `(menu)`: 메뉴에 노출되는 태그
- `New post example`: 현재 설정 기준으로 바로 실행 가능한 글 생성 예시

### 6. 글 목록 필터링

`/posts/` 글 목록에는 카테고리와 태그 필터가 표시됩니다.

- 카테고리 필터는 글의 `category` 값을 기준으로 동작합니다.
- 태그 필터는 글의 `tags` 값을 기준으로 동작합니다.
- 필터를 선택하면 현재 목록에서 조건에 맞는 글만 보여줍니다.
- 필터 상태는 `/posts/?category=...&tag=...` 형태로 URL에 반영됩니다.

이 필터는 사용자가 글 목록을 빠르게 탐색하기 위한 UI 기능입니다. SEO 색인용 페이지는 별도로 생성되는 `/topics/...`, `/tags/...` 페이지가 담당합니다.

### 7. 새 포스트 만들기

가장 쉬운 방법은 대화형 명령을 쓰는 것입니다.

```bash
npm run blog:new
```

명령을 실행하면 제목, 요약, 카테고리, 컬렉션, 태그를 순서대로 물어봅니다. 카테고리와 컬렉션은 번호로 선택할 수 있고, 태그는 쉼표로 여러 개를 입력할 수 있습니다.

직접 한 줄로 만들고 싶으면 아래처럼 옵션을 넣습니다.

```bash
npm run blog:new -- --title "글 제목" --excerpt "목록과 검색 결과에 표시할 한 문장 요약" --category "카테고리"
```

이 스크립트는 아래를 한 번에 만듭니다.
- `src/content/posts/<category>/<slug>.mdx`
- `public/images/posts/<slug>/`
- `public/og/posts/<slug>.svg`
- `public/og/posts/<slug>.png` (PNG 변환이 가능할 때)

`slug`는 글 파일명과 URL에 쓰이는 값입니다. 직접 지정하지 않으면 카테고리와 제목을 기준으로 자동 생성됩니다.

컬렉션을 선택한 글은 컬렉션 안의 다음 순번을 붙여 만듭니다.

```txt
title: Artificial Intelligence
category: AI
collection: AI Basics

src/content/posts/ai/01-artificial-intelligence.mdx
/posts/ai/01-artificial-intelligence/
```

컬렉션이 없는 글은 카테고리 폴더 아래에 제목 기준으로 생성되고, 카테고리 페이지에서는 `Other Posts`에 표시됩니다.

```txt
src/content/posts/ai/ai-tooling-notes.mdx
/posts/ai/ai-tooling-notes/
```

직접 정하고 싶을 때만 `--slug`를 추가합니다.

```bash
npm run blog:new -- --title "글 제목" --excerpt "글 요약" --category "카테고리" --slug ai/my-post
```

태그를 함께 넣고 싶으면 쉼표로 구분합니다.

```bash
npm run blog:new -- --title "글 제목" --excerpt "글 요약" --category "카테고리" --tags "태그1,태그2"
```

컬렉션에 넣을 글은 `--collection`을 추가합니다. `--collection-order`를 생략하면 같은 컬렉션의 다음 번호가 자동으로 들어갑니다.

```bash
npm run blog:new -- --title "인공신경망" --excerpt "인공신경망의 기본 개념을 정리합니다." --category "AI" --collection "AI Basics" --tags "인공신경망,AI,Perceptron"
```

`blog:new`은 등록되지 않은 카테고리, 태그, 컬렉션을 받으면 새 값으로 자동 추가합니다. 비슷한 기존 값이 있으면 오타 방지를 위해 기존 값을 사용할지 새로 추가할지 물어봅니다.

예를 들어 기존 태그가 `인공신경망`뿐인 상태에서 아래처럼 실행하면 `AI`, `Perceptron` 태그는 자동으로 추가됩니다.

```bash
npm run blog:new -- --title "인공신경망" --excerpt "인공신경망의 기본 개념을 Perceptron부터 차근차근 다시 정리합니다." --category "AI" --tags "인공신경망,AI,Perceptron"
```

자동 추가된 태그는 사이드바 주제 메뉴에는 바로 노출되지 않습니다. 메뉴에 노출하고 싶은 태그만 따로 켭니다.

```bash
npm run blog:tag:add -- --name "AI" --menu true
```

기본 본문 템플릿은 글에 노출되는 예시 문장 대신 작성용 주석으로만 안내합니다. 작성이 끝나면 남은 주석은 삭제해도 됩니다. `핵심 개념`, `내가 이해한 흐름`, `정리` 같은 섹션명은 샘플이므로 글 성격에 맞게 바꿔도 됩니다.

새 글은 기본적으로 `draft: true`로 생성됩니다. 글을 다 쓴 뒤 게시 직전에 `draft`를 `false`로 바꾸거나 줄을 삭제하고, `publishedAt`을 실제 게시일로 맞춘 뒤 빌드합니다.

### 8. 이미지 추가하기

```bash
npm run blog:image -- --slug ai/01-artificial-intelligence "/absolute/path/to/image.png"
```

여러 장도 한 번에 넣을 수 있습니다.

```bash
npm run blog:image -- --slug ai/01-artificial-intelligence "/path/one.png" "/path/two.jpg"
```

이 스크립트는 이미지를 `public/images/posts/<slug>/`로 복사하고, 본문에 붙여 넣을 마크다운 경로를 바로 출력합니다.

### 본문 이미지 규칙

포스트 이미지는 `public/images/posts/<slug>/` 아래에 두고, 본문에서는 절대 경로로 사용합니다.

```md
![설명](/images/posts/ai/01-artificial-intelligence/example.png)
```

### MDX 글쓰기

새 포스트는 기본적으로 `.mdx`로 생성됩니다. 아래 컴포넌트는 별도 import 없이 바로 쓸 수 있습니다.

```mdx
<Callout type="note" title="메모">
  남겨둘 판단이나 제약을 적습니다.
</Callout>

<PostImage
  src="/images/posts/ai/01-artificial-intelligence/example.png"
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
draft: true
comments: false
collection: 컬렉션-id
collectionOrder: 1
tags:
  - 태그
ogImage: /og/posts/ai/01-my-post.png
---
```

메타데이터 작성 기준:

- `title`: 글 제목입니다.
- `excerpt`: 목록, 검색 결과, SNS 미리보기에 쓰일 한 문장 요약입니다.
- `category`: `post-categories.json`에 등록된 값 중 하나만 씁니다.
- `publishedAt`: 게시 날짜입니다. 미래 날짜면 빌드되어도 목록과 상세 페이지에서 제외됩니다.
- `draft`: 작성 중이면 `true`입니다. 게시할 때는 `false`로 바꾸거나 줄을 삭제합니다.
- `comments`: 댓글을 열면 `true`, 닫으면 `false`입니다.
- `collection`: 선택 항목입니다. `post-collections.json`에 등록된 컬렉션 `id`를 씁니다.
- `collectionOrder`: 선택 항목입니다. 컬렉션 안에서 보여줄 순서입니다.
- `showCollection`: 선택 항목입니다. 상세 글 하단의 컬렉션 네비게이션을 `true`로 강제 표시하거나 `false`로 숨깁니다. 생략하면 자동입니다.
- `tags`: `post-tags.json`에 등록된 값을 여러 개 쓸 수 있습니다.
- `ogImage`: SNS 공유 이미지 경로입니다. `blog:new`가 기본값을 자동 생성합니다.

## VS Code 추천

`.vscode/extensions.json`에 추천 확장을 넣어두었습니다.
- Astro
- MDX
- Front Matter
- Markdown All in One
- Paste Image

### VS Code에서 새 글 만들기

`Cmd/Ctrl + Shift + P`에서 `blog`를 바로 검색하면 나오지 않습니다. 블로그 명령은 VS Code의 일반 명령이 아니라 이 프로젝트의 `Task`로 등록되어 있기 때문입니다.

항상 아래 순서로 실행합니다.

1. `Cmd/Ctrl + Shift + P`
2. `Tasks: Run Task` 입력 후 실행
3. `Blog:` 입력
4. 필요한 작업 선택

자주 쓰는 작업은 아래와 같습니다.

- `Blog: 카테고리/태그/컬렉션 조회`: 현재 사용할 수 있는 카테고리, 태그, 컬렉션을 확인합니다.
- `Blog: 카테고리 추가`: 새 카테고리를 추가합니다.
- `Blog: 태그 추가`: 새 태그를 추가하고 메뉴 노출 여부를 정합니다.
- `Blog: 컬렉션 추가`: 카테고리 안에서 글을 묶을 컬렉션을 추가합니다.
- `Blog: 새 글 만들기`: 제목, 요약, 카테고리, 태그를 입력해서 `.mdx` 글 파일을 생성합니다.
- `Blog: 이미지 추가`: 글 이미지 폴더에 이미지를 복사하고 본문에 붙일 경로를 출력합니다.
- `Blog: 개발 서버 실행`: 로컬 미리보기를 실행합니다.
- `Blog: 빌드`: 배포 전 빌드를 확인합니다.

새 글을 쓸 때 권장 순서는 아래입니다.

1. `Blog: 카테고리/태그/컬렉션 조회`
2. 카테고리가 없으면 `Blog: 카테고리 추가`
3. 태그가 없거나 새 태그가 필요하면 `Blog: 태그 추가`
4. 이어지는 글 묶음이 필요하면 `Blog: 컬렉션 추가`
5. 다시 `Blog: 카테고리/태그/컬렉션 조회`로 등록 상태 확인
6. `Blog: 새 글 만들기`
7. 생성된 `src/content/posts/<category>/<slug>.mdx`에서 글 작성
8. 이미지 파일을 추가할 때는 `Blog: 이미지 추가`

`Blog: 새 글 만들기`에서 `Collection id or name`을 비워두면 해당 글은 컬렉션 없이 생성되고 카테고리 페이지의 `Other Posts`에 표시됩니다.

`Collection order`를 비워두면 같은 컬렉션의 다음 번호가 자동으로 들어갑니다. 직접 `1`, `2`, `3`처럼 입력하면 그 순서로 고정됩니다.

터미널에서 직접 실행하고 싶으면 같은 작업을 `npm run blog:*` 명령으로 실행합니다.

### 이미지 붙여넣기

이미지는 `Blog: 이미지 추가` 또는 `npm run blog:image` 명령을 권장합니다. 이 명령은 `ai/01-artificial-intelligence`처럼 카테고리 폴더가 포함된 slug를 정확히 처리합니다.

`Paste Image` 확장도 사용할 수 있지만, 중첩 slug를 자동으로 완전히 알 수는 없습니다. 붙여넣기 전에 표시되는 전체 저장 경로가 `public/images/posts/ai/01-artificial-intelligence/...` 형태인지 확인하고 필요하면 직접 수정합니다.

- 저장 위치: `public/images/posts/<slug>/`
- 붙여넣기 결과: `PostImage` 컴포넌트 블록 자동 삽입

예:

```mdx
<PostImage
  src="/images/posts/ai/01-artificial-intelligence/example.png"
  alt="이미지 설명"
  caption="선택 캡션"
  size="wide"
/>
```

## 운영 메모

- 메뉴 구성은 `src/config/navigation.json`에서 관리합니다.
- 메뉴는 `sections` 순서대로 화면에 표시됩니다.
- 직접 링크는 `type: "link"`로 추가합니다.
- 카테고리/태그 메뉴는 `type: "categories"`, `type: "tags"`로 추가합니다.
- 카테고리는 `npm run blog:category:add -- --name "이름"`으로 추가합니다.
- 태그는 `npm run blog:tag:add -- --name "이름" --menu false`로 추가합니다.
- 컬렉션은 `npm run blog:collection:add -- --name "이름" --category "카테고리"`로 추가합니다.
- 특정 태그 메뉴를 노출하려면 태그 추가 시 `--menu true`를 사용합니다.
- 허용 카테고리는 내부적으로 `src/config/post-categories.json`에서 관리합니다.
- 허용 태그는 내부적으로 `src/config/post-tags.json`에서 관리합니다.
- 허용 컬렉션은 내부적으로 `src/config/post-collections.json`에서 관리합니다.
- 작성 전 조회는 `npm run blog:meta`로 합니다.
- RSS는 `/rss.xml`, 사이트맵은 `/sitemap.xml`에서 생성됩니다.
- 댓글은 `src/config/site.ts`의 Giscus 설정을 채우면 활성화됩니다.
- 방문 통계는 `src/config/site.ts`의 GoatCounter 설정을 사용하고, 관리자 화면에서 확인합니다.
- 화면에 표시되는 게시글 조회수는 Cloudflare Worker + D1을 사용합니다.
- 공유 채널 노출 여부도 `src/config/site.ts`에서 켜고 끕니다.
