import styles from 'styles/App.module.scss'
import { useLocalContext } from 'components/context/LocalContext'
import { useFirebaseContext } from 'components/context/FirebaseContext'

const Navbar = () => {
  const { visibleComponents, setVisibleComponents } = useLocalContext()
  const { handleSignOut } = useFirebaseContext()
  const ChangeVisibleComponent = (component: string) => {
    const newVisibleComponents = { ...visibleComponents }
    newVisibleComponents[component] = !newVisibleComponents[component]
    setVisibleComponents(newVisibleComponents)
  }

  return (
    <div className={styles.menuCard}>
      <h1 className={styles.header}>Menu</h1>
      <div className={styles.buttonWrapper}>
        <input
          type="button"
          value="Add New Employee"
          onClick={() => ChangeVisibleComponent('AddNewEmployee')}
          className={styles.input}
        />
        <input
          type="button"
          value="Commission Table"
          onClick={() => ChangeVisibleComponent('CommissionGrid')}
          className={styles.input}
        />
        <input
          type="button"
          value="CSV Import"
          onClick={() => ChangeVisibleComponent('ImportCSVButton')}
          className={styles.input}
        />
        <input
          type="button"
          value="Main Table"
          onClick={() => {
            ChangeVisibleComponent('Grid')
          }}
          className={styles.input}
        />
        <input
          type="button"
          value="Pivoted Table"
          onClick={() => ChangeVisibleComponent('PivotGrid')}
          className={styles.input}
        />
        <input
          type="button"
          value="Pivot Totals"
          onClick={() => ChangeVisibleComponent('PivotTotals')}
          className={styles.input}
        />
        <div>
          <input
            type="button"
            className={styles.input}
            onClick={() => {
              handleSignOut()
              window.location.reload()
            }}
            value={'Sign Out'}
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar
