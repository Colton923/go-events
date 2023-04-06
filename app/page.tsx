'use client'

import Login from '../components/login/Login'
export default function Index() {
  console.log('rendering index', new Date().toLocaleTimeString())
  return <Login />
}
