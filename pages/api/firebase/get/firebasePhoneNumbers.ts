import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: any, res: any) => {
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

  res.status(200).json(phoneNumbers)
}

export default handler
