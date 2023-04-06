import type { CommissionData } from '../types/data'

export const csvDataToJSON = (data: CommissionData[]) => {
  const json = data.map((item: any) => {
    return {
      id: item.id,
      client: item.client,
      organizationId: item.organizationId,
      date: item.date,
      employee: item.employee,
      status: item.status,
      salespersonId: item.salespersonId,
      actionDate: item.actionDate,
      nextAction: item.nextAction,
      totalFee: item.totalFee,
      totalEmployee: item.totalEmployee,
      totalEvent: item.totalEvent,
    }
  })
  json.shift()
  return json
}
