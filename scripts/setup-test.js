#!/usr/bin/env node

/**
 * Quick setup script for testing the application
 * This creates a basic test configuration
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate secure random strings
const generateSecret = () => crypto.randomBytes(32).toString('base64');
const generateApiKey = () => crypto.randomBytes(16).toString('hex');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please remove it first if you want to generate a new one.');
  process.exit(1);
}

// Read example file
const exampleContent = fs.readFileSync(envExamplePath, 'utf8');

// Generate test values
const testEnv = exampleContent
  .replace('your_youtube_api_key_here', 'TEST_' + generateApiKey())
  .replace('generate_a_secret_with_openssl_rand_base64_32', generateSecret())
  .replace('your_discord_client_id', 'TEST_DISCORD_CLIENT_ID')
  .replace('your_discord_client_secret', 'TEST_DISCORD_SECRET')
  .replace('your_discord_guild_id', 'TEST_GUILD_ID')
  .replace('your_course_role_id', 'TEST_ROLE_ID')
  .replace('your_stripe_secret_key', 'sk_test_' + generateApiKey())
  .replace('your_stripe_webhook_secret', 'whsec_test_' + generateApiKey())
  .replace('your_stripe_publishable_key', 'pk_test_' + generateApiKey())
  .replace('bcrypt_hashed_password', '$2a$10$' + generateApiKey())
  .replace('your_sentry_dsn', '')
  .replace('your_sentry_auth_token', '')
  .replace('redis://localhost:6379', 'redis://localhost:6379');

// Add test-specific values
const testConfig = testEnv + `
# Test Configuration
ADMIN_MASTER_CODE=${generateSecret()}
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WARNING: This is a TEST configuration
# Do NOT use these values in production!
`;

// Write test configuration
fs.writeFileSync(envPath, testConfig);

console.log('✅ Created .env.local with test configuration');
console.log('');
console.log('⚠️  IMPORTANT: This configuration is for TESTING ONLY!');
console.log('   Before deploying to production:');
console.log('   1. Get a real YouTube API key from Google Cloud Console');
console.log('   2. Set up Discord OAuth application');
console.log('   3. Configure Stripe account');
console.log('   4. Generate secure secrets');
console.log('');
console.log('📖 See SECURITY.md for detailed setup instructions');