---
description: Auto execution rule
---

# Auto Mode Rule
- **NEVER** use `request_feedback: true` in your artifacts or implementation plans for this workspace.
- **ALWAYS** automatically proceed to execution after deciding on a plan, without waiting for user approval.
- You do not need to create `implementation_plan.md` if you are just going to execute it immediately. Just execute the request directly.
- The user has explicitly requested that you do not ask for permission in this folder and just auto-execute everything.

# Apps Script Deployment Rule
- 앞으로 코드 수정시 **새 배포**는 절대 사용 금지. (새 배포시 모바일 웹앱 주소가 바뀌어 동기화가 끊어짐)
- 항상 기존 배포 ID를 유지하며 **새 버전**으로만 배포할 것. 
- 터미널(clasp)을 이용하여 배포 시 아래 명령어를 반드시 순서대로 실행할 것:
  ```bash
  clasp push -f
  clasp deploy -i AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg -d "업데이트 내용(예: 해외주식 업데이트 완료)"
  ```
- 만약 앱스스크립트 UI에서 수동 배포해야 할 경우:
  `배포 관리` -> 유일한 활성 배포 선택 -> `수정(연필 아이콘)` -> 버전: `새 버전` 선택 -> `배포` 순으로 진행하여 기존 주소(ID)가 유지되도록 할 것.

# Minor & Scratch Files Rule
- 브라우저 서브에이전트나 작업 중 생성되는 임시 메모/scratchpad 파일이 에디터 탭으로 자동 오픈되지 않도록 엄격 관리할 것.
- 임시 스크립트나 중간 결과물은 반드시 `UserFacing: false`로 설정하거나 `scratch/` 디렉토리에만 보관할 것.
- 작업 완료 후 불필요한 임시 scratchpad 파일은 즉시 정리할 것.

