'use client'

import { ExportButtonProps } from '../../types/props'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'
import styles from '../../styles/App.module.css'
import { useState } from 'react'

export const ExportButton = (props: ExportButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSubmitToDatabase = () => {
    if (!props.user) {
      alert('You must be logged in to submit data')
      return
    }
    setIsDisabled(true)
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
        setIsDisabled(false)
      } catch (e) {
        alert('Error uploading data')
        console.log(e)
        setIsDisabled(false)
      }
    }
    addData()
  }
  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.buttonWrapper}>
      <input
        className={styles.input}
        type="button"
        value="Submit to Database"
        onClick={handleSubmitToDatabase}
        disabled={isDisabled}
      />
    </div>
  )
}
