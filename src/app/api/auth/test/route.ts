import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  return NextResponse.json({
    authenticated: !!session,
    session: session ? {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
    } : null,
    timestamp: new Date().toISOString(),
  });
}