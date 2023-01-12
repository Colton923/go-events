'use client'
import { ChangeEvent } from 'react'
import { parse } from 'csv-parse'
import { AddNewEmployeeProps } from '../../types/props'
import styles from '../../styles/App.module.css'
import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'

export const AddNewEmployee = (props: AddNewEmployeeProps) => {
  const [employeeName, setEmployeeName] = useState('')
  const [employeePhone, setEmployeePhone] = useState('')

  const handleNewEmployee = () => {
    const newEmployee = {
      name: employeeName,
      phone: employeePhone,
    }
    addDoc(collection(db, 'users'), newEmployee)
      .then(() => {
        alert('Employee Added')
        setEmployeeName('')
        setEmployeePhone('')
        document.getElementById('employeeName')?.setAttribute('value', '')
        document.getElementById('employeePhone')?.setAttribute('value', '')
      })
      .catch((error) => {
        alert('Error adding employee: ' + error)
      })
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Name as it appears in Data</h1>
      <input
        className={styles.input}
        type="text"
        id="employeeName"
        onChange={(e) => setEmployeeName(e.target.value)}
      />
      <h1 className={styles.header}>The phone number they will login with</h1>
      <input
        className={styles.input}
        id="employeePhone"
        type="text"
        defaultValue={'1234567890'}
        onChange={(e) => setEmployeePhone('+1' + e.target.value)}
      />
      <div className={styles.buttonWrapper}>
        <input
          className={styles.input}
          type="button"
          value="Add Employee"
          onClick={() => {
            handleNewEmployee
          }}
        />
      </div>
    </div>
  )
}
