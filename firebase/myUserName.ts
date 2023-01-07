import { db } from './firebaseClient'
import { collection, getDoc, doc } from 'firebase/firestore'

type userDocData = {
  name: string
  phone: string
}
export const MyUserName = async (uid: string) => {
  const userRef = doc(collection(db, 'users'), uid)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    const data = docSnap.data() as userDocData
    return data.name
  }
  return 'Username Not Found'
}
