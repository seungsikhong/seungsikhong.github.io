#!/bin/bash

# 메뉴 설정 관리 스크립트
# 사용법: ./scripts/manage-menu.sh [명령어]

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

MENU_CONFIG_FILE="src/config/menuSettings.json"

# 메뉴 설정 파일이 없으면 생성
if [ ! -f "$MENU_CONFIG_FILE" ]; then
    cat > "$MENU_CONFIG_FILE" << EOF
{
  "activeMenus": [
    "project"
  ],
  "menuOrder": [
    "home",
    "posts",
    "project"
  ],
  "menuDescriptions": {
    "project": "개인 프로젝트 개발 과정과 결과"
  },
  "menuIcons": {
    "project": "Code"
  }
}
EOF
    echo -e "${GREEN}메뉴 설정 파일을 생성했습니다: $MENU_CONFIG_FILE${NC}"
fi

# 현재 메뉴 상태 표시
show_menus() {
    echo -e "${BLUE}📋 현재 활성화된 메뉴:${NC}"
    echo -e "${YELLOW}홈 (home) - 메인 페이지${NC}"
    echo -e "${YELLOW}모든 포스트 (posts) - 전체 포스트 목록${NC}"
    
    # 활성화된 커스텀 메뉴들 표시
    active_menus=$(jq -r '.activeMenus[]' "$MENU_CONFIG_FILE" 2>/dev/null)
    if [ $? -eq 0 ]; then
        for menu in $active_menus; do
            case $menu in
                "tutorial") echo -e "${GREEN}✅ 튜토리얼 (tutorial) - 단계별 학습 가이드${NC}" ;;
                "tips") echo -e "${GREEN}✅ 팁 & 트릭 (tips) - 유용한 개발 팁${NC}" ;;
                "review") echo -e "${GREEN}✅ 리뷰 (review) - 도구 및 서비스 리뷰${NC}" ;;
                "project") echo -e "${GREEN}✅ 프로젝트 (project) - 개인 프로젝트${NC}" ;;
                "study") echo -e "${GREEN}✅ 스터디 (study) - 학습 노트${NC}" ;;
            esac
        done
    fi
}

# 메뉴 활성화
enable_menu() {
    local menu_id="$1"
    case $menu_id in
        "tutorial"|"tips"|"review"|"project"|"study")
            # jq를 사용하여 메뉴 활성화
            jq --arg menu "$menu_id" '.activeMenus += [$menu] | .activeMenus |= unique' "$MENU_CONFIG_FILE" > temp.json && mv temp.json "$MENU_CONFIG_FILE"
            echo -e "${GREEN}✅ $menu_id 메뉴가 활성화되었습니다.${NC}"
            ;;
        *)
            echo -e "${RED}❌ 잘못된 메뉴 ID입니다. 사용 가능한 메뉴: tutorial, tips, review, project, study${NC}"
            ;;
    esac
}

# 메뉴 비활성화
disable_menu() {
    local menu_id="$1"
    case $menu_id in
        "tutorial"|"tips"|"review"|"project"|"study")
            # jq를 사용하여 메뉴 비활성화
            jq --arg menu "$menu_id" '.activeMenus -= [$menu]' "$MENU_CONFIG_FILE" > temp.json && mv temp.json "$MENU_CONFIG_FILE"
            echo -e "${YELLOW}⚠️ $menu_id 메뉴가 비활성화되었습니다.${NC}"
            ;;
        *)
            echo -e "${RED}❌ 잘못된 메뉴 ID입니다. 사용 가능한 메뉴: tutorial, tips, review, project, study${NC}"
            ;;
    esac
}

# 메뉴 설명 수정
update_description() {
    local menu_id="$1"
    local description="$2"
    
    case $menu_id in
        "tutorial"|"tips"|"review"|"project"|"study")
            jq --arg menu "$menu_id" --arg desc "$description" '.menuDescriptions[$menu] = $desc' "$MENU_CONFIG_FILE" > temp.json && mv temp.json "$MENU_CONFIG_FILE"
            echo -e "${GREEN}✅ $menu_id 메뉴 설명이 업데이트되었습니다.${NC}"
            ;;
        *)
            echo -e "${RED}❌ 잘못된 메뉴 ID입니다.${NC}"
            ;;
    esac
}

