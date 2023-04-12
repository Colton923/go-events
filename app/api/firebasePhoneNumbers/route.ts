import * as admin from 'firebase-admin'
import { NextResponse } from 'next/server'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export async function GET() {
  console.log('api: firebasePhoneNumbers')
  const db = admin.firestore()
  const docCol = db.collection('users')
  const doc = await docCol.get()
  const phoneNumbers: string[] = []
  doc.forEach((doc) => {
    const data = doc.data()
    if (data.phone) {
      phoneNumbers.push(data.phone)
    }
  })
  return NextResponse.json(phoneNumbers)
}
