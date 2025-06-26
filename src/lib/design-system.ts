// Design System for YouTube Analytics SaaS
// Integrates shadcn/ui with YouTube-inspired theme

export const designSystem = {
  // Color Palette
  colors: {
    // Primary brand colors (YouTube red)
    primary: {
      50: '#FFF1F1',
      100: '#FFDFDF',
      200: '#FFC5C5',
      300: '#FF9D9D',
      400: '#FF6464',
      500: '#FF0000', // YouTube red
      600: '#E60000',
      700: '#CC0000', // YouTube red hover
      800: '#A60000',
      900: '#800000',
      950: '#4A0000',
    },
    
    // Neutral colors for UI
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // Dark theme colors (YouTube-inspired)
    dark: {
      bg: {
        primary: '#0F0F0F',
        secondary: '#181818',
        tertiary: '#212121',
        card: '#212121',
        hover: '#272727',
        elevated: '#282828',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#AAAAAA',
        tertiary: '#717171',
        muted: '#606060',
      },
      border: '#303030',
      accent: '#3EA6FF',
    },
    
    // Status colors
    success: {
      500: '#2BA640',
      600: '#25A233',
      700: '#1F8A2B',
    },
    warning: {
      500: '#FF7626',
      600: '#E6691F',
      700: '#CC5D1C',
    },
    error: {
      500: '#FF4444',
      600: '#E63939',
      700: '#CC2E2E',
    },
    info: {
      500: '#3EA6FF',
      600: '#2E96E6',
      700: '#2785CC',
    },
    
    // Chart colors
    chart: {
      1: '#FF0000', // YouTube red
      2: '#3EA6FF', // YouTube blue
      3: '#2BA640', // Green
      4: '#FF7626', // Orange
      5: '#9147FF', // Purple
      6: '#FFD600', // Yellow
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    youtube: '0 2px 8px rgba(0, 0, 0, 0.5)',
    'youtube-hover': '0 4px 12px rgba(0, 0, 0, 0.6)',
  },
  
  // Component variants
  components: {
    button: {
      variants: {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        youtube: 'bg-youtube-red text-white hover:bg-youtube-red-hover shadow-youtube hover:shadow-youtube-hover transform hover:scale-[1.02] active:scale-[0.98]',
      },
      sizes: {
        sm: 'h-9 rounded-md px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    
    card: {
      variants: {
        default: 'rounded-lg border bg-card text-card-foreground shadow-sm',
        elevated: 'rounded-lg border bg-card text-card-foreground shadow-lg',
        youtube: 'rounded-lg border bg-card text-card-foreground shadow-card hover:shadow-youtube-hover transition-all duration-200',
      },
    },
    
    badge: {
      variants: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'text-foreground border',
        success: 'bg-accent-green/20 text-accent-green border-accent-green/30',
        warning: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30',
        error: 'bg-destructive/20 text-destructive border-destructive/30',
      },
    },
  },
  
  // Animation presets
  animations: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Utility functions for design system
export const getColor = (path: string) => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], designSystem.colors);
};

export const getSpacing = (size: keyof typeof designSystem.spacing) => {
  return designSystem.spacing[size];
};

export const getShadow = (size: keyof typeof designSystem.shadows) => {
  return designSystem.shadows[size];
};

// Component class generators
export const buttonVariants = (variant: string, size: string) => {
  const variantClass = designSystem.components.button.variants[variant as keyof typeof designSystem.components.button.variants];
  const sizeClass = designSystem.components.button.sizes[size as keyof typeof designSystem.components.button.sizes];
  return `${variantClass} ${sizeClass}`;
};

export const cardVariants = (variant: string) => {
  return designSystem.components.card.variants[variant as keyof typeof designSystem.components.card.variants];
};

export const badgeVariants = (variant: string) => {
  return designSystem.components.badge.variants[variant as keyof typeof designSystem.components.badge.variants];
};