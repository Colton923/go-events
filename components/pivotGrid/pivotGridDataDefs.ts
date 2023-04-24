import type { ColDef } from 'ag-grid-community'
import type { PivotData } from 'types/data'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}
const valueFormatter = (params: any) => {
  return `$${parseInt(params.value).toFixed(2)}`
}

const pivotGridDataDefs = [
  {
    headerName: 'Salesperson',
    children: [
      {
        headerName: 'Name',
        field: 'salesperson',
        valueGetter: valueGetter,
      },
      {
        headerName: 'Employee Wage Total',
        field: 'totalEmployee',
        valueGetter: valueGetter,
        valueFormatter: valueFormatter,
      },
    ],
  },
  {
    headerName: 'Manager',
    children: [
      {
        headerName: 'Name',
        field: 'manager',
        valueGetter: valueGetter,
      },
      {
        headerName: 'Manager Wage Total',
        field: 'totalManager',
        valueGetter: valueGetter,
        valueFormatter: valueFormatter,
      },
    ],
  },
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
  },
  { headerName: 'Event ID', field: 'eventId', valueGetter: valueGetter },
  { headerName: 'Event Date', field: 'actionDate', valueGetter: valueGetter },

  {
    headerName: 'Event Net Profit',
    field: 'totalEvent',
    valueGetter: valueGetter,
    valueFormatter: valueFormatter,
  },
] as ColDef<PivotData>[]

export default pivotGridDataDefs
