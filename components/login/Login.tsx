'use client'

import { useState, useEffect } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth, db } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { LoginProps } from '../../types/props'
import { MyUserName } from '../../firebase/myUserName'
import styles from '../../styles/App.module.css'
import { setDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

export const Login = (props: LoginProps) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [allUserPhoneNumbers, setAllUserPhoneNumbers] = useState<string[]>([])
  const [userLoggedIn] = useAuthState(auth)
  const [userName, setUserName] = useState('')

  if (userLoggedIn) {
    const name = MyUserName(userLoggedIn.uid)
    name.then((result) => {
      setUserName(result)
      props.setUser(userLoggedIn)
      props.setUserName(result)
    })
  }

  const getAllUserPhoneNumbers = async () => {
    fetch('/api/firebase/get/firebasePhoneNumbers')
      .then((res) => res.json())
      .then((data) => {
        setAllUserPhoneNumbers(data)
      })
  }

  useEffect(() => {
    if (allUserPhoneNumbers.length === 0) {
      getAllUserPhoneNumbers()
    }
  }, [])

  const handleSignIn = () => {
    const phone = '+1' + phoneNumber
    if (allUserPhoneNumbers.includes(phone)) {
      const reCaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
        auth
      )
      signInWithPhoneNumber(auth, phone, reCaptchaVerifier).then(
        (confirmationResult) => {
          if (phone === process.env.NEXT_PUBLIC_FIREBASE_AUTH_TEST_PHONE) {
            confirmationResult
              //@ts-ignore
              .confirm(process.env.NEXT_PUBLIC_FIREBASE_AUTH_TEST_PHONE_CODE)
              .then((result) => {
                const userLoggedIn = result.user
                let thisName = ''
                console.log(userLoggedIn.uid)
                const uid = userLoggedIn.uid
                const oldrefCol = collection(db, 'users')
                getDocs(oldrefCol)
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      if (doc.data().phone === phone) {
                        thisName = doc.data().name
                        deleteDoc(doc.ref)
                      }
                    })
                    const newDoc = doc(oldrefCol, uid)
                    setDoc(newDoc, { phone: phone, name: thisName })
                  })
                  .then(() => {
                    props.setUser(userLoggedIn)
                  })
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            const code = prompt('Enter the code you received via SMS:')
            if (code) {
              confirmationResult
                .confirm(code)
                .then(() => {
                  props.setUser(userLoggedIn)
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          }
        }
      )
    } else {
      alert('Phone number not found')
    }
  }

  if (userLoggedIn) {
    return (
      <div className={styles.main}>
        <div className={styles.subHeader}>
          <h1>Welcome Back {userName}</h1>
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
            onChange={(e) => setPhoneNumber(e.target.value)}
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
