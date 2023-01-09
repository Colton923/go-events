'use client'

import { ImportFirebaseDataButtonProps } from '../../types/props'
import type { CommissionData, MergedData } from '../../types/data'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'
import styles from '../../styles/App.module.css'
import { useState, useEffect } from 'react'

export const ImportFirebaseDataButton = (props: ImportFirebaseDataButtonProps) => {
  const [returnData, setReturnData] = useState<CommissionData[] | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    if (returnData) {
      props.setRowData(returnData)
    }
  }, [returnData])

  const handleCleanData = () => {
    if (!returnData) return
    const cleanData: CommissionData[] = []
    returnData.reduce((acc: CommissionData[], curr: CommissionData) => {
      const found = acc.find((item) => {
        JSON.stringify(item) === JSON.stringify(curr)
      })
      if (!found) {
        acc.push(curr)
      }
      return acc
    }, cleanData)
    setReturnData(cleanData)
    setIsDisabled(false)
  }

  const handleFirebaseData = () => {
    const TryGet = async () => {
      try {
        const dataForGrid: CommissionData[] = []
        const dataCol = collection(db, 'data')
        const querySnapshot = await getDocs(dataCol)
        querySnapshot.forEach((doc) => {
          const data = doc.data().data
          data.forEach((row: CommissionData) => {
            dataForGrid.push(row)
          })

          setReturnData(dataForGrid)
          if (dataForGrid.length === 0) {
            alert('No data found')
          }
        })
      } catch (e) {
        alert('Error getting data from database')
      }
    }
    TryGet().then(() => {
      setIsDisabled(false)
    })
  }

  return (
    <div>
      <input
        className={isDisabled ? styles.disabledInput : styles.input}
        type="button"
        value="View Firebase Data"
        onClick={() => {
          setIsDisabled(true)
          handleFirebaseData()
        }}
        disabled={isDisabled}
      />
      <input
        className={isDisabled && returnData ? styles.disabledInput : styles.input}
        type="button"
        value="Clean Data"
        onClick={() => {
          setIsDisabled(true)
          handleCleanData()
        }}
        disabled={isDisabled}
      />
    </div>
  )
}
