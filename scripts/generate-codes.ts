#!/usr/bin/env tsx

/**
 * Code Generation Script
 * 
 * This script generates access codes for the application.
 * Run with: npx tsx scripts/generate-codes.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generateCourseCode(cohort?: string): Promise<string> {
  const prefix = 'COURSE'
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${randomPart}`
}

async function main() {
  console.log('🔑 Access Code Generator')
  console.log('======================\n')
  
  try {
    // Generate course member codes
    const courseCodes = []
    
    console.log('📚 Generating Course Member Codes...')
    for (let i = 0; i < 5; i++) {
      const code = await generateCourseCode()
      const discountCode = await prisma.discountCode.create({
        data: {
          code,
          cohort: 'Course 2025',
          isActive: true,
        }
      })
      courseCodes.push(code)
    }
    
    console.log('\n✅ Generated Course Member Codes:')
    courseCodes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code}`)
    })
    
    // Display admin codes
    console.log('\n🔐 Admin Access Codes:')
    console.log('  1. ADMIN-MASTER-2025')
    console.log('  2. ADMIN-BYPASS-KEY')
    console.log('  3. Set ADMIN_MASTER_CODE env variable for custom code')
    
    console.log('\n📋 How to Access Tools Page:')
    console.log('  1. Course Members: Use one of the course codes above at /tools')
    console.log('  2. Admin Access: Use admin codes at /tools')
    console.log('  3. Regular Users: Sign up and upgrade to SAAS_SUBSCRIBER')
    console.log('  4. Discord Members: Login with Discord at /auth/signin')
    
    console.log('\n🚀 Usage Instructions:')
    console.log('  1. Go to /tools page')
    console.log('  2. Enter one of the codes above')
    console.log('  3. Click "Unlock Tools"')
    console.log('  4. Access all premium features!')
    
  } catch (error) {
    console.error('❌ Error generating codes:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)