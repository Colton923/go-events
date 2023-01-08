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
  const db = admin.firestore()
  const commissionCol = db.collection('commission')
  const cleanedDataCol = db.collection('cleanedData')

  const uniqueOrganizations: string[] = []
  const uniqueSalespeople: string[] = []

  const cleanedDataDocs = await cleanedDataCol.get()

  const cleanedData = cleanedDataDocs.docs[0].data().data

  const commissionManagerData: CommissionManagerData[] = []

  cleanedData.forEach((cleanedDataItem: any) => {
    const { organization, salesperson } = cleanedDataItem
    if (!uniqueOrganizations.includes(organization)) {
      uniqueOrganizations.push(organization)
    }
    if (!uniqueSalespeople.includes(salesperson)) {
      uniqueSalespeople.push(salesperson)
    }
  })

  uniqueOrganizations.forEach((organization) => {
    uniqueSalespeople.forEach((salesperson) => {
      commissionManagerData.push({
        organization,
        salesperson,
        commission: 0.1,
      })
    })
  })

  try {
    commissionCol.doc('commissionManagerData').set({ data: commissionManagerData })
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
}

export default handler
