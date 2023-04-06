import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useGridContext } from './GridContext'
import GridDateFilter from './gridDateFilter/GridDateFilter'
import styles from './Grid.module.scss'
import { useLocalContext } from '../context/LocalContext'

const Grid = () => {
  const { screenWidth } = useLocalContext()
  const { gridRef, onGridReady, defaultColDef, columnDefs, AGTheme, localRowData } =
    useGridContext()
  console.log('rendering Grid', new Date().toLocaleTimeString())
  return (
    <div className={styles.wrapper}>
      <GridDateFilter />
      <div className={AGTheme} style={{ height: 500, width: screenWidth * 0.95 }}>
        <AgGridReact
          ref={gridRef}
          rowData={localRowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  )
}

export default Grid
