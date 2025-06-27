import { isValidRedirectUrl, safeRedirect } from '../url-validation'

// Mock window.location for testing
const mockLocation = {
  href: '',
}

// @ts-ignore
global.window = {
  location: mockLocation,
}

// Mock console methods
const originalWarn = console.warn
const originalError = console.error

beforeEach(() => {
  mockLocation.href = ''
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  console.warn = originalWarn
  console.error = originalError
})

describe('isValidRedirectUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_APP_URL = 'https://myapp.com'
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('valid URLs', () => {
    it('should allow Stripe checkout URLs', () => {
      expect(isValidRedirectUrl('https://checkout.stripe.com/pay/cs_test_123')).toBe(true)
    })

    it('should allow Stripe billing portal URLs', () => {
      expect(isValidRedirectUrl('https://billing.stripe.com/p/session/test_123')).toBe(true)
    })

    it('should allow app domain URLs', () => {
      expect(isValidRedirectUrl('https://myapp.com/dashboard')).toBe(true)
    })

    it('should allow subdomains of allowed domains', () => {
      expect(isValidRedirectUrl('https://api.checkout.stripe.com/test')).toBe(true)
    })

    it('should allow localhost in development', () => {
      process.env.NODE_ENV = 'development'
      expect(isValidRedirectUrl('http://localhost:3000/dashboard')).toBe(true)
      expect(isValidRedirectUrl('http://127.0.0.1:3000/dashboard')).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('should block external domains', () => {
      expect(isValidRedirectUrl('https://evil.com/phishing')).toBe(false)
      expect(isValidRedirectUrl('https://google.com')).toBe(false)
    })

    it('should block HTTP URLs in production', () => {
      process.env.NODE_ENV = 'production'
      expect(isValidRedirectUrl('http://checkout.stripe.com/pay')).toBe(false)
    })

    it('should block non-localhost HTTP in development', () => {
      process.env.NODE_ENV = 'development'
      expect(isValidRedirectUrl('http://evil.com/test')).toBe(false)
    })

    it('should block javascript: protocol', () => {
      expect(isValidRedirectUrl('javascript:alert("XSS")')).toBe(false)
    })

    it('should block data: URLs', () => {
      expect(isValidRedirectUrl('data:text/html,<script>alert("XSS")</script>')).toBe(false)
    })

    it('should block malformed URLs', () => {
      expect(isValidRedirectUrl('not-a-valid-url')).toBe(false)
      expect(isValidRedirectUrl('')).toBe(false)
    })

    it('should block URLs with @ character (potential bypass)', () => {
      expect(isValidRedirectUrl('https://checkout.stripe.com@evil.com')).toBe(false)
    })
  })
})

describe('safeRedirect', () => {
  it('should redirect to valid URLs', () => {
    safeRedirect('https://checkout.stripe.com/pay/test')
    expect(mockLocation.href).toBe('https://checkout.stripe.com/pay/test')
  })

  it('should throw error for invalid URLs', () => {
    expect(() => {
      safeRedirect('https://evil.com/phishing')
    }).toThrow('Invalid redirect URL')
    expect(mockLocation.href).toBe('')
  })

  it('should log error for invalid URLs', () => {
    try {
      safeRedirect('https://evil.com/phishing')
    } catch (e) {
      // Expected
    }
    expect(console.error).toHaveBeenCalledWith('Attempted redirect to invalid URL:', 'https://evil.com/phishing')
  })
})