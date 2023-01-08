export type CommissionData = {
  client: string
  organization: string
  id: string
  date: string
  employee: string
  status: string
  salesperson: string
  actionDate: string
  nextAction: string
  totalFee: string
  totalEmployee: string
  totalEvent: string
}

export type PivotCommissionData = {
  salesperson: string
  organization: string
  id: string
  totalEmployee: number
}

export type PivotCommissionTotals = {
  salesperson: string
  totalEmployee: number
}

export type FirebaseData = {
  data: CommissionData[]
  filename: string
  uploadDateTime: string
  user: string
}

export type MergedResult = {
  filename: string
  uploadDateTime: string
  user: string
}

export type MergedData = {
  data: CommissionData[]
  mergedResults: MergedResult[]
}

export type CommissionManagerData = {
  organization: string
  salesperson: string
  commission: number
}
