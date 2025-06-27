import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { checkDiscordMembership } from '@/lib/discord'

export async function GET(request: Request) {
  // Verify this is a legitimate cron request (you can add additional security here)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all users with Discord IDs who are course members
    const discordUsers = await prisma.user.findMany({
      where: {
        discordId: { not: null },
        role: UserRole.COURSE_MEMBER
      },
      include: {
        accounts: {
          where: {
            provider: 'discord'
          }
        }
      }
    })

    const guildId = process.env.DISCORD_GUILD_ID
    const courseRoleId = process.env.DISCORD_COURSE_ROLE_ID

    if (!guildId) {
      return NextResponse.json({ error: 'Discord guild ID not configured' }, { status: 500 })
    }

    let updated = 0
    let revoked = 0
    
    // Check each user's membership status
    for (const user of discordUsers) {
      const discordAccount = user.accounts[0]
      
      if (!discordAccount?.access_token) {
        continue
      }

      try {
        // Check if they're still in the Discord server with the right role
        const isMember = await checkDiscordMembership(
          discordAccount.access_token,
          guildId,
          courseRoleId
        )

        if (!isMember) {
          // Revoke course access
          await prisma.user.update({
            where: { id: user.id },
            data: {
              role: UserRole.FREE_TRIAL,
              lastDiscordCheck: new Date()
            }
          })
          
          // Log the revocation
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'DISCORD_ACCESS_REVOKED',
              details: 'User no longer has course Discord role',
              metadata: {
                previousRole: UserRole.COURSE_MEMBER,
                newRole: UserRole.FREE_TRIAL
              }
            }
          })
          
          revoked++
        } else {
          // Update last check time
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastDiscordCheck: new Date()
            }
          })
          
          updated++
        }
      } catch (error) {
        console.error(`Error checking Discord membership for user ${user.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Verified ${updated + revoked} Discord users`,
      stats: {
        checked: discordUsers.length,
        maintained: updated,
        revoked: revoked
      }
    })
  } catch (error) {
    console.error('Discord verification cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Allow manual trigger with proper authentication
  return GET(request)
}