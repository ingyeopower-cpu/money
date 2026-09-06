---
description: Auto execution rule
---

# Auto Mode Rule
- **NEVER** use `request_feedback: true` in your artifacts or implementation plans for this workspace.
- **ALWAYS** automatically proceed to execution after deciding on a plan, without waiting for user approval.
- You do not need to create `implementation_plan.md` if you are just going to execute it immediately. Just execute the request directly.
- The user has explicitly requested that you do not ask for permission in this folder and just auto-execute everything.

# GitHub & Google Sheets Architecture Rule
- **메인 소스코드 및 배포 관리 (GitHub 중심):**
  - 모든 화면(UI), 스타일(CSS), 로직(JS) 등 기능 수정사항은 **GitHub (`main` 브랜치) 및 GitHub Pages를 통해 전담 관리**한다.
  - 코드 변경 시 로컬 작업 완료 후 `git push origin main`을 실행하면 GitHub Pages(`https://ingyeopower-cpu.github.io/money/`)로 30초 내 자동 배포된다.
- **구글 스프레드시트/Apps Script의 역할 (순수 데이터베이스 및 API):**
  - 구글 스프레드시트와 Apps Script는 화면을 직접 보여주는 용도가 아니며, **클라우드 데이터베이스(DB) 및 부부 실시간 동기화/시세 갱신 백엔드 API 역할만 수행**한다.
  - 따라서 통상적인 UI/기능 수정 시 구글 Apps Script를 매번 재배포할 필요가 없으며, 오직 백엔드 서버 로직(`code.gs`) 자체에 변경이 있을 때만 구글 배포를 갱신한다.

# Apps Script Deployment Rule (백엔드 code.gs 수정 시에만 적용)
- 백엔드 `code.gs` 수정 시 **새 배포**는 절대 사용 금지. (새 배포시 모바일 웹앱 주소가 바뀌어 동기화가 끊어짐)
- 항상 기존 배포 ID(`AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg`)를 유지하며 **새 버전**으로만 배포할 것.
- 만약 앱스스크립트 UI에서 배포해야 할 경우:
  `배포 관리` -> 활성 배포 선택 -> `수정(연필 아이콘)` -> 버전: `새 버전` 선택 -> `배포` 순으로 진행하여 기존 주소(ID)가 유지되도록 할 것.

# Minor & Scratch Files Rule
- 브라우저 서브에이전트나 작업 중 생성되는 임시 메모/scratchpad 파일이 에디터 탭으로 자동 오픈되지 않도록 엄격 관리할 것.
- 임시 스크립트나 중간 결과물은 반드시 `UserFacing: false`로 설정하거나 `scratch/` 디렉토리에만 보관할 것.
- 작업 완료 후 불필요한 임시 scratchpad 파일은 즉시 정리할 것.

