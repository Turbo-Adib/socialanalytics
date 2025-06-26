import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    // Clean the code (uppercase, remove spaces)
    const cleanCode = code.trim().toUpperCase();

    // Check if it's an admin access code
    if (cleanCode.startsWith('ADMIN-')) {
      // Special admin access logic
      const validAdminCodes = [
        'ADMIN-MASTER-2025',
        'ADMIN-BYPASS-KEY',
        process.env.ADMIN_MASTER_CODE // From environment variable
      ].filter(Boolean);

      if (validAdminCodes.includes(cleanCode)) {
        // Create or update admin user
        const adminUser = await prisma.user.upsert({
          where: { email: 'admin@insightsync.io' },
          update: {
            role: UserRole.SAAS_SUBSCRIBER, // Full access
          },
          create: {
            email: 'admin@insightsync.io',
            name: 'Admin User',
            role: UserRole.SAAS_SUBSCRIBER,
            password: null, // No password needed for code-based auth
          },
        });

        // Return success with special admin token
        return NextResponse.json({
          success: true,
          message: 'Admin access granted',
          adminToken: cleanCode,
          redirectUrl: '/tools',
        });
      }
    }

    // Check for course member codes
    const discountCode = await prisma.discountCode.findFirst({
      where: {
        code: cleanCode,
        isActive: true,
        usedBy: null, // Not yet used
      },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Get current session
    const session = await getServerSession(authOptions);

    if (session?.user) {
      // Authenticated user - update their role
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: UserRole.COURSE_MEMBER,
        },
      });

      // Mark code as used
      await prisma.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedBy: session.user.id,
          usedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Course access activated! Refreshing...',
      });
    } else {
      // Unauthenticated user - create account with code
      const tempEmail = `course_${cleanCode.toLowerCase()}@temp.insightsync.io`;
      
      // Create new user with course member role
      const newUser = await prisma.user.create({
        data: {
          email: tempEmail,
          name: `Course Member (${discountCode.cohort || 'General'})`,
          role: UserRole.COURSE_MEMBER,
          password: null, // No password for code-based users
        },
      });

      // Mark code as used
      await prisma.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedBy: newUser.id,
          usedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Course access activated!',
        tempEmail: tempEmail,
        requiresAuth: true,
      });
    }
  } catch (error) {
    console.error('Code redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem code' },
      { status: 500 }
    );
  }
}

// GET endpoint to check code validity
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check admin codes
    if (cleanCode.startsWith('ADMIN-')) {
      const validAdminCodes = [
        'ADMIN-MASTER-2025',
        'ADMIN-BYPASS-KEY',
        process.env.ADMIN_MASTER_CODE
      ].filter(Boolean);

      return NextResponse.json({
        valid: validAdminCodes.includes(cleanCode),
        type: 'admin',
      });
    }

    // Check course codes
    const discountCode = await prisma.discountCode.findFirst({
      where: {
        code: cleanCode,
        isActive: true,
        usedBy: null,
      },
    });

    return NextResponse.json({
      valid: !!discountCode,
      type: 'course',
      cohort: discountCode?.cohort,
    });
  } catch (error) {
    console.error('Code validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}