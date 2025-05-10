import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt')?.value

  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new NextResponse(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
} 