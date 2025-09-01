# Contributing to Wrapped Main Website

Thank you for your interest in contributing to the Wrapped main website! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat all community members with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different skill levels and backgrounds

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- [Bun](https://bun.sh/) installed (recommended) or Node.js 18+
- [Git](https://git-scm.com/) for version control
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/main-website.git
   cd main-website/main-web
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Contribution Types

We welcome various types of contributions:

### 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Browser and device** information
- **Console errors** if any

### ✨ Feature Requests

For new features, please provide:

- **Clear description** of the proposed feature
- **Use case** and motivation
- **Mockups or examples** if applicable
- **Implementation suggestions** (optional)

### 🔧 Code Contributions

We accept contributions for:

- **Bug fixes**
- **New features**
- **Performance improvements**
- **UI/UX enhancements**
- **Documentation updates**
- **Test coverage improvements**

## 🛠️ Development Guidelines

### Code Style

We follow these coding standards:

#### TypeScript
- Use **strict mode** TypeScript
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for functions
- Avoid **any** types

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

const getUser = (id: string): Promise<User> => {
  return fetchUser(id)
}

// ❌ Avoid
const getUser = (id: any): any => {
  return fetchUser(id)
}
```

#### React Components
- Use **functional components** with hooks
- Prefer **named exports** over default exports
- Use **TypeScript interfaces** for props
- Keep components **small and focused**

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`btn-${variant}`}
    >
      {children}
    </button>
  )
}
```

#### Styling
- Use **Tailwind CSS** utility classes
- Create **component classes** for reusable styles
- Follow **mobile-first** responsive design
- Use **semantic color names**

```css
/* ✅ Good - Component class */
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors;
}
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── home/            # Homepage-specific components
│   ├── tools/           # Developer tools
│   └── themes/          # Theme system components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── data/                # Static data and configuration
└── styles/              # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase (`userUtils.ts`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case (`user-profile`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

### Writing Tests

- Write tests for **new features**
- Include **edge cases**
- Use **descriptive test names**
- Mock **external dependencies**

```typescript
// Example test
describe('Button component', () => {
  it('should call onClick when clicked', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(mockClick).toHaveBeenCalledTimes(1)
  })
})
```

## 📋 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run linting** and fix any issues
3. **Update documentation** if needed
4. **Add tests** for new functionality
5. **Check responsive design** on different screen sizes

### PR Guidelines

1. **Create descriptive title**
   - ✅ `feat: add dark mode toggle to navigation`
   - ❌ `fix stuff`

2. **Write clear description**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes

3. **Link related issues**
   - Use `Fixes #123` or `Closes #123`

4. **Request appropriate reviewers**

5. **Respond to feedback** promptly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency**: Use established patterns and components
- **Accessibility**: Follow WCAG 2.1 guidelines
- **Performance**: Optimize for fast loading
- **Mobile-first**: Design for mobile, enhance for desktop

### Color Palette

- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for secondary actions
- **Accent**: Purple/pink for highlights
- **Success**: Green for positive actions
- **Warning**: Yellow for cautions
- **Error**: Red for errors

## 🚀 Release Process

1. **Feature development** in feature branches
2. **Code review** and testing
3. **Merge to main** branch
4. **Automated deployment** to staging
5. **Manual testing** on staging
6. **Production deployment**

## 📞 Getting Help

If you need help:

1. **Check existing issues** and documentation
2. **Ask in discussions** for general questions
3. **Create an issue** for bugs or feature requests
4. **Join our Discord** for real-time help

## 🏆 Recognition

Contributors will be:

- **Listed in README** acknowledgments
- **Mentioned in release notes**
- **Invited to contributor Discord channel**

Thank you for contributing to Wrapped! 🎉
