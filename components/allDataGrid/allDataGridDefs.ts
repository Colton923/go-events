import type { ColDef } from 'ag-grid-community'
import type { CommissionData } from 'types/data'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}

const commissionDataDefs = [
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
    sortable: true,
  },
  {
    headerName: 'Event ID',
    field: 'eventId',
    valueGetter: valueGetter,
    filter: 'number',
    sortable: true,
  },
  {
    headerName: 'Event Date',
    field: 'date',
    valueGetter: valueGetter,
    filter: 'date',
    sortable: true,
  },
  {
    headerName: 'Assigned Employee',
    field: 'employee',
    valueGetter: valueGetter,
    filter: 'text',
    sortable: true,
  },
  {
    headerName: 'Status',
    field: 'status',
    valueGetter: valueGetter,
    filter: 'text',
    sortable: true,
  },
  {
    headerName: 'Salesperson',
    field: 'salesperson',
    valueGetter: valueGetter,
    filter: 'text',
    sortable: true,
  },
  {
    headerName: 'Action Date',
    field: 'actionDate',
    valueGetter: valueGetter,
    filter: 'date',
    sortable: true,
  },
  {
    headerName: 'Next Action',
    field: 'nextAction',
    valueGetter: valueGetter,
    filter: 'text',
    sortable: true,
  },
  {
    headerName: 'Total Fee',
    field: 'totalFee',
    valueGetter: valueGetter,
    filter: 'number',
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    },
    sortable: true,
  },
  {
    headerName: 'Employee Wage Total',
    field: 'totalEmployee',
    valueGetter: valueGetter,
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    },
    sortable: true,
  },
  {
    headerName: 'Event Net Profit',
    field: 'totalEvent',
    valueGetter: valueGetter,
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    },
    sortable: true,
  },
] as ColDef<CommissionData>[]

export default commissionDataDefs
