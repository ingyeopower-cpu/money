---
name: toss-fintech-ui
description: >-
  Toss and modern Fintech White & Blue UI design system guidelines, color tokens,
  component patterns, micro-interactions, and mobile responsive standards for the money dashboard.
---

# Toss Modern Fintech White & Blue UI Design System

이 스킬은 **고석현의 돈통(윤지의돈창고)** 대시보드를 한국 최고 수준의 핀테크 서비스인 **토스(Toss)** 스타일의 미니멀하고 세련된 화이트/블루 감성으로 설계하고 유지하기 위한 표준 가이드라인입니다.

---

## 1. 핵심 컬러 팔레트 (Color Tokens)

### Light Mode (기본 토스 화이트/블루 톤)
- **Primary Blue (토스 블루)**: `#3182F6` (메인 액센트, CTA 버튼, 활성 탭, 주요 게이지)
- **Primary Blue Hover**: `#1B64DA`
- **Primary Blue Light (배경용)**: `#E8F3FF` 또는 `rgba(49, 130, 246, 0.08)`
- **Plane (전체 배경)**: `#F2F4F6` (토스 특유의 편안하고 부드러운 소프트 그레이)
- **Surface (카드 및 모달 배경)**: `#FFFFFF` (순백색)
- **Text Ink (제목/주요 금액)**: `#191F28` (높은 가독성의 다크 그레이)
- **Text Ink2 (부제목/본문)**: `#4E5968` (중간 명도)
- **Text Muted (라벨/안내문/보조)**: `#8B95A1` (연한 그레이)
- **Border / Divider (경계선)**: `#E5E8EB` (1px 미세 구분선)
- **Chip / Tag Background**: `#F2F4F6`
- **Gain / Up (상승/수익)**: `#F04452` (토스 레드) + `rgba(240, 68, 82, 0.08)` (배경)
- **Loss / Down (하락/변동)**: `#3182F6` (토스 블루) + `rgba(49, 130, 246, 0.08)` (배경)
- **Success / Target Done (달성)**: `#00B06F` (토스 민트/그린)

### Dark Mode (야간 핀테크 모드)
- **Plane**: `#101318`
- **Surface**: `#1B2028`
- **Text Ink**: `#F2F4F6`
- **Text Ink2**: `#B0B8C1`
- **Text Muted**: `#6B7684`
- **Border**: `rgba(255, 255, 255, 0.08)`
- **Chip**: `#252B36`

---

## 2. 타이포그래피 & 수치 표현

- **Font Family**: `Pretendard`, system-ui, -apple-system, sans-serif
- **Letter Spacing**: `-0.02em` (자간을 살짝 좁혀 전문적이고 현대적인 느낌 유지)
- **금액 & 수치**: `font-variant-numeric: tabular-nums` (숫자 너비를 고정하여 시선 흐름 안정화)
- **핵심 금액 위계**:
  - Hero 자산 금액: `font-size: 30px ~ 34px; font-weight: 800;`
  - 일반 KPI 수치: `font-size: 21px ~ 24px; font-weight: 750;`
  - 세부 목록/테이블 수치: `font-size: 13.5px ~ 15px; font-weight: 700;`

---

## 3. 컴포넌트 디자인 규칙

### 1) 카드 (Card)
- `border-radius: 22px;`
- `background: var(--surface);`
- `border: 1px solid var(--border);`
- `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);`
- 카드 상단 Hero나 중요 섹션은 `linear-gradient(145deg, #ffffff 0%, #f7faff 100%)`로 은은한 토스 블루 틴트 부여.

### 2) 버튼 (Buttons & Interaction)
- **기본 버튼**: `border-radius: 12px; font-weight: 600; padding: 9px 15px;`
- **Primary 버튼**: 
  - `background: #3182F6; color: #FFFFFF; border: none; font-weight: 700;`
  - `box-shadow: 0 4px 14px rgba(49, 130, 246, 0.28);`
- **터치 햅틱 모션 (Micro-interaction)**:
  - `button:active`: `transform: scale(0.97); transition: transform 0.1s ease;` (누를 때 착 감기는 느낌)

### 3) 탭 바 & 세그먼트 컨트롤 (Segmented Tabs)
- 배경 트랙: `background: var(--chip); border-radius: 14px; padding: 4px;`
- 활성 탭:
  - `background: var(--surface); color: var(--toss-blue);`
  - `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); font-weight: 700;`

### 4) 인풋 & 셀렉트박스 (Forms)
- `border-radius: 12px; background: var(--surface); border: 1px solid var(--border); padding: 10px 14px;`
- 포커스 상태:
  - `outline: none; border-color: #3182F6; box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.16);`

### 5) 모바일 하단 독 (Mobile Dock)
- `background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(20px);`
- `border-top: 1px solid var(--border); box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.04);`
- 활성 메뉴: 아이콘/글씨 `#3182F6` + 소프트 블루 배경 `#E8F3FF`.
