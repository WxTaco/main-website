# Contributor Guidelines - Wrapped Main Website

This document outlines specific guidelines and best practices for contributors to the Wrapped main website project.

## 🎯 Project Vision

The Wrapped main website serves as the primary gateway for users to discover and interact with our Discord analytics and automation platform. Our goal is to create a **professional, accessible, and performant** web experience that effectively communicates our value proposition.

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom component classes
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **Deployment**: Docker with Nginx for production

### Key Principles

1. **Performance First**: Every feature should be optimized for speed
2. **Accessibility**: WCAG 2.1 AA compliance is mandatory
3. **Mobile Responsive**: Mobile-first design approach
4. **SEO Optimized**: Proper meta tags and structured data
5. **Type Safety**: Comprehensive TypeScript coverage

## 📐 Component Architecture

### Component Hierarchy

```
App
├── Layout Components (Navbar, Footer)
├── Page Components (HomePage, AboutPage, etc.)
├── Feature Components (HeroSection, StatsGrid, etc.)
├── UI Components (Button, Modal, Card, etc.)
└── Utility Components (ThemeProvider, etc.)
```

### Component Guidelines

#### 1. Component Structure

```typescript
// ComponentName.tsx
import { ComponentProps } from './ComponentName.types'
import { useComponentLogic } from './ComponentName.hooks'
import './ComponentName.styles.css' // Only if needed

export const ComponentName = ({ prop1, prop2, ...props }: ComponentProps) => {
  const { state, handlers } = useComponentLogic({ prop1, prop2 })
  
  return (
    <div className="component-name" {...props}>
      {/* Component JSX */}
    </div>
  )
}
```

#### 2. Props Interface

```typescript
// ComponentName.types.ts
export interface ComponentProps {
  // Required props first
  title: string
  onClick: () => void
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  
  // HTML attributes
  className?: string
  children?: React.ReactNode
}
```

#### 3. Custom Hooks

```typescript
// ComponentName.hooks.ts
export const useComponentLogic = ({ prop1, prop2 }: HookProps) => {
  const [state, setState] = useState(initialState)
  
  const handleAction = useCallback(() => {
    // Logic here
  }, [dependencies])
  
  return {
    state,
    handlers: {
      handleAction
    }
  }
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

#### 1. Use Semantic Classes

```typescript
// ✅ Good - Semantic and reusable
<button className="btn-primary">
  Click me
</button>

// ❌ Avoid - Too specific and not reusable
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg">
  Click me
</button>
```

#### 2. Component Classes

```css
/* styles/components.css */
@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
  
  .card {
    @apply bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-200;
  }
}
```

#### 3. Responsive Design

```typescript
// Mobile-first approach
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* Content */}
</div>
```

### Animation Guidelines

#### 1. Framer Motion Patterns

```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Staggered animations
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}
```

#### 2. Performance Considerations

- Use `transform` properties for animations
- Prefer `opacity` over `visibility`
- Use `will-change` sparingly
- Implement `reduce-motion` support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔧 Feature Development

### Adding New Pages

1. **Create page component** in `src/pages/`
2. **Add route** to `src/App.tsx`
3. **Update navigation** in `src/components/Navbar.tsx`
4. **Add meta tags** for SEO
5. **Test responsive design**

### Adding Developer Tools

1. **Create tool component** in `src/components/tools/`
2. **Add tool metadata** to `src/data/tools.ts`
3. **Implement tool logic** with proper error handling
4. **Add tests** for tool functionality
5. **Update tools index** page

### Theme System Integration

```typescript
// Using theme colors
const ThemeAwareComponent = () => {
  return (
    <div 
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text)'
      }}
    >
      Content
    </div>
  )
}
```

## 🧪 Testing Standards

### Unit Tests

```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('should render with correct props', () => {
    render(<Component title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  
  it('should handle user interactions', () => {
    const mockHandler = jest.fn()
    render(<Component onClick={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Tests

```typescript
// Page.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('HomePage', () => {
  it('should render all sections', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText(/discord bot/i)).toBeInTheDocument()
  })
})
```

## 📊 Performance Guidelines

### Code Splitting

```typescript
// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))
```

### Image Optimization

```typescript
// Use appropriate formats and sizes
<img 
  src="/images/hero-image.webp"
  alt="Descriptive alt text"
  loading="lazy"
  width={800}
  height={600}
/>
```

### Bundle Analysis

```bash
# Analyze bundle size
bun run build
bun run analyze
```

## 🔒 Security Guidelines

### Input Validation

```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify'

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input)
}
```

### External Links

```typescript
// Always use rel="noopener noreferrer" for external links
<a 
  href="https://external-site.com"
  target="_blank"
  rel="noopener noreferrer"
>
  External Link
</a>
```

## 📈 Analytics & Monitoring

### Error Tracking

```typescript
// Error boundary implementation
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Component error:', error, errorInfo)
  }
}
```

### Performance Monitoring

```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 🚀 Deployment Guidelines

### Environment Configuration

```typescript
// Environment-specific configs
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true
  },
  production: {
    apiUrl: 'https://api.wrapped.site',
    debug: false
  }
}
```

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          utils: ['date-fns', 'lodash']
        }
      }
    }
  }
})
```

## 📚 Documentation Standards

### Component Documentation

```typescript
/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({ variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  // Implementation
}
```

### README Updates

When adding new features:

1. Update feature list
2. Add usage examples
3. Update screenshots if needed
4. Document any new environment variables

## 🎉 Recognition

Contributors who follow these guidelines and make significant contributions will be:

- Featured in our contributor spotlight
- Invited to exclusive contributor events
- Eligible for Wrapped merchandise
- Recognized in release notes

Thank you for helping make Wrapped's website amazing! 🚀
