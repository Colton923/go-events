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
  const [lastMonday, setLastMonday] = useState<Date>(new Date())
  const [thisSunday, setThisSunday] = useState<Date>(new Date())

  useEffect(() => {
    setLastMonday(new Date())
    setThisSunday(new Date())
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    setLastMonday(new Date(today.setDate(diff)))
    setThisSunday(new Date(today.setDate(diff + 6)))
  }, [])

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

  const filterParams = {
    comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
      const dateAsString = cellValue
      if (dateAsString === null) return -1
      const dateParts = dateAsString.split('/')
      const cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[0]) - 1,
        Number(dateParts[1])
      )

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0
      }

      if (cellDate < filterLocalDateAtMidnight) {
        return -1
      }

      if (cellDate > filterLocalDateAtMidnight) {
        return 1
      }
      return 0
    },
    browserDatePicker: true,
    minValidYear: 2000,
    maxValidYear: 2025,
    inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
  }

  const columnDefs = [
    { headerName: 'Client Name', field: 'client', valueGetter: valueGetter },
    {
      headerName: 'Organization / Company',
      field: 'organization',
      valueGetter: valueGetter,
    },
    {
      headerName: 'Event ID',
      field: 'id',
      valueGetter: valueGetter,
      filter: 'number',
    },
    {
      headerName: 'Event Date',
      field: 'date',
      valueGetter: valueGetter,
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Assigned Employee',
      field: 'employee',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Status',
      field: 'status',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Salesperson',
      field: 'salesperson',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Action Date',
      field: 'actionDate',
      valueGetter: valueGetter,
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
    },
    {
      headerName: 'Next Action',
      field: 'nextAction',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Total Fee',
      field: 'totalFee',
      valueGetter: valueGetter,
      filter: 'number',
      valueFormatter: (params: any) => {
        return `$${parseInt(params.value).toFixed(2)}`
      },
    },
    {
      headerName: 'Employee Wage Total',
      field: 'totalEmployee',
      valueGetter: valueGetter,
      valueFormatter: (params: any) => {
        return `$${parseInt(params.value).toFixed(2)}`
      },
    },
    {
      headerName: 'Event Net Profit',
      field: 'totalEvent',
      valueGetter: valueGetter,
      valueFormatter: (params: any) => {
        return `$${parseInt(params.value).toFixed(2)}`
      },
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
      minWidth: 200,
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
        totalEvent: 0,
        actionDate: '',
      })
    })

    tempPivotData.reduce((acc, cur) => {
      props.rowData.reduce((acc, cur) => {
        if (cur.id === acc.id) {
          acc.totalEvent += parseInt(cur.totalEvent)
          acc.actionDate = cur.actionDate
          acc.actionDate = cur.actionDate
          acc.organization = cur.organization
          acc.salesperson = cur.salesperson
        }
        return acc
      }, cur)
      props.commissionData.reduce((acc, cur) => {
        if (
          cur.salesperson === acc.salesperson &&
          cur.organization === acc.organization
        ) {
          acc.totalEmployee = Math.round(cur.commission * acc.totalEvent * 100) / 100
          acc.organization = cur.organization
        }
        return acc
      }, cur)
      return acc
    }, [])
    props.setPivotData(tempPivotData)
    props.setShowPivot(true)
  }

  const UpdateView = async () => {
    const dateRange = {
      start: lastMonday,
      end: thisSunday,
    }
    const dataToFilter = props.rowData
    const filteredData = dataToFilter.filter((row) => {
      const rowDate = new Date(row.actionDate)
      return rowDate >= dateRange.start && rowDate <= dateRange.end
    })
    props.setRowData(filteredData)
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.gridWrapper}>
        <h1 className={styles.header}>Date Filter</h1>
        <input
          type="date"
          id="start"
          className={styles.input}
          name="Commission Beginning"
          defaultValue={lastMonday.toISOString().slice(0, 10)}
          onChange={(e) => {
            if (e.target.valueAsDate) {
              setLastMonday(new Date(e.target.valueAsDate))
            }
          }}
        />
        <input
          type="date"
          id="end"
          className={styles.input}
          name="Commission Ending"
          defaultValue={thisSunday.toISOString().slice(0, 10)}
          onChange={(e) => {
            if (e.target.valueAsDate) {
              setThisSunday(new Date(e.target.valueAsDate))
            }
          }}
        />
        <input
          type="button"
          className={styles.input}
          value="Filter"
          onClick={() => {
            UpdateView()
          }}
        />
      </div>
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
        <div
          className="ag-theme-alpine"
          style={{ height: 500, width: props.width * 1 }}
        >
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
