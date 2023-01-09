'use client'

import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebaseClient'
import { db } from '../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

import { Grid } from '../components/grid/Grid'
import { PivotGrid } from '../components/pivotGrid/PivotGrid'
import { ImportCSVButton } from '../components/csvImport/ImportCSVButton'
import type {
  CommissionData,
  PivotCommissionData,
  PivotCommissionTotals,
  CommissionManagerData,
} from '../types/data'
import { Login } from '../components/login/Login'
import { ExportButton } from '../components/firebaseExport/ExportButton'
import { ImportFirebaseDataButton } from '../components/importFirebase/ImportFirebaseDataButton'
import { CommissionGrid } from '../components/commissionGrid/CommissionGrid'

import styles from '../styles/App.module.css'

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user] = useAuthState(auth)
  const [screenWidth, setScreenWidth] = useState(0)
  const [filename, setFilename] = useState('')
  const [rowData, setRowData] = useState<CommissionData[]>([])
  const [showCommissionGrid, setShowCommissionGrid] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showFirebaseImport, setShowFirebaseImport] = useState(false)
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [showPivot, setShowPivot] = useState(false)
  const [showFirebaseGrid, setShowFirebaseGrid] = useState(false)
  const [showPivotTotals, setShowPivotTotals] = useState(false)

  // Gets the screen width on load and on resize
  useEffect(() => {
    const handleScreenResize = () => {
      const width = window.innerWidth * 0.9
      setScreenWidth(width)
    }
    window.addEventListener('resize', handleScreenResize)
    handleScreenResize()
    return () => window.removeEventListener('resize', handleScreenResize)
  }, [])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const handleDateFilter = () => {
    const filteredData = rowData.filter((row) => {
      const rowDate = new Date(row.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return rowDate >= start && rowDate <= end
    })
    setRowData(filteredData)
  }

  const [commissionData, setCommissionData] = useState<CommissionManagerData[]>([])
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

  const [pivotData, setPivotData] = useState<PivotCommissionData[]>([])
  const handlePivot = () => {
    const uniqueIDs = [...new Set(rowData.map((row) => row.id))]
    const tempPivotData: PivotCommissionData[] = []
    uniqueIDs.forEach((id) => {
      tempPivotData.push({
        salesperson: '',
        organization: '',
        id: id,
        totalEmployee: 0,
      })
    })
    commissionData.forEach((commissionRow) => {
      rowData.forEach((row) => {
        if (commissionRow.salesperson === row.salesperson) {
          const index = tempPivotData.findIndex((item) => item.id === row.id)
          tempPivotData[index].salesperson = row.salesperson
          tempPivotData[index].organization = commissionRow.organization
          tempPivotData[index].totalEmployee +=
            Math.round(
              parseInt(row.totalEmployee) * commissionRow.commission * 100
            ) / 100
        }
      })
    })
    setPivotData(tempPivotData)
  }

  const [pivotTotals, setPivotTotals] = useState<PivotCommissionTotals[]>([])
  const handlePivotTotals = () => {
    if (pivotData.length > 0) {
      const uniqueSalespeople = [...new Set(pivotData.map((row) => row.salesperson))]
      const tempPivotTotals: PivotCommissionTotals[] = []
      uniqueSalespeople.forEach((salesperson) => {
        tempPivotTotals.push({
          salesperson: salesperson,
          totalEmployee: 0,
        })
      })
      pivotData.forEach((row) => {
        const index = tempPivotTotals.findIndex(
          (item) => item.salesperson === row.salesperson
        )
        tempPivotTotals[index].totalEmployee += row.totalEmployee
      })
      setPivotTotals(tempPivotTotals)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <Login user={user} setLoggedIn={setLoggedIn} />
      </div>
      {loggedIn ? (
        <div className={styles.allCardsWrapper}>
          <div className={styles.menuCard}>
            <h1 className={styles.header}>Menu</h1>
            <div className={styles.buttonWrapper}>
              <input
                type="button"
                value="Commission Grid"
                onClick={() => setShowCommissionGrid(!showCommissionGrid)}
              />
              <input
                type="button"
                value="CSV Import"
                onClick={() => setShowCSVImport(!showCSVImport)}
              />
              <input
                type="button"
                value="Firebase Import"
                onClick={() => setShowFirebaseImport(!showFirebaseImport)}
              />
              <input
                type="button"
                value="Date Filter"
                onClick={() => setShowDateFilter(!showDateFilter)}
              />
              <input
                type="button"
                value="Pivot"
                onClick={() => setShowPivot(!showPivot)}
              />
              <input
                type="button"
                value="Pivot Totals"
                onClick={() => setShowPivotTotals(!showPivotTotals)}
              />
            </div>
          </div>
          {showCommissionGrid && (
            <div className={styles.cardWrapper}>
              <h1 className={styles.header}>Commission Data</h1>
              <div className={styles.gridWrapper}>
                <CommissionGrid width={screenWidth} />
              </div>
            </div>
          )}
          {showCSVImport && (
            <div className={styles.cardWrapper}>
              <h1 className={styles.header}>CSV Only</h1>
              <div className={styles.buttonWrapper}>
                <ImportCSVButton setRowData={setRowData} setFilename={setFilename} />
              </div>
              <h2 className={styles.header}>File Name: {filename}</h2>
            </div>
          )}
          {showFirebaseImport && (
            <div className={styles.cardWrapper}>
              <h1 className={styles.header}>Import</h1>
              <div className={styles.buttonWrapper}>
                <ImportFirebaseDataButton setRowData={setRowData} user={user} />
              </div>
            </div>
          )}
          {showDateFilter && (
            <div className={styles.cardWrapper}>
              <div>
                <h1 className={styles.header}>Date Filter</h1>
                <h1 className={styles.subHeader}>Start Date</h1>
                <input
                  className={styles.input}
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <h1 className={styles.subHeader}>End Date</h1>
                <input
                  className={styles.input}
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <div className={styles.buttonWrapper}>
                  <input
                    className={styles.input}
                    type="button"
                    value="Date Filter"
                    onClick={() => {
                      handleDateFilter()
                      handlePivot()
                      handlePivotTotals()
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {showPivot && rowData.length > 0 ? (
            <>
              {pivotData.length > 0 ? (
                <>
                  <div className={styles.cardWrapper}>
                    <div>
                      <h1 className={styles.header}>Totals</h1>
                      <div className={styles.buttonWrapper}>
                        <input
                          type="button"
                          value="Refresh"
                          onClick={handlePivotTotals}
                          className={styles.input}
                        />
                      </div>
                      {pivotTotals
                        ? pivotTotals.map((row, index) => {
                            return (
                              <div key={index} className={styles.totalsGrid}>
                                <h1 className={styles.subHeader}>
                                  {row.salesperson}
                                </h1>
                                <h1 className={styles.subHeader}>
                                  $
                                  {row.totalEmployee
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  .00
                                </h1>
                              </div>
                            )
                          })
                        : null}
                    </div>
                  </div>
                  <div className={styles.cardWrapper}>
                    <div className={styles.gridWrapper}>
                      <h1 className={styles.header}>Pivoted Data Grid</h1>
                      <PivotGrid rowData={pivotData} width={screenWidth} />
                    </div>
                  </div>
                </>
              ) : null}
              {showFirebaseGrid && (
                <div className={styles.cardWrapper}>
                  <h1 className={styles.header}>All Data Grid</h1>
                  <h1 className={styles.subHeader}>Rows: {rowData.length}</h1>
                  <div className={styles.buttonWrapper}>
                    <ExportButton
                      rowData={rowData}
                      filename={filename}
                      user={user}
                    />
                  </div>
                  <div className={styles.buttonWrapper}>
                    <input
                      className={styles.input}
                      type="button"
                      value="Simple Pivot"
                      onClick={() => {
                        handlePivot()
                        handlePivotTotals()
                      }}
                    />
                  </div>
                  <div className={styles.gridWrapper}>
                    <Grid rowData={rowData} width={screenWidth} />
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
