'use client'

import { ImportFirebaseDataButtonProps } from '../../types/props'
import type { MergedData } from '../../types/data'
import type { CommissionData } from '../../types/data'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'
import styles from '../../styles/App.module.css'
import { useState } from 'react'

export const ImportFirebaseDataButton = (props: ImportFirebaseDataButtonProps) => {
  const [returnData, setReturnData] = useState<CommissionData[] | null>(null)

  const handleFirebaseData = () => {
    const TryClean = async () => {
      try {
        fetch('/api/firebase/post/cleanData').then(() => {
          try {
            const dataForGrid: CommissionData[] = []
            const dataCol = collection(db, 'cleanedData')
            const querySnapshot = getDocs(dataCol)
            querySnapshot
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  const dataset = doc.data().data
                  dataset.forEach((item: any) => {
                    dataForGrid.push(item)
                  })
                })
              })
              .then(() => {
                setReturnData(dataForGrid)
              })
          } catch (e) {
            alert('Error getting data from database')
          }
        })
      } catch (e) {
        alert('Error cleaning data')
      }
    }
    TryClean()
    if (returnData) {
      props.setRowData(returnData)
    }
  }

  return (
    <div>
      <input
        className={styles.input}
        type="button"
        value="View Firebase Data"
        onClick={handleFirebaseData}
      />
    </div>
  )
}
