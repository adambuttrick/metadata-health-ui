'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Text } from '../typography/typography';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav 
      className="border-b bg-white relative" 
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-28 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-4 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            prefetch={false}
            aria-label="Home - DataCite Metadata Health Reports"
          >
            <Image 
              src="/grei.svg" 
              width={100} 
              height={100} 
              alt="GREI Logo"
              className="h-12 w-auto sm:h-16"
              priority
            />
            <Image 
              src="/logo.svg" 
              width={100} 
              height={100} 
              alt="DataCite Metadata Health Reports Logo"
              className="h-12 w-auto sm:h-16"
              priority
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs sm:text-sm font-medium bg-datacite-light-blue text-white">
              Demo
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-datacite-dark-blue hover:text-datacite-light-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-6" role="menubar">
            <Link
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              role="menuitem"
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              <Text 
                variant="body" 
                className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
              >
                Search
              </Text>
            </Link>
            <Link
              href="/compare"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              role="menuitem"
              aria-current={pathname === '/compare' ? 'page' : undefined}
            >
              <Text 
                variant="body" 
                className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
              >
                Compare
              </Text>
            </Link>
            <Link
              href="/about"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              role="menuitem"
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              <Text 
                variant="body" 
                className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
              >
                About
              </Text>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } sm:hidden absolute w-full bg-white border-b z-50`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <Text 
              variant="body" 
              className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
            >
              Search
            </Text>
          </Link>
          <Link
            href="/compare"
            className="block py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === '/compare' ? 'page' : undefined}
          >
            <Text 
              variant="body" 
              className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
            >
              Compare
            </Text>
          </Link>
          <Link
            href="/about"
            className="block py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            <Text 
              variant="body" 
              className="text-datacite-dark-blue hover:text-datacite-light-blue transition-colors font-semibold"
            >
              About
            </Text>
          </Link>
        </div>
      </div>
    </nav>
  );
}