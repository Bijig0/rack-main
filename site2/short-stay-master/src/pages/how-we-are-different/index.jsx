import React from "react";
import PublicLayout from "../../layout/Public";
import CustomContainer from "../shared/components/CustomContainer";
import HouseImg from "../../assets/images/houseimg.svg";
import CheckIcon from "../../assets/images/icons/check-circle.svg";
import IconImg from "../../assets/images/icons/iconimg.svg";
import { Link } from "react-router-dom";

export default function HowWeAreDifferent() {
  // const comparisonData = [
  //   {
  //     title: "Without Us",
  //     description:
  //       "Jump between CoreLogic, AirDNA, PriceLabs, and other platforms manually.",
  //   },
  //   {
  //     title: "With Us",
  //     description:
  //       "We bring them all together—automated, accurate, and updated in one place.",
  //   },
  // ];
  const featuresData = [
    {
      title: "Property images & checklists",
    },
    {
      title: "Revenue forecasts",
    },
    {
      title: "Comparable listings",
    },
    {
      title: "Environmental risk insights",
    },
    {
      title: "Market trend charts",
    },
  ];
  return (
    <PublicLayout>
      <div className="bg-primary-color py-6">
        <CustomContainer>
          <h1 className="text-white">How We’re Different</h1>
          <p className="text-white">
            Why property professionals choose us over generic tools.
          </p>
        </CustomContainer>
      </div>
      <div className=" py-6">
        <CustomContainer>
          <h1 className="text-dark">Purpose-Built for Buyer Agents</h1>
          <p className="text-gray">
            Unlike generic property tools, our platform is designed specifically
            for buyer agents and property investors evaluating short-stay
            potential. Every feature is tailored for your real-world appraisal
            process.
          </p>
        </CustomContainer>
      </div>
      <div className="py-6 bg-light-color">
        <CustomContainer>
          <h1 className="text-dark">Centralized Data from Trusted Sources</h1>
          <p className="text-gray">
            Unlike other tools, our platform brings everything under one roof —
            with your branding and documents included.
          </p>
          <div className="grid mt-4">
            <div className="col-12 md:col-6">
              <div className="bg-white p-4 border-round-lg shadow-1 h-full">
                <h3 className="mt-0 text-xl text-dark">Without Us</h3>
                <ul className="p-0">
                  <li className="flex align-items-start gap-3">
                    <img src={CheckIcon} alt="" width={25} />
                    Manually switch between CoreLogic, AirDNA, PriceLabs, and
                    other platforms. Re-enter data. Rebuild reports.
                  </li>
                  <li className="flex align-items-start gap-3">
                    <img src={CheckIcon} alt="" width={25} />
                    No consistency. No branding.
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="bg-white p-4 border-round-lg shadow-1 h-full">
                <h3 className="mt-0 text-xl text-dark">With Short Stay</h3>
                <ul className="p-0">
                  <li className="flex align-items-center gap-3 font-bold text-dark mb-2">
                    <img src={IconImg} alt="" width={40} />
                    BrightStay Realty
                  </li>
                  <li className="flex align-items-start gap-3 font-medium text-dark mb-2">
                    BrightStay Realty
                  </li>
                  <li className="flex align-items-start gap-3 text-gray ">
                    Verified Buyer Agent
                  </li>
                </ul>
                <Link to="" className="">john@brightstay.com</Link>
              </div>
            </div>
            {/* {comparisonData.map((item, index) => (
              <div className="md:col-6">
                <div className="bg-white p-4 border-round-lg shadow-1">
                  <h3 className="mt-0 text-xl text-dark">{item.title}</h3>
                  <p className="text-gray">{item.description}</p>
                </div>
              </div>
            ))} */}
          </div>
        </CustomContainer>
      </div>
      <div className="grid align-items-center m-0">
        <div className="md:col-6 p-0">
          <img src={HouseImg} alt="" className="w-full h-full" />
        </div>
        <div className="md:col-6 p-0">
          <div className="px-4">
            <h1 className="text-dark">Appraisal Reports that Impress</h1>
            <p className="text-lg">
              Our reports are professionally formatted, investor-ready PDFs
              with:
            </p>
            <ul className="m-0 p-0">
              {featuresData.map((feature, index) => (
                <li className="flex mb-2 gap-3" key={index}>
                  <img src={CheckIcon} alt="" />
                  {feature.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="py-6 bg-light-color">
        <CustomContainer>
          <h1 className="text-dark">Dynamic Checklists, Your Way</h1>
          <p className="text-gray">
            Use our checklist templates or customize your own. Capture the exact
            data you need—nothing more, nothing less.
          </p>
        </CustomContainer>
      </div>
    </PublicLayout>
  );
}
