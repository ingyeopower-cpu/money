# 윤지의돈창고 프로젝트 현황 및 인수인계 메모

**최종 업데이트:** 2026-09-06 16:50  
**프로젝트 경로:** `C:\Users\PA\Desktop\윤지의돈창고`

---

## 1. 현재 배포 및 연동 현황 (완료)

- **구글 스프레드시트 배포 상태**:
  - **웹 앱 URL:**  
    `https://script.google.com/macros/s/AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg/exec`
  - **배포 ID:** `AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg`
  - **스프레드시트 ID:** `19FQSbeUff_A8UbVxeXuMUckYiMkrZVjfJv5i1cYq1Y5vWPLUjV2d6W9i`
- **데이터 보존 및 실시간 검증 완료:**
  - 현재 총자산: **2억 1,241만원** (`212,413,786원`)
  - 필요 준비자금: **2억 8,219만원** (목표 달성률 **75.3%**)
  - 보유 주식: 총 11개 종목 (아내 8종목, 남편 3종목)
  - 저축 및 자금이동 내역: 7건 정상 보존
  - 로컬 안전 백업 파일: `backup_existing_data.json` 보관 중

---

## 2. 모바일 웹앱(PWA) & 토스 스타일 모던 핀테크 UI 리디자인 (완료)

- **토스(Toss) / 카카오뱅크 스타일 모던 테마:**
  - 고품질 프리텐다드(Pretendard) 핀테크 서체 및 22px 라운드 카드 레이아웃.
  - 고대비 타이포그래피, 소프트 섀도우, 직관적인 컬러 시스템(Toss Blue, Emerald Green, Coral Red, Soft Pink).
  - 다크 모드 / 라이트 모드 완벽 지원.
- **핵심 신규 위젯 3종 탑재:**
  1. 🎯 **잔금 D-day 카운트다운 카드 (Hero Card):**
     - 2028년 5월 잔금 목표일 기준 실시간 D-day 계산 (`D-603일`).
     - 총자산 2억 1,241만원 vs 필요 잔금 2억 8,219만원 달성률(75.3%) 그라데이션 프로그레스 바.
     - 퀵 액션 버튼: [💰 저축 기록], [⚡ 실시간 시세 갱신], [📐 대출 시뮬레이션], [💎 보유 종목].
  2. 👫 **신혼부부 자산 포트폴리오 (아내 vs 남편 vs 공동):**
     - 아내 주식/ETF 8종목: **9,254만원** (43.6%)
     - 남편 주식/ETF 3종목: **2,283만원** (10.8%)
     - 부부 공동 자금(예적금/채권/금): **9,703만원** (45.7%)
     - 멀티 세그먼트 컬러 바 및 3개 통계 박스, 시너지 응원 배너.
  3. 📊 **이번 달 저축 목표 달성 현황:**
     - 2026년 9월 누적 저축액 **1,152만원** / 월 목표 **400만원**.
     - `🎉 목표 288% 달성 (+752만원 초과 저축)` 뱃지 및 마일스톤 게이지바.
- **모바일 사용성(UX) 극대화:**
  - 모바일 화면(`<=768px`) 전용 글래스모피즘 **하단 플로팅 탭바** 탑재 (홈, 자산, 저축·이동, 목표, 대출, 설정).
  - iOS/Android 전체화면(PWA), 다이내믹 아일랜드/노치 및 홈 바 여백(`safe-area-inset`) 패딩 완벽 대응.
  - 부부 실시간 자동 동기화(Auto-Pull) 및 동시성 병합(`mergeEntries_`) 유지.

---

## 3. 구글 Apps Script 자동 배포 완료 (기존 URL 100% 유지)

- **배포 버전:** 버전 5 (Version 5)
- **레이아웃 혁신 (모바일 뷰 기본 적용):**
  - **PC 환경 모바일 앱 컨테이너 일원화:** PC 화면에서도 모바일과 동일하게 중앙 480px 스마트폰 프레임 및 소프트 앰비언트 배경 적용 (토스/인스타그램 웹 스타일).
  - **상단 탭 & 하단 독 동시 지원:** 모바일 및 PC 전체에서 상단 가로 스크롤 필 탭과 하단 플로팅 독이 함께 노출되어 극강의 직관적 내비게이션 제공.
- **라이브 검증 완료:**
  - **웹 앱 URL (변동 없음):**  
    `https://script.google.com/macros/s/AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg/exec`
  - **배포 ID (변동 없음):** `AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg`
  - GitHub Pages 및 구글 Apps Script 양쪽 모두 모바일-퍼스트 기본 뷰 정상 배포 확인 완료.

---

## 4. GitHub Pages 배포 완료 (공식 라이브 웹앱)

- **웹 앱 URL (구글 상단 배너 없는 순수 웹앱):**  
  [https://ingyeopower-cpu.github.io/money/](https://ingyeopower-cpu.github.io/money/)
- **GitHub 리포지토리:**  
  [https://github.com/ingyeopower-cpu/money](https://github.com/ingyeopower-cpu/money)
- **배포 방식:** GitHub Actions (`pages-build-deployment`) 자동 배포
- **연동 구조:** 프론트엔드는 GitHub Pages에서 구글 배너 없이 고속 호스팅되며, 데이터 저장/동기화/시세 갱신은 기존 구글 스프레드시트 백엔드 API와 실시간 통신합니다.
- **모바일 웹앱(PWA):** 아이폰 Safari 또는 갤럭시 Chrome에서 접속 후 **[홈 화면에 추가]** 시 상단 주소창 및 배너 없이 진짜 네이티브 금융 앱처럼 실행됩니다.

---

## 5. 바탕화면 바로가기 현황

- **바로가기 명칭:** `고석현의 돈통` (Windows 바탕화면 바로가기 `.lnk`)
- **실행 대상:** Google Chrome -> `https://ingyeopower-cpu.github.io/money/`
- **아이콘:** 전용 웹앱 아이콘 자동 적용 완료
- **동작:** 더블클릭 시 구글 배너 없는 깨끗한 GitHub Pages 웹앱으로 즉시 열립니다.


