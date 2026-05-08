# Finance Tracker - Premium Fintech Design System

## Overview

A comprehensive, production-ready design system built for premium fintech applications. Inspired by modern fintech platforms like INDmoney, Groww, Zerodha, Revolut, and Stripe Dashboard.

---

## Color Palette

### Primary Colors
- **Brand Primary**: `#6366f1` (Indigo) - Main accent, buttons, highlights
- **Brand Secondary**: `#8b5cf6` (Purple) - Gradients, hover effects
- **Brand Light**: `#818cf8` - Lighter brand color
- **Brand Dark**: `#4f46e5` - Darker brand color

### Status Colors
- **Success**: `#10b981` (Emerald) - Positive actions, gains
- **Danger**: `#ef4444` (Red) - Destructive actions, losses
- **Warning**: `#f59e0b` (Amber) - Warnings, caution
- **Info**: `#3b82f6` (Blue) - Information, neutral

### Background Colors (Dark Mode - Default)
- **Primary**: `#0f0f1e` - Main background
- **Secondary**: `#1a1a2e` - Elevated background
- **Tertiary**: `#16213e` - Deep background
- **Surface**: `rgba(255, 255, 255, 0.02)` - Interactive elements
- **Elevated**: `rgba(255, 255, 255, 0.08)` - Premium cards

### Glass Effects
- **Glass BG**: `rgba(255, 255, 255, 0.04)` - Base glass effect
- **Glass Border**: `rgba(255, 255, 255, 0.08)` - Border for glass
- **Glass Hover BG**: `rgba(255, 255, 255, 0.07)` - Hover state
- **Glass Active BG**: `rgba(255, 255, 255, 0.1)` - Active state

### Text Colors (Dark Mode)
- **Primary Text**: `rgb(245, 245, 247)` - Main text
- **Secondary Text**: `rgb(160, 164, 181)` - Labels, captions
- **Tertiary Text**: `rgb(113, 118, 131)` - Muted text
- **Muted Text**: `rgb(88, 92, 104)` - Very faint text

---

## Typography

### Font Family
- **Font**: Inter (300, 400, 500, 600, 700, 800 weights)
- **Stack**: Inter, sans-serif

### Heading Hierarchy
- **H1**: 32px, 700 weight, letter-spacing -0.02em
- **H2**: 28px, 700 weight
- **H3**: 24px, 600 weight
- **H4**: 20px, 600 weight
- **Body**: 16px, 400 weight
- **Small**: 14px, 500 weight
- **Xs**: 12px, 600 weight

---

## Spacing Scale

```
--spacing-xs:   0.25rem (4px)
--spacing-sm:   0.5rem  (8px)
--spacing-md:   1rem    (16px)
--spacing-lg:   1.5rem  (24px)
--spacing-xl:   2rem    (32px)
--spacing-2xl:  3rem    (48px)
```

---

## Border Radius

```
--radius-sm:    0.5rem  (8px)
--radius-md:    0.75rem (12px)
--radius-lg:    1rem    (16px)
--radius-xl:    1.5rem  (24px)
--radius-2xl:   2rem    (32px)
--radius-full:  9999px  (pill shape)
```

---

## Shadow System

### Dark Mode Shadows
```
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.05)
--shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.1)
```

---

## Transitions

