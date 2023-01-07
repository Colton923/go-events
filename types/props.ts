import type { CommissionData } from './data'
import type { PivotCommissionData } from './data'
export interface GridProps {
  rowData: CommissionData[]
  width: number
}

export interface ImportCSVButtonProps {
  setRowData: (rowData: CommissionData[]) => void
  setFilename: (filename: string) => void
}

export interface LoginProps {
  setLoggedIn: (loggedIn: boolean) => void
  user: any
}

export interface ExportButtonProps {
  rowData: CommissionData[]
  user: any
  filename: string
}

export interface ImportFirebaseDataButtonProps {
  setRowData: (rowData: CommissionData[]) => void
  user: any
}

export interface PivotGridProps {
  rowData: PivotCommissionData[]
  width: number
}
