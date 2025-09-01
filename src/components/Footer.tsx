import { Link } from 'react-router-dom'
import { Github, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/data/config'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Tools', href: '/tools' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Documentation', href: '/coming-soon' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Privacy Policy', href: 'https://dash.wrapped.site/privacy-policy', external: true },
      { name: 'Terms of Service', href: 'https://dash.wrapped.site/terms-of-service', external: true },
      { name: 'Contact', href: '/about' }
    ],
    resources: [
      { name: 'Dashboard', href: 'https://dash.wrapped.site', external: true },
      { name: 'Support Server', href: 'https://wrappedbot.com/support', external: true },
      { name: 'Status Page', href: 'https://status.wrapped.site', external: true },
      { name: 'API Docs', href: '/coming-soon' }
    ]
  }

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-wrapped-500 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={siteConfig.bot.icon}
                  alt={siteConfig.bot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold gradient-text">{siteConfig.site.name}</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {siteConfig.site.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={scrollToTop}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={scrollToTop}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Wrapped. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
