'use client'

import styles from 'styles/App.module.scss'
import { useFirebaseContext } from 'components/context/FirebaseContext'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

const Login = () => {
  const { handleSignIn, setPhoneNumber, authLoading, authError, authUser } =
    useFirebaseContext()

  useEffect(() => {
    if (authUser) {
      const welcomeID = document.getElementById('welcomeID')
      if (welcomeID) {
        welcomeID.innerHTML = `Welcome ${
          authUser.displayName ? authUser.displayName : authUser.phoneNumber
        }`
      }
    }
  }, [authUser])

  if (authLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h2 className={styles.bigText}>Loading...</h2>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h2 className={styles.bigText}>Error: {authError.message}</h2>
        </div>
      </div>
    )
  } else if (!authUser) {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <div id="recaptcha-container"></div>
          <h2 className={styles.bigText}>Please Sign In</h2>
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
  } else {
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <h2 className={styles.bigText} id="welcomeID">
            Welcome
          </h2>
        </div>
      </div>
    )
  }
}

export default Login