# 메뉴 아이콘 수정
update_icon() {
    local menu_id="$1"
    local icon_name="$2"
    
    case $menu_id in
        "tutorial"|"tips"|"review"|"project"|"study")
            jq --arg menu "$menu_id" --arg icon "$icon_name" '.menuIcons[$menu] = $icon' "$MENU_CONFIG_FILE" > temp.json && mv temp.json "$MENU_CONFIG_FILE"
            echo -e "${GREEN}✅ $menu_id 메뉴 아이콘이 $icon_name으로 업데이트되었습니다.${NC}"
            ;;
        *)
            echo -e "${RED}❌ 잘못된 메뉴 ID입니다.${NC}"
            ;;
    esac
}

# 사용법 표시
show_usage() {
    echo -e "${BLUE}📖 메뉴 관리 스크립트 사용법:${NC}"
    echo -e "${YELLOW}$0 show                           - 현재 메뉴 상태 표시${NC}"
    echo -e "${YELLOW}$0 enable <menu_id>               - 메뉴 활성화${NC}"
    echo -e "${YELLOW}$0 disable <menu_id>              - 메뉴 비활성화${NC}"
    echo -e "${YELLOW}$0 desc <menu_id> <설명>          - 메뉴 설명 수정${NC}"
    echo -e "${YELLOW}$0 icon <menu_id> <icon_name>     - 메뉴 아이콘 수정${NC}"
    echo -e "${YELLOW}$0 icons                          - 사용 가능한 아이콘 목록 표시${NC}"
    echo -e "${YELLOW}$0 help                           - 도움말 표시${NC}"
    echo -e ""
    echo -e "${BLUE}사용 가능한 메뉴 ID:${NC}"
    echo -e "  tutorial - 튜토리얼"
    echo -e "  tips     - 팁 & 트릭"
    echo -e "  review   - 리뷰"
    echo -e "  project  - 프로젝트"
    echo -e "  study    - 스터디"
    echo -e ""
    echo -e "${GREEN}예시:${NC}"
    echo -e "  $0 enable tutorial"
    echo -e "  $0 disable review"
    echo -e "  $0 desc tutorial \"단계별 학습 가이드와 실습 예제\""
    echo -e "  $0 icon project Rocket"
}

# 사용 가능한 아이콘 목록 표시
show_icons() {
    echo -e "${BLUE}🎨 사용 가능한 아이콘 목록:${NC}"
    echo -e "${YELLOW}기본 아이콘:${NC}"
    echo -e "  Home, FileText, User, FolderOpen, Mail, BookOpen"
    echo -e "  Code, Heart, Star, Lightbulb, Database, Wrench"
    echo -e "  GitBranch, Rocket, Globe, Settings, Zap, Target"
    echo -e "  Palette, Camera, Music, Gamepad2, Coffee, Gift"
    echo -e ""
    echo -e "${GREEN}예시:${NC}"
    echo -e "  $0 icon project Rocket"
    echo -e "  $0 icon tutorial BookOpen"
    echo -e "  $0 icon tips Lightbulb"
}

# 메인 로직
case "$1" in
    "show")
        show_menus
        ;;
    "enable")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ 메뉴 ID를 지정해주세요.${NC}"
            exit 1
        fi
        enable_menu "$2"
        ;;
    "disable")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ 메뉴 ID를 지정해주세요.${NC}"
            exit 1
        fi
        disable_menu "$2"
        ;;
    "desc")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}❌ 메뉴 ID와 설명을 모두 지정해주세요.${NC}"
            exit 1
        fi
        update_description "$2" "$3"
        ;;
    "icon")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}❌ 메뉴 ID와 아이콘 이름을 모두 지정해주세요.${NC}"
            exit 1
        fi
        update_icon "$2" "$3"
        ;;
    "icons")
        show_icons
        ;;
    "help"|"")
        show_usage
        ;;
    *)
        echo -e "${RED}❌ 잘못된 명령어입니다.${NC}"
        show_usage
        exit 1
        ;;
esac
