import { PivotData, CommissionData } from 'types/data'

const PivotTable = (input: CommissionData[]) => {
  const output: PivotData[] = []

  input.forEach((commission) => {
    const {
      organization,
      salesperson,
      totalEvent,
      totalEmployee,
      eventId,
      actionDate,
    } = commission
    const index = output.findIndex(
      (item) =>
        item.organization === organization &&
        item.salesperson === salesperson &&
        item.eventId === eventId &&
        item.totalEmployee === totalEmployee &&
        item.totalEvent === totalEvent &&
        item.actionDate === commission.actionDate
    )
    if (index === -1) {
      output.push({
        organization,
        eventId,
        salesperson,
        totalEmployee,
        totalEvent,
        actionDate,
      })
    }
  })

  return output
}

export default PivotTable
