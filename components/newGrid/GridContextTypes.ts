import type { GridApi, ColumnApi } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import { PivotData } from 'types/data'

export type DataCheckerFunction = (data: any) => boolean

export type GridContextScope = {
  gridApi: GridApi | null
  gridColumnApi: ColumnApi | null
  localRowData: any[]
  defaultColDef: ColDef
  columnDefs: ColDef[]
  AGTheme: string
  gridRef: React.RefObject<any>
  pivotData: PivotData[]
  onGridReady: (params: { api: GridApi; columnApi: ColumnApi }) => void
  setLocalRowData: React.Dispatch<React.SetStateAction<any[]>>
  setColumnDefs: React.Dispatch<React.SetStateAction<ColDef[]>>
  setAGTheme: React.Dispatch<React.SetStateAction<string>>
  setPivotData: React.Dispatch<React.SetStateAction<PivotData[]>>
}
