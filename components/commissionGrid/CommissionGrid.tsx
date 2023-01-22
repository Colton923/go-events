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
  const [commissionValue, setCommissionValue] = useState(0)

  useEffect(() => {
    if (!props.activeComponent) return
    const fetchData = async () => {
      const tempOrg = props.rowData.map((row) => {
        return row.organization
      })
      const uniqueEmployees = props.rowData.map((row) => {
        return row.salesperson
      })

      let matches = 0
      const data = await getDocs(collection(db, 'commission'))
      const tempData: CommissionManagerData[] = []
      const newMatch: CommissionManagerData[] = []
      const commissionData = data.docs[0].data().data

      commissionData.forEach((row: any) => {
        if (
          uniqueEmployees.includes(row.salesperson) &&
          tempOrg.includes(row.organization)
        ) {
          tempData.push({
            salesperson: row.salesperson,
            organization: row.organization,
            commission: row.commission,
          })
        } else {
          matches++
          const findEmployee = uniqueEmployees.reduce((acc, curr) => {
            if (curr !== row.salesperson) {
              return curr
            }
            return acc
          }, '')

          const findOrganization = tempOrg.reduce((acc, curr) => {
            if (curr !== row.organization) {
              return curr
            }
            return acc
          }, '')

          tempData.push({
            salesperson: findEmployee,
            organization: findOrganization,
            commission: 0.4,
          })
          newMatch.push({
            salesperson: row.salesperson,
            organization: row.organization,
            commission: row.commission,
          })
        }
      })

      if (matches > 0) {
        try {
          fetch('/api/firebase/post/manager', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempData),
          })
        } catch (error) {
          console.log(error)
        }
      }

      setCommissionData(tempData)
    }
    fetchData()
  }, [props.activeComponent])

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 200,
      resizable: true,
      sortable: true,
    }),
    []
  )

  const gridRef = useRef()

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
  }

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

  const handleMultiSet = () => {
    const selectedRows: any = []
    //@ts-ignore
    gridApi.forEachNodeAfterFilter((node) => {
      selectedRows.push(node.data)
    })

    selectedRows.forEach((row: any) => {
      row.commission = commissionValue
      UpdateDB(row.salesperson, commissionValue, row.organization)
    })
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
      <input
        type="text"
        placeholder="Set all commission values for filtered data"
        className={styles.input}
        onChange={(e) => {
          setCommissionValue(Number(e.target.value))
        }}
      />
      <input
        type={'button'}
        value={'Set Commission'}
        className={styles.input}
        onClick={handleMultiSet}
      />
      <div className={styles.gridWrapper}>
        <div
          className="ag-theme-alpine"
          style={{ height: 500, width: props.width * 1 }}
        >
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
