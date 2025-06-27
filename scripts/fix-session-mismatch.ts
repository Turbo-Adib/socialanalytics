import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSessionMismatch() {
  try {
    // Find all users
    const users = await prisma.user.findMany()
    
    console.log('Current users in database:')
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`)
    })
    
    // Check for duplicate emails
    const emailMap = new Map<string, string[]>()
    users.forEach(user => {
      if (!emailMap.has(user.email)) {
        emailMap.set(user.email, [])
      }
      emailMap.get(user.email)!.push(user.id)
    })
    
    // Find duplicates
    const duplicates = Array.from(emailMap.entries()).filter(([_, ids]) => ids.length > 1)
    
    if (duplicates.length > 0) {
      console.log('\nFound duplicate emails:')
      duplicates.forEach(([email, ids]) => {
        console.log(`- Email: ${email}, IDs: ${ids.join(', ')}`)
      })
    } else {
      console.log('\nNo duplicate emails found.')
    }
    
    // Clear all sessions to force re-authentication
    console.log('\nClearing all sessions to force re-authentication...')
    await prisma.session.deleteMany()
    console.log('All sessions cleared. Users will need to sign in again.')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixSessionMismatch()