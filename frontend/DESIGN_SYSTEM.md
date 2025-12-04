# 🎨 EPICS Design System
**AI Crop Recommendation System - Production Design Specifications**

Version: 2.0  
Last Updated: December 4, 2025  
Status: Production Ready

---

## 📐 Design Principles

### Core Values
1. **Trustworthy & Professional** - Build farmer confidence through clean, predictable design
2. **Mobile-First** - Optimized for small screens and touch interactions
3. **Accessible** - WCAG AA compliant, multi-language ready
4. **Fast & Lightweight** - Optimized performance for rural connectivity
5. **Action-Oriented** - Clear CTAs and minimal cognitive load

### Visual Language
- **Earthy + Modern** - Blend natural agricultural tones with contemporary UI
- **Calm & Confident** - Reduce anxiety, inspire action
- **Data-Rich but Scannable** - Show insights without overwhelming

---

## 🎨 Color System

### Primary Palette
```css
--primary-50:  #F0FDFA;  /* Teal 50 - Backgrounds */
--primary-100: #CCFBF1;  /* Teal 100 - Hover states */
--primary-200: #99F6E4;  /* Teal 200 */
--primary-300: #5EEAD4;  /* Teal 300 */
--primary-400: #2DD4BF;  /* Teal 400 */
--primary-500: #14B8A6;  /* Teal 500 */
--primary-600: #0D9488;  /* Teal 600 */
--primary-700: #0F766E;  /* Teal 700 - Primary actions */
--primary-800: #115E59;  /* Teal 800 - Primary dark */
--primary-900: #134E4A;  /* Teal 900 */
```

**Usage:**
- Primary actions, interactive elements, trust signals
- Contrast ratio: 7.2:1 (WCAG AAA) with white text on 700+

### Accent (CTA) Palette
```css
--accent-50:  #EFF6FF;  /* Indigo 50 */
--accent-100: #DBEAFE;  /* Indigo 100 */
--accent-500: #3B82F6;  /* Indigo 500 */
--accent-600: #2563EB;  /* Indigo 600 - Primary CTA */
--accent-700: #1D4ED8;  /* Indigo 700 - CTA hover */
--accent-800: #1E40AF;  /* Indigo 800 */
```

**Usage:**
- High-priority CTAs (Get Recommendations, Start Chat)
- Links and interactive text
- Contrast ratio: 8.1:1 with white text on 600+

### Semantic Colors

#### Success
```css
--success-50:  #F0FDF4;  /* Green 50 */
--success-100: #DCFCE7;  /* Green 100 */
--success-500: #22C55E;  /* Green 500 */
--success-600: #16A34A;  /* Green 600 - Main success */
--success-700: #15803D;  /* Green 700 */
```

#### Warning
```css
--warning-50:  #FFFBEB;  /* Amber 50 */
--warning-100: #FEF3C7;  /* Amber 100 */
--warning-500: #F59E0B;  /* Amber 500 - Main warning */
--warning-600: #D97706;  /* Amber 600 */
--warning-700: #B45309;  /* Amber 700 */
```

#### Error/Danger
```css
--error-50:  #FEF2F2;  /* Red 50 */
--error-100: #FEE2E2;  /* Red 100 */
--error-500: #EF4444;  /* Red 500 */
--error-600: #DC2626;  /* Red 600 - Main error */
--error-700: #B91C1C;  /* Red 700 */
```

#### Info
```css
--info-50:  #F0F9FF;  /* Sky 50 */
--info-100: #E0F2FE;  /* Sky 100 */
--info-500: #0EA5E9;  /* Sky 500 - Main info */
--info-600: #0284C7;  /* Sky 600 */
```

