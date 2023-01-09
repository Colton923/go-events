import styles from '../../styles/App.module.css'
import { useState } from 'react'

import { DateFilterProps } from '../../types/props'

export const DateFilter = (props: DateFilterProps) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleDateFilter = () => {
    const filteredData = props.rowData.filter((row) => {
      const rowDate = new Date(row.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return rowDate >= start && rowDate <= end
    })
    props.setRowData(filteredData)
  }
  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Date Filter</h1>
      <h1 className={styles.subHeader}>Start Date</h1>
      <input
        className={styles.input}
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
      />
      <h1 className={styles.subHeader}>End Date</h1>
      <input
        className={styles.input}
        type="date"
        onChange={(e) => setEndDate(e.target.value)}
      />
      <div className={styles.buttonWrapper}>
        <input
          className={styles.input}
          type="button"
          value="Date Filter"
          onClick={() => {
            handleDateFilter()
          }}
        />
      </div>
    </div>
  )
}
