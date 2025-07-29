import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { TabulatorComponentProps, ColumnConfig } from '../types/TabulatorTypes';

const TabulatorTable: React.FC<TabulatorComponentProps> = ({ 
  data = [], 
  height = "400px",
  className = "" 
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTableReady, setIsTableReady] = useState(false);

  // 직책 및 부서 옵션 정의
  const positionOptions = ["신입", "대리", "과장"];
  const departmentOptions = ["개발팀", "디자인팀", "분석팀", "마케팅팀", "관리팀", "인사팀"];

  // 편집모드에 따른 컬럼 설정 (최적화된 버전)
  const getColumns = useCallback((): ColumnConfig[] => [
    { title: "ID", field: "id", width: 80, hozAlign: "center", sorter: "number" },
    { title: "이름", field: "name", width: 120, editor: isEditMode ? "input" : false },
    { title: "나이", field: "age", width: 80, hozAlign: "center", sorter: "number", editor: isEditMode ? "number" : false },
    { title: "이메일", field: "email", width: 200, editor: isEditMode ? "input" : false },
    { 
      title: "직책", 
      field: "position", 
      width: 150, 
      editor: isEditMode ? "select" : false,
      editorParams: isEditMode ? { values: positionOptions } : undefined
    },
    { 
      title: "급여", 
      field: "salary", 
      width: 120, 
      hozAlign: "right", 
      formatter: "money",
      sorter: "number",
      editor: isEditMode ? "number" : false
    },
    { 
      title: "부서", 
      field: "department", 
      width: 120, 
      editor: isEditMode ? "select" : false,
      editorParams: isEditMode ? { values: departmentOptions } : undefined
    },
    { title: "입사일", field: "startDate", width: 120, sorter: "date", editor: isEditMode ? "date" : false }
  ], [isEditMode, positionOptions, departmentOptions]);

  useEffect(() => {
    if (tableRef.current && !tabulatorRef.current) {
      // Tabulator 인스턴스 생성
      tabulatorRef.current = new Tabulator(tableRef.current, {
        data: data,
        columns: getColumns(),
        height: height,
        layout: "fitColumns",
        responsiveLayout: "hide",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 50],
        movableColumns: true,
        resizableRows: true,
        selectable: true,
        tooltips: true,
        addRowPos: "top",
        history: true,
        clipboard: true,
        clipboardCopyStyled: false,
        clipboardPasteParser: "table",
        clipboardCopyConfig: {
          columnHeaders: false,
          columnGroups: false,
          rowGroups: false,
          columnCalcs: false,
          dataTree: false,
          formatCells: false,
        },
        printAsHtml: true,
        printStyled: true,
        printRowRange: "visible",
        downloadConfig: {
          columnHeaders: true,
          columnGroups: false,
          rowGroups: false,
          columnCalcs: false,
          dataTree: false,
        },
        // 이벤트 핸들러
        cellEdited: (cell: any) => {
          console.log("셀이 편집되었습니다:", cell.getValue());
        },
        rowClick: (e: any, row: any) => {
          console.log("행이 클릭되었습니다:", row.getData());
        },
      });
      
      // 테이블이 완전히 초기화되면 플래그 설정
      setIsTableReady(true);
    }

    // 데이터 업데이트
    if (tabulatorRef.current && data.length > 0) {
      tabulatorRef.current.setData(data);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.destroy();
        tabulatorRef.current = null;
      }
      setIsTableReady(false);
    };
  }, [data, height]);

  // 편집모드 변경 시 컬럼 설정 업데이트 (destroy 없이)
  useEffect(() => {
    if (tabulatorRef.current && tableRef.current && isTableReady) {
      try {
        console.log(`편집모드 변경: ${isEditMode ? 'ON' : 'OFF'} - setColumns 사용 (destroy 없음)`);
        const startTime = performance.now();
        
        // Tabulator 인스턴스와 DOM 요소가 모두 준비된 상태에서만 실행
        // 약간의 지연을 두어 DOM이 완전히 준비될 때까지 대기
        setTimeout(() => {
          if (tabulatorRef.current && tableRef.current && tabulatorRef.current.element) {
            try {
              tabulatorRef.current.setColumns(getColumns());
              
              const endTime = performance.now();
              console.log(`컬럼 업데이트 완료: ${(endTime - startTime).toFixed(2)}ms`);
            } catch (innerError) {
              console.error('setColumns 실행 중 에러:', innerError);
              throw innerError; // catch 블록에서 처리하도록 에러 재발생
            }
          }
        }, 10);
        
      } catch (error) {
        console.error('컬럼 업데이트 중 오류 발생:', error);
        // 에러 발생 시 fallback으로 기존 방식 사용
        console.log('Fallback: destroy 후 재생성 방식 사용');
        const currentData = tabulatorRef.current.getData();
        tabulatorRef.current.destroy();
        
        tabulatorRef.current = new Tabulator(tableRef.current, {
          data: currentData,
          columns: getColumns(),
          height: height,
          layout: "fitColumns",
          responsiveLayout: "hide",
          pagination: "local",
          paginationSize: 10,
          paginationSizeSelector: [5, 10, 20, 50],
          movableColumns: true,
          resizableRows: true,
          selectable: true,
          tooltips: true,
          addRowPos: "top",
          history: true,
          clipboard: true,
          clipboardCopyStyled: false,
          clipboardPasteParser: "table",
          clipboardCopyConfig: {
            columnHeaders: false,
            columnGroups: false,
            rowGroups: false,
            columnCalcs: false,
            dataTree: false,
            formatCells: false,
          },
          printAsHtml: true,
          printStyled: true,
          printRowRange: "visible",
          downloadConfig: {
            columnHeaders: true,
            columnGroups: false,
            rowGroups: false,
            columnCalcs: false,
            dataTree: false,
          },
          // 이벤트 핸들러
          cellEdited: (cell: any) => {
            console.log("셀이 편집되었습니다:", cell.getValue());
          },
          rowClick: (e: any, row: any) => {
            console.log("행이 클릭되었습니다:", row.getData());
          },
        });
      }
    }
  }, [isEditMode, getColumns, isTableReady]);

  // 테이블 조작 함수들
  const addRow = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.addRow({
        id: Date.now(),
        name: "새 사용자",
        age: 25,
        email: "new@example.com",
        position: "신입",
        salary: 3000,
        department: "개발팀",
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteSelectedRows = () => {
    if (tabulatorRef.current) {
      const selectedRows = tabulatorRef.current.getSelectedRows();
      selectedRows.forEach((row: any) => row.delete());
    }
  };

  const downloadCSV = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.download("csv", "data.csv");
    }
  };

  const downloadJSON = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.download("json", "data.json");
    }
  };

  return (
    <div className={`tabulator-container ${className} ${isEditMode ? 'edit-mode' : ''}`}>
      <div className="table-controls" style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => setIsEditMode(!isEditMode)} 
          className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
          style={{ marginRight: '10px' }}
        >
          {isEditMode ? '편집모드 OFF' : '편집모드 ON'}
        </button>
        <button onClick={addRow} style={{ marginRight: '10px' }}>
          행 추가
        </button>
        <button onClick={deleteSelectedRows} style={{ marginRight: '10px' }}>
          선택된 행 삭제
        </button>
        <button onClick={downloadCSV} style={{ marginRight: '10px' }}>
          CSV 다운로드
        </button>
        <button onClick={downloadJSON}>
          JSON 다운로드
        </button>
      </div>
      <div className="edit-mode-indicator">
        <span className={`mode-status ${isEditMode ? 'edit' : 'view'}`}>
          현재 모드: {isEditMode ? '편집 모드' : '보기 모드'}
        </span>
      </div>
      <div ref={tableRef} />
    </div>
  );
};

export default TabulatorTable;