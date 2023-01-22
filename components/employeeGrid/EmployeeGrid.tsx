'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { EmployeeGridProps } from '../../types/props'
import { EmployeeData } from '../../types/data'
import styles from '../../styles/App.module.css'

import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../../firebase/firebaseClient'

type EmployeeCommission = {
  commission: number
  salesperson: string
  organization: string
}

export const EmployeeGrid = (props: EmployeeGridProps) => {
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [employeeRowData, setEmployeeRowData] = useState<EmployeeData[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [lastMonday, setLastMonday] = useState<Date>(new Date())
  const [thisSunday, setThisSunday] = useState<Date>(new Date())
  const [total, setTotal] = useState(0)
  const [employeeCommission, setEmployeeCommission] = useState<EmployeeCommission[]>(
    []
  )

  useEffect(() => {
    setLastMonday(new Date())
    setThisSunday(new Date())
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    setLastMonday(new Date(today.setDate(diff)))
    setThisSunday(new Date(today.setDate(diff + 6)))
  }, [])

  const TryGetCommission = async () => {
    try {
      const dataCol = collection(db, 'commission')
      const querySnapshot = await getDocs(dataCol)
      const tempData: EmployeeCommission[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data().data
        data.forEach((row: EmployeeCommission) => {
          if (row.salesperson === props.userName) {
            tempData.push(row)
          }
        })
      })
      setEmployeeCommission(tempData)
      setLoadingData(false)
    } catch (error) {
      console.log(error)
    }
  }

  const TryGetData = async () => {
    setLoadingData(true)
    try {
      const dataForGrid: EmployeeData[] = []
      const dataCol = collection(db, 'data')
      const querySnapshot = await getDocs(dataCol)
      let thisTotal = 0
      let thisEvent = 0
      querySnapshot.forEach((doc) => {
        const data = doc.data().data
        data.forEach((row: EmployeeData) => {
          const date = new Date(row.date)
          if (
            row.salesperson === props.userName &&
            date >= lastMonday &&
            date <= thisSunday
          ) {
            const tempRow: EmployeeData = {
              organization: row.organization,
              id: row.id,
              totalEvent: 0,
              actionDate: row.actionDate,
              salesperson: row.salesperson,
              eventProfit: 0,
              date: row.date,
            }

            employeeCommission.findIndex((commission) => {
              if (
                commission.organization === row.organization &&
                commission.salesperson === row.salesperson
              ) {
                const EventCash =
                  Math.round(commission.commission * row.totalEvent * 100) / 100
                thisTotal += EventCash
                tempRow.totalEvent = EventCash

                const EventProfit = Math.round(row.totalEvent * 100) / 100
                thisEvent += EventProfit
                tempRow.eventProfit = EventProfit
                return true
              }
              return false
            })

            dataForGrid.push(tempRow)
          }
        })
      })
      if (dataForGrid.length === 0) {
        dataForGrid.push({
          organization: 'No Data',
          id: 'No Data',
          totalEvent: 0,
        } as EmployeeData)
      }
      setEmployeeRowData(dataForGrid)
      setTotal(thisTotal)
      setLoadingData(false)
    } catch (error) {
      alert('Error getting data')
    }
  }

  useEffect(() => {
    if (props.uid !== '') {
      TryGetCommission().then(() => {
        TryGetData().then(() => {
          setLoadingData(false)
        })
      })
    }
  }, [props.uid])

  const gridRef = useRef()

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 150,
      resizable: true,
      sortable: true,
    }),
    []
  )

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
  }

  const columnDefs = [
    {
      headerName: 'Organization / Company',
      field: 'organization',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Event ID',
      field: 'id',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Event Date',
      field: 'date',
      valueGetter: valueGetter,
      filter: 'text',
    },
    {
      headerName: 'Event Net Profit',
      field: 'eventProfit',
      valueGetter: valueGetter,
      filter: 'text',
      valueFormatter: (params: any) => {
        if (typeof params.value === 'number') {
          return `$${params.value.toFixed(2)}`
        }
        return params.value
      },
    },
    {
      headerName: 'Commission',
      field: 'totalEvent',
      valueGetter: valueGetter,
      filter: 'text',
      valueFormatter: (params: any) => {
        if (typeof params.value === 'number') {
          return `$${params.value.toFixed(2)}`
        }
        return params.value
      },
    },
  ] as ColDef<EmployeeData>[]

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.sizeColumnsToFit()
    params.api.setRowData(employeeRowData)
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <>
      {loadingData ? (
        <div className={styles.loading}>
          <h1
            style={{
              left: '50%',
              top: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              textAlign: 'center',
            }}
          ></h1>
        </div>
      ) : (
        <>
          <div className={styles.signOutWrapper}>
            <input
              type="button"
              className={styles.input}
              value="Logout"
              onClick={() => {
                auth.signOut()
              }}
            />
          </div>
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
                  TryGetData()
                }}
              />
            </div>
          </div>
          <div className={styles.cardWrapper}>
            <div className={styles.gridWrapper}>
              <h1 className={styles.header}>Total Commission</h1>
              <h1 className={styles.header}>
                {`$${total.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </h1>
            </div>
          </div>

          <div className={styles.cardWrapper}>
            <div className={styles.gridWrapper}>
              <h1 className={styles.header}>Commission Report</h1>
              <div
                className="ag-theme-alpine"
                style={{ height: 500, width: props.width * 1 }}
              >
                <AgGridReact
                  //@ts-ignore
                  ref={gridRef}
                  rowData={employeeRowData}
                  defaultColDef={defaultColDef}
                  columnDefs={columnDefs}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
