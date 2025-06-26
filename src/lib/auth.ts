import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        adminCode: { label: 'Admin Code', type: 'text' }
      },
      async authorize(credentials) {
        // Admin code bypass
        if (credentials?.adminCode) {
          const cleanCode = credentials.adminCode.trim().toUpperCase();
          const validAdminCodes = [
            'ADMIN-MASTER-2025',
            'ADMIN-BYPASS-KEY',
            process.env.ADMIN_MASTER_CODE
          ].filter(Boolean);

          if (validAdminCodes.includes(cleanCode)) {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
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