import styles from '../../styles/App.module.css'
import { useState } from 'react'
import type { PivotCommissionTotals } from '../../types/data'
import { PivotTotalsProps } from '../../types/props'

export const PivotTotals = (props: PivotTotalsProps) => {
  const [pivotTotals, setPivotTotals] = useState<PivotCommissionTotals[]>([])

  const handlePivotTotals = () => {
    if (props.pivotData.length > 0) {
      const uniqueSalespeople = [
        ...new Set(props.pivotData.map((row) => row.salesperson)),
      ]
      const tempPivotTotals: PivotCommissionTotals[] = []
      uniqueSalespeople.forEach((salesperson) => {
        tempPivotTotals.push({
          salesperson: salesperson,
          totalEmployee: 0,
        })
      })
      props.pivotData.forEach((row) => {
        const index = tempPivotTotals.findIndex(
          (item) => item.salesperson === row.salesperson
        )
        tempPivotTotals[index].totalEmployee += row.totalEmployee
        tempPivotTotals[index].totalEmployee =
          Math.round(tempPivotTotals[index].totalEmployee * 100) / 100
      })
      setPivotTotals(tempPivotTotals)
    }
  }

  const FixDecimalNumberToCurrency = (number: number) => {
    const fixedNumber = number.toFixed(2)
    const numberWithCommas = fixedNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    return numberWithCommas
  }

  if (!props.activeComponent) {
    return null
  }
  return (
    <div className={styles.cardWrapper}>
      <h1 className={styles.header}>Totals</h1>
      <div className={styles.buttonWrapper}>
        <input
          type="button"
          value="Refresh"
          onClick={handlePivotTotals}
          className={styles.input}
        />
      </div>
      {pivotTotals
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
        : null}
    </div>
  )
}
