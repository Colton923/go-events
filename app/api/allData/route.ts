import * as admin from 'firebase-admin'
import type { CommissionData } from 'types/data'
import { NextResponse } from 'next/server'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export async function GET() {
  console.log('api: allData')
  try {
    const FillCommissionData = async () => {
      const commissions: CommissionData[] = []

      const db = admin.firestore()
      const docCol = db.collection('commissions')
      const snapshot = await docCol.get()

      snapshot.forEach((doc) => {
        const data = doc.data() as CommissionData
        commissions.push(data)
      })
      return commissions
    }

    const commissions = await FillCommissionData()
    return NextResponse.json(commissions)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      error: error.message,
    })
  }
}
