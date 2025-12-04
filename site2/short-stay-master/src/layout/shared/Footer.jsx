import React, { useState } from "react";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";
import CustomContainer from "../../pages/shared/components/CustomContainer";
import LinkedinIcon from "../../assets/images/icons/linkedin.svg";
import InstagramIcon from "../../assets/images/icons/instagram.svg";

export default function Footer() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <footer id="contact" className="bg-dark text-white px-4 pt-6 pb-2">
      <CustomContainer>
        <div className="grid ">
          {/* Company Info */}
          <div className="col-12 lg:col-5 mb-4">
            <div className="px-2">
              <div className="flex align-items-center mb-3">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="h-10 w-auto mr-2"
                />
              </div>
              <p className="text-gray-400">
                From front door to forecast – Your property investment journey
                starts here. Discover high-potential short stay properties with
                dynamic rental appraisals, on-site checklists, and integrated
                environmental risk data—powered by leading industry APIs.
              </p>
            </div>
          </div>
          <div className="md:col-7">
            <div className="grid">
              {/* Links */}
              <div className="col-12 lg:col-4 mb-4">
                <div className="px-2">
                  <h4 className="font-semibold text-white mb-3">Links</h4>
                  <ul className="list-none p-0 m-0">
                    <li className="mb-2">
                      <Link
                        to="/"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          const el = document.getElementById("pricing");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        Pricing
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/how-we-are-different"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        How We’re Different
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        Media
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support */}
              <div className="col-12 lg:col-4 mb-4">
                <div className="px-2">
                  <h4 className="font-semibold text-white mb-3">Support Us</h4>
                  <ul className="list-none p-0 m-0">
                    <li className="mb-2">
                      <Link
                        to="/contact-us"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/terms-of-service"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/privacy-policy"
                        className="text-gray-400 hover:text-white transition-colors no-underline"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact */}
              <div className="col-12 lg:col-4 mb-4">
                <div className="px-2 text-right">
                  <h4 className="font-semibold text-white mb-3">Contact Us</h4>
                  <div
                    className="flex justify-content-end"
                    style={{ gap: "1rem" }}
                  >
                    <Link
                      href="#"
                      className="w-2rem h-2rem bg-white border-circle flex align-items-center justify-content-center text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      <img src={LinkedinIcon} alt="" />
                    </Link>
                    <Link
                      href="#"
                      className="w-2rem h-2rem bg-white border-circle flex align-items-center justify-content-center text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      <img src={InstagramIcon} alt="" />
                      {/* <i className="pi pi-instagram text-primary-color"></i> */}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomContainer>
      <div className="col-12 border-top-gray">
        <div className="border-to1 border-gray-800 py-3 text-center">
          <p className="text-gray-400 m-0">
            Copyright ©2025 BARRY. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
