'use client'

import { LocalContextProvider } from 'components/context/LocalContext'
import { FirebaseContextProvider } from 'components/context/FirebaseContext'

interface Props {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  return (
    <LocalContextProvider>
      <FirebaseContextProvider>{children}</FirebaseContextProvider>
    </LocalContextProvider>
  )
}
