import { ImportFirebaseDataButtonProps } from '../../types/props'
import type { MergedData } from '../../types/data'
import type { CommissionData } from '../../types/data'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'

export const ImportFirebaseDataButton = (props: ImportFirebaseDataButtonProps) => {
  const handleFirebaseData = () => {
    const TryClean = async () => {
      try {
        fetch('/api/firebase/post/cleanData')
          .then((res) => res.json())
          .then((data: MergedData) => {
            if (data) {
              const length = data.data.length
              alert(`Data cleaned successfully. ${length} rows cleaned.`)
            }
          })
      } catch (e) {
        alert('Error cleaning data')
      }
    }

    const TryImport = async () => {
      try {
        if (!props.user) {
          alert('You must be logged in to view data')
        }
        const dataForGrid: CommissionData[] = []
        const dataCol = collection(db, 'cleanedData')
        const querySnapshot = getDocs(dataCol)
        querySnapshot
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const dataset = doc.data().data
              dataset.forEach((item: any) => {
                dataForGrid.push(item)
              })
            })
          })
          .then(() => {
            props.setRowData(dataForGrid)
          })
      } catch (e) {
        alert('Error getting data from database')
      }
    }

    TryClean().then(() => {
      TryImport()
    })
  }

  return (
    <div>
      <input type="button" value="View Firebase Data" onClick={handleFirebaseData} />
    </div>
  )
}
