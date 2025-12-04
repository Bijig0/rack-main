'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block bg-primary h-screen transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarVisible && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarVisible(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 bg-primary z-50 lg:hidden">
            <Sidebar onClose={() => setSidebarVisible(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          onMenuToggle={() => setSidebarVisible(true)}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-auto p-6 bg-light">{children}</main>
      </div>
    </div>
  );
}