### Neutral Palette
```css
--neutral-50:  #F8FAFC;  /* Slate 50 - App background */
--neutral-100: #F1F5F9;  /* Slate 100 - Secondary background */
--neutral-200: #E2E8F0;  /* Slate 200 - Borders */
--neutral-300: #CBD5E1;  /* Slate 300 - Disabled states */
--neutral-400: #94A3B8;  /* Slate 400 - Placeholder text */
--neutral-500: #64748B;  /* Slate 500 - Secondary text */
--neutral-600: #475569;  /* Slate 600 - Body text */
--neutral-700: #334155;  /* Slate 700 - Headings */
--neutral-800: #1E293B;  /* Slate 800 - Dark text */
--neutral-900: #0F172A;  /* Slate 900 - Darkest */
--white:       #FFFFFF;  /* Pure white - Cards */
```

### Agricultural Accent Colors
```css
--soil-brown:   #92400E;  /* Rich soil */
--harvest-gold: #F59E0B;  /* Wheat/harvest */
--leaf-green:   #059669;  /* Fresh vegetation */
--sky-blue:     #0EA5E9;  /* Clear sky */
--rain-blue:    #0891B2;  /* Rainfall */
```

### Contrast Requirements
| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| Primary-700 + White | 7.2:1 | AAA |
| Accent-600 + White | 8.1:1 | AAA |
| Neutral-600 + White | 8.5:1 | AAA |
| Success-600 + White | 4.8:1 | AA (Large text) |
| Warning-500 + Black | 10.4:1 | AAA |
| Error-600 + White | 7.1:1 | AAA |

---

## 📝 Typography

### Font Families

#### Latin Scripts (English)
```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
```
- **Primary:** Inter (400, 500, 600, 700)
- **Fallback:** System UI fonts
- **CDN:** Google Fonts
- **Subset:** latin, latin-ext

#### Indian Scripts
```css
/* Hindi, Marathi, Sanskrit */
font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;

/* Tamil */
font-family: 'Noto Sans Tamil', 'Noto Sans', sans-serif;

/* Telugu */
font-family: 'Noto Sans Telugu', 'Noto Sans', sans-serif;

/* Kannada */
font-family: 'Noto Sans Kannada', 'Noto Sans', sans-serif;

/* Gujarati */
font-family: 'Noto Sans Gujarati', 'Noto Sans', sans-serif;

/* Bengali */
font-family: 'Noto Sans Bengali', 'Noto Sans', sans-serif;

/* Malayalam */
font-family: 'Noto Sans Malayalam', 'Noto Sans', sans-serif;

/* Punjabi */
font-family: 'Noto Sans Gurmukhi', 'Noto Sans', sans-serif;
```

### Type Scale

#### Desktop
```css
/* Display */
--text-display: 48px / 1.1 / 700;    /* Hero sections */
--text-h1:      36px / 1.2 / 700;    /* Page titles */
--text-h2:      30px / 1.3 / 600;    /* Section headers */
--text-h3:      24px / 1.3 / 600;    /* Card titles */
--text-h4:      20px / 1.4 / 600;    /* Subsection */
--text-h5:      18px / 1.4 / 600;    /* Small headers */

/* Body */
--text-body-lg: 18px / 1.6 / 400;    /* Lead paragraphs */
--text-body:    16px / 1.5 / 400;    /* Body text */
--text-body-sm: 14px / 1.5 / 400;    /* Secondary text */

/* Utility */
--text-caption: 12px / 1.4 / 500;    /* Labels, captions */
--text-tiny:    10px / 1.4 / 500;    /* Micro text */

/* Interactive */
--text-button:  15px / 1 / 600;      /* Button text */
--text-link:    16px / 1.5 / 500;    /* Links */
```

#### Mobile
```css
/* Display */
--text-display: 36px / 1.1 / 700;
--text-h1:      28px / 1.2 / 700;
--text-h2:      24px / 1.3 / 600;
--text-h3:      20px / 1.3 / 600;
--text-h4:      18px / 1.4 / 600;
--text-h5:      16px / 1.4 / 600;

/* Body */
--text-body-lg: 17px / 1.6 / 400;
--text-body:    16px / 1.5 / 400;    /* Larger for legibility */
--text-body-sm: 14px / 1.5 / 400;

/* Utility */
--text-caption: 12px / 1.4 / 500;
--text-tiny:    11px / 1.4 / 500;

/* Interactive */
--text-button:  16px / 1 / 600;      /* Larger tap targets */
--text-link:    16px / 1.5 / 500;
```

