import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import CustomContainer from "../../pages/shared/components/CustomContainer";
import { OutlinedButton } from "../../pages/shared/components/CustomButton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`
      );
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <header
      ref={headerRef}
      className="bg-primary-color text-white relative z-50 md:px-4 py-3"
    >
      <CustomContainer>
        <div className="flex align-items-center justify-content-between relative">
          {/* Logo */}
          <div className="flex align-items-center">
            <Link to="/" className="no-underline">
              <img src={logo} alt="Company Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 bg-transparent text-white border-white border-1 border-round-lg hover:text-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i
              className={`pi ${isMobileMenuOpen ? "pi-times" : "pi-bars"
                } text-xl`}
            ></i>
          </button>

          {/* Navigation Menu */}
          <div
            className={`${isMobileMenuOpen ? "mobile-menu" : "hidden"
              } lg:flex navbar flex-column lg:flex-row align-items-start lg:align-items-center
            fixed lg:relative lg:justify-content-between lg:w-full 
            bg-primary-color lg:bg-transparent
            p-4 lg:p-0 shadow-lg lg::shadow-none
            lg:mt-0 gap-3`}
          >
            {/* Navigation Links */}

            {!["/register", "/login"].includes(currentPath) && (

              <nav className="w-full md:w-auto mx-auto">
                <div className="flex flex-column lg:flex-row gap-3 lg:gap-7">
                  <Link
                    to="/"
                    className="text-white no-underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  <Link
                    to="#"
                    className="text-white no-underline bg-transparent border-none cursor-pointer"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      const el = document.getElementById("pricing");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    Pricing
                  </Link>

                  <Link
                    to="/how-we-are-different"
                    className="text-white no-underline"
                  >
                    How We’re  Different
                  </Link>
                  <Link
                    to="/contact-us"
                    className="text-white no-underline"
                  >
                    Contact
                  </Link>
                </div>
              </nav>

            )}


            {/* Action Button  */}
            {!["/register", "/login"].includes(currentPath) && (
              <div className="flex flex-column-reverse mt-3 lg:mt-0 md:flex-row align-items-start md:align-items-center gap-3 w-full md:w-auto">
                <Link to="/register">
                  <OutlinedButton
                    label="Get Started"
                    className="w-full md:w-auto border-white text-white"
                  />
                </Link>
                <Link to="/login" className="text-white no-underline">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </CustomContainer>
    </header>
  );
}
