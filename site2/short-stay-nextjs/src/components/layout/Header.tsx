'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { OutlinedButton } from '@/components/ui/Button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = ['/register', '/login'].includes(pathname);

  const scrollToPricing = () => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-primary text-white relative z-50 py-4">
      <Container>
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Short Stay Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 bg-transparent text-white border border-white rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Navigation Menu */}
          <div
            className={`${
              isMobileMenuOpen
                ? 'fixed top-16 left-0 right-0 bg-primary p-4 shadow-lg'
                : 'hidden'
            } lg:flex lg:relative lg:bg-transparent lg:p-0 lg:shadow-none lg:items-center lg:gap-8`}
          >
            {!isAuthPage && (
              <>
                {/* Navigation Links */}
                <nav className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                  <Link
                    href="/"
                    className="text-white hover:text-white/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <button
                    onClick={scrollToPricing}
                    className="text-white hover:text-white/80 transition-colors text-left"
                  >
                    Pricing
                  </button>
                  <Link
                    href="/how-we-are-different"
                    className="text-white hover:text-white/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How We&apos;re Different
                  </Link>
                  <Link
                    href="/contact-us"
                    className="text-white hover:text-white/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-4 lg:mt-0">
                  <Link href="/login" className="text-white hover:text-white/80">
                    Sign In
                  </Link>
                  <Link href="/register">
                    <OutlinedButton
                      label="Get Started"
                      className="border-white text-white hover:bg-white hover:text-primary"
                    />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
