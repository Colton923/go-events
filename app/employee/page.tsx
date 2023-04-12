import EmployeeGrid from 'components/employeeGrid/EmployeeGrid'

export default function Employee() {
  console.log('rendering Employee', new Date().toLocaleTimeString())

  return (
    <div>
      <EmployeeGrid />
    </div>
  )
}
