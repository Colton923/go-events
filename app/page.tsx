'use client'
import { parse } from 'csv-parse'
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from 'react'
import { render } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../firebase/firebaseClient'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export default function Index() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [user] = useAuthState(auth)
  const [screenWidth, setScreenWidth] = useState(0)
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [filename, setFilename] = useState('')
  const [json, setJson] = useState([
    {
      client: '',
      organization: '',
      id: '',
      date: '',
      employee: '',
      status: '',
      salesperson: '',
      actionDate: '',
      nextAction: '',
      totalFee: '',
      totalEmployee: '',
      totalEvent: '',
    },
  ])
  const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Client Name', field: 'client' },
    { headerName: 'Organization / Company', field: 'organization' },
    { headerName: 'Event ID', field: 'id' },
    { headerName: 'Event Date', field: 'date' },
    { headerName: 'Assigned Employee', field: 'employee' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Salesperson', field: 'salesperson' },
    { headerName: 'Action Date', field: 'actionDate' },
    { headerName: 'Next Action', field: 'nextAction' },
    { headerName: 'Total Fee', field: 'totalFee' },
    { headerName: 'Employee Wage Total', field: 'totalEmployee' },
    { headerName: 'Event Net Profit', field: 'totalEvent' },
  ])
  const [allUserPhoneNumbers, setAllUserPhoneNumbers] = useState<string[]>([])

  const gridRef = useRef()
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
    }),
    []
  )

  const cellClickedListener = useCallback((e: any) => {
    console.log(e)
  }, [])

  const csvDataToJSON = (data: any[]) => {
    const json = data.map((item) => {
      return {
        client: item['Client Name'],
        organization: item['Organization / Company'],
        id: item['Event ID'],
        date: item['Event Date'],
        employee: item['Assigned Employee'],
        status: item['Status'],
        salesperson: item['Salesperson'],
        actionDate: item['Action Date'],
        nextAction: item['Next Action'],
        totalFee: item['Total Fee'],
        totalEmployee: item['Employee Wage Total'],
        totalEvent: item['Event Net Profit'],
      }
    })
    json.shift()
    return json
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    setFilename(file.name.split('.').slice(0, -1).join('.'))
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target) return
      const text = e.target.result
      parse(
        text as string,
        {
          columns: [
            'Client Name',
            'Organization / Company',
            'Event ID',
            'Event Date',
            'Assigned Employee',
            'Status',
            'Salesperson',
            'Action Date',
            'Next Action',
            'Total Fee',
            'Employee Wage Total',
            'Event Net Profit',
          ],
        },
        (err, data) => {
          const json = csvDataToJSON(data)
          setJson(json)
        }
      )
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    if (allUserPhoneNumbers.length === 0) {
      getAllUserPhoneNumbers()
    }
    if (json.length > 1) {
      setAllowSubmit(true)
    } else {
      setAllowSubmit(false)
    }
  }, [])

  const getAllUserPhoneNumbers = async () => {
    fetch('/api/firebase/get/firebasePhoneNumbers')
      .then((res) => res.json())
      .then((data) => {
        setAllUserPhoneNumbers(data)
      })
  }

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleScreenResize)
    handleScreenResize()
    return () => window.removeEventListener('resize', handleScreenResize)
  }, [])

  const handleSubmitToDatabase = () => {
    if (!user) {
      alert('You must be logged in to submit data')
    }
    const dataCol = collection(db, 'data')
    const uploadDateTime = new Date().toISOString()
    const data = {
      filename,
      uploadDateTime,
      data: json,
      user: user?.uid,
    }
    const addData = async () => {
      try {
        await addDoc(dataCol, data)
        alert('Data uploaded successfully')
      } catch (e) {
        alert('Error uploading data')
        console.log(e)
      }
    }
    addData()
  }

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
          const code = prompt('Enter the code')
          if (code) {
            confirmationResult
              .confirm(code)
              .then((result) => {
                alert('Success')
              })
              .catch((error) => {
                alert('Error')
                console.log(error)
              })
          }
        }
      )
    } else {
      alert('Phone number not found')
    }
  }

  const handleFirebaseData = () => {
    try {
      const dataForGrid: any[] = []
      const dataCol = collection(db, 'data')
      const querySnapshot = getDocs(dataCol)
      querySnapshot
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const dataset = doc.data().data
            dataset.forEach((item: any) => {
              dataForGrid.push(item)
            })
          })
        })
        .then(() => {
          setJson(dataForGrid)
        })
    } catch (e) {
      alert('Error getting data from database')
    }
  }

  //use Effect to change ag grid data when json changes
  useEffect(() => {
    if (json.length > 0) {
      //@ts-ignore
      setRowData(json)
      setFilename('')
      console.log('changing row data')
    }
  }, [json])

  if (!user)
    return (
      <div>
        <div id="recaptcha-container"></div>
        <h1>Please Sign In</h1>
        <input
          type="text"
          id="phone"
          placeholder="###-###-####"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input type="button" value="Sign In" onClick={handleSignIn} />
      </div>
    )
  return (
    <div>
      <h1>Welcome Back User#{user?.uid}</h1>
      <h1>CSV Only</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      <h2>File Name: {filename}</h2>
      <h2>CSV Data</h2>
      <h2>Grid</h2>
      <input
        type="button"
        value="Submit to Database"
        onClick={handleSubmitToDatabase}
      />
      <input type="button" value="View Firebase Data" onClick={handleFirebaseData} />
      <div className="ag-theme-alpine" style={{ height: 400, width: screenWidth }}>
        <AgGridReact
          gridOptions={{ rowHeight: 30, headerHeight: 30 }}
          columnDefs={columnDefs}
          rowData={rowData}
        />
      </div>
    </div>
  )
}
