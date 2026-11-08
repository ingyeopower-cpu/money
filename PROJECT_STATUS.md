# 🏠 고석현의 돈통 프로젝트 현황 및 종합 인덱스

> **최종 갱신:** 2026-11-08  
> **프로젝트 경로:** `C:\Users\PA\Desktop\윤지의돈창고`  
> **현재 배포 버전:** GitHub Pages 최신 빌드 (자가치유 healState, PWA v2, SHA-256 보안, 8대 은행 금리 비교)

---

## 1. 🌐 핵심 서비스 바로가기

| 구분 | 링크 / 식별자 | 설명 |
| :--- | :--- | :--- |
| **공식 웹앱 (GitHub Pages)** | [https://ingyeopower-cpu.github.io/money/](https://ingyeopower-cpu.github.io/money/) | **메인 실서비스 웹앱** (PWA 홈 화면 추가 지원) |
| **GitHub 소스코드 저장소** | [https://github.com/ingyeopower-cpu/money](https://github.com/ingyeopower-cpu/money) | `main` 브랜치 (커밋 즉시 30초 내 자동 배포) |
| **백엔드 API (Google Apps Script)** | `AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg` | 활성 배포 ID (클라우드 DB & 부부 동기화 API) |
| **구글 스프레드시트 (클라우드 DB)** | `19FQSbeUfF_A8UbVxeXuMUckYiMkrZVjFJv5i1cYq1Y5vWPLUjV2d6W9i` | 자산 원장 영구 보관소 (A1 셀 JSON DB) |

---

## 2. 💰 현재 자산 및 목표 요약 (2026-11-08 최신)

- **현재 준비된 총자산:** **2억 1,834만원** (`218,338,961원`) ✅
- **최종 필요 준비자금 (입주 잔금):** **2억 7,361만원** (취득세 1,197만원 포함)
- **잔여 잔금 (부족액):** **6,391만원** (목표 달성률 **76.6%**)
- **목표 입주 시점:** **2028년 05월** (잔여 18개월 / D-540일)
- **현재 월 계획 저축액:** **400만원** (필요 월 저축액 355만원 대비 매월 여유 자금 달성 추세)

---

## 3. 📂 세부 문서 인덱스 (`docx/` 폴더)

본 프로젝트의 상세 아키텍처, 행동 수칙, 포트폴리오 명세는 `docx/` 디렉터리에 모듈별로 체계적으로 분류되어 있습니다:

| 분류 | 문서명 | 주요 내용 |
| :--- | :--- | :--- |
| **아키텍처 & 배포** | [01_architecture.md](docx/01_architecture.md) | GitHub Pages 자동 배포, Apps Script 배포 원칙, SHA-256 보안 체계 |
| **에이전트 수칙** | [02_agent_rules.md](docx/02_agent_rules.md) | Auto Mode 규칙, 에디터 탭 방지(Scratchpad 즉시 삭제), 핀테크 UI 표준 |
| **자산 포트폴리오** | [03_portfolio_data.md](docx/03_portfolio_data.md) | 11개 보유 종목 수량/평단/현재가, 현금/채권/예적금 6대 버킷, 데이터 구조 |
| **UI 및 기능 명세** | [04_features_and_ui.md](docx/04_features_and_ui.md) | 대시보드 지표, 두꺼비 모달 영상, 토스 카드뷰, 6대 지표 차트, 은행 금리 비교 |
| **변경 이력 아카이브**| [05_changelog.md](docx/05_changelog.md) | 2026년 9월~11월 전체 작업 일지 (PWA화, 낭인두꺼비, 실자산 복원 등) |

---

## 4. ☀️ 핵심 운영 및 유지보수 원칙

1. **배포 이원화 철칙:**
   - 화면 UI, CSS, 스크립트 수정은 **GitHub `main` 브랜치 push**로 자동 배포 (Apps Script 재배포 불필요).
   - `code.gs` 수정 시에만 기존 배포 ID를 유지하며 **새 버전**으로 배포.
2. **에디터 탭 자동 열림 방지:**
   - 임시 Scratchpad 마크다운 파일 생성 금지 및 브라우저 서브에이전트 종료 시 즉시 파일 삭제.
3. **데이터 무결성 보장:**
   - 실시간 자가치유(`healState_`) 로직을 통해 브라우저 캐시 고착 시에도 실제 보유 자산(2.18억) 자동 보존.
