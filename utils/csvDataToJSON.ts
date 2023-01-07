import type { CommissionData } from '../types/data'

export const csvDataToJSON = (data: CommissionData[]) => {
  const json = data.map((item: any) => {
    return {
      client: item['Client Name'],
      organization: item['Organization / Company'],
      id: item['Event ID'],
      date: item['Event Date'],
      employee: item['Assigned Employee'],
      status: item['Status'],
      salesperson: item['Salesperson'],
      actionDate: item['Action Date'],
      nextAction: item['Next Action'],
      totalFee: item['Total Fee'],
      totalEmployee: item['Employee Wage Total'],
      totalEvent: item['Event Net Profit'],
    }
  })
  json.shift()
  return json
}
