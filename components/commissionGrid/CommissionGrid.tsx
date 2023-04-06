import styles from '@styles/App.module.scss'
import commissionDataDefs from '@components/commissionGrid/commissionDataDefs'
import NewGrid from '@components/newGrid/Grid'
import { useGridContext } from '@components/newGrid/GridContext'
import { useLocalContext } from '@components/context/LocalContext'

export const CommissionGrid = () => {
  console.log('rendering CommissionGrid', new Date().toLocaleTimeString())
  const { setColumnDefs, localRowData } = useGridContext()
  const { visibleComponents } = useLocalContext()

  setColumnDefs(commissionDataDefs)

  if (localRowData.length === 0) return <div>Loading...</div>

  if (!visibleComponents.CommissionGrid) return null

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Commission Data</h1>
      <NewGrid />
    </div>
  )
}
