'use client'
import { useGridContext } from 'components/newGrid/GridContext'
import styles from 'styles/App.module.scss'
import { useFirebaseContext } from 'components/context/FirebaseContext'

export const ImportFirebaseDataButton = () => {
  // const { ChangeRowData } = useFirebaseContext()
  // const { setLocalRowData } = useGridContext()

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Import</h1>
      <div className={styles.buttonWrapper}>
        {/* <input
          className={styles.input}
          type="button"
          value="View Firebase Data"
          onClick={() => {
            ChangeRowData('AllData', setLocalRowData)
          }}
        /> */}
      </div>
    </div>
  )
}
