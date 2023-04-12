import * as admin from 'firebase-admin'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export async function GET(req: NextApiRequest) {
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
          return NextResponse.json({
            isPhoneIn: true,
          })
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    })
  }
}
