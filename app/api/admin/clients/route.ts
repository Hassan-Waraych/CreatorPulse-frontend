import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/clients`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in clients API route:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
} 