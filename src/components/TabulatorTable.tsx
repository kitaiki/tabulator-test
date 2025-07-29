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
  const editModeRef = useRef(false); // 실시간 편집모드 상태 추적

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
        selectable: 1, // 단일 행 선택
        selectableCheck: () => !editModeRef.current, // 편집모드가 아닐 때만 선택 가능
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
        rowClick: (_e: any, row: any) => {
          console.log("행이 클릭되었습니다:", row.getData());
        },
      });
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
    };
  }, [data, height, getColumns]);

  // 편집모드 변경 시 즉시 동기화 업데이트 (깜빡임 완전 제거)
  useEffect(() => {
    if (tabulatorRef.current && tableRef.current) {
      console.log(`편집모드 변경: ${isEditMode ? 'ON' : 'OFF'} - 즉시 동기화 업데이트`);
      
      try {
        // RequestAnimationFrame을 사용해 브라우저 렌더링 사이클에 맞춰 업데이트
        requestAnimationFrame(() => {
          if (!tabulatorRef.current) return;
          
          const startTime = performance.now();
          
          // 편집 가능한 컬럼들을 동기적으로 즉시 업데이트
          const editableFields = [
            { field: "name", editor: isEditMode ? "input" : false },
            { field: "age", editor: isEditMode ? "number" : false },
            { field: "email", editor: isEditMode ? "input" : false },
            { 
              field: "position", 
              editor: isEditMode ? "select" : false,
              editorParams: isEditMode ? { values: positionOptions } : undefined
            },
            { field: "salary", editor: isEditMode ? "number" : false },
            { 
              field: "department", 
              editor: isEditMode ? "select" : false,
              editorParams: isEditMode ? { values: departmentOptions } : undefined
            },
            { field: "startDate", editor: isEditMode ? "date" : false }
          ];

          // 배치 업데이트로 한 번에 처리
          editableFields.forEach(column => {
            try {
              const updateDef: any = { editor: column.editor };
              if (column.editorParams !== undefined) {
                updateDef.editorParams = column.editorParams;
              }
              
              // 동기적 업데이트 시도 (깜빡임 방지)
              try {
                const columnComponent = (tabulatorRef.current as any).getColumn(column.field);
                if (columnComponent && columnComponent.updateDefinition) {
                  columnComponent.updateDefinition(updateDef);
                } else {
                  // getColumn이 없으면 바로 비동기 방식 사용
                  throw new Error('getColumn method not available');
                }
              } catch (syncError) {
                // fallback으로 비동기 방식 시도
                tabulatorRef.current!.updateColumnDefinition(column.field, updateDef)
                  .catch(fallbackError => console.warn(`컬럼 ${column.field} fallback 실패:`, fallbackError));
              }
            } catch (error) {
              console.warn(`컬럼 ${column.field} 업데이트 실패:`, error);
            }
          });
          
          const endTime = performance.now();
          console.log(`동기화 컬럼 업데이트 완료: ${(endTime - startTime).toFixed(2)}ms`);
        });
        
      } catch (error) {
        console.error('편집모드 업데이트 중 오류:', error);
      }
    }
  }, [isEditMode, positionOptions, departmentOptions]);

  // 편집모드 상태를 ref에 동기화 (selectableCheck에서 실시간 참조용)
  useEffect(() => {
    editModeRef.current = isEditMode;
  }, [isEditMode]);

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
        <button 
          onClick={deleteSelectedRows} 
          disabled={isEditMode}
          style={{ 
            marginRight: '10px',
            opacity: isEditMode ? 0.5 : 1,
            cursor: isEditMode ? 'not-allowed' : 'pointer'
          }}
        >
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