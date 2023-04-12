import type { ColDef } from 'ag-grid-community'
import type { CommissionData } from 'types/data'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}

const filterParams = {
  comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
    const dateAsString = cellValue
    if (dateAsString === null) return -1
    const dateParts = dateAsString.split('/')
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[0]) - 1,
      Number(dateParts[1])
    )

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1
    }
    return 0
  },
  browserDatePicker: true,
  minValidYear: 2000,
  maxValidYear: 2025,
  inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
}

const commissionDataDefs = [
  { headerName: 'Client Name', field: 'client', valueGetter: valueGetter },
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
  },
  {
    headerName: 'Event ID',
    field: 'id',
    valueGetter: valueGetter,
    filter: 'number',
  },
  {
    headerName: 'Event Date',
    field: 'date',
    valueGetter: valueGetter,
    filter: 'agDateColumnFilter',
  },
  {
    headerName: 'Assigned Employee',
    field: 'employee',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Status',
    field: 'status',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Salesperson',
    field: 'salesperson',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Action Date',
    field: 'actionDate',
    valueGetter: valueGetter,
    filter: 'agDateColumnFilter',
    filterParams: filterParams,
  },
  {
    headerName: 'Next Action',
    field: 'nextAction',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Total Fee',
    field: 'totalFee',
    valueGetter: valueGetter,
    filter: 'number',
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value).toFixed(2)}`
    },
  },
  {
    headerName: 'Employee Wage Total',
    field: 'totalEmployee',
    valueGetter: valueGetter,
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value).toFixed(2)}`
    },
  },
  {
    headerName: 'Event Net Profit',
    field: 'totalEvent',
    valueGetter: valueGetter,
    valueFormatter: (params: any) => {
      return `$${parseInt(params.value).toFixed(2)}`
    },
  },
] as ColDef<CommissionData>[]

export default commissionDataDefs
