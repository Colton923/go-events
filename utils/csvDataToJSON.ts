import type { CommissionData } from 'types/data'

export const csvDataToJSON = (data: CommissionData[]) => {
  console.log('utils/csvDataToJSON: ', data)
  const json: CommissionData[] = data.map((item: CommissionData) => {
    return {
      actionDate: item.actionDate,
      client: item.client,
      date: item.date,
      employee: item.employee,
      eventId: item.eventId,
      nextAction: item.nextAction,
      organization: item.organization,
      salesperson: item.salesperson,
      status: item.status,
      totalEmployee: item.totalEmployee,
      totalFee: item.totalFee,
      totalEvent: item.totalEvent,
    }
  })
  json.shift()
  console.log('utils/csvDataToJSON: ', json)
  return json
}

// 'Client Name',
// 'Organization / Company',
// 'Event ID',
// 'Event Date',
// 'Assigned Employee',
// 'Status',
// 'Salesperson',
// 'Action Date',
// 'Next Action',
// 'Total Fee',
// 'Employee Wage Total',
// 'Event Net Profit',
