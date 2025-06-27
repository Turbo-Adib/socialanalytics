#!/bin/bash

echo "🚀 Starting production build process..."

# Exit on error
set -e

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build process completed successfully!"