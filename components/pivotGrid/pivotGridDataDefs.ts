import type { ColDef } from 'ag-grid-community'
import type { CommissionData, PivotData } from '../../types/data'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}
const valueFormatter = (params: any) => {
  return `$${parseInt(params.value).toFixed(2)}`
}

const pivotGridDataDefs = [
  { headerName: 'Salesperson', field: 'salesperson', valueGetter: valueGetter },
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
  },
  { headerName: 'Event ID', field: 'eventId', valueGetter: valueGetter },
  { headerName: 'Event Date', field: 'actionDate', valueGetter: valueGetter },
  {
    headerName: 'Employee Wage Total',
    field: 'totalEmployee',
    valueGetter: valueGetter,
    valueFormatter: valueFormatter,
  },
  {
    headerName: 'Event Net Profit',
    field: 'totalEvent',
    valueGetter: valueGetter,
    valueFormatter: valueFormatter,
  },
] as ColDef<PivotData>[]

export default pivotGridDataDefs
