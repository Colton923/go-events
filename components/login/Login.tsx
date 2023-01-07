import { useState, useEffect } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { LoginProps } from '../../types/props'

export const Login = (props: LoginProps) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [allUserPhoneNumbers, setAllUserPhoneNumbers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [userLoggedIn] = useAuthState(auth)

  if (userLoggedIn) {
    props.setLoggedIn(true)
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
          const code = prompt('Enter the code you received via SMS:')
          if (code) {
            confirmationResult
              .confirm(code)
              .then((result) => {
                setUser(result.user)
                props.setLoggedIn(true)
              })
              .catch((error) => {
                console.log(error)
              })
          }
        }
      )
    } else {
      alert('Phone number not found')
    }
  }

  if (props.user) {
    return <div>Welcome Back {user}</div>
  } else {
    return (
      <div>
        <div id="recaptcha-container"></div>
        <h1>Please Sign In</h1>
        <input
          type="text"
          id="phone"
          placeholder="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input type="button" value="Sign In" onClick={handleSignIn} />
      </div>
    )
  }
}
