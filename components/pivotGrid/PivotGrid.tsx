'use client'

import { useState, useRef, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PivotGridProps } from '../../types/props'
import { PivotCommissionData } from '../../types/data'
import styles from '../../styles/App.module.css'

export const PivotGrid = (props: PivotGridProps) => {
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const gridRef = useRef()

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
    }),
    []
  )

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
  }

  const columnDefs = [
    { headerName: 'Salesperson', field: 'salesperson', valueGetter: valueGetter },
    {
      headerName: 'Organization / Company',
      field: 'organization',
      valueGetter: valueGetter,
    },
    { headerName: 'Event ID', field: 'id', valueGetter: valueGetter },
    {
      headerName: 'Employee Wage Total',
      field: 'totalEmployee',
      valueGetter: valueGetter,
    },
  ] as ColDef<PivotCommissionData>[]

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.sizeColumnsToFit()
    params.api.setRowData(props.rowData)
  }
  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.gridWrapper}>
        <h1 className={styles.header}>Pivoted Data Grid</h1>
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
