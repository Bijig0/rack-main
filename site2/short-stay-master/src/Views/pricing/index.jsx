import React from "react";
import PrivateLayout from "../../layout/Private";
import CheckIcon from "../../assets/images/icons/check-circle.svg";
import PrimaryButton, { OutlinedButton } from "../../pages/shared/components/CustomButton";
import { useNavigate } from "react-router-dom";

export default function PricingPlan() {
  const navigate = useNavigate();
    const pricingPlans = [
    {
      type: "STARTER PLAN",
      price: "$29",
      currency: "AUD",
      period: "/month",
      description: "Ideal For: New buyer agents or low-volume users",
      features: [
        "Ideal For: New buyer agents or low-volume users",
        "Create and manage up to 10 properties",
        "Access to 3 checklist templates ",
        "Generate up to 10 rental appraisal reports/month"
      ],
      buttonLabel: "Get Started",
      buttonVariant: "outlined",
    },
    {
      type: "PROFESSIONAL PLAN",
      price: "$59",
      currency: "AUD",
      period: "/month",
      description: "Ideal For: Active agents managing multiple properties",
      features: [
        "Ideal For: Active agents managing multiple properties",
        "Create and manage up to 50 properties",
        "Access to unlimited checklist templates",
        "Generate up to 50 rental appraisal reports/month",
        "Email support",
      ],
      buttonLabel: "Get Started",
      buttonVariant: "primary",
      isPopular: true,
    },
    {
      type: "PREMIUM PLAN",
      price: "$99",
      currency: "AUD",
      period: "/month",
      description: "Ideal For: Power users and agencies",
      features: [
        "Ideal For: Power users and agencies ",
        "Create and manage unlimited properties",
        "Access to all available checklist templates",
        "Generate unlimited appraisal reports",
        "Priority email support ",
        "Early access to new features ",
      ],
      buttonLabel: "Get Started",
      buttonVariant: "outlined",
    },
  ];
  return (
    <PrivateLayout>
      <div className="p-4">
        <div className="text-center w-full md:w-10 lg:w-8 mb-6 mx-auto">
          <h2 className="text-4xl font-bold text-dark mb-3">
            Simple Pricing for Powerful Insights.
          </h2>
          <p className="text-gray text-xl">
            Whether you're a solo agent or managing multiple clients, our plans
            scale with your needs.
          </p>
        </div>

        <div className="grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="col-12 md:col-4 p-3">
              <div
                className={`p-4 border-round-xl bg-white shadow-1 h-full flex flex-column `}
              >
                <div className="">
                  <h3 className={`text-base font-semibold text-dark mb-2`}>
                    {plan.type}
                  </h3>
                  <div className="flex align-items-baseline">
                    <span className="text-4xl text-primary-color font-bold">
                      {plan.currency}
                    </span>
                    <span className="text-4xl text-primary-color font-bold mx-1">
                      {plan.price}
                    </span>
                    <span className="text-lg text-dark">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-grow-1">
                  <h4 className={`text-base font-semibold text-dark mb-3 `}>
                    What's Included:
                  </h4>
                  <ul className="list-none p-0 m-0">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex align-items-center text-gray gap-2 mb-3"
                      >
                        <img src={CheckIcon} alt="" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 ">
                  {plan.isPopular && (
                    <PrimaryButton
                      label={plan.buttonLabel}
                      className={`w-full border-primary ${
                        plan.isPopular
                          ? "bg-primary-color text-white"
                          : "bg-white text-primary-color"
                      }`}
                      onClick={() => navigate("/payment")}
                    />
                  )}
                  {!plan.isPopular && (
                    <OutlinedButton
                      label={plan.buttonLabel}
                      className="text-primary-color w-full"
                      onClick={() => navigate("/payment")}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrivateLayout>
  );
}
