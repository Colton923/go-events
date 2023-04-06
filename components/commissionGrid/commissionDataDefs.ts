import type { ColDef } from 'ag-grid-community'
import type { CommissionData } from '../../types/data'

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
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
  },
  {
    headerName: 'Salesperson',
    field: 'salesperson',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Commission',
    field: 'commission',
    valueGetter: valueGetter,
    filter: 'text',
  },
] as ColDef<CommissionData>[]

export default commissionDataDefs
