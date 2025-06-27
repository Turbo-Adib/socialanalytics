# Open Redirect Vulnerability Fix Plan

## Overview
Snyk has identified two Open Redirect vulnerabilities (CWE-601) in `src/components/BillingDashboard.tsx`. Both vulnerabilities occur when unsanitized URLs from API responses are directly used for browser navigation.

## Vulnerability Details

### Location 1: Line 35
```javascript
const data = await response.json()
if (response.ok && data.url) {
  window.location.href = data.url  // Vulnerability: Unsanitized redirect
}
```

### Location 2: Line 59
```javascript
const data = await response.json()
if (response.ok && data.url) {
  window.location.href = data.url  // Vulnerability: Unsanitized redirect
}
```

## Root Cause
The vulnerability exists because:
1. URLs from API responses are trusted without validation
2. No client-side URL validation is performed before redirect
3. An attacker could potentially manipulate the API response to redirect users to malicious sites

## Fix Strategy

### 1. Client-Side URL Validation
Implement a URL validation utility that:
- Validates URLs are from trusted domains
- Ensures URLs use HTTPS protocol
- Checks against a whitelist of allowed redirect domains

### 2. Server-Side Hardening
While the main fix is client-side, ensure server APIs:
- Only return URLs from trusted sources (Stripe)
- Validate URLs before including in responses
- Use environment variables for base URLs

### 3. Implementation Steps

#### Step 1: Create URL Validation Utility
Create `/src/lib/url-validation.ts`:
```typescript
const ALLOWED_DOMAINS = [
  'checkout.stripe.com',
  'billing.stripe.com',
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ''),
].filter(Boolean)

export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    
    // Only allow HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      return false
    }
    
    // Check if hostname is in allowed list
    const hostname = parsedUrl.hostname
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

export function safeRedirect(url: string): void {
  if (isValidRedirectUrl(url)) {
    window.location.href = url
  } else {
    console.error('Invalid redirect URL attempted:', url)
    throw new Error('Invalid redirect URL')
  }
}
```

#### Step 2: Update BillingDashboard Component
Replace direct redirects with validated redirects:
```typescript
import { safeRedirect } from '@/lib/url-validation'

// In handleSubscribe function (line 35):
if (response.ok && data.url) {
  safeRedirect(data.url)
}

// In handleManageBilling function (line 59):
if (response.ok && data.url) {
  safeRedirect(data.url)
}
```

#### Step 3: Add Error Handling
Enhance error handling to catch validation failures:
```typescript
try {
  if (response.ok && data.url) {
    safeRedirect(data.url)
  }
} catch (error) {
  if (error.message === 'Invalid redirect URL') {
    alert('Security error: Invalid redirect URL. Please contact support.')
  }
  // existing error handling
}
```

## Testing Plan

1. **Valid URLs Test**
   - Test with actual Stripe checkout URLs
   - Test with Stripe billing portal URLs
   - Verify successful redirects

2. **Invalid URLs Test**
   - Test with external domains
   - Test with HTTP URLs in production
   - Test with malformed URLs
   - Verify redirects are blocked

3. **Edge Cases**
   - Test with relative URLs
   - Test with javascript: protocol
   - Test with data: URLs
   
## Security Benefits

1. **Prevents Open Redirect Attacks**: Malicious actors cannot redirect users to phishing sites
2. **Domain Whitelist**: Only trusted domains (Stripe and app domain) are allowed
3. **Protocol Enforcement**: HTTPS-only in production prevents downgrade attacks
4. **Logging**: Failed redirect attempts are logged for security monitoring

## Implementation Timeline

1. Create validation utility: 10 minutes
2. Update BillingDashboard component: 10 minutes  
3. Test implementation: 15 minutes
4. Documentation: 5 minutes

Total estimated time: 40 minutes