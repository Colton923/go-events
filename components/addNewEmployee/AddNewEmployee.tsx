import styles from 'styles/App.module.scss'
import { addDoc, collection, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseClient'
import { useLocalContext } from 'components/context/LocalContext'

export const AddNewEmployee = () => {
  console.log('rendering AddNewEmployee', new Date().toLocaleTimeString())
  const { visibleComponents } = useLocalContext()
  const handleNewEmployee = () => {
    const employeeInput = document.getElementById('employeeName')
    const employeeName = employeeInput?.getAttribute('value')
    const phoneInput = document.getElementById('employeePhone')
    const employeePhone = phoneInput?.getAttribute('value')
    const newEmployee = {
      name: employeeName,
      phone: employeePhone,
    }

    addDoc(collection(db, 'users'), newEmployee)
      .then((data) => {
        setDoc(data, { id: data.id }, { merge: true })
        alert('Employee Added')
        employeeInput?.setAttribute('value', '')
        phoneInput?.setAttribute('value', '')
      })
      .catch((error) => {
        alert('Error adding employee: ' + error)
      })
  }

  if (!visibleComponents.AddNewEmployee) return null

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Name as it appears in Data</h1>
      <input className={styles.input} type="text" id="employeeName" />
      <h1 className={styles.header}>The phone number they will login with</h1>
      <input
        className={styles.input}
        id="employeePhone"
        type="text"
        defaultValue={'1234567890'}
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
