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
import * as Grid from './GridContextTypes'
import type { PivotData } from 'types/data'
import PivotTable from './utils/PivotTable'
import { useFirebaseContext } from 'components/context/FirebaseContext'
import { useLocalContext } from 'components/context/LocalContext'

interface Props {
  children: React.ReactNode
}

export const GridContext = createContext<Grid.GridContextScope | null>(null)

export const GridContextProvider = (props: Props) => {
  const { children } = props
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const [localRowData, setLocalRowData] = useState<any[]>([])
  const [pivotData, setPivotData] = useState<PivotData[]>([])
  const [AGTheme, setAGTheme] = useState<string>('ag-theme-alpine')
  const gridRef = useRef()

  const onGridReady = (params: { api: GridApi; columnApi: ColumnApi }) => {
    if (!params.api) return
    if (localRowData.length === 0) return
    console.log('onGridReady')
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.setRowData(localRowData)
    params.api.sizeColumnsToFit()
    params.columnApi.autoSizeAllColumns()
  }

  useEffect(() => {
    if (localRowData.length === 0) return
    const UpdateView = async () => {
      const startValue = document.getElementById('start') as HTMLInputElement
      const endValue = document.getElementById('end') as HTMLInputElement

      const dateRange = {
        start: new Date(startValue.value),
        end: new Date(endValue.value),
      }
      const filteredData = localRowData.filter((row) => {
        const date = new Date(row.date)
        return date >= dateRange.start && date <= dateRange.end
      })

      setLocalRowData(filteredData)
    }
    UpdateView()
  }, [])

  const contextValue = useMemo<Grid.GridContextScope | null>(
    () => ({
      gridApi,
      gridColumnApi,
      localRowData,
      AGTheme,
      gridRef,
      pivotData,
      onGridReady,
      setAGTheme,
      setLocalRowData,
      setPivotData,
    }),
    [
      gridApi,
      gridColumnApi,
      localRowData,
      AGTheme,
      gridRef,
      pivotData,
      onGridReady,
      setAGTheme,
      setLocalRowData,
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
