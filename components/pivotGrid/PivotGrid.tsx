import styles from '../../styles/App.module.scss'
import Grid from '../newGrid/Grid'
import pivotGridDataDefs from './pivotGridDataDefs'
import { useGridContext } from '../newGrid/GridContext'
import { useLocalContext } from '@components/context/LocalContext'

export const PivotGrid = () => {
  const { setColumnDefs, pivotData, setLocalRowData } = useGridContext()
  const { visibleComponents } = useLocalContext()

  setColumnDefs(pivotGridDataDefs)

  if (pivotData.length === 0) return <div>Loading...</div>

  setLocalRowData(pivotData)
  if (!visibleComponents.PivotGrid) return null

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.gridWrapper}>
        <h1 className={styles.header}>Pivoted Data Grid</h1>
        <Grid />
      </div>
    </div>
  )
}
