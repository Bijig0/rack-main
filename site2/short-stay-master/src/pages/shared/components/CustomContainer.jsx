import React from "react";

export default function CustomContainer({className,children}) {
  return <div className={`container ${className}`}>{children}</div>;
}
