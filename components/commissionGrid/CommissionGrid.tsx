'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import styles from '../../styles/App.module.css'
import { db } from '../../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

import { CommissionGridProps } from '../../types/props'
import { CommissionManagerData } from '../../types/data'

export const CommissionGrid = (props: CommissionGridProps) => {
  const [commissionData, setCommissionData] = useState<CommissionManagerData[]>([])
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, 'commission'))
      const tempData: CommissionManagerData[] = []
      const commissionData = data.docs[0].data().data
      commissionData.forEach((row: any) => {
        tempData.push({
          salesperson: row.salesperson,
          organization: row.organization,
          commission: row.commission,
        })
      })

      setCommissionData(tempData)
    }
    fetchData()
  }, [])

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
    }),
    []
  )

  const gridRef = useRef()

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
  }
  // I need a valueSetter function here
  const valueSetter = (params: any) => {
    params.data[params.colDef.field] = params.newValue
    UpdateDB(params.data.salesperson, params.newValue, params.data.organization)
    return true
  }

  const UpdateDB = (
    salesperson: string,
    newCommission: number,
    organization: string
  ) => {
    commissionData.find((row) => {
      if (row.salesperson === salesperson && row.organization === organization) {
        row.commission = newCommission
      }
    })
    setCommissionData(commissionData)
    try {
      fetch('/api/firebase/post/manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commissionData),
      })
    } catch (error) {
      console.log(error)
    }
  }

  const columnDefs = [
    {
      headerName: 'Salesperson',
      field: 'salesperson',
      valueGetter: valueGetter,
      filter: true,
    },
    {
      headerName: 'Organization / Company',
      field: 'organization',
      valueGetter: valueGetter,
      filter: true,
    },
    {
      headerName: 'Commission',
      field: 'commission',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
      editable: true,
    },
  ] as ColDef<CommissionManagerData>[]

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.sizeColumnsToFit()
    params.api.setRowData(commissionData)
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Commission Data</h1>
      <div className={styles.gridWrapper}>
        <div className="ag-theme-alpine" style={{ height: 500, width: props.width }}>
          <AgGridReact
            //@ts-ignore
            ref={gridRef}
            rowData={commissionData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  )
}
