import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('api: amIAdmin')

  const { uid } = req.body
  try {
    if (
      uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_COLTON ||
      uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_FRANK
    ) {
      res.status(200).json({ isAdmin: true })
    } else {
      res.status(200).json({ isAdmin: false })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
