import { ChangeEvent } from 'react'
import { parse } from 'csv-parse'
import { csvDataToJSON } from 'utils/csvDataToJSON'
import styles from 'styles/App.module.scss'
import { useLocalContext } from 'components/context/LocalContext'
import { useFirebaseContext } from 'components/context/FirebaseContext'
import type { CommissionData } from 'types/data'

export const ImportCSVButton = () => {
  console.log('rendering ImportCSVButton', new Date().toLocaleTimeString())
  const { setFilename, filename, visibleComponents } = useLocalContext()
  const { setRowData } = useFirebaseContext()

  if (!visibleComponents.ImportCSVButton) return null

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    setFilename(file.name.split('.').slice(0, -1).join('.'))
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
          setRowData(json as CommissionData[])
        }
      )
    }
    reader.readAsText(file)
  }

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>CSV Only</h1>
      <div className={styles.buttonWrapper}>
        <input
          className={styles.input}
          type="file"
          onChange={handleFileUpload}
          accept=".csv"
        />
      </div>
      <h2 className={styles.header}>File Name: {filename}</h2>
    </div>
  )
}
