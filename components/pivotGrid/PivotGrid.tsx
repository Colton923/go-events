'use client'

import styles from 'styles/App.module.scss'
import NewGrid from 'components/newGrid/Grid'
import pivotGridDataDefs from './pivotGridDataDefs'
import { useFirebaseContext } from 'components/context/FirebaseContext'
import { GridContextProvider } from 'components/newGrid/GridContext'

export const PivotGrid = () => {
  const { pivotData } = useFirebaseContext()

  if (!pivotData) return <div>Loading...</div>
  if (pivotData.length === 0) return <div>No data</div>

  return (
    <div className={styles.cardWrapper}>
      <GridContextProvider key={'pivot'}>
        <div className={styles.gridWrapper}>
          <h1 className={styles.header}>Pivot Table</h1>
          <NewGrid gridDefs={pivotGridDataDefs} localData={pivotData} />
        </div>
      </GridContextProvider>
    </div>
  )
}
