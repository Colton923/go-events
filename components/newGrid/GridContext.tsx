'use client'

import {
  useMemo,
  memo,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import type { GridApi, ColumnApi } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import * as Grid from './GridContextTypes'
import { useFirebaseContext } from '../context/FirebaseContext'
import type { CommissionData, EmployeeData, PivotData } from '../../types/data'
import PivotTable from './utils/PivotTable'

interface Props {
  children: React.ReactNode
}

export const GridContext = createContext<Grid.GridContextScope | null>(null)

export const GridContextProvider = (props: Props) => {
  const { children } = props
  const { rowData } = useFirebaseContext()
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const [localRowData, setLocalRowData] = useState<any[]>([])
  const [defaultColDef, setDefaultColDef] = useState<ColDef>({
    flex: 1,
    minWidth: 200,
    resizable: true,
    sortable: true,
  })
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([])
  const [pivotData, setPivotData] = useState<PivotData[]>([])
  const [AGTheme, setAGTheme] = useState<string>('ag-theme-alpine')
  const gridRef = useRef()

  const fetchAllData = useCallback(async () => {
    const res = await fetch('/api/firebase/get/allData')
    const data = await res.json()
    setLocalRowData(data.commissions)
  }, [])

  useEffect(() => {
    setLocalRowData(rowData)
  }, [rowData])

  useEffect(() => {
    // When columnDefs changes, fetch the data and set the localRowData
    if (!columnDefs.length) return
    fetchAllData()
  }, [columnDefs])

  useEffect(() => {
    // When localRowData changes, set the pivotData
    if (!localRowData.length) return
    const pivotTable = PivotTable(localRowData)
    setPivotData(pivotTable)
  }, [localRowData])

  const onGridReady = (params: { api: GridApi; columnApi: ColumnApi }) => {
    if (!localRowData) return
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.setRowData(localRowData)
    params.api.sizeColumnsToFit()
    params.columnApi.autoSizeAllColumns()
  }

  const contextValue = useMemo<Grid.GridContextScope | null>(
    () => ({
      gridApi,
      gridColumnApi,
      localRowData,
      defaultColDef,
      columnDefs,
      AGTheme,
      gridRef,
      pivotData,
      onGridReady,
      setColumnDefs,
      setAGTheme,
      setLocalRowData,
      setPivotData,
    }),
    [
      gridApi,
      gridColumnApi,
      localRowData,
      defaultColDef,
      columnDefs,
      AGTheme,
      gridRef,
      pivotData,
      onGridReady,
      setLocalRowData,
      setColumnDefs,
      setAGTheme,
      setPivotData,
    ]
  )

  return (
    <GridContext.Provider value={contextValue as Grid.GridContextScope}>
      {children}
    </GridContext.Provider>
  )
}

export default memo(GridContextProvider)

export const useGridContext = () => {
  const context = useContext(GridContext)
  if (!context) {
    throw new Error('useGridContext must be used within a GridContextProvider')
  }
  return context
}
