'use client'

const Migration = () => {
  const HandleMigration = () => {
    fetch('/api/firebase/get/updateDB')
  }

  return <button onClick={HandleMigration}>Migrate</button>
}

export default Migration
