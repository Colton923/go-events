'use client'
import type { CommissionData } from 'types/data'

import { useMemo, memo, createContext, useContext, useState, useEffect } from 'react'

export type LocalContextScope = {
  screenWidth: number
  setScreenWidth: React.Dispatch<React.SetStateAction<number>>
  filename: string
  setFilename: React.Dispatch<React.SetStateAction<string>>
  visibleComponents: VisibleComponents
  setVisibleComponents: React.Dispatch<React.SetStateAction<VisibleComponents>>
  FixDecimalNumberToCurrency: (number: number) => string
}

export type VisibleComponents = {
  [key: string]: boolean
}

interface Props {
  children: React.ReactNode
}

export const LocalContext = createContext<LocalContextScope | null>(null)

export const LocalContextProvider = (props: Props) => {
  console.log('rendering LocalContextProvider', new Date().toLocaleTimeString())
  const { children } = props
  const [screenWidth, setScreenWidth] = useState(0)
  const [filename, setFilename] = useState('')
  const [visibleComponents, setVisibleComponents] = useState<VisibleComponents>({
    AddNewEmployee: false,
    CommissionGrid: false,
    ImportCSVButton: false,
    EmployeeGrid: false,
    ExportButton: false,
    Grid: false,
    ImportFirebaseDataButton: false,
    Login: false,
    Navbar: false,
    PivotGrid: false,
    PivotTotals: false,
  })

  const FixDecimalNumberToCurrency = (number: number) => {
    const fixedNumber = number.toFixed(2)
    const numberWithCommas = fixedNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    return numberWithCommas
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

  const contextValue = useMemo(
    () => ({
      screenWidth,
      setScreenWidth,
      filename,
      setFilename,
      visibleComponents,
      setVisibleComponents,
      FixDecimalNumberToCurrency,
    }),
    [
      screenWidth,
      filename,
      visibleComponents,
      setFilename,
      setVisibleComponents,
      setScreenWidth,
    ]
  )

  return (
    <LocalContext.Provider value={contextValue as LocalContextScope}>
      {children}
    </LocalContext.Provider>
  )
}

export default memo(LocalContextProvider)

export const useLocalContext = () => {
  const context = useContext(LocalContext)
  if (!context) {
    throw new Error('useLocalContext must be used within a LocalContextProvider')
  }
  return context
}
