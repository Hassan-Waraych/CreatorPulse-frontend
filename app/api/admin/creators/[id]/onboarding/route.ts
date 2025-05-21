import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/creators/${params.id}/onboarding`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${request.headers.get('Authorization')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update creator onboarding status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in creator onboarding update API route:', error);
    return NextResponse.json({ error: 'Failed to update creator onboarding status' }, { status: 500 });
  }
} 