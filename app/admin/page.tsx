'use client'

import Navbar from 'components/navbar/Navbar'
import { PivotGrid } from 'components/pivotGrid/PivotGrid'
import { PivotTotals } from 'components/pivotTotals/PivotTotals'
import { CommissionGrid } from 'components/commissionGrid/CommissionGrid'
import { AddNewEmployee } from 'components/addNewEmployee/AddNewEmployee'
import { AllDataGrid } from 'components/allDataGrid/AllDataGrid'
import { ImportCSVButton } from 'components/csvImport/ImportCSVButton'
import { useLocalContext } from 'components/context/LocalContext'

export default function Admin() {
  const { visibleComponents } = useLocalContext()
  console.log('rendering Admin', new Date().toLocaleTimeString())

  return (
    <>
      Admin
      <Navbar />
      {visibleComponents.ImportCSVButton && <ImportCSVButton />}
      {visibleComponents.PivotTotals && <PivotTotals />}
      {visibleComponents.AddNewEmployee && <AddNewEmployee />}
      {visibleComponents.CommissionGrid && <CommissionGrid />}
      {visibleComponents.PivotGrid && <PivotGrid />}
      {visibleComponents.Grid && <AllDataGrid />}
    </>
  )
}
