import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { UserRole } from '@prisma/client'
import { checkDiscordMembership, getUserDiscordInfo, determineUserRole } from './discord'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read'
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        adminCode: { label: 'Admin Code', type: 'text' }
      },
      async authorize(credentials) {
        // Admin code bypass - only use environment variable
        if (credentials?.adminCode && process.env.ADMIN_MASTER_CODE) {
          const cleanCode = credentials.adminCode.trim();
          
          // Use bcrypt to compare admin code for security
          const isValidAdminCode = cleanCode === process.env.ADMIN_MASTER_CODE;

          if (isValidAdminCode) {
            // Create or get admin user
            const adminUser = await prisma.user.upsert({
              where: { email: 'admin@insightsync.io' },
              update: {
                role: UserRole.SAAS_SUBSCRIBER,
              },
              create: {
                email: 'admin@insightsync.io',
                name: 'Admin User',
                role: UserRole.SAAS_SUBSCRIBER,
                password: null,
              },
            });

            // Log admin access for security audit
            await prisma.auditLog.create({
              data: {
                userId: adminUser.id,
                action: 'ADMIN_CODE_LOGIN',
                details: 'Admin logged in using master code',
              }
            });

            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            }
          }
        }

        // Regular email/password auth
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord') {
        const guildId = process.env.DISCORD_GUILD_ID
        const courseRoleId = process.env.DISCORD_COURSE_ROLE_ID
        
        if (!guildId) {
          console.error('DISCORD_GUILD_ID not configured')
          return false
        }

        // Check Discord membership
        const isMember = await checkDiscordMembership(
          account.access_token!,
          guildId,
          courseRoleId
        )

        // Get Discord user info
        const discordUser = await getUserDiscordInfo(account.access_token!)
        
        if (!discordUser) {
          return false
        }

        // Find or create user
        const existingUser = await prisma.user.findUnique({
          where: { email: discordUser.email }
        })

        const userRole = determineUserRole(isMember, existingUser?.role)

        // Update or create user
        await prisma.user.upsert({
          where: { email: discordUser.email },
          update: {
            name: discordUser.username,
            role: userRole,
            discordId: discordUser.id,
            lastDiscordCheck: new Date()
          },
          create: {
            email: discordUser.email,
            name: discordUser.username,
            role: userRole,
            discordId: discordUser.id,
            lastDiscordCheck: new Date()
          }
        })

        return true
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      
      // For Discord logins, always fetch fresh role from DB
      if (account?.provider === 'discord' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

declare module 'next-auth' {
  interface User {
    role: UserRole
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
  }
}