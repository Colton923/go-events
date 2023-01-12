import { db } from './firebaseClient'
import { collection, getDoc, doc } from 'firebase/firestore'

type userDocData = {
  name: string
  phone: string
}
export const MyUserName = async (uid: string) => {
  const userCol = collection(db, 'users')
  const userRef = doc(userCol, uid)
  const docSnap = await getDoc(userRef).then((doc) => {
    if (doc.exists()) {
      const data = doc.data() as userDocData
      return data.name
    } else {
      return 'User not found'
    }
  })
  return docSnap
}
