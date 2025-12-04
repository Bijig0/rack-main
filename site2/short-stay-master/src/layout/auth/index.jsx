import React from "react";
import PublicBg from "../../assets/images/contactimg.svg";

export default function AuthContainer({ src, title, description, children }) {
  return (
    <div
      className="grid m-0"
      style={{ height: "calc(100vh - var(--header-height, 0px))" }}
    >
      <div
        className="col-12 md:col-6 p-0"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${PublicBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="public-right-side flex flex-column justify-content-center align-items-center h-full mx-auto">
          <h1 className="text-6xl text-white line-height-2">
            From front door to forecast – Your property investment journey
            starts here.
          </h1>
          <p className="text-lg text-gray text-white">
            Discover high-potential short stay properties with dynamic rental
            appraisals, on-site checklists, and integrated environmental risk
            data—powered by leading industry APIs.
          </p>
        </div>
      </div>
      <div className=" p-4 col-12 md:col-6 flex align-items-center justify-content-center">
        <div className="p-5 bg-cream-light border-round-xl w-30rem">
          {src && <img src={src} alt="" className="mx-auto block" />}
          <h2 className="text-dark text-3xl m-0 text-center">{title}</h2>
          {description && (
            <p className="text-gray text-center mt-0">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
