'use client'

const Migration = () => {
  const HandleMigration = () => {
    fetch('/api/firebase/updateDB')
  }

  return <button onClick={HandleMigration}>Migrate</button>
}

export default Migration
