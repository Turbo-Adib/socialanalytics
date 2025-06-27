import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkDiscordMembership } from '@/lib/discord'
import { UserRole } from '@prisma/client'

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user with Discord account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          where: {
            provider: 'discord'
          }
        }
      }
    })

    if (!user?.discordId || !user.accounts[0]?.access_token) {
      return NextResponse.json({ error: 'No Discord account linked' }, { status: 400 })
    }

    const guildId = process.env.DISCORD_GUILD_ID
    const courseRoleId = process.env.DISCORD_COURSE_ROLE_ID

    if (!guildId) {
      return NextResponse.json({ error: 'Discord configuration missing' }, { status: 500 })
    }

    // Check membership
    const isMember = await checkDiscordMembership(
      user.accounts[0].access_token,
      guildId,
      courseRoleId
    )

    // Update user role based on membership
    const newRole = isMember ? UserRole.COURSE_MEMBER : UserRole.FREE_TRIAL
    
    if (user.role !== newRole) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: newRole,
          lastDiscordCheck: new Date()
        }
      })

      // Log the change
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: isMember ? 'DISCORD_ACCESS_GRANTED' : 'DISCORD_ACCESS_REVOKED',
          details: `Discord membership verification: ${isMember ? 'granted' : 'revoked'} access`,
          metadata: {
            previousRole: user.role,
            newRole: newRole
          }
        }
      })
    } else {
      // Just update the check time
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastDiscordCheck: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      isMember,
      role: newRole,
      message: isMember 
        ? 'Discord membership verified - course access granted' 
        : 'Not a member of the course Discord server'
    })
  } catch (error) {
    console.error('Discord verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify Discord membership' },
      { status: 500 }
    )
  }
}