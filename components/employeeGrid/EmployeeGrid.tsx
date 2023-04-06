import styles from '../../styles/App.module.scss'
import Grid from '../newGrid/Grid'

export const EmployeeGrid = () => {
  console.log('rendering EmployeeGrid', new Date().toLocaleTimeString())

  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Employee Data</h1>
      <Grid />
    </div>
  )
}
