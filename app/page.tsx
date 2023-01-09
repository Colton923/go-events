'use client'

import { useState, useEffect } from 'react'
import { Grid } from '../components/grid/Grid'
import { PivotGrid } from '../components/pivotGrid/PivotGrid'
import { ImportCSVButton } from '../components/csvImport/ImportCSVButton'
import type {
  CommissionData,
  PivotCommissionData,
  CommissionManagerData,
} from '../types/data'
import { Login } from '../components/login/Login'
import { ImportFirebaseDataButton } from '../components/importFirebase/ImportFirebaseDataButton'
import { CommissionGrid } from '../components/commissionGrid/CommissionGrid'
import { DateFilter } from '../components/dateFilter/DateFilter'
import { PivotTotals } from '../components/pivotTotals/PivotTotals'
import { Navbar } from '../components/navbar/Navbar'
import * as Prop from '../types/props'

export default function Index() {
  const [user, setUser] = useState(null)
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
  const [pivotData, setPivotData] = useState<PivotCommissionData[]>([])
  const [commissionData, setCommissionData] = useState<CommissionManagerData[]>([])

  const loginProps: Prop.LoginProps = {
    setUser: setUser,
  }
  const navbarProps: Prop.NavbarProps = {
    setShowCommissionGrid: setShowCommissionGrid,
    setShowCSVImport: setShowCSVImport,
    setShowFirebaseGrid: setShowFirebaseGrid,
    setShowFirebaseImport: setShowFirebaseImport,
    setShowDateFilter: setShowDateFilter,
    setShowPivot: setShowPivot,
    setShowPivotTotals: setShowPivotTotals,
    showCommissionGrid: showCommissionGrid,
    showCSVImport: showCSVImport,
    showFirebaseGrid: showFirebaseGrid,
    showFirebaseImport: showFirebaseImport,
    showDateFilter: showDateFilter,
    showPivot: showPivot,
    showPivotTotals: showPivotTotals,
    user: user,
  }
  const gridProps: Prop.GridProps = {
    rowData: rowData,
    filename: filename,
    width: screenWidth,
    setCommissionData: setCommissionData,
    commissionData: commissionData,
    setPivotData: setPivotData,
    setRowData: setRowData,
    user: user,
    activeComponent: showFirebaseGrid,
    setShowPivot: setShowPivot,
  }
  const pivotGridProps: Prop.PivotGridProps = {
    rowData: pivotData,
    width: screenWidth,
    activeComponent: showPivot,
  }
  const importCSVButtonProps: Prop.ImportCSVButtonProps = {
    setRowData: setRowData,
    setFilename: setFilename,
    fileName: filename,
    activeComponent: showCSVImport,
  }
  const importFirebaseDataButtonProps: Prop.ImportFirebaseDataButtonProps = {
    setRowData: setRowData,
    user: user,
    activeComponent: showFirebaseImport,
  }
  const commissionGridProps: Prop.CommissionGridProps = {
    width: screenWidth,
    activeComponent: showCommissionGrid,
  }
  const dateFilterProps: Prop.DateFilterProps = {
    rowData: rowData,
    setRowData: setRowData,
    activeComponent: showDateFilter,
  }
  const pivotTotalsProps: Prop.PivotTotalsProps = {
    pivotData: pivotData,
    activeComponent: showPivotTotals,
  }
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

  return (
    <>
      <Login {...loginProps} />
      <Navbar {...navbarProps} />
      <ImportCSVButton {...importCSVButtonProps} />
      <ImportFirebaseDataButton {...importFirebaseDataButtonProps} />
      <DateFilter {...dateFilterProps} />
      <PivotTotals {...pivotTotalsProps} />
      <CommissionGrid {...commissionGridProps} />
      <PivotGrid {...pivotGridProps} />
      <Grid {...gridProps} />
    </>
  )
}
