import type { GridApi, ColumnApi } from 'ag-grid-community'
import { PivotData } from 'types/data'

export type DataCheckerFunction = (data: any) => boolean

export type GridContextScope = {
  gridApi: GridApi | null
  gridColumnApi: ColumnApi | null
  localRowData: any[]
  AGTheme: string
  gridRef: React.RefObject<any>
  pivotData: PivotData[]
  onGridReady: (params: { api: GridApi; columnApi: ColumnApi }) => void
  setLocalRowData: React.Dispatch<React.SetStateAction<any[]>>
  setAGTheme: React.Dispatch<React.SetStateAction<string>>
  setPivotData: React.Dispatch<React.SetStateAction<PivotData[]>>
}
