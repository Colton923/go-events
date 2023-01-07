'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { GridProps } from '../../types/props'
import { CommissionData } from '../../types/data'
export const Grid = (props: GridProps) => {
  // I want the valueGetter to be a function that returns the props.rowData["column header"]
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

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

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

  const gridRef = useRef()

  return (
    <div>
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
  )
}
