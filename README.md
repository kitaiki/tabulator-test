# Tabulator React TypeScript 예제

React와 TypeScript를 사용한 Tabulator 테이블 예제 프로젝트입니다.

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 📁 프로젝트 구조

```
src/
├── components/
│   └── TabulatorTable.tsx    # 메인 Tabulator 컴포넌트
├── types/
│   └── TabulatorTypes.ts     # TypeScript 타입 정의
├── data/
│   └── sampleData.ts         # 예제 데이터
├── App.tsx                   # 메인 App 컴포넌트
├── App.css                   # 스타일 시트
├── index.tsx                 # 애플리케이션 진입점
└── index.css                 # 전역 스타일
```

## ✨ 주요 기능

- 🔄 **편집모드 토글**: 셀 편집 제어 (깜빡임 없는 부드러운 전환)
- ✅ **정렬 및 필터링**: 컬럼 헤더 클릭으로 정렬
- ✅ **인라인 편집**: 편집모드에서 셀을 더블클릭하여 직접 편집
- 📋 **Select 편집**: 직책(신입/대리/과장), 부서 드롭다운 선택
- ✅ **페이지네이션**: 대용량 데이터 효율적 표시
- 🎯 **단일 행 선택**: 보기모드에서만 단일 행 선택 및 삭제
- ✅ **데이터 다운로드**: CSV/JSON 형식으로 다운로드
- ✅ **컬럼 조작**: 크기 조정 및 순서 변경
- ✅ **클립보드 지원**: 복사/붙여넣기 기능
- ✅ **반응형 레이아웃**: 모바일 친화적 디자인

## 🛠️ 사용된 기술

- **React 18**: 최신 React 훅 활용
- **TypeScript**: 타입 안전성 보장
- **Tabulator 5.5**: 강력한 테이블 라이브러리
- **CSS3**: 현대적 스타일링 (Grid, Flexbox, Gradient)

## 📚 Tabulator 설정

### 컬럼 설정
```typescript
const columns: ColumnConfig[] = [
  { title: "ID", field: "id", width: 80, sorter: "number" },
  { title: "이름", field: "name", width: 120, editor: "input" },
  // ... 더 많은 컬럼
];
```

### 테이블 옵션
```typescript
const tableOptions = {
  pagination: "local",
  paginationSize: 10,
  movableColumns: true,
  resizableRows: true,
  selectable: true,
  // ... 더 많은 옵션
};
```

## 🎨 커스텀 스타일링

- **그라디언트 배경**: 모던한 UI 디자인
- **커스텀 버튼**: 호버 효과 및 애니메이션
- **테이블 테마**: 헤더 그라디언트 및 행 하이라이트
- **반응형 디자인**: 모바일 환경 최적화

## 📝 사용 방법

1. **행 추가**: "행 추가" 버튼으로 새 데이터 추가
2. **편집**: 셀을 더블클릭하여 인라인 편집
3. **선택**: 행을 클릭하여 선택 (Ctrl/Cmd로 다중 선택)
4. **삭제**: 행 선택 후 "선택된 행 삭제" 버튼 클릭
5. **다운로드**: CSV 또는 JSON 형식으로 데이터 내보내기

## 🔧 추가 개발

새로운 기능을 추가하려면:

1. `src/types/TabulatorTypes.ts`에서 타입 정의 수정
2. `src/components/TabulatorTable.tsx`에서 컴포넌트 로직 추가
3. `src/data/sampleData.ts`에서 테스트 데이터 업데이트

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.