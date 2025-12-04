import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import SmallLogo from "../../assets/images/collapselogo.svg";

const menuItems = [
  { icon: "pi pi-th-large", label: "Dashboard", path: "/dashboard" },
  { icon: "pi pi-home", label: "Property & Checklists", path: "/properties" },
  { icon: "pi pi-file", label: "Appraisal Reports", path: "/appraisal-report" },
  { icon: "pi pi-ticket", label: "Subscription Plans", path: "/subscription" },
  { icon: "pi pi-file", label: "PricaLab Estimator", path: "/my-property" },
  { icon: "pi pi-cog", label: "Account Settings", path: "/account-setting" },
];

export default function Sidebar({ isCollapsed }) {
  const location = useLocation();

  const MenuItem = ({ icon, label, path }) => (
    <Link
      to={path}
      className={`flex align-items-center p-3 text-white no-underline transition-colors border-round-lg ${location.pathname === path
        ? "bg-dark"
        : ""
        }`}
    >
      <i className={`${icon} mr-2`}></i>
      <span className={`font-medium ${isCollapsed ? "hidden" : ""}`}>{label}</span>
    </Link>
  );

  return (
    <div className="flex flex-column h-full">
      {/* Logo Section */}
      <div className={` border-white-alpha-20 ${isCollapsed ? "p-2" : "p-4"}`}>
        <img src={isCollapsed ? SmallLogo : Logo} alt="Short Stay" className={isCollapsed ? "2rem" : "w-10rem"} />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <ul className={`list-none m-0 ${isCollapsed ? "p-2" : "p-3"}`}>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <MenuItem {...item} />
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile Section */}
      <div className={isCollapsed ? "p-2" : "p-3"}>
        <Link
          to="/contact-panel"
          className={`flex align-items-center p-3 text-white no-underline transition-colors transition-duration-150 border-round-lg `}
        >
          <i className={`pi pi-envelope mr-2`}></i>
          <span className={`font-medium ${isCollapsed ? "hidden" : ""}`}>Contact Us</span>
        </Link>
      </div>
    </div>
  );
}
