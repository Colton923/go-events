import styles from '../../styles/App.module.css'
import { NavbarProps } from '../../types/props'

export const Navbar = (props: NavbarProps) => {
  if (!props.user) {
    return null
  }
  return (
    <div className={styles.menuCard}>
      <h1 className={styles.header}>Menu</h1>
      <div className={styles.buttonWrapper}>
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
        <input
          type="button"
          value="Date Filter"
          onClick={() => props.setShowDateFilter(!props.showDateFilter)}
          className={styles.input}
        />
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
      </div>
    </div>
  )
}
