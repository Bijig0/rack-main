'use client';

import React from 'react';
import { Menu, PanelLeftClose, PanelLeft, Bell } from 'lucide-react';

interface TopbarProps {
  onMenuToggle: () => void;
  onCollapse: () => void;
  isCollapsed: boolean;
}

export function Topbar({ onMenuToggle, onCollapse, isCollapsed }: TopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray" />
        </button>

        {/* Desktop collapse button */}
        <button
          onClick={onCollapse}
          className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 text-gray" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-gray" />
          )}
        </button>

        <h1 className="text-lg font-semibold text-dark">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
          U
        </div>
      </div>
    </div>
  );
}
