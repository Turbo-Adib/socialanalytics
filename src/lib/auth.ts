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
        try {
          // SIMPLIFIED ADMIN BYPASS - JUST MAKE IT WORK
          if (credentials?.adminCode && credentials.adminCode === 'admin123') {
            console.log('Admin code login attempt with code:', credentials.adminCode);
            
            // Create or get admin user
            const adminUser = await prisma.user.upsert({
              where: { email: 'admin@beta.test' },
              update: {
                role: UserRole.COURSE_MEMBER,
              },
              create: {
                email: 'admin@beta.test',
                name: 'Admin User',
                role: UserRole.COURSE_MEMBER,
                password: await bcrypt.hash('betaadmin123', 10),
              },
            });

            console.log('Admin user created/found:', adminUser.email);

            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            }
          }
        } catch (error) {
          console.error('Admin login error:', error);
          // Continue to regular auth flow
        }

        // Regular email/password auth
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // SIMPLE HARDCODED ADMIN ACCESS
        if (credentials.email === 'admin@beta.test' && credentials.password === 'betaadmin123') {
          console.log('Admin email login attempt');
          
          try {
            // Create or get admin user
            const adminUser = await prisma.user.upsert({
              where: { email: 'admin@beta.test' },
              update: {
                role: UserRole.COURSE_MEMBER,
              },
              create: {
                email: 'admin@beta.test',
                name: 'Beta Admin',
                role: UserRole.COURSE_MEMBER,
                password: await bcrypt.hash('betaadmin123', 10),
              },
            });

            console.log('Admin user created/found via email:', adminUser.email);

            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            }
          } catch (error) {
            console.error('Admin email login error:', error);
            return null;
          }
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