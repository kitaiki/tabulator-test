// Tabulator와 관련된 TypeScript 타입 정의

export interface UserData {
  id: number;
  name: string;
  age: number;
  email: string;
  position: string;
  salary: number;
  department: string;
  startDate: string;
}

export interface TabulatorComponentProps {
  data?: UserData[];
  height?: string | number;
  className?: string;
}

// Tabulator 컬럼 설정을 위한 타입
export interface ColumnConfig {
  title: string;
  field: keyof UserData;
  width?: number;
  hozAlign?: "left" | "center" | "right";
  formatter?: string;
  editor?: string | boolean;
  editorParams?: {
    values?: string[] | { [key: string]: string };
  };
  sorter?: string;
}