'use client'

import styles from 'styles/App.module.scss'
import commissionDataDefs from 'components/commissionGrid/commissionDataDefs'
import NewGrid from 'components/newGrid/Grid'
import { GridContextProvider } from 'components/newGrid/GridContext'
import { useFirebaseContext } from 'components/context/FirebaseContext'

export const CommissionGrid = () => {
  const { commissionGridData } = useFirebaseContext()
  return (
    <div className={styles.cardWrapper}>
      <GridContextProvider key={'commissionGrid'}>
        <h1 className={styles.header}>Commission Data</h1>
        <NewGrid gridDefs={commissionDataDefs} localData={commissionGridData} />
      </GridContextProvider>
    </div>
  )
}
