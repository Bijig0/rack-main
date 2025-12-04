import React, { useState } from "react";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import Sidebar from "../shared/Sidebar";
import Topbar from "../shared/Topbar";

export default function PrivateLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="grid m-0 h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block col-fixed ${
          isCollapsed ? "w-5rem" : "w-18rem"
        } bg-primary-color h-screen transition-all transition-duration-50`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <PrimeSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="w-18rem bg-primary-color p-0"
        showCloseIcon={false}
      >
        <Sidebar />
      </PrimeSidebar>

      {/* Main Content */}
      <div className="col p-0 h-full overflow-auto">
        {/* Header */}
        <Topbar 
          onMenuToggle={() => setSidebarVisible(true)} 
          onCollapse={toggleCollapse}
          isCollapsed={isCollapsed}
        />

        {/* Page Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}