### Font Loading Strategy
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/noto-sans-devanagari-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Google Fonts with display=swap -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```

### Font Subsetting
```
?family=Inter:wght@400;500;600;700&subset=latin,latin-ext&display=swap
?family=Noto+Sans+Devanagari:wght@400;500;600;700&subset=devanagari&display=swap
```

---

## 📏 Spacing Scale

### Base Unit: 4px (0.25rem)

```css
--spacing-0:   0px;      /* 0 */
--spacing-px:  1px;      /* 0.0625rem */
--spacing-0-5: 2px;      /* 0.125rem */
--spacing-1:   4px;      /* 0.25rem */
--spacing-1-5: 6px;      /* 0.375rem */
--spacing-2:   8px;      /* 0.5rem */
--spacing-2-5: 10px;     /* 0.625rem */
--spacing-3:   12px;     /* 0.75rem */
--spacing-4:   16px;     /* 1rem */
--spacing-5:   20px;     /* 1.25rem */
--spacing-6:   24px;     /* 1.5rem */
--spacing-7:   28px;     /* 1.75rem */
--spacing-8:   32px;     /* 2rem */
--spacing-10:  40px;     /* 2.5rem */
--spacing-12:  48px;     /* 3rem */
--spacing-16:  64px;     /* 4rem */
--spacing-20:  80px;     /* 5rem */
--spacing-24:  96px;     /* 6rem */
--spacing-32:  128px;    /* 8rem */
```

### Component Spacing

#### Cards
```css
padding: 20px;           /* Mobile */
padding: 24px;           /* Tablet */
padding: 32px;           /* Desktop */
gap: 16px;              /* Internal spacing */
```

#### Sections
```css
margin-bottom: 32px;    /* Mobile */
margin-bottom: 48px;    /* Tablet */
margin-bottom: 64px;    /* Desktop */
```

#### Forms
```css
gap: 16px;              /* Between fields */
padding: 12px 16px;     /* Input internal */
margin-bottom: 24px;    /* Form sections */
```

---

## 🔘 Border Radius

```css
--radius-none: 0px;
--radius-sm:   6px;     /* Small elements, inputs */
--radius-md:   8px;     /* Cards, buttons */
--radius-lg:   12px;    /* Large cards, modals */
--radius-xl:   16px;    /* Special cards */
--radius-2xl:  20px;    /* Hero sections */
--radius-3xl:  24px;    /* Large features */
--radius-full: 9999px;  /* Pills, avatars */
```

### Usage Guidelines
- **Buttons:** 8px (medium)
- **Cards:** 12px (large)
- **Inputs:** 6px (small)
- **Modals:** 16px (xl)
- **Chips/Tags:** 9999px (full)
- **Images:** 8px (medium)

---

## 🌑 Elevation (Shadows)

### Shadow Scale
```css
/* None */
--shadow-none: none;

/* Subtle - Cards at rest */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default - Cards, dropdowns */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Raised - Hover states */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Floating - Modals, popovers */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Dramatic - Hero elements */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Colored shadows for CTAs */
--shadow-primary: 0 10px 15px -3px rgba(15, 118, 110, 0.3),
                  0 4px 6px -2px rgba(15, 118, 110, 0.05);

--shadow-accent: 0 10px 15px -3px rgba(37, 99, 235, 0.3),
                 0 4px 6px -2px rgba(37, 99, 235, 0.05);
```

### Context Usage
```css
.card-default { box-shadow: var(--shadow-md); }
.card-hover   { box-shadow: var(--shadow-lg); }
.modal        { box-shadow: var(--shadow-2xl); }
.button-cta   { box-shadow: var(--shadow-accent); }
```

---

## 🎬 Motion & Animation

### Duration Tokens
```css
--duration-instant: 75ms;     /* Micro-interactions */
--duration-fast:    150ms;    /* Hover, focus states */
--duration-normal:  300ms;    /* Standard transitions */
--duration-slow:    500ms;    /* Modal open/close */
--duration-slower:  700ms;    /* Page transitions */
```

### Easing Functions
```css
/* Default ease */
--ease-default: cubic-bezier(0.22, 0.9, 0.41, 1);

