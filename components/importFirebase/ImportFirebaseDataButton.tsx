'use client'

import { ImportFirebaseDataButtonProps } from '../../types/props'
import type { CommissionData } from '../../types/data'
import { collection, getDocs, getDoc, setDoc } from 'firebase/firestore'
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

  useEffect(() => {
    handleFirebaseData()
  }, [])

  const handleCleanData = () => {
    if (!returnData) return
    const cleanData: CommissionData[] = []
    const dirtyData: CommissionData[] = []
    const TryClean = async () => {
      returnData.reduce((acc: CommissionData[], curr: CommissionData) => {
        const found = acc.find((item) => {
          if (
            item.totalEmployee === curr.totalEmployee &&
            item.actionDate === curr.actionDate &&
            item.client === curr.client &&
            item.date === curr.date &&
            item.employee === curr.employee &&
            item.id === curr.id &&
            item.nextAction === curr.nextAction &&
            item.organization === curr.organization &&
            item.salesperson === curr.salesperson &&
            item.status === curr.status &&
            item.totalEvent === curr.totalEvent
          )
            return true
        })
        if (!found) {
          acc.push(curr)
        }
        if (found) {
          dirtyData.push(curr)
        }
        return acc
      }, cleanData)
    }
    TryClean()
      .then(() => {
        if (dirtyData.length > 0) {
          alert(
            'Found ' +
              dirtyData.length +
              ' duplicate rows, attempting removal from database'
          )
          handleRemoveData(dirtyData)
        } else {
          alert('No duplicate rows found')
        }
      })
      .then(() => {
        setReturnData(cleanData)
        setIsDisabled(false)
      })
  }

  const handleRemoveData = (dirtyData: CommissionData[]) => {
    const TryRemove = async () => {
      try {
        const dataCol = collection(db, 'data')
        const querySnapshot = await getDocs(dataCol)
        querySnapshot.forEach((doc) => {
          let count = 0
          const data = doc.data().data
          dirtyData.forEach((row: CommissionData) => {
            const index = data.findIndex((item: CommissionData) => {
              if (
                item.totalEmployee === row.totalEmployee &&
                item.actionDate === row.actionDate &&
                item.client === row.client &&
                item.date === row.date &&
                item.employee === row.employee &&
                item.id === row.id &&
                item.nextAction === row.nextAction &&
                item.organization === row.organization &&
                item.salesperson === row.salesperson &&
                item.status === row.status &&
                item.totalEvent === row.totalEvent
              )
                return true
            })
            if (index > -1) {
              count += 1
              data.splice(index, 1)
              dirtyData.splice(dirtyData.indexOf(row), 1)
            }
          })
          if (count > 0) {
            alert('Removed ' + count + ' duplicate rows from database')
            setDoc(doc.ref, { data: data }, { merge: true })
          }
        })
      } catch (e) {
        alert('Error removing data from database')
      }
    }
    TryRemove()
  }

  const handleFirebaseData = () => {
    const dataForGrid: CommissionData[] = []
    const TryGet = async () => {
      try {
        const dataCol = collection(db, 'data')
        const querySnapshot = await getDocs(dataCol)
        querySnapshot.forEach((doc) => {
          const data = doc.data().data
          data.forEach((row: CommissionData) => {
            dataForGrid.push(row)
          })
        })
      } catch (e) {
        alert('Error getting data from database')
      }
    }
    TryGet().then(() => {
      setReturnData(dataForGrid)
      setIsDisabled(false)
    })
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Import</h1>
      <div className={styles.buttonWrapper}>
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
    </div>
  )
}
