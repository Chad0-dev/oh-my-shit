# Oh My Sh!t

건강한 배변 습관을 돕는 앱입니다. 타이머를 통해 변기에 오래 앉지 않도록 하고, 배변 기록을 관리하여 사용자에게 더 나은 배변 습관을 제공합니다.

## 핵심 기능

- **타이머 기능**: 변기에 앉은 시간을 기록하며 치질 예방에 도움을 주는 타이머
- **배변 기록**: 배변 성공 여부, 배변 양, 이상변 여부 등을 기록
- **캘린더 시각화**: 날짜별 배변 기록을 색상으로 구분하여 직관적으로 확인
- **통계 분석**: 배변 패턴을 분석하고 연령대별 평균 및 연구자 권장 기준과 비교

## 기술 스택

- **프레임워크**: Expo (React Native)
- **언어**: TypeScript
- **UI 라이브러리**: NativeWind
- **상태 관리**: Zustand
- **시간 처리**: Day.js
- **백엔드**: Supabase (Auth + DB + Storage)

## 실행 방법

1. 환경 설정

```bash
# 필요한 패키지 설치
npm install

# Supabase URL 및 Anon Key 설정
# src/supabase/client.ts 파일에서 Supabase URL과 Anon Key 설정
```

2. 개발 서버 실행

```bash
npm start

# 또는 직접 플랫폼 지정
npm run ios
npm run android
npm run web
```

## 디자인

- 'Mossy hollow' 테마 컬러 적용
- 다크 모드와 라이트 모드 지원
- 귀여운 캐릭터와 깔끔한 UI 제공

## 배포 계획 (예정)

- 배경 및 캐릭터 구매 기능
- 광고 제거 기능
- 푸시 알림 기능
- 배변 관련 아티클, 식품 정보 제공
- 인근 병원/약국 위치 안내

## 프로젝트 구조

```
src/
├── components/          # 공통 UI 컴포넌트
├── screens/             # 화면 단위 컴포넌트
├── stores/              # Zustand 상태관리
├── features/            # 기능 중심 구조
├── supabase/            # Supabase 클라이언트 초기화 및 API 유틸
├── utils/               # 공통 유틸리티 (날짜 변환 등)
├── constants/           # 앱 내 공통 상수
```
