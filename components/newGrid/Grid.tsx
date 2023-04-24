import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useGridContext } from './GridContext'
import styles from './Grid.module.scss'
import { useLocalContext } from 'components/context/LocalContext'

interface GripProps {
  gridDefs?: any
  localData?: any
}

const Grid = (props: GripProps) => {
  const { screenWidth } = useLocalContext()
  const { gridDefs, localData } = props
  const { gridRef, onGridReady, AGTheme } = useGridContext()

  return (
    <div className={styles.wrapper}>
      <div className={AGTheme} style={{ height: 500, width: screenWidth * 0.95 }}>
        <AgGridReact
          ref={gridRef}
          rowData={localData}
          columnDefs={gridDefs}
          onGridReady={onGridReady}
          defaultColDef={{
            flex: 1,
            minWidth: 200,
            filter: true,
            sortable: true,
            resizable: true,
            floatingFilter: true,
          }}
        />
      </div>
    </div>
  )
}

export default Grid
