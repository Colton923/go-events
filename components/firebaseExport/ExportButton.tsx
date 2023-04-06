import styles from '../../styles/App.module.scss'

export const ExportButton = () => {
  return (
    <div className={styles.buttonWrapper}>
      <input
        className={styles.input}
        type="button"
        value="Submit to Database"
        // onClick={handleSubmitToDatabase}
        // disabled={isDisabled}
      />
    </div>
  )
}
