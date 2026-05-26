const { useState, useCallback } = React;

/* ════════════════════════════════════════════
   Button 컴포넌트 (React Native → Web 포팅)
════════════════════════════════════════════ */
const variantContainer = {
  primary: { backgroundColor: "#58CC02" },
  kakao:   { backgroundColor: "#FEE500" },
  outline: { backgroundColor: "#242628", border: "1.5px solid #333537" },
  ghost:   { backgroundColor: "transparent" },
  danger:  { backgroundColor: "#242628", border: "1px solid #FF4B4B55" },
};
const variantText = {
  primary: { color: "#fff" },
  kakao:   { color: "#191919" },
  outline: { color: "#fff" },
  ghost:   { color: "#58CC02" },
  danger:  { color: "#FF4B4B" },
};
const disabledContainer = {
  primary: { backgroundColor: "#1e3a10" },
  kakao:   { opacity: 0.6 },
  outline: { opacity: 0.5 },
  ghost:   { opacity: 0.5 },
  danger:  { opacity: 0.5 },
};

function Button({ label, onClick, disabled = false, variant = "primary", color, textColor, style = {}, textStyle = {} }) {
  return (
    <button
      style={{
        borderRadius: 14, padding: "13px 24px", cursor: disabled ? "not-allowed" : "pointer",
        border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "opacity 0.15s, transform 0.1s", userSelect: "none",
        ...variantContainer[variant],
        ...(disabled ? disabledContainer[variant] : {}),
        ...(color ? { backgroundColor: color } : {}),
        ...style,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <span style={{ fontSize: 15, fontWeight: "700", fontFamily: "inherit", ...variantText[variant], ...(textColor ? { color: textColor } : {}), ...textStyle }}>
        {label}
      </span>
    </button>
  );
}

/* ════════════════════════════════════════════
   마크다운 → HTML 간이 렌더러
════════════════════════════════════════════ */
function renderMarkdown(md) {
  const lines = md.split("\n");
  const elements = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) { elements.push(<h3 key={key++}>{line.slice(4)}</h3>); i++; continue; }
    if (line.startsWith("## "))  { elements.push(<h2 key={key++}>{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith("# "))   { i++; continue; }
    if (/^---+$/.test(line.trim())) { elements.push(<hr key={key++} />); i++; continue; }

    if (line.startsWith("> ")) {
      elements.push(<blockquote key={key++}>{line.slice(2)}</blockquote>);
      i++; continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) { tableLines.push(lines[i]); i++; }
      const rows = tableLines.filter(l => !/^\|[-| :]+\|$/.test(l.trim()));
      const parseRow = r => r.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      const [header, ...body] = rows;
      elements.push(
        <table key={key++}>
          <thead><tr>{parseRow(header).map((h, ci) => <th key={ci}>{h}</th>)}</tr></thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>
                {parseRow(row).map((cell, ci) => {
                  const urlMatch = cell.match(/https?:\/\/[^\s)]+/);
                  return <td key={ci}>{urlMatch ? <a href={urlMatch[0]} target="_blank" rel="noreferrer">{cell}</a> : cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    }

    if (/^(\d+\.|[-*]) /.test(line)) {
      const isOrdered = /^\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^(\d+\.|[-*]) /.test(lines[i])) {
        const text = lines[i].replace(/^(\d+\.|[-*]) /, "");
        const parts = text.split(/\*\*(.+?)\*\*/g).map((p, idx) => idx % 2 === 1 ? <strong key={idx}>{p}</strong> : p);
        items.push(<li key={i}>{parts}</li>);
        i++;
      }
      const Tag = isOrdered ? "ol" : "ul";
      elements.push(<Tag key={key++}>{items}</Tag>);
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    const parts = line.split(/\*\*(.+?)\*\*/g).map((p, idx) => idx % 2 === 1 ? <strong key={idx}>{p}</strong> : p);
    elements.push(<p key={key++}>{parts}</p>);
    i++;
  }
  return elements;
}

/* ════════════════════════════════════════════
   콘텐츠 데이터
════════════════════════════════════════════ */
const OPEN_SOURCE_MD = `# 오픈소스 라이선스 고지

본 앱(CodeBite)은 아래의 오픈소스 소프트웨어를 사용합니다.

---

## 코어 프레임워크

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| react | 19.1.0 | MIT | https://github.com/facebook/react |
| react-dom | 19.1.0 | MIT | https://github.com/facebook/react |
| react-native | 0.81.5 | MIT | https://github.com/facebook/react-native |
| expo | ~54.0.33 | MIT | https://github.com/expo/expo |

---

## 네비게이션

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| expo-router | ~6.0.23 | MIT | https://github.com/expo/expo |
| @react-navigation/native | ^7.1.8 | MIT | https://github.com/react-navigation/react-navigation |
| @react-navigation/bottom-tabs | ^7.4.0 | MIT | https://github.com/react-navigation/react-navigation |
| @react-navigation/elements | ^2.6.3 | MIT | https://github.com/react-navigation/react-navigation |

---

## 상태 관리 및 데이터 페칭

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| zustand | ^5.0.12 | MIT | https://github.com/pmndrs/zustand |
| @tanstack/react-query | ^5.96.0 | MIT | https://github.com/TanStack/query |
| axios | ^1.15.0 | MIT | https://github.com/axios/axios |

---

## 저장소

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| @react-native-async-storage/async-storage | 2.2.0 | MIT | https://github.com/react-native-async-storage/async-storage |
| expo-secure-store | ^55.0.12 | MIT | https://github.com/expo/expo |

---

## UI / 애니메이션

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| lottie-react-native | ^7.3.6 | Apache-2.0 | https://github.com/lottie-react-native/lottie-react-native |
| react-native-reanimated | ~4.1.1 | MIT | https://github.com/software-mansion/react-native-reanimated |
| react-native-gesture-handler | ~2.28.0 | MIT | https://github.com/software-mansion/react-native-gesture-handler |
| react-native-svg | 15.12.1 | MIT | https://github.com/software-mansion/react-native-svg |
| @expo/vector-icons | ^15.0.3 | MIT | https://github.com/expo/vector-icons |
| react-native-worklets | 0.5.1 | MIT | https://github.com/margelo/react-native-worklets |

---

## Expo 모듈

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| expo-constants | ~18.0.13 | MIT | https://github.com/expo/expo |
| expo-font | ~14.0.11 | MIT | https://github.com/expo/expo |
| expo-haptics | ~15.0.8 | MIT | https://github.com/expo/expo |
| expo-image | ~3.0.11 | MIT | https://github.com/expo/expo |
| expo-linking | ~8.0.11 | MIT | https://github.com/expo/expo |
| expo-splash-screen | ~31.0.13 | MIT | https://github.com/expo/expo |
| expo-status-bar | ~3.0.9 | MIT | https://github.com/expo/expo |
| expo-symbols | ~1.0.8 | MIT | https://github.com/expo/expo |
| expo-system-ui | ~6.0.9 | MIT | https://github.com/expo/expo |
| expo-web-browser | ^55.0.14 | MIT | https://github.com/expo/expo |

---

## 플랫폼 지원

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| react-native-safe-area-context | ~5.6.0 | MIT | https://github.com/th3rdwave/react-native-safe-area-context |
| react-native-screens | ~4.16.0 | MIT | https://github.com/software-mansion/react-native-screens |
| react-native-web | ~0.21.0 | MIT | https://github.com/necolas/react-native-web |

---

## 알림 (예정)

> 아래 라이브러리는 향후 푸시 알림 기능 구현 시 추가될 예정입니다.

| 라이브러리 | 라이선스 | 링크 | 용도 |
|---|---|---|---|
| expo-notifications | MIT | https://github.com/expo/expo | 로컬/푸시 알림 수신 및 권한 요청 |
| expo-device | MIT | https://github.com/expo/expo | 기기 정보 확인 (알림 권한 분기 처리에 필요) |

---

## 개발 의존성

| 라이브러리 | 버전 | 라이선스 | 링크 |
|---|---|---|---|
| typescript | ~5.9.2 | Apache-2.0 | https://github.com/microsoft/TypeScript |
| jest | ^29.7.0 | MIT | https://github.com/jestjs/jest |
| jest-expo | ^55.0.15 | MIT | https://github.com/expo/expo |
| eslint | ^9.25.0 | MIT | https://github.com/eslint/eslint |
| eslint-config-expo | ~10.0.0 | MIT | https://github.com/expo/expo |
| axios-mock-adapter | ^2.1.0 | MIT | https://github.com/ctimmerm/axios-mock-adapter |
| @types/react | ~19.1.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/jest | ^30.0.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |

---

각 라이브러리의 전체 라이선스 본문은 해당 GitHub 저장소의 LICENSE 파일에서 확인할 수 있습니다.`;

const PRIVACY_MD = `# CodeBite 개인정보 처리 방침

**시행일: 2026년 5월 22일**

CodeBite 팀(이하 "운영자")은 「개인정보 보호법」을 준수하며, 이용자의 개인정보를 보호하기 위해 다음과 같은 개인정보 처리 방침을 수립·운영합니다.

---

## 제1조 (개인정보의 처리 목적)

운영자는 다음의 목적으로 개인정보를 처리합니다. 처리하는 개인정보는 아래 목적 외의 용도로 이용되지 않으며, 목적이 변경될 경우 사전에 동의를 받겠습니다.

| 목적 | 내용 |
|------|------|
| 회원 가입 및 관리 | 본인 확인, 중복 가입 방지, 계정 식별 |
| 서비스 제공 | 퀴즈 학습, 스트릭 관리, 도토리 지급, 랭킹 집계, 팔로우·검색 기능 제공 |
| 알림 발송 | 학습 알림 등 푸시 알림 발송 (구현 예정) |
| 부정 이용 방지 | 이용 약관 위반 행위 탐지 및 제재 |
| 고충 처리 | 이용자 문의 접수 및 답변 |

---

## 제2조 (수집하는 개인정보의 항목 및 수집 방법)

### 수집 항목

**가입 시 수집 (필수)**

| 가입 유형 | 수집 항목 |
|-----------|-----------|
| 이메일 회원 가입 | 이메일 주소, 비밀번호(암호화 저장) |
| Google 소셜 로그인 | 이메일 주소, Google 계정 고유 식별자 |
| Kakao 소셜 로그인 | 이메일 주소, Kakao 계정 고유 식별자 |

**서비스 이용 중 자동 생성·수집**

- 닉네임, 사용자 코드(6자리 랜덤)
- 학습 기록: 스트릭(연속 학습 일수), 마지막 학습 일시, 도토리 보유량
- 보유 아이템 및 장착 배너 정보
- 팔로우 관계
- 북마크(학습 완료 개념)
- 인증 토큰(Refresh Token, 로그인 유지 목적)

**알림 서비스 동의 시 수집 (구현 예정)**

- FCM 토큰(기기 식별 토큰, 푸시 알림 발송 용도)

### 수집 방법

- 이용자가 서비스 가입 화면에서 직접 입력
- Google, Kakao OAuth 인증 과정에서 해당 플랫폼으로부터 전달
- 서비스 이용 과정에서 자동 생성

---

## 제3조 (개인정보의 처리 및 보유 기간)

1. 운영자는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보를 수집할 때 동의 받은 기간 내에서 개인정보를 처리·보유합니다.
2. 개인정보 처리 및 보유 기간은 다음과 같습니다.

| 항목 | 보유 기간 |
|------|-----------|
| 회원 가입 및 서비스 이용 관련 정보 | 회원 탈퇴 시 즉시 삭제 |
| FCM 토큰 | 알림 거부 또는 회원 탈퇴 시 즉시 삭제 |

3. 관련 법령에 의해 보존이 필요한 경우 아래 기간 동안 보관합니다.

| 근거 법령 | 보존 항목 | 보존 기간 |
|-----------|-----------|-----------|
| 통신비밀보호법 | 로그인 기록(접속 IP 등) | 3개월 |
| 전자상거래법 | 소비자 불만 및 분쟁 처리 기록 | 3년 |

---

## 제4조 (개인정보의 제3자 제공)

운영자는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.

- 이용자가 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

---

## 제5조 (개인정보 처리 위탁)

운영자는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다. 수탁자가 개인정보를 안전하게 처리하도록 관리·감독합니다.

| 수탁자 | 위탁 업무 | 보유 및 이용 기간 |
|--------|-----------|-------------------|
| Google LLC | Google OAuth 소셜 로그인 인증 | 위탁 계약 종료 시 또는 이용자 탈퇴 시 |
| Kakao Corp. | Kakao OAuth 소셜 로그인 인증 | 위탁 계약 종료 시 또는 이용자 탈퇴 시 |
| Google LLC (Firebase) | FCM 푸시 알림 발송 (구현 예정) | 위탁 계약 종료 시 또는 알림 거부·탈퇴 시 |

각 수탁자의 개인정보 처리 방침은 해당 서비스의 공식 방침을 따릅니다.

---

## 제6조 (정보주체의 권리·의무 및 행사 방법)

이용자는 운영자에 대해 언제든지 다음의 권리를 행사할 수 있습니다.

1. **개인정보 열람 요구**: 운영자가 보유한 본인의 개인정보 확인
2. **오류 정정 요구**: 개인정보가 부정확하거나 누락된 경우 수정 요청
3. **삭제 요구**: 서비스 내 탈퇴 기능 이용 또는 이메일 요청
4. **처리 정지 요구**: 특정 개인정보 처리의 정지 요청

권리 행사는 서비스 내 설정 화면 또는 아래 연락처(ghxo03215@gmail.com)를 통해 할 수 있으며, 운영자는 지체 없이 조치합니다.

---

## 제7조 (개인정보의 파기)

1. 운영자는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 해당 개인정보를 지체 없이 파기합니다.
2. 파기 방법은 다음과 같습니다.

| 형태 | 파기 방법 |
|------|-----------|
| 전자적 파일 형태 | 복구 불가능한 방법으로 영구 삭제 |
| 데이터베이스 기록 | 해당 레코드 삭제 |

---

## 제8조 (개인정보의 안전성 확보 조치)

운영자는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.

- **비밀번호 암호화**: 이용자 비밀번호는 단방향 암호화(BCrypt)로 저장하며 운영자도 원문을 알 수 없습니다.
- **인증 토큰 관리**: JWT 기반 인증을 사용하며, Refresh Token은 서버에서 관리합니다.
- **접근 제한**: 개인정보에 접근할 수 있는 인원을 최소화합니다.
- **HTTPS 통신**: 개인정보 전송 시 암호화된 통신을 사용합니다.

---

## 제9조 (자동 수집 장치)

운영자는 서비스 인증 및 이용 편의를 위해 JWT(JSON Web Token) 기반 인증을 사용합니다.

- **Access Token**: 짧은 유효 기간의 인증 토큰으로 클라이언트에서 관리합니다.
- **Refresh Token**: 로그인 상태 유지를 위해 서버 데이터베이스에 저장되며, 로그아웃 또는 탈퇴 시 삭제됩니다.

---

## 제10조 (개인정보 보호 책임자)

운영자는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 개인정보 관련 불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호 책임자를 지정합니다.

- **책임자**: CodeBite 팀
- **연락처**: ghxo03215@gmail.com

---

## 제11조 (권익침해 구제 방법)

이용자는 개인정보 침해로 인한 구제를 받기 위해 아래 기관에 분쟁 해결이나 상담을 신청할 수 있습니다.

| 기관 | 연락처 |
|------|--------|
| 개인정보 침해신고센터 (한국인터넷진흥원) | privacy.kisa.or.kr / 국번 없이 118 |
| 개인정보 분쟁조정위원회 | www.kopico.go.kr / 1833-6972 |
| 대검찰청 사이버수사과 | www.spo.go.kr / 국번 없이 1301 |
| 경찰청 사이버수사국 | ecrm.cyber.go.kr / 국번 없이 182 |

---

## 제12조 (개인정보 처리 방침의 변경)

1. 이 개인정보 처리 방침은 시행일로부터 적용됩니다.
2. 내용이 변경되는 경우 변경 사항을 시행일 기준 7일 전에 서비스 내 공지합니다. 이용자에게 불리한 변경의 경우 30일 전에 공지합니다.
3. 이전 버전의 처리 방침은 운영자에게 요청 시 확인할 수 있습니다.

---

본 개인정보 처리 방침은 2026년 5월 22일부터 시행됩니다.`;

const TERMS_MD = `# CodeBite 이용약관

**시행일: 2026년 5월 22일**

---

## 제1조 (목적)

이 약관은 CodeBite 팀(이하 "운영자")이 제공하는 CodeBite 서비스(이하 "서비스")의 이용 조건 및 절차, 운영자와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.

---

## 제2조 (용어의 정의)

이 약관에서 사용하는 용어의 정의는 다음과 같습니다.

1. **서비스**: 운영자가 제공하는 코딩 학습 퀴즈 플랫폼 CodeBite 및 관련 제반 서비스
2. **이용자**: 이 약관에 동의하고 서비스를 이용하는 회원
3. **회원**: 서비스에 가입하여 계정을 보유한 자
4. **계정**: 이용자가 서비스를 이용하기 위해 등록한 이메일 또는 소셜 로그인 정보
5. **닉네임**: 서비스 내에서 이용자를 식별하는 표시 이름
6. **도토리**: 퀴즈 학습 완료 등 서비스 내 활동을 통해 무상으로 지급되는 가상의 재화. 현금으로 구매하거나 현금으로 환전할 수 없습니다.
7. **스트릭(Streak)**: 이용자가 매일 연속으로 학습을 완료한 일수
8. **보호자(Protector)**: 스트릭이 끊기지 않도록 보호해 주는 아이템
9. **배너**: 도토리로 구매하여 프로필에 장착할 수 있는 꾸미기 아이템

---

## 제3조 (약관의 게시 및 변경)

1. 운영자는 이 약관의 내용을 서비스 내 또는 연결 화면에 게시합니다.
2. 운영자는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.
3. 약관이 변경될 경우, 운영자는 변경 사항을 시행일 기준 7일 전에 서비스 내 공지합니다. 다만, 이용자에게 불리한 변경의 경우 30일 전에 공지합니다.
4. 이용자가 변경된 약관의 시행일 이후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주합니다.

---

## 제4조 (서비스 가입)

1. 이용자는 다음 방법 중 하나로 서비스에 가입할 수 있습니다.
   - 이메일 및 비밀번호를 이용한 일반 회원 가입
   - Google 계정을 이용한 소셜 로그인
   - Kakao 계정을 이용한 소셜 로그인
2. 이용자는 가입 시 실제 본인의 정보를 정확하게 입력해야 합니다.
3. 타인의 정보를 도용하거나 허위 정보를 입력하여 가입한 경우, 운영자는 해당 계정을 삭제하거나 이용을 제한할 수 있습니다.
4. 만 14세 미만의 아동은 서비스에 가입할 수 없습니다.

---

## 제5조 (계정 관리)

1. 이용자는 자신의 계정 정보(비밀번호 등)를 안전하게 관리할 책임이 있습니다.
2. 이용자는 자신의 계정을 타인에게 양도하거나 공유해서는 안 됩니다.
3. 계정 도용 또는 부정 사용이 의심되는 경우, 즉시 운영자(ghxo03215@gmail.com)에게 신고해야 합니다.
4. 이용자 본인의 부주의로 인한 계정 도용에 대해 운영자는 책임을 지지 않습니다.

---

## 제6조 (서비스 이용)

1. 운영자는 다음의 서비스를 제공합니다.
   - 프로그래밍 관련 주제별 코딩 학습 퀴즈
   - 학습 스트릭 및 도토리 보상 시스템
   - 도토리로 구매 가능한 아이템 상점 (배너 등)
   - 랭킹 조회 기능
   - 팔로우·유저 검색 등 소셜 기능
   - 학습한 개념에 대한 북마크 기능
   - 푸시 알림(FCM) 서비스
2. 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검·장애·운영 상의 이유로 일시 중단될 수 있습니다.

---

## 제7조 (도토리 및 서비스 내 재화)

1. 도토리는 퀴즈 완료 등 서비스 내 활동을 통해 무상으로 지급되는 가상 재화입니다.
2. 도토리는 현금으로 구매하거나 현금·상품권 등 실제 재화로 환전할 수 없습니다.
3. 도토리로 구매한 아이템(배너 등)은 환불·교환이 불가합니다.
4. 회원 탈퇴 시 보유 중인 도토리 및 아이템은 즉시 소멸되며, 이에 대한 보상은 제공되지 않습니다.
5. 운영자는 서비스 운영 정책에 따라 도토리 지급 조건 및 수량을 변경할 수 있습니다.

---

## 제8조 (이용자의 의무)

이용자는 다음 행위를 해서는 안 됩니다.

1. 타인의 계정, 개인정보를 도용하거나 무단으로 사용하는 행위
2. 서비스 운영을 방해하거나 서버에 과도한 부하를 주는 행위 (자동화 프로그램, 봇 등 사용 포함)
3. 서비스 내에서 욕설, 비방, 혐오 표현 등 타인에게 불쾌감을 주는 행위
4. 퀴즈 정답 및 학습 콘텐츠를 무단으로 복제·배포하는 행위
5. 서비스의 취약점을 악용하거나 해킹, 치트 프로그램을 이용하는 행위
6. 관련 법령을 위반하는 행위
7. 기타 운영자가 서비스 이용에 부적절하다고 판단하는 행위

---

## 제9조 (운영자의 의무)

1. 운영자는 관련 법령 및 이 약관을 준수하며 안정적인 서비스를 제공하기 위해 노력합니다.
2. 운영자는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다.
3. 운영자는 이용자로부터 제기된 의견이나 불만이 정당하다고 인정되는 경우, 이를 처리하기 위해 노력합니다.
4. 운영자는 서비스 개선을 위해 이용자에게 사전 고지 후 콘텐츠 및 기능을 변경할 수 있습니다.

---

## 제10조 (서비스 이용 제한 및 중단)

1. 이용자가 제8조를 위반한 경우, 운영자는 사전 고지 없이 다음 조치를 취할 수 있습니다.
   - 경고
   - 일시적 서비스 이용 정지
   - 계정 영구 정지 및 삭제
2. 운영자는 서비스 제공에 필요한 시스템 점검, 증설 또는 교체 등을 위해 서비스를 일시 중단할 수 있으며, 이 경우 사전에 공지합니다.
3. 불가항력(천재지변, 정전, 통신 장애 등)으로 인해 서비스가 중단된 경우, 운영자는 이에 대한 책임을 지지 않습니다.

---

## 제11조 (회원 탈퇴)

1. 이용자는 언제든지 서비스 내 설정 또는 운영자에게 요청하여 회원 탈퇴를 신청할 수 있습니다.
2. 탈퇴 즉시 이용자의 계정 정보, 스트릭 기록, 도토리, 아이템, 팔로우 정보 등 모든 데이터는 삭제됩니다. 단, 관계 법령에 따라 보관이 필요한 정보는 해당 기간 동안 보존됩니다.
3. 탈퇴 후에는 동일한 소셜 계정으로 재가입이 가능하나, 이전 데이터는 복구되지 않습니다.

---

## 제12조 (개인정보 보호)

1. 운영자는 이용자의 개인정보를 관련 법령 및 개인정보처리방침에 따라 수집·이용·보관합니다.
2. 수집하는 개인정보 항목은 다음과 같습니다.
   - 이메일 주소, 닉네임 (필수)
   - 소셜 로그인 시 해당 서비스의 고유 사용자 식별자
   - FCM 토큰 (푸시 알림 동의 시)
3. 이용자는 개인정보 처리와 관련한 문의를 운영자 이메일(ghxo03215@gmail.com)로 할 수 있습니다.

---

## 제13조 (지식재산권)

1. 서비스 내 퀴즈 콘텐츠, 학습 자료, 디자인, 소프트웨어 등의 지식재산권은 운영자에게 귀속됩니다.
2. 이용자는 서비스의 콘텐츠를 운영자의 사전 서면 동의 없이 복제, 배포, 상업적으로 이용할 수 없습니다.

---

## 제14조 (면책 조항)

1. 운영자는 다음의 경우 서비스 제공과 관련하여 발생한 손해에 대해 책임을 지지 않습니다.
   - 천재지변, 전쟁, 테러 등 불가항력에 의한 서비스 중단
   - 이용자 본인의 귀책 사유로 인한 손해
   - 이용자 간의 분쟁으로 인한 손해
   - 무료로 제공되는 서비스의 이용 또는 이용 불가로 인한 손해
2. 운영자는 서비스 내 학습 콘텐츠의 정확성·완전성을 보증하지 않으며, 이를 사용한 결과에 대한 책임을 지지 않습니다.

---

## 제15조 (분쟁 해결)

1. 서비스 이용과 관련하여 분쟁이 발생한 경우, 운영자와 이용자는 성실한 협의를 통해 해결합니다.
2. 협의가 이루어지지 않는 경우, 관련 법령에 따라 관할 법원에 소를 제기할 수 있습니다.
3. 이 약관은 대한민국 법령을 기준으로 해석하며, 관할 법원은 민사소송법에 따릅니다.

---

## 제16조 (문의)

서비스 이용 및 약관에 대한 문의는 아래 연락처로 해주시기 바랍니다.

- **이메일**: ghxo03215@gmail.com
- **운영팀**: CodeBite 팀

---

본 약관은 2026년 5월 22일부터 시행됩니다.`;

/* ════════════════════════════════════════════
   탭 정의
════════════════════════════════════════════ */
const TABS = [
  { id: "home",    label: "홈" },
  { id: "terms",   label: "이용약관" },
  { id: "privacy", label: "개인정보처리방침" },
  { id: "oss",     label: "오픈소스" },
];

/* ════════════════════════════════════════════
   광고 카드 데이터
════════════════════════════════════════════ */
const AD_CARDS = [
  {
    icon: "🔥",
    title: "스트릭",
    desc: "매일 연속 학습해서\n보상을 노려보세요!",
    cta: "스트릭 이어가기 →",
    accent: "#FF6B35",
  },
  {
    icon: "🌰",
    title: "도토리",
    desc: "퀴즈를 풀고 도토리를 모아\n아이템을 구매해보세요!",
    cta: "상점 둘러보기 →",
    accent: "#58CC02",
  },
  {
    icon: "🏆",
    title: "랭킹",
    desc: "전국 학습자와 겨루며\n실력을 입증해보세요!",
    cta: "랭킹 확인하기 →",
    accent: "#FFD700",
  },
];

/* ════════════════════════════════════════════
   홈 화면
════════════════════════════════════════════ */
function HomeScreen({ onNavigate }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>

      {/* 로고 — 투명 배경, 크게 */}
      <div style={{ marginBottom: 40 }}>
        <img
          src="assets/logo.png"
          alt="CodeBite"
          style={{ height: 90, maxWidth: "100%", mixBlendMode: "screen" }}
        />
      </div>

      <p style={{ fontSize: 17, color: "#999", marginBottom: 48, lineHeight: 1.7 }}>
        코딩을 배우는 가장 쉬운 방법.<br />
        매일 퀴즈를 풀고 스트릭을 이어가세요.
      </p>

      {/* 광고식 특징 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 48 }}>
        {AD_CARDS.map(({ icon, title, desc, cta, accent }) => (
          <div key={title} className="ad-card">
            <div className="ad-card-accent" style={{ background: accent }} />
            <div className="ad-card-icon">{icon}</div>
            <div className="ad-card-title">{title}</div>
            <div className="ad-card-desc">{desc}</div>
            <span className="ad-card-cta" style={{ color: accent }}>{cta}</span>
          </div>
        ))}
      </div>

      {/* CTA 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "stretch" }}>
        <Button label="시작하기" variant="primary" style={{ width: "100%" }} />
        <Button label="카카오로 시작하기" variant="kakao" style={{ width: "100%" }} />
        <Button label="구글로 시작하기" variant="outline" style={{ width: "100%" }} />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>
        <Button label="이용약관" variant="ghost" textStyle={{ fontSize: 13 }} onClick={() => onNavigate("terms")} />
        <span style={{ color: "#444", lineHeight: "36px" }}>·</span>
        <Button label="개인정보처리방침" variant="ghost" textStyle={{ fontSize: 13 }} onClick={() => onNavigate("privacy")} />
        <span style={{ color: "#444", lineHeight: "36px" }}>·</span>
        <Button label="오픈소스" variant="ghost" textStyle={{ fontSize: 13 }} onClick={() => onNavigate("oss")} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   문서 화면
════════════════════════════════════════════ */
function DocScreen({ title, content, onBack }) {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 60px" }}>
      <div style={{ marginBottom: 24 }}>
        <Button label="← 홈으로" variant="ghost" textStyle={{ fontSize: 14 }} onClick={onBack} />
      </div>
      <div style={{ background: "#1a1c1e", borderRadius: 18, padding: "32px 36px", border: "1px solid #242628" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #242628" }}>
          {title}
        </h1>
        <div>{renderMarkdown(content)}</div>
      </div>
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Button label="↑ 맨 위로" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   헤더
════════════════════════════════════════════ */
function Header({ tab, onNavigate }) {
  return (
    <header style={{
      position: "sticky", top: 0,
      background: "#131516ee",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #242628",
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 24px",
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}
        >
          <img src="assets/codebite_icon.png" alt="CodeBite" style={{ width: 34, height: 34, borderRadius: 8 }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Code<span style={{ color: "#58CC02" }}>Bite</span>
          </span>
        </button>

        <nav style={{ display: "flex", gap: 4 }}>
          {TABS.slice(1).map(t => (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              style={{
                background: tab === t.id ? "#1e3a10" : "none",
                border: "none",
                color: tab === t.id ? "#58CC02" : "#888",
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════
   푸터
════════════════════════════════════════════ */
function Footer({ onNavigate }) {
  return (
    <footer style={{
      borderTop: "1px solid #242628",
      padding: "28px 24px",
      textAlign: "center",
      color: "#555",
      fontSize: 13,
      marginTop: "auto",
    }}>
      <div style={{ marginBottom: 12, display: "flex", gap: 16, justifyContent: "center" }}>
        {[
          { id: "terms",   label: "이용약관" },
          { id: "privacy", label: "개인정보처리방침" },
          { id: "oss",     label: "오픈소스 고지" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
          >
            {label}
          </button>
        ))}
      </div>
      <div>© 2026 CodeBite Team · ghxo03215@gmail.com</div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   App
════════════════════════════════════════════ */
function App() {
  const [tab, setTab] = useState("home");

  const navigate = useCallback((id) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderContent = () => {
    switch (tab) {
      case "home":    return <HomeScreen onNavigate={navigate} />;
      case "terms":   return <DocScreen title="이용약관" content={TERMS_MD} onBack={() => navigate("home")} />;
      case "privacy": return <DocScreen title="개인정보 처리 방침" content={PRIVACY_MD} onBack={() => navigate("home")} />;
      case "oss":     return <DocScreen title="오픈소스 라이선스 고지" content={OPEN_SOURCE_MD} onBack={() => navigate("home")} />;
      default:        return null;
    }
  };

  return (
    <>
      <Header tab={tab} onNavigate={navigate} />
      <main style={{ flex: 1 }}>{renderContent()}</main>
      <Footer onNavigate={navigate} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
