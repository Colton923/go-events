import type { ColDef } from 'ag-grid-community'
import type { ReturnType } from '../../app/api/commissionGridData/route'

const valueGetter = (params: any) => {
  return params.data[params.colDef.field]
}

const commissionDataDefs = [
  {
    headerName: 'Organization / Company',
    field: 'organization',
    valueGetter: valueGetter,
  },
  {
    headerName: 'Salesperson',
    children: [
      {
        headerName: 'Salesperson',
        field: 'salesperson',
        valueGetter: valueGetter,
        filter: 'text',
      },
      {
        headerName: 'Commission',
        field: 'commission_percent',
        valueGetter: valueGetter,
        filter: 'text',
      },
    ],
  },
  {
    headerName: 'Account Manager',
    children: [
      {
        headerName: 'Account Manager',
        field: 'manager',
        valueGetter: valueGetter,
        filter: 'text',
      },
      {
        headerName: 'Manager Commission',
        field: 'manager_commission_percent',
        valueGetter: valueGetter,
        filter: 'text',
      },
    ],
  },

  {
    headerName: 'From Effective',
    field: 'from_effective',
    valueGetter: valueGetter,
    filter: 'text',
  },
  {
    headerName: 'To Effective',
    field: 'to_effective',
    valueGetter: valueGetter,
    filter: 'text',
  },
] as ColDef<ReturnType>[]

export default commissionDataDefs
