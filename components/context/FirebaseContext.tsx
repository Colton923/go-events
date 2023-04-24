'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import type { CommissionData } from 'types/data'
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
import { useRouter } from 'next/navigation'
import type { ReturnType } from 'app/api/commissionGridData/route'
import type { PivotData } from 'types/data'
export type FirebaseContextScope = {
  authUser: User | null
  authLoading: boolean
  authError: any
  phoneNumber: string
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
  validPhone: boolean
  validAdmin: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  rowData: CommissionData[]
  setRowData: React.Dispatch<React.SetStateAction<CommissionData[]>>
  commissionGridData: ReturnType[]
  setCommissionGridData: React.Dispatch<React.SetStateAction<ReturnType[]>>
  pivotData: PivotData[]
  setPivotData: React.Dispatch<React.SetStateAction<PivotData[]>>
}

interface Props {
  children: React.ReactNode
}

export type InHouseQs = 'AllData' | 'Pivot' | 'Employee' | 'Commission'

export const FirebaseContext = createContext<FirebaseContextScope | null>(null)

export const FirebaseContextProvider = (props: Props) => {
  console.log('rendering FirebaseContextProvider', new Date().toLocaleTimeString())
  const { children } = props
  const [user] = useAuthState(auth)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [validPhone, setValidPhone] = useState(false)
  const [validAdmin, setValidAdmin] = useState(false)
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<any>(null)
  const [rowData, setRowData] = useState<CommissionData[]>([])
  const [commissionGridData, setCommissionGridData] = useState<ReturnType[]>([])
  const [pivotData, setPivotData] = useState<PivotData[]>([])

  const router = useRouter()

  useEffect(() => {
    if (user !== null && user !== undefined) {
      setAuthUser(user)
      setAuthLoading(false)
      setAuthError(null)
    } else {
      setAuthUser(null)
      setAuthLoading(false)
      setAuthError(null)
    }
  }, [user])

  const isPhoneIn = useCallback(async () => {
    if (!phoneNumber) return false
    const checkDb = await fetch('/isPhoneIn', {
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

  const isAdmin = useCallback(() => {
    console.log('rendering isAdmin', user)
    if (!user) return false
    if (
      user.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_COLTON ||
      user.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_FRANK
    ) {
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
      return true
    } else {
      setTimeout(() => {
        router.push('/employee')
      }, 2000)
      return false
    }
  }, [user])

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
    // auth.signOut()
  }

  useEffect(() => {
    const setIsAdmin = async () => {
      const admin = await isAdmin()
      console.log('isAdmin: ', admin)
      if (admin) {
        await AllDataSync()
        await CommissionGridDataSync()
      }
      setValidAdmin(admin as boolean)
    }
    setIsAdmin()
  }, [isAdmin])

  const AllDataSync = async () => {
    const data = await fetch('/api/allData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
    setRowData(data as CommissionData[])
  }

  type PivotGrid = {
    commission_percent: number
    from_effective: string
    id: number
    manager: string
    manager_commission_percent: number
    organization: string
    salesperson: string
    to_effective: string
  }

  const CommissionGridDataSync = async () => {
    const data = await fetch('/api/commissionGridData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status !== 200) {
        console.log('error: ', res)
      }
      return res.json()
    })
    console.log('data: ', data)

    setCommissionGridData(data as ReturnType[])

    setPivotData(HandlePivotData(data as []))
  }

  const HandlePivotData = (commissionGrid: PivotGrid[]) => {
    const commissionView: PivotData[] = commissionGrid

      .filter((salesRow) => salesRow.salesperson && salesRow.salesperson !== null)
      .map((salesRow) => {
        const commissionRow = rowData.find((commissionRow) => {
          return commissionRow.salesperson === salesRow.salesperson
        })
        if (commissionRow === undefined || commissionRow === null) {
          return null // skip rows with missing data
        }
        const commissionAmount =
          commissionRow?.totalEmployee * salesRow.commission_percent
        const managerCommissionAmount =
          commissionRow?.totalEmployee * salesRow.manager_commission_percent

        console.log(
          'totalEmployee = salespersonCommission% * totalEmployee: ',
          commissionRow?.totalEmployee,
          salesRow.commission_percent,
          commissionAmount
        )
        console.log(
          'totalManager = salespersonCommission% * totalEmployee: ',
          commissionRow?.totalEmployee,
          salesRow.manager_commission_percent,
          managerCommissionAmount
        )
        return {
          totalManager: managerCommissionAmount,
          manager: salesRow.manager,
          salesperson: salesRow.salesperson,
          eventId: commissionRow.eventId,
          totalEmployee: commissionAmount,
          totalEvent: commissionRow.totalEvent,
          organization: commissionRow.organization,
          actionDate: commissionRow.actionDate,
        }
      })
      .filter((row) => row !== null)

    console.log('commissionView: ', commissionView)
    return commissionView
  }

  useEffect(() => {
    const setPhone = async () => {
      const phone = await isPhoneIn()
      setValidPhone(phone)
    }
    setPhone()
  }, [isPhoneIn])

  const contextValue = useMemo(
    () => ({
      authUser,
      authLoading,
      authError,
      phoneNumber,
      setPhoneNumber,
      validPhone,
      validAdmin,
      handleSignIn,
      handleSignOut,
      rowData,
      setRowData,
      commissionGridData,
      setCommissionGridData,
      pivotData,
      setPivotData,
    }),
    [
      authUser,
      authLoading,
      authError,
      phoneNumber,
      validPhone,
      validAdmin,
      handleSignIn,
      handleSignOut,
      isAdmin,
      isPhoneIn,
      setPhoneNumber,
      setValidPhone,
      setValidAdmin,
      setAuthUser,
      setAuthLoading,
      setAuthError,
      rowData,
      setRowData,
      commissionGridData,
      setCommissionGridData,
      pivotData,
      setPivotData,
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
