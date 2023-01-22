'use client'

import { useState, useEffect } from 'react'
import type {
  CommissionData,
  PivotCommissionData,
  CommissionManagerData,
} from '../types/data'

import * as Prop from '../types/props'
import { Login } from '../components/login/Login'
import { Grid } from '../components/grid/Grid'
import { ImportCSVButton } from '../components/csvImport/ImportCSVButton'
import { EmployeeGrid } from '../components/employeeGrid/EmployeeGrid'
import { Navbar } from '../components/navbar/Navbar'
import { PivotGrid } from '../components/pivotGrid/PivotGrid'
import { PivotTotals } from '../components/pivotTotals/PivotTotals'
import { ImportFirebaseDataButton } from '../components/importFirebase/ImportFirebaseDataButton'
import { CommissionGrid } from '../components/commissionGrid/CommissionGrid'
import { auth } from '../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { AddNewEmployee } from '../components/addNewEmployee/AddNewEmployee'

export default function Index() {
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState('')
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [authUser, authLoading, authError] = useAuthState(auth)
  const [showAddNewEmployee, setShowAddNewEmployee] = useState(false)

  const loginProps: Prop.LoginProps = {
    setUserName: setUserName,
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
    setShowAddNewEmployee: setShowAddNewEmployee,
    showAddNewEmployee: showAddNewEmployee,
    showCommissionGrid: showCommissionGrid,
    showCSVImport: showCSVImport,
    showFirebaseGrid: showFirebaseGrid,
    showFirebaseImport: showFirebaseImport,
    showDateFilter: showDateFilter,
    showPivot: showPivot,
    showPivotTotals: showPivotTotals,
    user: user,
    authUser: authUser,
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
    rowData: rowData,
  }
  const pivotTotalsProps: Prop.PivotTotalsProps = {
    pivotData: pivotData,
    activeComponent: showPivotTotals,
  }
  const employeeGridProps: Prop.EmployeeGridProps = {
    width: screenWidth,
    uid: user ? user.uid : '',
    activeComponent: !isAdmin,
    userName: userName,
  }
  const addNewEmployeeProps: Prop.AddNewEmployeeProps = {
    activeComponent: showAddNewEmployee,
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

  // Checks if the user is an admin
  useEffect(() => {
    if (user) {
      if (
        user.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_COLTON ||
        user.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_FRANK
      ) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
  }, [user, authUser, authLoading, authError])

  if (authLoading) return <div>Loading...</div>

  if (authError) return <div>Error: {authError.message}</div>

  return (
    <>
      <Login {...loginProps} />
      {isAdmin ? (
        <>
          <Navbar {...navbarProps} />
          <ImportCSVButton {...importCSVButtonProps} />
          <ImportFirebaseDataButton {...importFirebaseDataButtonProps} />
          <PivotTotals {...pivotTotalsProps} />
          <CommissionGrid {...commissionGridProps} />
          <PivotGrid {...pivotGridProps} />
          <Grid {...gridProps} />
          <AddNewEmployee {...addNewEmployeeProps} />
        </>
      ) : (
        <>
          <EmployeeGrid {...employeeGridProps} />
        </>
      )}
    </>
  )
}
