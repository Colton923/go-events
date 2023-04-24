'use client'

import styles from 'styles/App.module.scss'
import NewGrid from 'components/newGrid/Grid'
import allGridDataDefs from './allDataGridDefs'
import { GridContextProvider } from 'components/newGrid/GridContext'
import { useFirebaseContext } from 'components/context/FirebaseContext'
export function AllDataGrid() {
  const { rowData } = useFirebaseContext()

  return (
    <div className={styles.cardWrapper}>
      <GridContextProvider key={'allData'}>
        <h1 className={styles.header}>Main Table</h1>
        <NewGrid gridDefs={allGridDataDefs} localData={rowData} />
      </GridContextProvider>
    </div>
  )
}
