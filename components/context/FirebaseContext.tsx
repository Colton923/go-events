'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import type { CommissionData } from '../../types/data'
import {
  useMemo,
  memo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, User } from 'firebase/auth'
import { useGridContext } from '@components/newGrid/GridContext'

export type FirebaseContextScope = {
  authUser: User | null
  authLoading: boolean
  authError: any
  rowData: CommissionData[]
  setRowData: React.Dispatch<React.SetStateAction<CommissionData[]>>
  phoneNumber: string
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
  validPhone: boolean
  validAdmin: boolean
  handleSignIn: () => void
  handleSignOut: () => void
}

interface Props {
  children: React.ReactNode
}

export type InHouseQs = 'AllData' | 'Pivot' | 'Employee' | 'Commission'

export const FirebaseContext = createContext<FirebaseContextScope | null>(null)

export const FirebaseContextProvider = (props: Props) => {
  console.log('rendering FirebaseContextProvider', new Date().toLocaleTimeString())
  const { children } = props
  const [user, loading, error] = useAuthState(auth)
  const [rowData, setRowData] = useState<CommissionData[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [validPhone, setValidPhone] = useState(false)
  const [validAdmin, setValidAdmin] = useState(false)
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<any>(null)

  useEffect(() => {
    if (user) {
      setAuthUser(user)
      setAuthLoading(false)
      setAuthError(null)
    } else {
      setAuthUser(null)
      setAuthLoading(false)
      setAuthError(null)
    }
  }, [user])

  //TODO:
  // const handleNewEmployee = () => {
  //   const newEmployee = {
  //     name: employeeName,
  //     phone: employeePhone,
  //   }
  //   addDoc(collection(db, 'users'), newEmployee)
  //     .then(() => {
  //       alert('Employee Added')
  //       setEmployeeName('')
  //       setEmployeePhone('')
  //       document.getElementById('employeeName')?.setAttribute('value', '')
  //       document.getElementById('employeePhone')?.setAttribute('value', '')
  //     })
  //     .catch((error) => {
  //       alert('Error adding employee: ' + error)
  //     })
  // }
  //
  //TODO:
  // const handleSubmitToDatabase = () => {
  //   if (!props.user) {
  //     alert('You must be logged in to submit data')
  //     return
  //   }
  //   setIsDisabled(true)
  //   const dataCol = collection(db, 'data')
  //   const uploadDateTime = new Date().toISOString()
  //   const data = {
  //     filename: props.filename,
  //     uploadDateTime: uploadDateTime,
  //     data: props.rowData,
  //     user: props.user.uid,
  //   }
  //   const addData = async () => {
  //     try {
  //       await addDoc(dataCol, data)
  //       alert('Data uploaded successfully')
  //       setIsDisabled(false)
  //     } catch (e) {
  //       alert('Error uploading data')
  //       console.log(e)
  //       setIsDisabled(false)
  //     }
  //   }
  //   addData()
  // }

  const isPhoneIn = useCallback(async () => {
    if (!phoneNumber) return false
    const checkDb = await fetch('/api/firebase/get/isPhoneIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error)
          return false
        } else {
          return data.isPhoneIn ? true : false
        }
      })

    return checkDb
  }, [phoneNumber])

  const isAdmin = useCallback(async () => {
    if (!authUser) return false
    const checkDb = await fetch('/api/firebase/get/amIAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: authUser.uid }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error)
          return false
        } else {
          return data.isAdmin ? true : false
        }
      })

    return checkDb
  }, [authUser])

  const handleSignIn = async () => {
    const phone = phoneNumber
    const validPhone = await isPhoneIn()

    if (validPhone) {
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
            return confirmationResult.confirm(code)
          }
        }
      )
    } else {
      alert('Phone number not found')
    }
  }

  const handleSignOut = () => {
    auth.signOut()
  }

  useEffect(() => {
    const setIsAdmin = async () => {
      const admin = await isAdmin()
      setValidAdmin(admin)
    }
    setIsAdmin()
  }, [authUser])

  useEffect(() => {
    const setPhone = async () => {
      const phone = await isPhoneIn()
      setValidPhone(phone)
    }
    setPhone()
  }, [phoneNumber])

  const contextValue = useMemo(
    () => ({
      authUser,
      authLoading,
      authError,
      rowData,
      setRowData,
      phoneNumber,
      setPhoneNumber,
      validPhone,
      validAdmin,
      handleSignIn,
      handleSignOut,
    }),
    [
      authUser,
      authLoading,
      authError,
      rowData,
      setRowData,
      phoneNumber,
      setPhoneNumber,
      validPhone,
      validAdmin,
      handleSignIn,
      handleSignOut,
    ]
  )

  return (
    <FirebaseContext.Provider value={contextValue as FirebaseContextScope}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default memo(FirebaseContextProvider)

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error(
      'useFirebaseContext must be used within a FirebaseContextProvider'
    )
  }
  return context
}
