import React from 'react';
import TabulatorTable from './components/TabulatorTable';
import { sampleUsers } from './data/sampleData';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tabulator React TypeScript 예제</h1>
        <p>직원 관리 테이블</p>
      </header>
      
      <main className="App-main">
        <div className="table-wrapper">
          <TabulatorTable 
            data={sampleUsers} 
            height="500px"
            className="employee-table"
          />
        </div>
        
        <div className="features-info">
          <h3>주요 기능:</h3>
          <ul>
            <li>🔄 편집모드 토글 (셀 편집 제어)</li>
            <li>✅ 정렬 및 필터링</li>
            <li>✅ 인라인 편집 (편집모드에서만)</li>
            <li>✅ 페이지네이션</li>
            <li>✅ 행 선택 및 삭제</li>
            <li>✅ CSV/JSON 다운로드</li>
            <li>✅ 컬럼 크기 조정</li>
            <li>✅ 컬럼 이동</li>
            <li>✅ 클립보드 복사/붙여넣기</li>
            <li>✅ 반응형 레이아웃</li>
          </ul>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
            <strong>💡 사용 팁:</strong> 편집모드 ON 버튼을 클릭하면 셀을 더블클릭하여 직접 편집할 수 있습니다.<br />
            <strong>📋 Select 편집:</strong> 직책과 부서는 드롭다운 메뉴에서 선택할 수 있습니다.
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;