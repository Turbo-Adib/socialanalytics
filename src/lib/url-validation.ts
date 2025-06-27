/**
 * URL validation utility to prevent Open Redirect vulnerabilities
 * Only allows redirects to trusted domains
 */

// Whitelist of allowed domains for redirects
const ALLOWED_DOMAINS = [
  'checkout.stripe.com',
  'billing.stripe.com',
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ''),
].filter(Boolean)

/**
 * Validates if a URL is safe to redirect to
 * @param url - The URL to validate
 * @returns true if URL is safe, false otherwise
 */
export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    
    // Only allow HTTPS in production (allow HTTP for local development)
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      console.warn('Blocked redirect to non-HTTPS URL in production:', url)
      return false
    }
    
    // Allow HTTP only for localhost in development
    if (process.env.NODE_ENV === 'development' && 
        parsedUrl.protocol === 'http:' && 
        !['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) {
      console.warn('Blocked redirect to non-localhost HTTP URL in development:', url)
      return false
    }
    
    // Check if hostname is in allowed list
    const hostname = parsedUrl.hostname
    const isAllowed = ALLOWED_DOMAINS.some(domain => {
      if (!domain) return false
      return hostname === domain || hostname.endsWith(`.${domain}`)
    })
    
    if (!isAllowed) {
      console.warn('Blocked redirect to unauthorized domain:', hostname)
    }
    
    return isAllowed
  } catch (error) {
    console.error('Invalid URL format:', url, error)
    return false
  }
}

/**
 * Safely redirects to a URL after validation
 * @param url - The URL to redirect to
 * @throws Error if URL is invalid
 */
export function safeRedirect(url: string): void {
  if (isValidRedirectUrl(url)) {
    window.location.href = url
  } else {
    console.error('Attempted redirect to invalid URL:', url)
    throw new Error('Invalid redirect URL')
  }
}

/**
 * Gets a safe fallback URL for failed redirects
 * @returns The dashboard URL as a safe fallback
 */
export function getFallbackUrl(): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`
}