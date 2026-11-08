# 🏛️ 시스템 아키텍처 및 배포 가이드

> **최종 갱신:** 2026-11-08  
> **상위 인덱스:** [PROJECT_STATUS.md](../PROJECT_STATUS.md)

---

## 1. 🌐 서비스 개요 및 핵심 링크

| 구분 | 주소 / 식별자 | 설명 |
| :--- | :--- | :--- |
| **공식 웹앱 (GitHub Pages)** | [https://ingyeopower-cpu.github.io/money/](https://ingyeopower-cpu.github.io/money/) | 구글 상단 배너 없는 메인 실서비스 웹앱 (PWA 풀스크린 지원) |
| **GitHub 소스코드 저장소** | [https://github.com/ingyeopower-cpu/money](https://github.com/ingyeopower-cpu/money) | `main` 브랜치 전담 (모든 UI/CSS/JS 수정 및 자동 배포) |
| **백엔드 API (Google Apps Script)** | `AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg` | 구글 Apps Script Web App 활성 배포 ID (클라우드 DB & 동기화 전담) |
| **구글 스프레드시트 (클라우드 DB)** | `19FQSbeUfF_A8UbVxeXuMUckYiMkrZVjFJv5i1cYq1Y5vWPLUjV2d6W9i` | 자산 및 저축 데이터 영구 저장소 (A1 셀 JSON 원장) |

---

## 2. 🏗️ 이원화 시스템 아키텍처

본 프로젝트는 **GitHub 중심의 프론트엔드**와 **Google Cloud 중심의 백엔드/DB**로 엄격히 역할이 분리되어 있습니다.

```
[사용자 브라우저 / 모바일 PWA]
        │
        ├── (1) 정적 웹앱 로드 (HTML/CSS/JS/SW) ──► GitHub Pages (main 브랜치)
        │                                           (git push 즉시 30초 내 자동 배포)
        │
        └── (2) 자산 원장 동기화 & 시세 크롤링 ──► Google Apps Script Web App
                                                    (doGet / doPost / refreshMarket)
                                                             │
                                                             ▼
                                                    Google Spreadsheet (A1 DB)
```

### (1) 프론트엔드 & 배포 (GitHub Pages 전담)
- **대상 파일:** `index.html`, `sw.js`, `manifest.json`, `assets/*`
- **배포 프로세스:** 로컬에서 소스 수정 후 `git push origin main` 실행 시 GitHub Actions를 통해 30초 내 전 세계 기기(아이폰, 갤럭시, PC)로 자동 배포됩니다.
- **PWA & 오프라인 캐싱:**
  - `sw.js` (Service Worker)가 정적 에셋을 캐싱하여 초고속 네이티브 앱 경험을 제공합니다.
  - 서비스 워커 버전(`CACHE_NAME`) 갱신 시 브라우저가 자동으로 구버전 캐시를 즉시 파기하고 최신 코드를 내려받습니다.

### (2) 백엔드 & 클라우드 DB (Google Apps Script & Spreadsheet 전담)
- **대상 파일:** `code.gs`
- **역할:** 사용자가 브라우저에서 보는 화면이 아니며, **순수 클라우드 데이터베이스(DB) 및 백엔드 API 역할**만 수행합니다.
- **주요 엔드포인트:**
  - `GET ?action=data`: 스프레드시트 A1 셀의 자산 JSON 원장 조회
  - `POST`: 로컬 자산 변경 사항(`payload.data`)을 A1 셀에 저장
  - `GET ?action=refreshMarket`: 네이버/야후 금융 API를 통해 종목 종가 및 환율을 백엔드에서 일괄 갱신 후 시트 저장

---

## 3. 🚨 Apps Script 배포 절대 원칙 (code.gs 수정 시에만 적용)

1. **일반적인 UI/기능 수정 시에는 Apps Script를 재배포할 필요가 전혀 없습니다.** (GitHub 배포만 진행)
2. 오직 `code.gs` 백엔드 로직 자체에 변경이 있을 때만 구글 배포를 갱신합니다.
3. **새 배포 절대 금지:** 새 배포를 생성하면 웹앱 URL(배포 ID)이 변경되어 모바일 기기 및 부부 동기화가 끊어집니다.
4. **기존 배포 ID 유지 원칙:**
   - 기존 배포 ID: `AKfycbwvmGOCVuYW6Uul4DZBe13JVEHZ0ie3BiOP6vDc-ND9k-E-yLbVgqohcjsNowLV7MldHg`
   - Apps Script UI 진행 시: `배포 관리` ➔ 활성 배포 선택 ➔ `수정(연필 아이콘)` ➔ 버전: `새 버전` 선택 ➔ `배포`

---

## 4. 🔒 관리자 보안 시스템 (Security Architecture)

- **보호 대상:** 자산, 목표설정, 저축·자금이동, 기록 탭의 모든 수정/저장/삭제 동작
- **암호화 방식:** Web Crypto API 기반의 **SHA-256 단방향 암호화** 검증 (평문 비밀번호 노출 차단)
- **세션 관리:**
  - 1회 인증 성공 시 10분 동안 재입력 없이 연속 편집 가능
  - 상단 헤더에 `🔓 관리자 수정 모드 승인됨 (MM:SS)` 실시간 타이머 및 `[🔒 즉시 잠금]` 버튼 제공
  - 10분 경과 시 자동 잠금되어 비인가 기기에서의 위변조 원천 방어
