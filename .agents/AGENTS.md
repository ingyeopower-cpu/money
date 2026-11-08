---
description: Auto execution rule
---

# 1. Auto Mode Rule
- **NEVER** use `request_feedback: true` in your artifacts or implementation plans.
- **ALWAYS** automatically proceed to execution immediately without waiting for user approval.
- Do not create `implementation_plan.md` if executing directly. Auto-execute everything.

# 2. GitHub & Google Sheets Architecture Rule
- **GitHub Pages (프론트엔드/배포):** 모든 UI/JS/CSS 수정은 `main` 브랜치 push로 전담 관리 (30초 내 자동 배포).
- **Google Apps Script (순수 DB/API):** 화면용이 아니며 DB/API 역할만 수행. `code.gs` 수정 시에만 기존 배포 ID(`AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg`)의 **새 버전**으로 배포. (새 배포 생성 절대 금지)

# 3. Scratchpad Zero-Tolerance Rule (에디터 탭 열림 차단)
- **임시 마크다운 생성 금지:** 명시적 요청 외 임시 문서/메모 생성 금지 (`UserFacing: false` 필수).
- **브라우저 서브에이전트 종료 시 즉시 삭제 (필수):**
  `Remove-Item -Path "$env:USERPROFILE\.gemini\antigravity-ide\brain\*\browser\scratchpad_*.md" -Force -ErrorAction SilentlyContinue`
  `Remove-Item -Path "$env:USERPROFILE\.gemini\antigravity\brain\*\browser\scratchpad_*.md" -Force -ErrorAction SilentlyContinue`
- **경량 검증 우선:** 브라우저 서브에이전트 대신 `node`, `curl`, `powershell` 우선 활용.

# 4. 세부 가이드 인덱스
- 시스템 아키텍처 및 배포: [docx/01_architecture.md](docx/01_architecture.md)
- 상세 에이전트 행동 수칙: [docx/02_agent_rules.md](docx/02_agent_rules.md)
- 최신 자산 포트폴리오 데이터: [docx/03_portfolio_data.md](docx/03_portfolio_data.md)
- 전체 프로젝트 종합 현황: [PROJECT_STATUS.md](PROJECT_STATUS.md)
