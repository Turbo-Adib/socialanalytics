#!/usr/bin/env tsx

/**
 * Admin Setup Script
 * 
 * This script helps set up initial admin users for the application.
 * Run with: npx tsx scripts/setup-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('🔧 Admin Setup Script')
  console.log('===================\n')
  
  try {
    // Check if any admin users already exist
    const existingAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, name: true }
    })
    
    if (existingAdmins.length > 0) {
      console.log('📋 Existing admin users:')
      existingAdmins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.email} (${admin.name || 'No name'})`)
      })
      console.log('')
      
      const continueSetup = await question('Do you want to add another admin user? (y/n): ')
      if (continueSetup.toLowerCase() !== 'y') {
        console.log('Setup cancelled.')
        return
      }
    }
    
    // Get admin user details
    const email = await question('Enter admin email: ')
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address')
    }
    
    const name = await question('Enter admin name (optional): ')
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log(`\n📝 User ${email} already exists.`)
      if (existingUser.role === 'ADMIN') {
        console.log('User is already an admin.')
        return
      }
      
      const promoteUser = await question('Promote existing user to admin? (y/n): ')
      if (promoteUser.toLowerCase() !== 'y') {
        console.log('Setup cancelled.')
        return
      }
      
      // Promote existing user
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
      
      // Log the promotion
      await prisma.auditLog.create({
        data: {
          userId: existingUser.id,
          userEmail: email,
          action: 'user_promoted_to_admin_via_script',
          resource: existingUser.id,
          details: JSON.stringify({
            previousRole: existingUser.role,
            promotedViaScript: true
          }),
          ipAddress: 'localhost',
          userAgent: 'admin-setup-script',
          severity: 'critical'
        }
      })
      
      console.log(`✅ Successfully promoted ${email} to admin role.`)
    } else {
      // Create new admin user
      const password = await question('Enter password (optional, for credentials login): ')
      const hashedPassword = password ? createHash('sha256').update(password).digest('hex') : undefined
      
      const newUser = await prisma.user.create({
        data: {
          email,
          name: name || undefined,
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(), // Auto-verify admin users
        }
      })
      
      // Log the creation
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          userEmail: email,
          action: 'admin_user_created_via_script',
          resource: newUser.id,
          details: JSON.stringify({
            createdViaScript: true,
            hasPassword: !!password
          }),
          ipAddress: 'localhost',
          userAgent: 'admin-setup-script',
          severity: 'critical'
        }
      })
      
      console.log(`✅ Successfully created admin user: ${email}`)
    }
    
    // Display current admin users
    const allAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, name: true, createdAt: true }
    })
    
    console.log('\n📋 Current admin users:')
    allAdmins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.email} (${admin.name || 'No name'}) - Created: ${admin.createdAt.toISOString().split('T')[0]}`)
    })
    
    console.log('\n🎉 Admin setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. The admin user can now access /api/admin/* endpoints')
    console.log('2. All admin actions will be logged in the audit_logs table')
    console.log('3. Consider setting up proper authentication (OAuth) for production')
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n⏹️  Setup interrupted.')
  await prisma.$disconnect()
  rl.close()
  process.exit(0)
})

main().catch(console.error)