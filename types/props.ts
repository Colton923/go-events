import type { CommissionData, CommissionManagerData } from './data'
import type { PivotCommissionData } from './data'
export interface GridProps {
  rowData: CommissionData[]
  setCommissionData: (commissionData: CommissionManagerData[]) => void
  setRowData: (rowData: CommissionData[]) => void
  commissionData: CommissionManagerData[]
  width: number
  setPivotData: (pivotData: PivotCommissionData[]) => void
  filename: string
  user: any
  activeComponent: boolean
  setShowPivot: (showPivot: boolean) => void
}
export interface CommissionGridProps {
  width: number
  activeComponent: boolean
}

export interface ImportCSVButtonProps {
  setRowData: (rowData: CommissionData[]) => void
  setFilename: (filename: string) => void
  fileName: string
  activeComponent: boolean
}

export interface LoginProps {
  setUser: (user: any) => void
}

export interface ExportButtonProps {
  rowData: CommissionData[]
  user: any
  filename: string
  activeComponent: boolean
}

export interface ImportFirebaseDataButtonProps {
  setRowData: (rowData: CommissionData[]) => void
  user: any
  activeComponent: boolean
}

export interface PivotGridProps {
  rowData: PivotCommissionData[]
  width: number
  activeComponent: boolean
}

export interface CommissionManagerProps {
  rowData: CommissionManagerData[]
}

export interface DateFilterProps {
  setRowData: (rowData: CommissionData[]) => void
  rowData: CommissionData[]
  activeComponent: boolean
}

export interface PivotTotalsProps {
  pivotData: PivotCommissionData[]
  activeComponent: boolean
}

export interface NavbarProps {
  setShowCommissionGrid: (showCommissionGrid: boolean) => void
  setShowCSVImport: (showCSVImport: boolean) => void
  setShowFirebaseGrid: (showFirebaseGrid: boolean) => void
  setShowFirebaseImport: (showFirebaseImport: boolean) => void
  setShowDateFilter: (showDateFilter: boolean) => void
  setShowPivot: (showPivot: boolean) => void
  setShowPivotTotals: (showPivotTotals: boolean) => void
  showCommissionGrid: boolean
  showCSVImport: boolean
  showFirebaseGrid: boolean
  showFirebaseImport: boolean
  showDateFilter: boolean
  showPivot: boolean
  showPivotTotals: boolean
  user: any
}
