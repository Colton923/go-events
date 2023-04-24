import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabase/supabaseClient'
import type { Database } from 'types/supabase'

export type ReturnType = {
  id: number
  created_at: string
  commission_percent: number
  manager_commission_percent: number
  from_effective: string
  to_effective: string
  organizations: { organization: string }
  salespeople: { salesperson: string }
  managers: { manager: string }
}

export async function POST(requst: Request) {
  // const body = await requst.json()
  // console.log('body', body)
  // const { date } = body
  const date = '2021-09-01'
  const dateFormatter = (dateIn: string) => {
    if (dateIn === null) return null
    const dateOut = dateIn.split('-')
    return `${dateOut[1]}/${dateOut[2]}/${dateOut[0]}`
  }

  try {
    const commissions: any[] = []
    //@ts-ignore
    const { data, error } = await supabase
      .from('sales')
      .select(
        `
        id:id,
        created_at:created_at,
        salespeople:salespeople (salesperson),
        organizations:organizations (organization),
        commission_percent:commission_percent,
        managers:managers (manager),
        manager_commission_percent:manager_commission_percent,
        from_effective:from_effective,
        to_effective:to_effective
    `
      )
      .returns<ReturnType[]>()
    if (error) throw error

    data?.forEach((commission) => {
      if (commission.from_effective > date || commission.to_effective < date) return
      commissions.push({
        id: commission.id,
        commission_percent: commission.commission_percent / 100,
        manager_commission_percent: commission.manager_commission_percent / 100,
        from_effective: dateFormatter(commission.from_effective),
        to_effective: dateFormatter(commission.to_effective),
        salesperson: commission.salespeople.salesperson,
        manager: commission.managers.manager,
        organization: commission.organizations.organization,
      })
    })

    if (commissions.length === 0) {
      return NextResponse.json({
        error: 'No commissions found',
        status: 404,
      })
    }
    return NextResponse.json(commissions)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      error: error.message,
    })
  }
}
