'use client'

import { useFirebaseContext } from 'components/context/FirebaseContext'
import { useGridContext } from '../GridContext'
import { DataCheckerFunction } from '../GridContextTypes'
import styles from './GridDataFilter.module.scss'

export type Days =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type GridDataFilter = {
  DataChecker: DataCheckerFunction
}

const GridDateFilter = () => {
  const { setLocalRowData, localRowData } = useGridContext()

  const LastDay = (day: Days) => {
    const today = new Date()
    const DateIndex = (day: Days) => {
      switch (day) {
        case 'Monday':
          return 0
        case 'Tuesday':
          return 1
        case 'Wednesday':
          return 2
        case 'Thursday':
          return 3
        case 'Friday':
          return 4
        case 'Saturday':
          return 5
        case 'Sunday':
          return 6
      }
    }
    const dayIndex = DateIndex(day)
    const diff = today.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  }

  const UpdateView = async () => {
    const startValue = document.getElementById('start') as HTMLInputElement
    const endValue = document.getElementById('end') as HTMLInputElement
    const dateRange = {
      start: new Date(startValue.value),
      end: new Date(endValue.value),
    }
    const filteredData = localRowData.filter((row) => {
      const date = new Date(row.date)
      return date >= dateRange.start && date <= dateRange.end
    })

    setLocalRowData(filteredData)
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="date"
        id="start"
        name="Commission Beginning"
        className={styles.input}
        defaultValue={LastDay('Monday').toISOString().slice(0, 10)}
        onInput={(e) => {
          e.preventDefault()
          const thisElement = e.target as HTMLInputElement
          if (thisElement.valueAsDate) {
            const newDate = new Date(thisElement.valueAsDate)
            thisElement.setAttribute('value', newDate.toISOString().slice(0, 10))
          }
        }}
      />
      <input
        type="date"
        id="end"
        className={styles.input}
        name="Commission Ending"
        defaultValue={LastDay('Sunday').toISOString().slice(0, 10)}
        onInput={(e) => {
          e.preventDefault()
          const thisElement = e.target as HTMLInputElement
          if (thisElement.valueAsDate) {
            const newDate = new Date(thisElement.valueAsDate)
            thisElement.setAttribute('value', newDate.toISOString().slice(0, 10))
          }
        }}
      />
      <input
        type="button"
        value="Filter"
        className={styles.input}
        onClick={() => {
          UpdateView()
        }}
      />
    </div>
  )
}

export default GridDateFilter
