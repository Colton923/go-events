'use client'

import styles from 'styles/App.module.scss'
import NewGrid from 'components/newGrid/Grid'

import { GridContextProvider } from 'components/newGrid/GridContext'

const EmployeeGrid = () => {
  console.log('rendering EmployeeGrid', new Date().toLocaleTimeString())

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Employee Data</h1>
      <GridContextProvider>
        <NewGrid />
      </GridContextProvider>
    </div>
  )
}

export default EmployeeGrid
