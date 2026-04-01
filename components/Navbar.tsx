'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/discover', label: 'Discover' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/help', label: 'Help' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-white/5"
      style={{
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="TasteVault home"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-background"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 32 32"
              >
                <ellipse cx="16" cy="17" rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="13" y1="8" x2="13" y2="14"/>
                  <line x1="11.5" y1="14" x2="11.5" y2="19"/>
                  <line x1="13" y1="13" x2="13" y2="20"/>
                  <line x1="14.5" y1="14" x2="14.5" y2="19"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <path d="M19 14 L22 20 L16 20 Z"/>
                </g>
              </svg>
            </motion.div>
            <span className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
              TasteVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {session?.user && (
              <Link
                href="/my-kitchen"
                className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200 relative group"
              >
                My Kitchen
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </div>

          {/* Search & Auth */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-48 lg:w-64 px-4 py-2 pl-10 bg-surface border border-border rounded-full text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted">Loading...</span>
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-3 py-1 text-sm font-semibold bg-accent/10 text-accent border border-accent/20 rounded-full hover:bg-accent/20 transition-all duration-200">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </div>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-9 h-9 rounded-full border-2 border-accent/50 hover:border-accent transition-all duration-200 object-cover"
                  />
                )}
                <div className="relative group">
                  <button
                    onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface rounded-full transition-all duration-200"
                    aria-label="Sign out"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="hidden lg:inline">Sign out</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                    <Link
                      href="/my-kitchen"
                      className="block px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                      My Kitchen
                    </Link>
                    <button
                      onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-sm font-semibold rounded-full hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30"
                >
                  <span>Sign in</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="pt-4 pb-2 border-t border-border mt-2">
                <form onSubmit={handleSearch} className="mb-4">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-full text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                  />
                </form>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 text-base font-medium text-muted hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {session?.user && (
                  <Link
                    href="/my-kitchen"
                    className="block py-3 text-base font-medium text-muted hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Kitchen
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
