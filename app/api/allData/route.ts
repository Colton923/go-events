import type { CommissionData } from 'types/data'
import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabase/supabaseClient'

export type ReturnType = {
  id: number
  created_at: string
  action_date: string
  client: string
  event_date: string
  external_id: number
  next_action: string
  status: string
  total_fee: number
  employee_wage: number
  employees: { employee: string }
  organizations: { organization: string }
  salespeople: { salesperson: string }
}

export async function POST() {
  const dateFormatter = (dateIn: string) => {
    const dateOut = dateIn.split('-')
    return `${dateOut[1]}/${dateOut[2]}/${dateOut[0]}`
  }

  try {
    const commissions: CommissionData[] = []
    //@ts-ignore
    const { data, error } = await supabase
      .from('commissions')
      .select(
        `
        id,
        created_at,
        action_date,
        client,
        event_date,
        employees (employee),
        external_id,
        next_action,
        organizations (organization),
        salespeople (salesperson),
        status,
        total_fee,
        employee_wage
    `
      )
      .returns<ReturnType[]>()
    if (error) throw error

    data?.forEach((commission) => {
      commissions.push({
        eventId: commission.external_id.toString(),
        client: commission.client,
        organization: commission.organizations.organization,
        date: dateFormatter(commission.event_date),
        employee: commission.employees.employee,
        status: commission.status,
        salesperson: commission.salespeople.salesperson,
        actionDate: dateFormatter(commission.action_date),
        nextAction: commission.next_action,
        totalFee: commission.total_fee / 100,
        totalEmployee: commission.employee_wage / 100,
        totalEvent: commission.total_fee / 100 - commission.employee_wage / 100,
      })
    })

    return NextResponse.json(commissions)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      error: error.message,
    })
  }
}
