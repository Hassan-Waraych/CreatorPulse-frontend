import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Forward all query parameters
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/creators?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${request.headers.get('Authorization')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch creators');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in creators API route:', error);
    return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 });
  }
} 