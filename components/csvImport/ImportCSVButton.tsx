'use client'
import { ChangeEvent } from 'react'
import { parse } from 'csv-parse'
import { csvDataToJSON } from '../../utils/csvDataToJSON'
import { ImportCSVButtonProps } from '../../types/props'
import styles from '../../styles/App.module.css'

export const ImportCSVButton = (props: ImportCSVButtonProps) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    props.setFilename(file.name.split('.').slice(0, -1).join('.'))
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target) return
      const text = e.target.result
      parse(
        text as string,
        {
          columns: [
            'Client Name',
            'Organization / Company',
            'Event ID',
            'Event Date',
            'Assigned Employee',
            'Status',
            'Salesperson',
            'Action Date',
            'Next Action',
            'Total Fee',
            'Employee Wage Total',
            'Event Net Profit',
          ],
        },
        (err, data) => {
          const json = csvDataToJSON(data)
          props.setRowData(json)
        }
      )
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input
        className={styles.input}
        type="file"
        onChange={handleFileUpload}
        accept=".csv"
      />
    </div>
  )
}
