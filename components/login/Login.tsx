import { useLocalContext } from '@components/context/LocalContext'
import styles from '../../styles/App.module.scss'
import { useFirebaseContext } from '../context/FirebaseContext'
import Migration from '@components/migration/Migration'

const Login = () => {
  const {
    authUser,
    authLoading,
    authError,
    handleSignIn,
    setPhoneNumber,
    validAdmin,
  } = useFirebaseContext()
  const { router } = useLocalContext()
  if (authLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h1 className={styles.bigText}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h1 className={styles.bigText}>Error: {authError.message}</h1>
        </div>
      </div>
    )
  }

  if (authUser) {
    if (validAdmin) {
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    } else {
      setTimeout(() => {
        router.push('/employee')
      }, 3000)
    }

    return (
      <div className={styles.main}>
        <div className={styles.subHeader}>
          <h1>
            Welcome Back
            {authUser.displayName ? authUser.displayName : authUser.phoneNumber}
          </h1>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <div id="recaptcha-container"></div>
          <h1 className={styles.bigText}>Please Sign In</h1>
          <input
            className={styles.input}
            type="text"
            id="phone"
            placeholder="Phone Number"
            onChange={(e) => {
              if (e.target.value.length !== 12) return
              setPhoneNumber(e.target.value)
            }}
          />
          <input
            className={styles.input}
            type="button"
            value="Sign In"
            onClick={handleSignIn}
          />
        </div>
      </div>
    )
  }
}

export default Login