/* Sharp entrance */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Smooth exit */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Bounce */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Spring */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Animation Presets

#### Hover States
```css
transition: all 150ms cubic-bezier(0.22, 0.9, 0.41, 1);
transform: translateY(-4px);
box-shadow: var(--shadow-lg);
```

#### Focus States
```css
transition: box-shadow 150ms ease;
box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.2);
outline: 2px solid transparent;
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 300ms var(--ease-default);
```

#### Slide Up
```css
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
animation: slideUp 300ms var(--ease-default);
```

#### Skeleton Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse 2s var(--ease-default) infinite;
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🎯 Interactive States

### Buttons
```css
/* Default */
background: var(--accent-600);
color: white;
box-shadow: var(--shadow-md);

/* Hover */
background: var(--accent-700);
box-shadow: var(--shadow-lg);
transform: translateY(-1px);

/* Focus */
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);

/* Active */
transform: translateY(0);
box-shadow: var(--shadow-sm);

/* Disabled */
background: var(--neutral-300);
color: var(--neutral-500);
cursor: not-allowed;
opacity: 0.6;
```

### Inputs
```css
/* Default */
border: 1px solid var(--neutral-300);
background: white;

/* Focus */
border-color: var(--primary-600);
box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);

/* Error */
border-color: var(--error-600);
box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);

/* Disabled */
background: var(--neutral-100);
cursor: not-allowed;
```

### Cards
```css
/* Default */
background: white;
border: 1px solid var(--neutral-200);
box-shadow: var(--shadow-sm);

/* Hover */
border-color: var(--primary-200);
box-shadow: var(--shadow-md);
transform: translateY(-2px);

/* Selected */
border-color: var(--primary-600);
background: var(--primary-50);
box-shadow: var(--shadow-primary);
```

---

## 📱 Touch Targets & Accessibility

### Minimum Sizes
```css
--touch-target-min: 44px;    /* iOS/Android minimum */
--touch-target-comfortable: 48px;
--button-height-sm: 36px;    /* Dense UIs only */
--button-height-md: 44px;    /* Default */
--button-height-lg: 52px;    /* Primary actions */
```

### Spacing for Touch
```css
--touch-spacing-sm: 8px;     /* Between small elements */
--touch-spacing-md: 12px;    /* Between buttons */
--touch-spacing-lg: 16px;    /* Between sections */
```

### Focus Indicators
```css
/* Keyboard focus */
:focus-visible {
  outline: 2px solid var(--accent-600);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Focus ring alternative */
.focus-ring {
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.3);
}
```

---

## 🖼️ Iconography

### Icon Library: Lucide React + Heroicons

#### Size Scale
```css
--icon-xs:  12px;    /* Inline with text */
--icon-sm:  16px;    /* Small buttons, tags */
--icon-md:  20px;    /* Default buttons */
--icon-lg:  24px;    /* Large buttons, headers */
--icon-xl:  32px;    /* Feature icons */
--icon-2xl: 48px;    /* Hero sections */
```

#### Stroke Width
```css
--icon-stroke-thin:   1.5px;  /* Delicate */
--icon-stroke-normal: 2px;    /* Default */
--icon-stroke-bold:   2.5px;  /* Emphasis */
```

### Common Icons
```jsx
import { 
  Home,           // Dashboard
  Sprout,         // Crops
  TrendingUp,     // Market
  MessageCircle,  // Chat
  User,           // Profile
  Settings,       // Settings
  Bell,           // Notifications
  Search,         // Search
  MapPin,         // Location
  Cloud,          // Weather
  Droplets,       // Water
  Calendar,       // Schedule
  IndianRupee,    // Currency
  ChevronRight,   // Navigation
  Check,          // Success
  AlertCircle,    // Warning
  XCircle,        // Error
  Info,           // Information
} from 'lucide-react';
```

