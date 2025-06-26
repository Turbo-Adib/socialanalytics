import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        },
        expires: session.expires,
      } : null,
      timestamp: new Date().toISOString(),
      cookies: request.headers.get('cookie'),
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check session',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}