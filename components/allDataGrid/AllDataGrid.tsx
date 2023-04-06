import styles from '../../styles/App.module.scss'
import NewGrid from '../newGrid/Grid'
import { useGridContext } from '../newGrid/GridContext'
import allDataGridDefs from './allDataGridDefs'
import { ImportFirebaseDataButton } from '@components/importFirebase/ImportFirebaseDataButton'
import { useLocalContext } from '@components/context/LocalContext'

export const AllDataGrid = () => {
  console.log('rendering AllDataGrid', new Date().toLocaleTimeString())
  const { setColumnDefs, localRowData } = useGridContext()
  const { visibleComponents } = useLocalContext()

  setColumnDefs(allDataGridDefs)

  if (localRowData.length === 0) return <div>Loading...</div>

  if (!visibleComponents.Grid) return null

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Commission Data</h1>
      <ImportFirebaseDataButton />
      <NewGrid />
    </div>
  )
}
