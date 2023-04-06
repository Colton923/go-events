import styles from '../../styles/App.module.scss'

export const AddNewEmployee = () => {
  console.log('rendering AddNewEmployee', new Date().toLocaleTimeString())
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Name as it appears in Data</h1>
      <input
        className={styles.input}
        type="text"
        id="employeeName"
        // onChange={(e) => setEmployeeName(e.target.value)}
      />
      <h1 className={styles.header}>The phone number they will login with</h1>
      <input
        className={styles.input}
        id="employeePhone"
        type="text"
        defaultValue={'1234567890'}
        // onChange={(e) => setEmployeePhone('+1' + e.target.value)}
      />
      <div className={styles.buttonWrapper}>
        <input
          className={styles.input}
          type="button"
          value="Add Employee"
          // onClick={() => {
          //   handleNewEmployee
          // }}
        />
      </div>
    </div>
  )
}
