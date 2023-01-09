'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import styles from '../../styles/App.module.css'
import { ExportButton } from '../firebaseExport/ExportButton'

import { GridProps } from '../../types/props'
import { CommissionData } from '../../types/data'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'
import type { CommissionManagerData, PivotCommissionData } from '../../types/data'

export const Grid = (props: GridProps) => {
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

      props.setCommissionData(tempData)
    }
    fetchData()
  }, [])

  const gridRef = useRef()

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
  }

  const columnDefs = [
    { headerName: 'Client Name', field: 'client', valueGetter: valueGetter },
    {
      headerName: 'Organization / Company',
      field: 'organization',
      valueGetter: valueGetter,
    },
    { headerName: 'Event ID', field: 'id', valueGetter: valueGetter },
    { headerName: 'Event Date', field: 'date', valueGetter: valueGetter },
    { headerName: 'Assigned Employee', field: 'employee', valueGetter: valueGetter },
    { headerName: 'Status', field: 'status', valueGetter: valueGetter },
    { headerName: 'Salesperson', field: 'salesperson', valueGetter: valueGetter },
    { headerName: 'Action Date', field: 'actionDate', valueGetter: valueGetter },
    { headerName: 'Next Action', field: 'nextAction', valueGetter: valueGetter },
    { headerName: 'Total Fee', field: 'totalFee', valueGetter: valueGetter },
    {
      headerName: 'Employee Wage Total',
      field: 'totalEmployee',
      valueGetter: valueGetter,
    },
    {
      headerName: 'Event Net Profit',
      field: 'totalEvent',
      valueGetter: valueGetter,
    },
  ] as ColDef<CommissionData>[]

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.sizeColumnsToFit()
    params.api.setRowData(props.rowData)
  }

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
    }),
    []
  )

  const handlePivot = () => {
    const uniqueIDs = [...new Set(props.rowData.map((row) => row.id))]
    const tempPivotData: PivotCommissionData[] = []
    uniqueIDs.forEach((id) => {
      tempPivotData.push({
        salesperson: '',
        organization: '',
        id: id,
        totalEmployee: 0,
      })
    })
    props.commissionData.forEach((commissionRow) => {
      props.rowData.forEach((row) => {
        if (commissionRow.salesperson === row.salesperson) {
          const index = tempPivotData.findIndex((item) => item.id === row.id)
          tempPivotData[index].salesperson = row.salesperson
          tempPivotData[index].organization = commissionRow.organization
          tempPivotData[index].totalEmployee += parseInt(row.totalEvent)
          tempPivotData[index].totalEmployee =
            Math.round(
              tempPivotData[index].totalEmployee * commissionRow.commission * 100
            ) / 100
        }
      })
    })
    props.setPivotData(tempPivotData)
    props.setShowPivot(true)
  }
  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>All Data Grid</h1>
      <h1 className={styles.subHeader}>Rows: {props.rowData.length}</h1>
      <ExportButton
        rowData={props.rowData}
        filename={props.filename}
        user={props.user}
        activeComponent={props.activeComponent}
      />
      <div className={styles.buttonWrapper}>
        <input
          className={styles.input}
          type="button"
          value="Simple Pivot"
          onClick={() => {
            handlePivot()
          }}
        />
      </div>
      <div className={styles.gridWrapper}>
        <div className="ag-theme-alpine" style={{ height: 500, width: props.width }}>
          <AgGridReact
            //@ts-ignore
            ref={gridRef}
            rowData={props.rowData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  )
}
