import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('server: amIAdmin')
  //@ts-ignore
  const { uid } = req.body

  try {
    if (
      uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_COLTON ||
      uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_FRANK
    ) {
      return new Response(JSON.stringify({ isAdmin: true }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } else {
      return new Response(JSON.stringify({ isAdmin: false }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error: any) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
