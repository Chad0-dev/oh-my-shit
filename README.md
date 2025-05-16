# Oh My Poop

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

# .env 파일 생성
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## 앱스토어 배포 준비

1. **빌드 설정**

   - `eas.json` 파일에서 iOS/Android 빌드 설정 확인
   - 환경 변수를 EAS Secret에 설정: `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_value"`

2. **애플 앱스토어 배포**

   - Apple Developer 계정 필요
   - App Store Connect에 앱 등록 필요
   - 다음 명령어로 빌드 및 제출: `eas build --platform ios --profile production && eas submit -p ios`

3. **구글 플레이스토어 배포**
   - Google Play Console 계정 필요
   - 서비스 계정 키(serviceAccountKey.json) 설정 필요
   - 다음 명령어로 빌드 및 제출: `eas build --platform android --profile production && eas submit -p android`

## 배포 전 체크리스트

- [ ] app.json과 package.json의 앱 정보 일치 확인
- [ ] Android/iOS 번들 ID 및 패키지명 설정 확인
- [ ] 환경 변수 설정 (Supabase URL, Anon Key 등)
- [ ] 앱 아이콘 및 스플래시 이미지 설정
- [ ] Android 서비스 계정 키 설정
- [ ] iOS 인증서 및 프로비저닝 프로필 설정
- [ ] 프라이버시 정책 URL 추가
- [ ] 스크린샷 및 앱 설명 준비
- [ ] 앱 내 약관 및 개인정보처리방침 추가

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
