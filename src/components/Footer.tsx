import { Link } from 'react-router-dom';
import { Rocket, Twitter, Linkedin, Instagram } from 'lucide-react';
import { cn } from '../lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Resources',
      links: [
        { label: 'Courses', path: '/courses' },
        { label: 'Tools', path: '/tools' },
        { label: 'Community', path: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer
      className={cn(
        'relative z-10',
        'bg-background-secondary/80 backdrop-blur-md',
        'border-t border-accent-metallic-dark/10',
        'print:hidden'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-accent-purple" />
              <span className="text-lg font-bold gradient-text">Propulsion Society</span>
            </div>
            <p className="text-sm text-accent-metallic">
              Accelerating personal growth, financial success, and strategic networking.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-2 rounded-lg',
                    'text-accent-metallic hover:text-accent-purple-light',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-accent-purple/20'
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-accent-metallic-light mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={cn(
                        'text-sm text-accent-metallic',
                        'hover:text-accent-purple-light',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-accent-purple/20 rounded'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div>
            <h3 className="text-sm font-semibold text-accent-metallic-light mb-4">Stay Updated</h3>
            <form className="space-y-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  'w-full px-4 py-2 rounded-lg',
                  'bg-background/50 border border-accent-metallic-dark/20',
                  'text-accent-metallic-light placeholder-accent-metallic-dark',
                  'focus:outline-none focus:ring-2 focus:ring-accent-purple/20',
                  'transition-all duration-200'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'w-full px-4 py-2 rounded-lg',
                  'bg-accent-purple text-white',
                  'hover:bg-accent-purple-dark',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-accent-purple/50'
                )}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={cn(
            'mt-12 pt-8',
            'border-t border-accent-metallic-dark/10',
            'text-sm text-center text-accent-metallic'
          )}
        >
          © {currentYear} Propulsion Society. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
