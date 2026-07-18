# View Counter Worker

Cloudflare Worker + D1 기반 게시글 조회수 API입니다. GoatCounter는 관리자 통계용으로 유지하고, 블로그 화면에 표시되는 게시글별 조회수는 이 Worker가 담당합니다.

## 동작 방식

- `POST /views`: 게시글 조회수를 증가시키고 최신 값을 반환합니다.
- `GET /views?path=/posts/example/`: 게시글 조회수를 조회합니다.
- 같은 방문자와 같은 게시글은 기본 1시간 동안 1회만 카운트합니다.
- IP 원문은 저장하지 않고, Worker 내부에서 `IP + User-Agent + path + time bucket + secret`을 SHA-256 해시로 바꿔 중복 판단에만 사용합니다.

## 초기 설정

Cloudflare에 로그인한 뒤 D1 데이터베이스를 만듭니다.

```bash
npm run views:d1:create
```

명령 결과의 `database_id`를 `workers/view-counter/wrangler.toml`의 `database_id`에 넣습니다.

마이그레이션을 적용합니다.

```bash
npm run views:d1:migrate
```

중복 카운트 해시에 사용할 secret을 등록합니다.

```bash
npm run views:secret
```

랜덤 문자열을 입력합니다. 예를 들어 비밀번호 관리자에서 만든 긴 문자열을 사용합니다.

Worker를 배포합니다.

```bash
npm run views:deploy
```

배포 후 나온 Worker URL을 GitHub 저장소 변수에 등록합니다.

```txt
PUBLIC_VIEW_COUNTER_ENDPOINT=https://<worker-name>.<account>.workers.dev
```

GitHub 저장소에서 `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`에 추가합니다.

## 환경 변수

- `ALLOWED_ORIGINS`: 브라우저 호출을 허용할 origin 목록입니다.
- `VIEW_DEDUPE_SECONDS`: 같은 방문자와 같은 글을 중복 카운트하지 않을 시간입니다. 기본값은 `3600`입니다.
- `ALLOWED_POST_PATHS`: 비워두면 `/posts/.../` 형식만 검증합니다. 쉼표로 path를 넣으면 해당 게시글만 허용합니다.
- `VIEW_COUNTER_SALT`: Worker secret입니다. D1에 저장되는 방문자 해시 생성에 사용합니다.

## 게시글 URL 변경

조회수는 게시글 URL path를 key로 저장합니다. URL을 바꾸면 새 path 기준으로 조회수가 다시 집계되므로, 글을 공개한 뒤에는 slug를 가능한 유지합니다.

## 보안 메모

이 API는 공개 조회수 카운터이므로 조작 가능성을 0으로 만들 수는 없습니다. 대신 origin 제한, path 검증, 1시간 중복 제한, raw IP 미저장으로 개인 블로그 수준의 현실적인 방어를 적용합니다.
