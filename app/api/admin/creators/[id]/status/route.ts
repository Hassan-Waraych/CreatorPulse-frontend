import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/creators/${params.id}/status`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch creator status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in creator status API route:', error);
    return NextResponse.json({ error: 'Failed to fetch creator status' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/creators/${params.id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update creator status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in creator status update API route:', error);
    return NextResponse.json({ error: 'Failed to update creator status' }, { status: 500 });
  }
} 