# 🤖 AI 에이전트 행동 수칙 및 협업 가이드

> **최종 갱신:** 2026-11-08  
> **상위 인덱스:** [PROJECT_STATUS.md](../PROJECT_STATUS.md)

---

## 1. ⚡ Auto Mode Rule (자동 실행 원칙)

- **피드백 요청 금지:** 아티팩트나 구현 계획에서 `request_feedback: true`를 절대 사용하지 마십시오.
- **자동 즉시 실행:** 계획 수립 후 사용자의 별도 승인 대기 없이 즉시 코드 수정 및 실행 단계로 직행합니다.
- **불필요한 계획서 생략:** 즉시 실행할 수 있는 작업은 `implementation_plan.md`를 생성할 필요 없이 직접 작업을 완료합니다.
- **무승인 실행 승인:** 사용자가 이 프로젝트 폴더 내 모든 작업의 사전 확인 없이 자동 실행을 승인하였습니다.

---

## 2. 🧹 Unwanted Files & Scratchpad Zero-Tolerance Rule (에디터 탭 자동 열림 원천 차단)

사용자가 작업 중 IDE 상단 탭에 불필요한 마크다운 파일(Scratchpad, 임시 메모 등)이 우후죽순 열려 화면이 지저분해지는 것을 극도로 지양합니다.

### 절대 준수 수칙
1. **브라우저 서브에이전트 종료 즉시 파일 강제 삭제 (필수):**
   - `browser_subagent`를 호출한 경우, 결과 확인 후 **턴을 끝내기 전에 반드시** 아래 PowerShell 명령을 실행하여 생성된 임시 scratchpad를 즉시 영구 삭제할 것:
     ```powershell
     Remove-Item -Path "$env:USERPROFILE\.gemini\antigravity-ide\brain\*\browser\scratchpad_*.md" -Force -ErrorAction SilentlyContinue
     Remove-Item -Path "$env:USERPROFILE\.gemini\antigravity\brain\*\browser\scratchpad_*.md" -Force -ErrorAction SilentlyContinue
     ```
   - 파일 삭제 즉시 IDE 설정(`workbench.editor.closeOnFileDelete: true`)에 의해 에디터 탭도 완전히 닫힙니다.
2. **불필요한 아티팩트/메모 생성 절대 금지:**
   - 사용자가 명시적으로 문서화를 요구하지 않는 한 임시 마크다운 파일을 만들지 말 것.
   - 생성 시 무조건 `UserFacing: false` 지정.
3. **가벼운 검증은 백그라운드 스크립트 우선 사용:**
   - 단순 API 응답이나 코드 문법 검사는 무거운 브라우저 서브에이전트 대신 `node`, `curl`, `powershell`을 우선 활용하여 subagent 자체의 생성을 최소화할 것.
4. **탭 개수 상한 설정 유지:**
   - IDE 설정의 `workbench.editor.limit.value: 5`를 유지하여 에디터 탭이 5개 이상 무한정 증식하지 않도록 관리할 것.
5. **Auto-Open Edited Files 끄기 유지:**
   - IDE Settings > General > File Access의 `Auto-Open Edited Files` 스위치가 OFF(회색) 상태로 유지되도록 관리할 것.

---

## 3. 🛡️ 자산 데이터 보호 및 자가치유(Self-Healing) 원칙

- **스프레드시트 원장 데이터 무단 초기화 금지:**
  - 시트 데이터 수정 전 반드시 현재 상태를 읽어 백업하고 변경사항만 반영합니다.
- **자가치유(HealState) 아키텍처 준수:**
  - `index.html` 내 `healState_()` 로직은 브라우저 로컬스토리지에 남아있을 수 있는 구버전 하드코딩 수량(1,169주 등)을 실보유 수량(2,939주 등)으로 안전하게 교정합니다.
  - 데이터 모델을 변경할 때는 이 자가치유 로직 및 `defaults()`와 시트 원장의 일관성을 반드시 검증합니다.
- **다중 직렬화(Double Stringified) 방지:**
  - API 페이로드 전송 시 객체(`{ data: S }`)를 전송하며, 파싱 시에는 `while (typeof remoteData === "string")`으로 완충합니다.

---

## 4. 🎨 UI/UX 및 핀테크 표준 가이드라인

- **손익 컬러 표준:** 한국 주식시장 표준 적용
  - 상승 / 이익: **레드** (`var(--gain, #f04452)`)
  - 하락 / 손실: **토스 블루** (`var(--loss, #3182f6)`)
- **숫자 및 통화 표기:**
  - `moneyText()` 헬퍼를 활용하여 만원 단위 쉼표 포맷 유지
  - 중복 단위("만원원" 등) 방지
- **모바일 퍼스트:**
  - 모든 UI는 모바일(360~430px)에서 가로 스크롤 없이 한눈에 파악될 수 있도록 카드 뷰 및 접기 토글을 기본 지원합니다.

