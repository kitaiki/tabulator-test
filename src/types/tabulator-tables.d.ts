// Tabulator Tables 타입 정의
declare module 'tabulator-tables' {
  export interface ColumnDefinition {
    title: string;
    field: string;
    width?: number;
    hozAlign?: "left" | "center" | "right";
    formatter?: string;
    editor?: string | boolean;
    editorParams?: {
      values?: string[] | { [key: string]: string };
    };
    sorter?: string;
  }

  export interface TabulatorOptions {
    data?: any[];
    columns?: ColumnDefinition[];
    height?: string | number;
    layout?: string;
    responsiveLayout?: string;
    pagination?: string;
    paginationSize?: number;
    paginationSizeSelector?: number[];
    movableColumns?: boolean;
    resizableRows?: boolean;
    selectable?: boolean | number;
    selectableCheck?: (row: any) => boolean;
    tooltips?: boolean;
    addRowPos?: string;
    history?: boolean;
    clipboard?: boolean;
    clipboardCopyStyled?: boolean;
    clipboardPasteParser?: string;
    clipboardCopyConfig?: any;
    printAsHtml?: boolean;
    printStyled?: boolean;
    printRowRange?: string;
    downloadConfig?: any;
    cellEdited?: (cell: any) => void;
    rowClick?: (e: any, row: any) => void;
  }

  export interface ColumnComponent {
    updateDefinition(definition: Partial<ColumnDefinition>): void;
  }

  export class TabulatorFull {
    constructor(element: HTMLElement, options: TabulatorOptions);
    setData(data: any[]): void;
    getData(): any[];
    setColumns(columns: ColumnDefinition[]): void;
    updateColumnDefinition(field: string, definition: Partial<ColumnDefinition>): Promise<any>;
    getColumn(field: string): ColumnComponent | false;
    addRow(data: any, pos?: string): void;
    getSelectedRows(): any[];
    download(type: string, filename: string): void;
    destroy(): void;
    element?: HTMLElement;
    initialized?: boolean;
  }
}