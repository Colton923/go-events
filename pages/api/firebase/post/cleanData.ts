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
  const collectionNames: string[] = []
  let data: CommissionData[] = []
  const mergedResults: MergedResult[] = []
  const collections = await db.listCollections()
  collections.forEach((collection) => {
    collectionNames.push(collection.id)
  })
  const GetData = async () => {
    if (collectionNames.includes('data')) {
      const docCol = db.collection('data')
      const doc = await docCol.get()
      const EmptyCol1 = async () => {
        doc.forEach((doc) => {
          const docData = doc.data().data
          const filename = docData.filename ? docData.filename : ''
          const uploadDateTime = docData.uploadDateTime ? docData.uploadDateTime : ''
          const user = docData.user ? docData.user : ''
          mergedResults.push({ filename, uploadDateTime, user })
          docData.forEach((element: CommissionData) => {
            data.push(element)
          })
        })
      }
      const EraseCol1 = async () => {
        doc.forEach((doc) => {
          doc.ref.delete()
        })
      }
      if (!doc.empty) {
        await EmptyCol1().then(() => EraseCol1())
      }
    }
    if (collectionNames.includes('cleanedData')) {
      const docCol2 = db.collection('cleanedData')
      const doc2 = await docCol2.get()
      const EmptyCol2 = async () => {
        doc2.forEach((doc) => {
          const docData = doc.data().data
          const filename = docData.filename ? docData.filename : ''
          const uploadDateTime = docData.uploadDateTime ? docData.uploadDateTime : ''
          const user = docData.user ? docData.user : ''
          mergedResults.push({ filename, uploadDateTime, user })
          docData.forEach((element: CommissionData) => {
            data.push(element)
          })
        })
      }
      const EraseCol2 = async () => {
        doc2.forEach((doc) => {
          doc.ref.delete()
        })
      }
      if (!doc2.empty) {
        await EmptyCol2().then(() => EraseCol2())
      }
    }
    return data
  }
  const FilterData = async () => {
    data = data.reduce((acc: CommissionData[], current: CommissionData) => {
      const x = acc.find((item: CommissionData) => {
        item.totalEvent === current.totalEvent &&
          item.employee === current.employee &&
          item.id === current.id &&
          item.date === current.date
      })
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    return data
  }

  const FilterResults = () => {
    mergedResults.reduce((acc: MergedResult[], current: MergedResult) => {
      const x = acc.find((item: MergedResult) => {
        item.filename === current.filename &&
          item.uploadDateTime === current.uploadDateTime &&
          item.user === current.user
      })
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    return mergedResults
  }
  await GetData()
    .then(() => {
      data.length > 0 ? FilterData() : null
    })
    .then(() => {
      mergedResults.length > 0 ? FilterResults() : null
    })
    .then(() => {
      const mergedData: MergedData = {
        data,
        mergedResults,
      }
      db.collection('cleanedData').add(mergedData)
      res.status(200).json(mergedData)
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}

export default handler
