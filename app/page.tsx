import styles from 'styles/App.module.scss'
import Login from 'components/login/Login'

export default function Index() {
  return (
    <div className={styles.main}>
      <h1>Go-Events</h1>
      <Login />
    </div>
  )
}
