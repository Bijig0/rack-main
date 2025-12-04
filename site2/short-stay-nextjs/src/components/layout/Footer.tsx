import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Short Stay Logo"
                width={150}
                height={40}
                className="h-10 w-auto mb-4"
              />
            </Link>
            <p className="text-white/80 max-w-md">
              Your trusted partner for short-term rental property analysis and
              investment insights. Make data-driven decisions with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-we-are-different" className="text-white/80 hover:text-white transition-colors">
                  How We&apos;re Different
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-white/80 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-white/80 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Short Stay. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