```
--transition-fast:    150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal:  300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow:    500ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Glass Morphism Effects

### Backdrop Filters
- **Standard**: `blur(24px)`
- **Strong**: `blur(32px)` (for modals, drawers)

### Implementation
```css
background: var(--glass-bg);
backdrop-filter: var(--glass-blur);
-webkit-backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
```

---

## Component Styles

### Cards
- **Base Card**: `.card` - Standard glass card with padding
- **Card Small**: `.card-sm` - Compact card (p-4)
- **Card Large**: `.card-lg` - Spacious card (p-8)
- **Card Flat**: `.card-flat` - Surface-only card (no glass)
- **Elevated Card**: `.glass-elevated` - Premium elevation

### Buttons
- **Primary**: `.btn-primary` - Brand gradient, shadow glow
- **Secondary**: `.btn-secondary` - Glass effect
- **Danger**: `.btn-danger` - Red gradient
- **Success**: `.btn-success` - Green gradient

### Sizes
- **Small**: `.btn-sm` - 0.5rem padding, 0.8125rem text
- **Base**: `.btn-base` - 0.625rem padding, 0.9375rem text
- **Large**: `.btn-lg` - 0.875rem padding, 1.0625rem text

### Forms
- **Input**: Glass style with focus ring
- **Select**: Dropdown with glass effect
- **Label**: Secondary text color with optional required marker

### Status Indicators
- **Badge Success**: Emerald background, green text
- **Badge Danger**: Red background, red text
- **Badge Warning**: Amber background, amber text
- **Badge Info**: Blue background, blue text
- **Badge Primary**: Indigo background, indigo text

---

## Animations

### Available Animations
- `animate-fadeIn` - Smooth opacity fade
- `animate-fadeInUp` - Fade in from bottom
- `animate-fadeInDown` - Fade in from top
- `animate-slideUp` - Slide up entrance
- `animate-slideDown` - Slide down entrance
- `animate-slideLeft` - Slide left entrance
- `animate-slideRight` - Slide right entrance
- `animate-scaleIn` - Scale from small to normal
- `animate-pulse` - Pulsing opacity effect
- `animate-glow` - Glowing effect with shadows
- `animate-shimmer` - Loading shimmer effect

### Framer Motion Integration
All components use Framer Motion for advanced animations:
- Spring animations for active states
- Staggered animations for lists
- Layout animations for transitions
- Gesture animations (whileHover, whileTap)

---

## Light Mode Support

The design system includes a complete light mode with:
- Light backgrounds (white, gray-50, gray-100)
- Lower opacity glass effects
- Adjusted text colors for contrast
- Consistent gradients adapted for light backgrounds
- Proper shadow adjustments

### Activating Light Mode
```html
<html class="light">
```

---

## Responsive Design

### Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641-1024px
- **Desktop**: 1025px+

### Mobile-First Approach
- Base styles for mobile
- `sm:` prefix for tablet (640px)
- `md:` prefix for desktop (768px)
- `lg:` prefix for large desktop (1024px)

### Mobile-Specific Features
- Premium sidebar drawer with overlay
- Bottom navigation for core features
- Optimized touch targets (min 44px)
- Responsive spacing adjustments
- Simplified navigation hierarchy

---

## Accessibility

### Features
- **Keyboard Navigation**: Full focus states on interactive elements
- **Color Contrast**: WCAG AA compliant ratios
- **Reduced Motion**: Support for `prefers-reduced-motion`
- **High Contrast Mode**: Support for `prefers-contrast: more`
- **Touch Targets**: Minimum 44x44px interactive areas

### Focus States
All interactive elements have clear focus states:
```css
.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}
```

---

## Best Practices

### When to Use Each Component

#### Cards
- Use `.card` for most content containers
- Use `.glass-elevated` for modals, drawers, premium content
- Use `.card-flat` for lists, tables, data displays

#### Buttons
- Use `.btn-primary` for main actions
- Use `.btn-secondary` for alternative actions
- Use `.btn-danger` for destructive actions
- Use `.btn-success` for positive confirmations

#### Colors
- Use status colors for financial data (green=gain, red=loss)
- Use brand colors for interactive elements
- Use text-secondary for labels and captions
- Use text-tertiary for muted information

### Glass Morphism Rules
1. Always use with proper backdrop-filter
2. Ensure sufficient text contrast (min 4.5:1)
3. Use subtle borders for definition
4. Combine with shadows for depth
5. Test in both light and dark modes

---

## File Structure

```
src/
├── index.css              # Design system tokens & global styles
├── pages/                 # Page-level components
├── components/
│   ├── layout/           # Sidebar, navbar, footer
│   │   ├── ResponsiveSidebar.jsx
│   │   ├── MobileBottomNav.jsx
│   ├── ui/               # Reusable UI components
│   │   ├── GlassCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── Badge.jsx
│   │   └── SkeletonLoader.jsx
```

---

## Maintenance

### Adding New Colors
1. Add to CSS variables in `index.css`
2. Create both dark and light mode variants
3. Test contrast ratios
4. Document in this file

### Adding New Components
1. Use CSS variables, not hardcoded colors
2. Support both light and dark modes
3. Include focus/hover/active states
4. Test on mobile and desktop
5. Add to component library documentation

### Updating Animations
1. Use CSS variables for timing
2. Keep duration under 500ms for perception
3. Use smooth easing functions
4. Test with reduced-motion preference

---

## Version History

### v1.0 - Premium Fintech Design System (May 2026)
- Complete color palette with dark/light modes
- Comprehensive spacing and typography system
- Premium glass morphism effects
- Mobile-optimized navigation
- Accessibility features
- Animation library
- Component styles for all UI elements

---

## References

Design inspired by:
- INDmoney - fintech simplicity
- Groww - trading platform UX
- Zerodha - dashboard excellence
- Revolut - modern mobile-first design
- Stripe Dashboard - premium B2B design
- Linear - clean productivity UI

---

## Support

For design system updates, component additions, or questions:
- Check this document first
- Review component implementations in `src/components/`
- Check CSS variables in `src/index.css`
- Test in both light and dark modes
