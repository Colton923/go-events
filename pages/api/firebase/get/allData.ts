import * as admin from 'firebase-admin'
import type { CommissionData } from '../../../../types/data'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: any, res: any) => {
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
    res.status(200).json({ commissions })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
