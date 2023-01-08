import * as admin from 'firebase-admin'
import type { CommissionManagerData } from '../../../../types/data'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: any, res: any) => {
  const CommissionManagerData: CommissionManagerData[] = req.body
  const db = admin.firestore()
  const commissionCol = db.collection('commission')
  const commissionDocs = await commissionCol.get()
  try {
    commissionCol.doc(commissionDocs.docs[0].id).set({ data: CommissionManagerData })
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
}

export default handler
