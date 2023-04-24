import type { ColDef } from 'ag-grid-community'
import type { EmployeeData } from 'types/data'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}

const employeeGridDataDefs = [
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Event ID',
    field: 'id',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'Event Date',
    field: 'date',
    valueGetter: valueGetter,
    filter: 'text',
  },
  // {
  //   headerName: 'Event Net Profit',
  //   field: 'eventProfit',
  //   valueGetter: valueGetter,
  //   filter: 'text',
  //   valueFormatter: (params: any) => {
  //     if (typeof params.value === 'number') {
  //       return `$${params.value.toFixed(2)}`
  //     }
  //     return params.value
  //   },
  // },
  {
    headerName: 'Commission',
    field: 'totalEvent',
    valueGetter: valueGetter,
    filter: 'text',
    valueFormatter: (params: any) => {
      if (typeof params.value === 'number') {
        return `$${params.value.toFixed(2)}`
      } else if (typeof params.value === 'string') {
        return `$${parseFloat(params.value).toFixed(2)}`
      }
      return params.value
    },
  },
] as ColDef<EmployeeData>[]

export default employeeGridDataDefs
