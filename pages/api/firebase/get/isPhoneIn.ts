import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('api: isPhoneIn')
  const { phone } = req.body
  const db = admin.firestore()
  const docCol = db.collection('users')
  try {
    const doc = await docCol.get()
    doc.forEach((doc) => {
      const data = doc.data()
      if (data.phone) {
        if (phone === data.phone) {
          return res.status(200).json({ isPhoneIn: true })
        }
      }
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
