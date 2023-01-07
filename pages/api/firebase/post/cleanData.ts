import * as admin from 'firebase-admin'
import type { CommissionData } from '../../../../types/data'
import type { MergedData } from '../../../../types/data'
import type { MergedResult } from '../../../../types/data'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const handler = async (req: any, res: any) => {
  const db = admin.firestore()
  const docCol = db.collection('data')
  const doc = await docCol.get()
  const data: CommissionData[] = []
  doc.forEach((doc) => {
    const docData = doc.data().data
    docData.forEach((element: CommissionData) => {
      data.push(element)
    })
  })
  data.reduce((acc: CommissionData[], current: CommissionData) => {
    const x = acc.find((item: CommissionData) => {
      item.id === current.id &&
        item.client === current.client &&
        item.organization === current.organization &&
        item.date === current.date &&
        item.employee === current.employee &&
        item.status === current.status &&
        item.salesperson === current.salesperson &&
        item.actionDate === current.actionDate &&
        item.nextAction === current.nextAction &&
        item.totalFee === current.totalFee &&
        item.totalEmployee === current.totalEmployee &&
        item.totalEvent === current.totalEvent
    })
    if (!x) {
      return acc.concat([current])
    } else {
      return acc
    }
  }, [])
  const mergedResults: MergedResult[] = []
  doc.forEach((doc) => {
    const docData = doc.data()
    const filename = docData.filename
    const uploadDateTime = docData.uploadDateTime
    const user = docData.user
    mergedResults.push({ filename, uploadDateTime, user })
  })
  const mergedData: MergedData = {
    data,
    mergedResults,
  }
  doc.forEach((doc) => {
    doc.ref.delete()
  })

  const docCol2 = db.collection('cleanedData')
  if (mergedData.data.length !== 0) {
    docCol2.add(mergedData)
  }

  res.status(200).json(mergedData)
}

export default handler
