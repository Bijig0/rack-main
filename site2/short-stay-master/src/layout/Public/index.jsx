import React from "react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

export default function PublicLayout({ children, showFooter = true }) {
  return (
    <>
      <Header />
      {children}
      {showFooter && <Footer />}
    </>
  );
}
