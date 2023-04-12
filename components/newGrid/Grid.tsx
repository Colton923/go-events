import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useGridContext } from './GridContext'
import GridDateFilter from './gridDateFilter/GridDateFilter'
import styles from './Grid.module.scss'
import { useLocalContext } from 'components/context/LocalContext'

interface GripProps {
  params?: any
}

const Grid = (props: GripProps) => {
  const { screenWidth } = useLocalContext()
  const { params } = props
  const {
    gridRef,
    onGridReady,
    defaultColDef,
    columnDefs,
    AGTheme,
    localRowData,
    setColumnDefs,
  } = useGridContext()
  console.log('rendering Grid')

  if (!localRowData) return <div>Loading...</div>

  if (localRowData.length === 0) return <div>No data</div>
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
