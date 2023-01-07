import { ExportButtonProps } from '../../types/props'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'

export const ExportButton = (props: ExportButtonProps) => {
  const handleSubmitToDatabase = () => {
    if (!props.user) {
      alert('You must be logged in to submit data')
    }
    const dataCol = collection(db, 'data')
    const uploadDateTime = new Date().toISOString()
    const data = {
      filename: props.filename,
      uploadDateTime: uploadDateTime,
      data: props.rowData,
      user: props.user.uid,
    }
    const addData = async () => {
      try {
        await addDoc(dataCol, data)
        alert('Data uploaded successfully')
      } catch (e) {
        alert('Error uploading data')
        console.log(e)
      }
    }
    addData()
  }

  return (
    <div>
      <input
        type="button"
        value="Submit to Database"
        onClick={handleSubmitToDatabase}
      />
    </div>
  )
}
