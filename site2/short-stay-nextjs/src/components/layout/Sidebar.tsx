'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  FileText,
  DollarSign,
  Settings,
  Phone,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/properties', label: 'My Properties', icon: Home },
  { path: '/dashboard/pricelab', label: 'Price Lab', icon: BarChart3 },
  { path: '/dashboard/appraisal', label: 'Appraisal Report', icon: FileText },
  { path: '/dashboard/pricing', label: 'Pricing Plan', icon: DollarSign },
  { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  { path: '/dashboard/contact', label: 'Contact Us', icon: Phone },
];

export function Sidebar({ isCollapsed = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
        <Link href="/dashboard" onClick={onClose}>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
          ) : (
            <Image
              src="/images/logo.svg"
              alt="Short Stay Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
