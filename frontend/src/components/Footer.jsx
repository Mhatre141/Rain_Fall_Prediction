/**
 * Footer — professional site footer
 */
import { CloudRain, ExternalLink, Heart } from 'lucide-react'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const footerLinks = {
  Product: [
    { label: 'Prediction',  href: '#predict' },
    { label: 'History',     href: '#history' },
    { label: 'About',       href: '#about'   },
  ],
  Technical: [
    { label: 'API Reference', href: '#', external: false },
    { label: 'GitHub Repo',   href: 'https://github.com', external: true },
    { label: 'Dataset',       href: 'https://www.kaggle.com/datasets/jsphyg/weather-dataset-rattle-package', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-14 mt-0" role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <CloudRain size={16} className="text-white" />
              </div>
              <span className="font-bold text-[17px] text-slate-900 dark:text-slate-50">RainSense</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Machine learning weather prediction trained on 145,000+ real Australian weather observations.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-label="View source on GitHub"
            >
              <GithubIcon size={16} />
              View on GitHub
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-4">
                {section}
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center gap-1.5"
                    >
                      {label}
                      {external && <ExternalLink size={10} aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} RainSense. Built with{' '}
            <Heart size={10} className="inline text-red-400 mx-0.5" aria-hidden="true" />
            using React + Flask + Scikit-learn.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span>MIT License</span>
            <span>·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
