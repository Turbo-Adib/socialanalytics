import { UserRole } from '@prisma/client'

interface DiscordGuildMember {
  user: {
    id: string
    username: string
    discriminator: string
  }
  roles: string[]
  joined_at: string
}

export async function checkDiscordMembership(
  accessToken: string,
  guildId: string,
  requiredRoleId?: string
): Promise<boolean> {
  try {
    // Get user's guilds
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!guildsResponse.ok) {
      console.error('Failed to fetch Discord guilds:', guildsResponse.statusText)
      return false
    }

    const guilds = await guildsResponse.json()
    
    // Check if user is in the specific guild
    const isInGuild = guilds.some((guild: any) => guild.id === guildId)
    
    if (!isInGuild) {
      return false
    }

    // If we need to check for a specific role
    if (requiredRoleId) {
      const memberResponse = await fetch(
        `https://discord.com/api/users/@me/guilds/${guildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!memberResponse.ok) {
        console.error('Failed to fetch member info:', memberResponse.statusText)
        return false
      }

      const member: DiscordGuildMember = await memberResponse.json()
      return member.roles.includes(requiredRoleId)
    }

    return true
  } catch (error) {
    console.error('Error checking Discord membership:', error)
    return false
  }
}

export async function getUserDiscordInfo(accessToken: string) {
  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user info')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Discord user info:', error)
    return null
  }
}

export function determineUserRole(isCourseMember: boolean, currentRole?: UserRole): UserRole {
  if (isCourseMember) {
    return UserRole.COURSE_MEMBER
  }
  
  // If not a course member but has existing role, keep it
  if (currentRole && currentRole !== UserRole.COURSE_MEMBER) {
    return currentRole
  }
  
  // Default to free trial
  return UserRole.FREE_TRIAL
}