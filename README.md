# CodeBite

코딩 학습 앱 **CodeBite**의 웹 데모 프로젝트입니다.

React Native 앱의 UI 컴포넌트를 브라우저에서 확인할 수 있도록 순수 HTML + Babel CDN 방식으로 포팅했습니다.

## 실행 방법

별도 빌드 없이 로컬 서버만 있으면 됩니다.

```bash
# VS Code Live Server 확장 설치 후
# index.html 우클릭 → Open with Live Server
```

> `file://` 프로토콜로 직접 열면 스크립트 로드 오류가 발생할 수 있으므로 반드시 로컬 서버를 사용하세요.

## 기술 스택

| 항목 | 내용 |
|------|------|
| React | 18 (CDN) |
| Babel | Standalone (JSX 변환) |
| 스타일 | 순수 CSS (`styles.css`) |

## 파일 구조

```
codebite/
├── index.html      # 진입점
├── app.js          # React 컴포넌트
├── styles.css      # 스타일
├── assets/         # 이미지 리소스
└── docs/           # 약관 및 오픈소스 고지
```

## 라이선스

[오픈소스 고지](docs/OPEN_SOURCE.md) · [이용약관](docs/TERMS_OF_SERVICE.md) · [개인정보처리방침](docs/PRIVACY_POLICY.md)
