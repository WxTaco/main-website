# Wrapped - Main Website

Welcome to Wrapped

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

The official website for Wrapped - a Discord analytics and automation platform serving 10,000+ users. This modern, responsive website showcases our bot features, developer tools, and provides a comprehensive user experience.

💡 **Frequent and impactful contributors may be considered for invitations to work on the main Wrapped platform:** [Dash.wrapped.site](https://dash.wrapped.site)

## 🌟 Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Theme System**: Dynamic theme switching with custom color palettes
- **Developer Tools**: 22+ integrated web-based utilities
- **Performance Optimized**: Fast loading with efficient code splitting
- **SEO Friendly**: Comprehensive meta tags and structured data
- **Accessibility**: WCAG 2.1 compliant with full keyboard navigation

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/WxTaco/main-website.git
cd main-website/main-web

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d

# View logs
docker compose logs -f

# Stop container
docker compose down
```

## 📁 Project Structure

```
main-web/
├── public/                 # Static assets
│   ├── bot-logo.png       # Bot icon
│   └── logo.png           # Site logo
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── home/         # Homepage sections
│   │   ├── themes/       # Theme system
│   │   ├── tools/        # Developer tools
│   │   └── ui/           # Base UI components
│   ├── data/             # Configuration and static data
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Container build instructions
└── nginx.conf            # Production server config
```

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript compiler

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Tailwind CSS**: Utility-first styling approach

## 🎨 Theme System

The website features a dynamic theme system allowing users to:

- Choose from predefined themes
- Create custom color palettes
- Save preferences in localStorage
- Apply themes across all components

### Adding New Themes

```typescript
// src/data/themes.ts
export const customTheme = {
  name: 'Custom Theme',
  colors: {
    primary: '#your-color',
    secondary: '#your-color',
    accent: '#your-color',
    background: {
      start: '#your-color',
      end: '#your-color'
    }
  }
}
```

## 🔧 Developer Tools

The website includes 22+ integrated developer tools:

- JSON Debugger & Formatter
- Color Palette Generator
- Markdown Editor & Preview
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- Hash Generator (MD5, SHA)
- QR Code Generator
- And many more...

### Adding New Tools

1. Create tool component in `src/components/tools/`
2. Add tool metadata to `src/data/tools.ts`
3. Register route in `src/App.tsx`

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Production Build

```bash
bun run build
```

### Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build image
docker build -t wrapped-web .

# Run container
docker run -p 40125:40125 wrapped-web
```

### Environment Setup

For production deployment, ensure:

- Environment variables are properly set
- SSL certificates are configured
- CDN is set up for static assets
- Monitoring and logging are enabled

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.wrapped.site](https://wrapped.site/docs)
- **Discord**: [Support Server](https://wrappedbot.com/support)
- **Email**: [support@wrapped.site](mailto:support@wrapped.site)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons
- [Vite](https://vitejs.dev/) - Build tool

---

Built with ❤️ by [Taco](https://github.com/WxTaco)