---

## 📐 Grid & Layout

### Container
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;  /* Mobile */
}

@media (min-width: 640px) {
  .container { padding: 0 24px; }  /* Tablet */
}

@media (min-width: 1024px) {
  .container { 
    padding: 0 32px;
    max-width: 1280px;  /* Desktop */
  }
}
```

### Breakpoints
```css
--breakpoint-sm:  640px;   /* Mobile landscape */
--breakpoint-md:  768px;   /* Tablet portrait */
--breakpoint-lg:  1024px;  /* Tablet landscape / Small desktop */
--breakpoint-xl:  1280px;  /* Desktop */
--breakpoint-2xl: 1536px;  /* Large desktop */
```

### Grid System
```css
.grid-2 { grid-template-columns: repeat(2, 1fr); gap: 16px; }
.grid-3 { grid-template-columns: repeat(3, 1fr); gap: 20px; }
.grid-4 { grid-template-columns: repeat(4, 1fr); gap: 24px; }

/* Responsive */
@media (max-width: 768px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

---

## 🌍 Localization

### Language Support
- English (en)
- Hindi (hi) - हिन्दी
- Telugu (te) - తెలుగు
- Tamil (ta) - தமிழ்
- Kannada (kn) - ಕನ್ನಡ
- Marathi (mr) - मराठी
- Bengali (bn) - বাংলা
- Gujarati (gu) - ગુજરાતી
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ

### Implementation
```jsx
// Language detection
<html lang={currentLanguage}>

// Font switching
const fontFamily = {
  en: 'Inter',
  hi: 'Noto Sans Devanagari',
  ta: 'Noto Sans Tamil',
  te: 'Noto Sans Telugu',
  // ...
};

// Number formatting
const formatCurrency = (amount, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    notation: 'compact'
  }).format(amount);
};

// Date formatting
const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};
```

---

## 📦 Component Tokens

### Button Variants
```css
/* Primary */
.btn-primary {
  background: var(--accent-600);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
}

/* Secondary */
.btn-secondary {
  background: var(--neutral-100);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-300);
}

/* Outline */
.btn-outline {
  background: transparent;
  color: var(--primary-700);
  border: 2px solid var(--primary-700);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--neutral-700);
}
```

### Card Variants
```css
/* Default */
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
}

/* Flat */
.card-flat {
  background: white;
  border: 1px solid var(--neutral-200);
  box-shadow: none;
}

/* Elevated */
.card-elevated {
  box-shadow: var(--shadow-lg);
}
```

---

## ✅ Design Checklist

### Before Development
- [ ] All colors have 4.5:1 contrast minimum
- [ ] Touch targets are 44px minimum
- [ ] Focus states are visible and consistent
- [ ] Typography scales for mobile and desktop
- [ ] Icons have consistent stroke width
- [ ] Spacing follows 4px grid
- [ ] Motion respects prefers-reduced-motion

### During Development
- [ ] Components use design tokens (no magic values)
- [ ] Responsive behavior tested on 3+ screen sizes
- [ ] Keyboard navigation works for all interactions
- [ ] Screen reader announces all dynamic content
- [ ] Error states provide actionable feedback
- [ ] Loading states prevent layout shift

### Before Launch
- [ ] Lighthouse accessibility score 90+
- [ ] WCAG AA compliance verified
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Multi-language testing with actual content
- [ ] Performance budget: FCP < 1.8s, LCP < 2.5s
- [ ] RTL layout tested (if applicable)

---

## 📚 Resources

### Design Tools
- **Figma**: Design files and prototypes
- **Tailwind UI**: Component inspiration
- **Heroicons**: SVG icon library
- **Lucide**: Additional icons

### Development
- **Tailwind CSS**: v3.4+
- **React**: v18.2+
- **Framer Motion**: Animations
- **React Testing Library**: Testing
- **Axe DevTools**: Accessibility auditing

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)

---

**End of Design System Documentation**
