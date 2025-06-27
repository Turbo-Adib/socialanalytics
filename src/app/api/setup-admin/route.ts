import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);

    // Create or update admin user
    const hashedPassword = await bcrypt.hash('betaadmin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@beta.test' },
      update: {
        role: UserRole.COURSE_MEMBER,
        password: hashedPassword,
      },
      create: {
        email: 'admin@beta.test',
        name: 'Beta Admin',
        role: UserRole.COURSE_MEMBER,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user setup complete',
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
      totalUsers: userCount + 1,
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}