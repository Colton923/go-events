import styles from 'styles/App.module.scss'

export const PivotTotals = () => {
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Totals</h1>
      <div className={styles.buttonWrapper}>
        <input
          type="button"
          value="Refresh"
          // onClick={handlePivotTotals}
          className={styles.input}
        />
      </div>
      {/* {pivotTotals
        ? pivotTotals.map((row, index) => {
            return (
              <div key={index} className={styles.totalsGrid}>
                <h1 className={styles.subHeader}>{row.salesperson}</h1>
                <h1 className={styles.subHeader}>
                  ${FixDecimalNumberToCurrency(row.totalEmployee)}
                </h1>
              </div>
            )
          })
        : null} */}
    </div>
  )
}
