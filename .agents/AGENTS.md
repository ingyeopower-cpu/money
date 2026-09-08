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

# Unwanted Files & Scratchpad Zero-Tolerance Rule (에디터 탭 자동 열림 원천 차단)
- **사용자 핵심 불편사항:** 작업 중 `Scratchpad`, 임시 메모, 불필요한 아티팩트 파일이 에디터 상단 탭으로 우후죽순 열려 작업 화면이 지저분해지는 문제.
- **원인:**
  1. `browser_subagent`가 호출될 때마다 brain 폴더에 자동 생성하는 `scratchpad_*.md` 파일이 IDE 상단 에디터 탭으로 자동 등록됨.
  2. 에이전트가 임시 파일을 `UserFacing: true`로 생성하여 에디터 탭으로 오픈됨.
- **절대 준수 수칙:**
  1. **브라우저 서브에이전트 종료 즉시 파일 강제 삭제 (필수):**
     `browser_subagent`를 호출한 경우, 결과 확인 후 **턴을 끝내기 전에 반드시** 아래 PowerShell 명령을 실행하여 생성된 임시 scratchpad를 즉시 영구 삭제할 것:
     `Remove-Item -Path "$env:USERPROFILE\.gemini\antigravity-ide\brain\*\browser\scratchpad_*.md" -Force -ErrorAction SilentlyContinue`
     (`settings.json`의 `workbench.editor.closeOnFileDelete: true` 설정에 의해 파일 삭제 즉시 에디터 탭도 완전히 닫힘)
  2. **불필요한 아티팩트/메모 생성 절대 금지:**
     사용자가 명시적으로 문서화를 요구하지 않는 한 임시 마크다운 파일을 만들지 말 것. 생성 시 무조건 `UserFacing: false` 지정.
  3. **가벼운 검증은 백그라운드 스크립트 우선 사용:**
     단순 API 응답이나 코드 문법 검사는 무거운 브라우저 서브에이전트 대신 `node`, `curl`, `powershell`을 우선 활용하여 subagent 자체의 생성을 최소화할 것.
  4. **탭 개수 상한 설정 유지:**
     IDE 설정의 `workbench.editor.limit.value: 5`를 유지하여 에디터 탭이 5개 이상 무한정 증식하지 않도록 할 것.
  5. **Auto-Open Edited Files 끄기 유지:**
     IDE Settings > General > File Access의 `Auto-Open Edited Files` 스위치가 OFF(회색) 상태로 유지되도록 관리할 것.


