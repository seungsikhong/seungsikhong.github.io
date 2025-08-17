#!/bin/bash

# 새로운 포스트 생성 스크립트
# 사용법: ./scripts/create-post.sh "포스트 제목" "카테고리"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 입력 확인
if [ $# -lt 2 ]; then
    echo -e "${RED}사용법: $0 \"포스트 제목\" \"메뉴/카테고리\"${NC}"
    echo -e "${YELLOW}예시: $0 \"Next.js 15 새로운 기능\" \"tutorial\"${NC}"
    echo -e "${BLUE}사용 가능한 메뉴: tutorial, tips, review, project, study${NC}"
    exit 1
fi

TITLE="$1"
CATEGORY="$2"

# 현재 날짜
DATE=$(date +"%Y-%m-%d")

# 슬러그 생성 (한글 제목을 영문으로 변환)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9가-힣]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')

# 파일 경로
POST_DIR="src/content/posts"
POST_FILE="$POST_DIR/$SLUG.mdx"

# 디렉토리 확인 및 생성
if [ ! -d "$POST_DIR" ]; then
    mkdir -p "$POST_DIR"
    echo -e "${GREEN}포스트 디렉토리를 생성했습니다: $POST_DIR${NC}"
fi

# 파일이 이미 존재하는지 확인
if [ -f "$POST_FILE" ]; then
    echo -e "${RED}경고: 파일이 이미 존재합니다: $POST_FILE${NC}"
    read -p "덮어쓰시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}작업을 취소했습니다.${NC}"
        exit 1
    fi
fi

# MDX 파일 내용 생성
cat > "$POST_FILE" << EOF
---
title: "$TITLE"
excerpt: "여기에 포스트 요약을 작성하세요."
date: "$DATE"
category: "$CATEGORY"
tags: ["태그1", "태그2"]
readTime: "5분"
views: 0
---

# $TITLE

여기에 포스트 내용을 작성하세요.

## 소개

포스트의 소개 부분을 작성하세요.

## 본문

### 첫 번째 섹션

첫 번째 섹션의 내용을 작성하세요.

### 두 번째 섹션

두 번째 섹션의 내용을 작성하세요.

## 결론

포스트의 결론을 작성하세요.

---

**참고 자료:**
- [링크1](https://example.com)
- [링크2](https://example.com)
EOF

echo -e "${GREEN}✅ 포스트가 성공적으로 생성되었습니다!${NC}"
echo -e "${BLUE}📁 파일 위치: $POST_FILE${NC}"
echo -e "${BLUE}🔗 URL: /posts/$SLUG${NC}"
echo -e "${YELLOW}💡 팁: VS Code에서 파일을 열어 편집하세요!${NC}"

# VS Code로 파일 열기 (VS Code가 설치되어 있는 경우)
if command -v code &> /dev/null; then
    echo -e "${GREEN}🚀 VS Code로 파일을 엽니다...${NC}"
    code "$POST_FILE"
else
    echo -e "${YELLOW}💡 VS Code가 설치되어 있지 않습니다. 수동으로 파일을 열어주세요.${NC}"
fi
