import * as admin from 'firebase-admin'
import type { CommissionData, FirebaseData } from '../../../../types/data'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const nextLocalId = (
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[],
  iterator: number
) => {
  const ids = docs.map((doc) => parseInt(doc.id))
  const max = Math.max(...ids)
  if (isNaN(max)) {
    return iterator + 1
  } else {
    return max + iterator + 1
  }
}

const handler = async (req: any, res: any) => {
  console.log('api: migrateOrgs')
  try {
    const db = admin.firestore()
    const orgCol = db.collection('organizations')
    const salespeopleCol = db.collection('salespeople')
    const dataCol = db.collection('commissions')
    const employeesCol = db.collection('employees')
    const data = await dataCol.get()
    const newCommissions = data.docs.map((doc) => doc.data()) as CommissionData[]
    const orgs = await orgCol.get()
    const salespeople = await salespeopleCol.get()
    const employees = await employeesCol.get()
    const orgsData = orgs.docs.map((doc) => {
      return doc.data().name
    })
    const salespeopleData = salespeople.docs.map((doc) => {
      return doc.data().name
    })
    const employeesData = employees.docs.map((doc) => {
      return doc.data().name
    })
    const filteredOrgs = newCommissions.map((commission) => commission.organization)
    const filteredSalespeople = newCommissions.map(
      (commission) => commission.salesperson
    )
    const filteredEmployees = newCommissions.map((commission) => commission.employee)

    const newOrgs: { id: string; name: string }[] = []
    const newSalespeople: { id: string; name: string }[] = []
    const newEmployees: { id: string; name: string }[] = []
    const uniqueOrgs = [...new Set(filteredOrgs)]
    const uniqueSalespeople = [...new Set(filteredSalespeople)]
    const uniqueEmployees = [...new Set(filteredEmployees)]
    const orgsIterator = nextLocalId(orgs.docs, 0)
    const salespeopleIterator = nextLocalId(salespeople.docs, 0)
    const employeesIterator = nextLocalId(employees.docs, 0)
    const orgsBatch = db.batch()
    const salespeopleBatch = db.batch()
    const employeesBatch = db.batch()

    orgsData.forEach((org, index) => {
      if (uniqueOrgs.includes(org)) {
        uniqueOrgs.splice(uniqueOrgs.indexOf(org), 1)
      }
    })
    salespeopleData.forEach((salesperson, index) => {
      if (uniqueSalespeople.includes(salesperson)) {
        uniqueSalespeople.splice(uniqueSalespeople.indexOf(salesperson), 1)
      }
    })
    employeesData.forEach((employee, index) => {
      if (uniqueEmployees.includes(employee)) {
        uniqueEmployees.splice(uniqueEmployees.indexOf(employee), 1)
      }
    })

    uniqueOrgs.forEach((org, index) => {
      newOrgs.push({ id: (orgsIterator + index).toString(), name: org })
    })
    uniqueSalespeople.forEach((salesperson, index) => {
      newSalespeople.push({
        id: (salespeopleIterator + index).toString(),
        name: salesperson,
      })
    })
    uniqueEmployees.forEach((employee, index) => {
      newEmployees.push({
        id: (employeesIterator + index).toString(),
        name: employee,
      })
    })

    newOrgs.forEach((org, index) => {
      if (!org.id || !org.name) return
      orgsBatch.set(orgCol.doc((orgsIterator + index).toString()), org)
    })
    newSalespeople.forEach((salesperson, index) => {
      if (!salesperson.id || !salesperson.name) return
      salespeopleBatch.set(
        salespeopleCol.doc((salespeopleIterator + index).toString()),
        salesperson
      )
    })
    newEmployees.forEach((employee, index) => {
      if (!employee.id || !employee.name) return
      employeesBatch.set(
        employeesCol.doc((employeesIterator + index).toString()),
        employee
      )
    })
    await employeesBatch.commit()
    await orgsBatch.commit()
    await salespeopleBatch.commit()
    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    console.log('error', error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
