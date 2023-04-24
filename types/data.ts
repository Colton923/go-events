// Firebase Document Type
export type FirebaseData = {
  data: CommissionData[]
  filename: string
  uploadDateTime: string
  user: string
}

export type CommissionData = {
  eventId: string
  client: string
  organization: string
  date: string
  employee: string
  status: string
  salesperson: string
  actionDate: string
  nextAction: string
  totalFee: number
  totalEmployee: number
  totalEvent: number
}

export type PivotData = {
  totalManager: number
  manager: string
  salesperson: string
  eventId: string
  totalEmployee: number
  totalEvent: number
  organization: string
  actionDate: string
} | null

export type EmployeeData = Pick<
  CommissionData,
  'organization' | 'eventId' | 'date' | 'totalEvent'
>

export type CommissionGridData = Pick<
  CommissionData,
  'salesperson' | 'organization'
> & {
  commission: number
}

export type Salesperson = {
  id: string
  name: string
  commission: {
    [key: Organization['id']]: number
  }
}

export type Organization = {
  id: string
  name: string
}
