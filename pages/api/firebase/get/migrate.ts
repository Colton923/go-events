import * as admin from 'firebase-admin'
import type { CommissionData, FirebaseData } from '../../../../types/data'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: any, res: any) => {
  console.log('api: migrate')
  try {
    const db = admin.firestore()
    const docCol = db.collection('commissions')
    const dataCol = db.collection('data')
    const data = await dataCol.get()
    const dataDoc = data.docs[0]
    const firebaseData = dataDoc.data() as FirebaseData
    const newCommissions = firebaseData.data as CommissionData[]
    newCommissions.forEach((commission) => {
      docCol.add(commission)
    })

    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
