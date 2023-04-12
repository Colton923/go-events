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
import { useFirebaseContext } from 'components/context/FirebaseContext'
import type { CommissionData, EmployeeData, PivotData } from 'types/data'
import PivotTable from './utils/PivotTable'
import { db } from '../../firebase/firebaseClient'
import { collection, getDocs, where, query } from 'firebase/firestore'
import employeeGridDataDefs from '../employeeGrid/employeeGridDataDefs'

interface Props {
  children: React.ReactNode
}

export const GridContext = createContext<Grid.GridContextScope | null>(null)

export const GridContextProvider = (props: Props) => {
  const { children } = props
  const { rowData, validAdmin, authUser } = useFirebaseContext()
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
  console.log('rendering GridContextProvider')

  const fetchAllData = async () => {
    if (!authUser) return
    if (!validAdmin) return
    const res = await fetch('/api/allData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    if (!data) return

    setLocalRowData(data.commissions)
  }

  const fetchEmployeeData = async () => {
    console.log('in fetchEmployeeData')
    if (!authUser) return
    if (!authUser.phoneNumber) return
    const phone = authUser.phoneNumber
    const docCol = collection(db, 'users')
    const snapshot = await getDocs(docCol)
    const data = snapshot.docs.find((doc) => doc.data().phone === phone)?.data()
    if (!data) {
      return console.log('no data')
    }
    console.log('data: ', data)
    const salesmanName = data.name as string
    const commissions: CommissionData[] = []
    const commissionsCol = collection(db, 'commissions')
    const q = query(commissionsCol, where('name', '==', 'Sean McCaffrey'))
    const commissionsSnapshot = await getDocs(q)
    commissionsSnapshot.forEach((doc) => {
      const data = doc.data() as CommissionData
      commissions.push(data)
    })
    console.log('commissions: ', commissions)
    return commissions
  }

  // useEffect(() => {
  //   if (!rowData.length) return
  //   setLocalRowData(rowData)
  // }, [rowData])

  useEffect(() => {
    console.log(92)

    // When columnDefs changes, fetch the data and set the localRowData
    console.log('gridContext ColumnDefs changed')
    if (validAdmin) {
      if (!columnDefs.length) return
      console.log('fetching all data')
      fetchAllData()
    } else {
      console.log('fetching employee data')
      setColumnDefs(employeeGridDataDefs)
      fetchEmployeeData().then((data) => {
        console.log('data: ', data)
        if (!data) return

        setLocalRowData(data)
      })
    }
  }, [columnDefs, validAdmin])

  useEffect(() => {
    console.log(107)
    // When localRowData changes, set the pivotData
    if (!localRowData.length) return
    const pivotTable = PivotTable(localRowData)
    setPivotData(pivotTable)
  }, [localRowData])

  const onGridReady = (params: { api: GridApi; columnApi: ColumnApi }) => {
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
