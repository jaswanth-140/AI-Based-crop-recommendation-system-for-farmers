# ♿ Accessibility Guide
**EPICS - WCAG AA Compliance Documentation**

Version: 2.0  
Standard: WCAG 2.1 Level AA  
Last Updated: December 4, 2025

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Accessibility Principles](#accessibility-principles)
3. [Implementation Guidelines](#implementation-guidelines)
4. [Component-Specific Requirements](#component-specific-requirements)
5. [Testing Strategy](#testing-strategy)
6. [Common Patterns](#common-patterns)
7. [Tools & Resources](#tools--resources)
8. [Checklist](#checklist)

---

## Overview

### Commitment
EPICS is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

### Scope
- Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
- Section 508 compliance
- EN 301 549 compliance (European standard)

### Target Audience
- Screen reader users
- Keyboard-only users
- Users with visual impairments
- Users with motor disabilities
- Users with cognitive disabilities
- Users of assistive technologies

---

## Accessibility Principles

### 1. Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

**Our Implementation:**
- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content structured for different presentations
- Sufficient color contrast (minimum 4.5:1)

### 2. Operable
User interface components and navigation must be operable.

**Our Implementation:**
- All functionality available via keyboard
- Users have enough time to read and use content
- Content doesn't cause seizures
- Users can navigate and find content

### 3. Understandable
Information and operation of user interface must be understandable.

**Our Implementation:**
- Text is readable and understandable
- Content appears and operates in predictable ways
- Users are helped to avoid and correct mistakes

### 4. Robust
Content must be robust enough to be interpreted reliably by assistive technologies.

**Our Implementation:**
- Compatible with current and future assistive technologies
- Valid, semantic HTML
- Proper ARIA usage

---

## Implementation Guidelines

### HTML Semantics

#### Use Semantic HTML Elements
```html
<!-- ✅ Good -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
<footer>
  <p>&copy; 2025 EPICS</p>
</footer>

<!-- ❌ Bad -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Page Title</div>
  </div>
</div>
```

#### Document Structure
```html
<!-- Proper heading hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
    <h3>Subsection 2.2</h3>
```

### Keyboard Navigation

#### Tab Order
```tsx
// Ensure logical tab order with tabIndex
<div>
  <button tabIndex={0}>Primary Action</button>
  <button tabIndex={0}>Secondary Action</button>
  {/* Avoid tabIndex > 0 */}
</div>
```

#### Focus Management
```tsx
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus modal close button
      closeButtonRef.current?.focus();
    } else {
      // Restore focus
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements?.[0] as HTMLElement;
        const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div role="dialog" aria-modal="true" ref={modalRef}>
      <button ref={closeButtonRef} onClick={onClose}>Close</button>
      {/* Modal content */}
    </div>
  );
};
```

#### Keyboard Shortcuts
```tsx
const App = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      // Keyboard shortcuts
      if (e.key === '/' && e.ctrlKey) {
        e.preventDefault();
        openSearch();
      }
      
      if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        goToHome();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <div>{/* App content */}</div>;
};
```

### Color & Contrast

#### Minimum Contrast Ratios
- **Normal text (< 18pt):** 4.5:1
- **Large text (≥ 18pt or ≥ 14pt bold):** 3:1
- **UI components and graphics:** 3:1

#### Color Usage
```tsx
// ❌ Bad - Information conveyed by color alone
<p style={{ color: 'red' }}>Error: Form is invalid</p>

// ✅ Good - Color + icon + text
<p className="text-error-600 flex items-center gap-2">
  <AlertCircle className="w-5 h-5" aria-hidden="true" />
  <span>Error: Form is invalid</span>
</p>
```

#### Color Blindness Support
```tsx
// Use patterns or icons in addition to colors
const StatusIndicator = ({ status }) => {
  const config = {
    success: { color: 'text-success-600', icon: CheckCircle, label: 'Success' },
    warning: { color: 'text-warning-600', icon: AlertTriangle, label: 'Warning' },
    error: { color: 'text-error-600', icon: XCircle, label: 'Error' },
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};
```

### ARIA Attributes

#### Landmark Roles
```html
<header role="banner">
  <nav role="navigation" aria-label="Main">...</nav>
</header>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

#### Live Regions
```tsx
// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {message}
</div>

// For urgent announcements
<div aria-live="assertive">
  {criticalAlert}
</div>
```

#### States and Properties
```tsx
// Button states
<button
  aria-pressed={isActive}
  aria-disabled={isDisabled}
  aria-busy={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Form inputs
<input
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}

// Expandable sections
<button
  aria-expanded={isExpanded}
  aria-controls="section-content"
>
  Toggle Section
</button>
<div id="section-content" hidden={!isExpanded}>
  Content
</div>
```

### Forms

#### Labels
```tsx
// ✅ Explicit label association
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" />

// ✅ Implicit label association
<label>
  Email Address
  <input type="email" name="email" />
</label>

// ✅ Hidden label for visual design
<label htmlFor="search" className="sr-only">
  Search
</label>
<input
  id="search"
  type="search"
  placeholder="Search..."
  aria-label="Search"
/>
```

#### Error Handling
```tsx
const FormField = ({ label, error, ...props }) => {
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert" className="text-error-600">
          {error}
        </span>
      )}
    </div>
  );
};
```

#### Required Fields
```tsx
<label htmlFor="name">
  Name
  <span aria-label="required" className="text-error-600">*</span>
</label>
<input
  id="name"
  type="text"
  required
  aria-required="true"
/>
```

### Images

#### Alt Text
```tsx
// Informative image
<img src="rice-field.jpg" alt="Rice field with green crops ready for harvest" />

// Decorative image
<img src="pattern.svg" alt="" role="presentation" />

// Complex image with long description
<figure>
  <img src="chart.png" alt="Bar chart showing crop yields" aria-describedby="chart-desc" />
  <figcaption id="chart-desc">
    Detailed description: This chart shows crop yields from 2020-2025...
  </figcaption>
</figure>

// Icon with adjacent text
<button>
  <Trash className="w-4 h-4" aria-hidden="true" />
  Delete
</button>

// Icon button without text
<button aria-label="Delete item">
  <Trash className="w-4 h-4" aria-hidden="true" />
</button>
```

### Links

#### Descriptive Link Text
```tsx
// ❌ Bad
<a href="/crops">Click here</a>

// ✅ Good
<a href="/crops">View crop recommendations</a>

// ✅ Good with context
<p>
  Learn more about sustainable farming practices.{' '}
  <a href="/guide">Read the complete guide</a>
</p>
```

#### External Links
```tsx
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  External Resource
  <span className="sr-only">(opens in new tab)</span>
</a>
```

### Motion & Animation

#### Respect User Preferences
```css
/* Reduce motion for users who prefer it */
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

```tsx
// React implementation
import { useReducedMotion } from './hooks/useReducedMotion';

const Component = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
      }}
    >
      Content
    </motion.div>
  );
};

// Hook implementation
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};
```

### Screen Reader Utilities

#### Screen Reader Only Content
```css
/* Hide visually but keep for screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Show on focus (for skip links) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

```tsx
// Skip to main content link
<a href="#main-content" className="sr-only-focusable">
  Skip to main content
</a>

// Descriptive text for icon buttons
<button>
  <Search className="w-5 h-5" aria-hidden="true" />
  <span className="sr-only">Search</span>
</button>
```

---

## Component-Specific Requirements

### Buttons

```tsx
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  loading,
  disabled,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className="btn btn-primary"
    >
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
      {children}
    </button>
  );
};
```

### Modals

```tsx
const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={modalRef}
      tabIndex={-1}
      className="modal"
    >
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <h2 id={titleId}>{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="modal-close"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};
```

### Data Tables

```tsx
const AccessibleTable = ({ data, columns }) => {
  return (
    <table role="table" aria-label="Crop Recommendations">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={col.key}>
                {colIndex === 0 ? (
                  <th scope="row">{row[col.key]}</th>
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## Testing Strategy

### Automated Testing

#### Jest + React Testing Library
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button Accessibility', () => {
  it('has accessible name', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('is keyboard accessible', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.tab();
    expect(button).toHaveFocus();
    
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('announces loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

#### Jest-Axe
```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing

#### Screen Reader Testing
1. **NVDA (Windows) - Free**
   - Download from https://www.nvaccess.org/
   - Test with Firefox or Chrome
   - Verify all content is announced correctly

2. **JAWS (Windows) - Commercial**
   - Most popular enterprise screen reader
   - Test critical user flows

3. **VoiceOver (macOS/iOS) - Built-in**
   - Test on Safari
   - Enable: System Preferences → Accessibility → VoiceOver
   - Keyboard shortcut: Cmd + F5

4. **TalkBack (Android) - Built-in**
   - Test mobile experience
   - Enable: Settings → Accessibility → TalkBack

#### Keyboard Testing Checklist
- [ ] Can reach all interactive elements via Tab
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Can activate buttons/links with Enter/Space
- [ ] Can close modals with Escape
- [ ] Form submission works with Enter
- [ ] Can navigate dropdowns with arrow keys

#### Color Contrast Testing
- Use tools like:
  - Contrast Checker (WebAIM)
  - Colour Contrast Analyser (TPGi)
  - Chrome DevTools (Lighthouse)

---

## Common Patterns

### Skip Links
```tsx
const App = () => {
  return (
    <>
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Dashboard />
      </main>
    </>
  );
};
```

### Loading States
```tsx
const LoadingSpinner = () => {
  return (
    <div role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
```

### Error Announcements
```tsx
const Form = () => {
  const [errors, setErrors] = useState({});

  return (
    <form>
      {/* Announce errors */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive" className="sr-only">
          Form has {Object.keys(errors).length} errors. Please review and correct.
        </div>
      )}
      
      {/* Form fields */}
    </form>
  );
};
```

---

## Tools & Resources

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Visual feedback on accessibility
- **Lighthouse** - Built into Chrome DevTools
- **ANDI** - Free accessibility testing tool

### Online Tools
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **WAVE** - https://wave.webaim.org/
- **Color Oracle** - Color blindness simulator

### Documentation
- **WCAG 2.1** - https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility** - https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **A11y Project** - https://www.a11yproject.com/

---

## Checklist

### Before Development
- [ ] Review accessibility requirements
- [ ] Understand ARIA patterns needed
- [ ] Check design for color contrast
- [ ] Plan keyboard interactions

### During Development
- [ ] Use semantic HTML
- [ ] Add proper ARIA attributes
- [ ] Implement keyboard navigation
- [ ] Include focus indicators
- [ ] Add alt text to images
- [ ] Label all form inputs
- [ ] Test with keyboard only
- [ ] Run automated tests

### Before Deployment
- [ ] Run Lighthouse accessibility audit (score 95+)
- [ ] Run axe DevTools scan (0 violations)
- [ ] Test with screen reader
- [ ] Verify keyboard navigation
- [ ] Check color contrast
- [ ] Test with zoom (200%)
- [ ] Verify focus order
- [ ] Test error handling
- [ ] Review with accessibility specialist

---

**Accessibility Guide Version:** 1.0  
**Compliance Level:** WCAG 2.1 Level AA  
**Next Review:** Quarterly
