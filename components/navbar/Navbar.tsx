'use client'

import styles from '../../styles/App.module.css'
import { NavbarProps } from '../../types/props'
import { auth } from '../../firebase/firebaseClient'

export const Navbar = (props: NavbarProps) => {
  if (!props.user || props.authUser === null) {
    return null
  }
  return (
    <div className={styles.menuCard}>
      <h1 className={styles.header}>Menu</h1>
      <div className={styles.buttonWrapper}>
        <input
          type="button"
          value="Add New Employee"
          onClick={() => props.setShowAddNewEmployee(!props.showAddNewEmployee)}
          className={styles.input}
        />
        <input
          type="button"
          value="Commission Grid"
          onClick={() => props.setShowCommissionGrid(!props.showCommissionGrid)}
          className={styles.input}
        />
        <input
          type="button"
          value="CSV Import"
          onClick={() => props.setShowCSVImport(!props.showCSVImport)}
          className={styles.input}
        />
        <input
          type="button"
          value="Firebase Import"
          onClick={() => {
            props.setShowFirebaseGrid(!props.showFirebaseGrid)
            props.setShowFirebaseImport(!props.showFirebaseImport)
          }}
          className={styles.input}
        />
        {/* <input
          type="button"
          value="Date Filter"
          onClick={() => props.setShowDateFilter(!props.showDateFilter)}
          className={styles.input}
        /> */}
        <input
          type="button"
          value="Pivot"
          onClick={() => props.setShowPivot(!props.showPivot)}
          className={styles.input}
        />
        <input
          type="button"
          value="Pivot Totals"
          onClick={() => props.setShowPivotTotals(!props.showPivotTotals)}
          className={styles.input}
        />
        <div>
          <input
            type="button"
            className={styles.input}
            onClick={() => {
              props.setShowAddNewEmployee(false)
              props.setShowCommissionGrid(false)
              props.setShowCSVImport(false)
              props.setShowFirebaseGrid(false)
              props.setShowFirebaseImport(false)
              props.setShowPivot(false)
              props.setShowPivotTotals(false)
              auth.signOut()
            }}
            value={'Sign Out'}
          />
        </div>
      </div>
    </div>
  )
}
