import Navbar from 'components/navbar/Navbar'
import { PivotGrid } from 'components/pivotGrid/PivotGrid'
import { PivotTotals } from 'components/pivotTotals/PivotTotals'
import { CommissionGrid } from 'components/commissionGrid/CommissionGrid'
import { AddNewEmployee } from 'components/addNewEmployee/AddNewEmployee'
import { GridContextProvider } from 'components/newGrid/GridContext'
import { AllDataGrid } from 'components/allDataGrid/AllDataGrid'
import { ImportCSVButton } from 'components/csvImport/ImportCSVButton'

export default function Admin() {
  console.log('rendering Admin', new Date().toLocaleTimeString())

  return (
    <div>
      Admin
      <Navbar />
      <ImportCSVButton />
      <PivotTotals />
      <AddNewEmployee />
      <GridContextProvider>
        <CommissionGrid />
      </GridContextProvider>
      <GridContextProvider>
        <PivotGrid />
      </GridContextProvider>
      <GridContextProvider>
        <AllDataGrid />
      </GridContextProvider>
    </div>
  )
}
