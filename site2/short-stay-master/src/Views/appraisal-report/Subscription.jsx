import React from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import CheckIcon from "../../assets/images/icons/check-circle.svg";
import PrimaryButton, {
  OutlinedButton,
} from "../../pages/shared/components/CustomButton";

export default function Subscription() {
  const plans = [
    {
      name: "STARTER PLAN",
      price: "29",
      currency: "AUD $",
      period: "/month",
      features: [
        "Ideal For: New buyer agents or low-volume users",
        "Create and manage up to 10 properties",
        "Access to 2 checklist templates",
        "Generate up to 10 rental appraisal reports/month",
      ],
      button: "Select Plan",
      current: false,
      outlined: true,
    },
    {
      name: "PROFESSIONAL PLAN",
      price: "59",
      currency: "AUD $",
      period: "/month",
      features: [
        "Ideal For: Active agents managing multiple properties",
        "Access to unlimited checklist templates",
        "Generate up to 50 rental appraisal reports/month",
        "Email support",
      ],
      button: "Cancel Plan",
      current: true,
      outlined: false,
    },
    {
      name: "PREMIUM PLAN",
      price: "99",
      currency: "AUD $",
      period: "/month",
      features: [
        "Ideal For: Power users and agencies",
        "Create and manage unlimited properties",
        "Access to all available checklist templates",
        "Generate unlimited appraisal reports",
        "Priority email support",
        "Early access to new features",
      ],
      button: "Select Plan",
      current: false,
      outlined: true,
    },
  ];

  const billingHistory = [
    {
      purchaseDate: "Jan 07, 2025",
      validDate: "Feb 07, 2025",
      plan: "Starter Plan",
      amount: "AUD $29",
      status: "Cancelled",
    },
    {
      purchaseDate: "Dec 07, 2024",
      validDate: "Jan 07, 2025",
      plan: "Professional Plan",
      amount: "AUD $59",
      status: "Paid",
    },
    {
      purchaseDate: "Nov 07, 2024",
      validDate: "Dec 07, 2024",
      plan: "Premium Plan",
      amount: "AUD $99",
      status: "Paid",
    },
    {
      purchaseDate: "Oct 07, 2024",
      validDate: "Nov 07, 2024",
      plan: "Starter Plan",
      amount: "AUD $29",
      status: "Cancelled",
    },
    {
      purchaseDate: "Sep 07, 2024",
      validDate: "Oct 07, 2024",
      plan: "Professional Plan",
      amount: "AUD $59",
      status: "Paid",
    },
  ];

  const checkIcon = (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="9" fill="#E6F4EF" />
      <path
        d="M6.75 9.75l1.5 1.5 3-3"
        stroke="#1A7F5A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <PrivateLayout>
      <TitleContainer title="Subscription Plans" searchinput={false} />
      <div className="grid mt-2">
        {plans.map((plan, index) => (
          <div key={index} className="col-12 md:col-4 p-3">
            <div
              className="p-4 border-round-xl bg-white shadow-1 h-full flex flex-column"
              style={{ position: "relative" }}
            >
              <div>
                <h3 className="text-base font-semibold text-dark mb-2">
                  {plan.name}
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
                {plan.current && (
                  <span
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      background: "#204745",
                      color: "#fff",
                      borderRadius: 16,
                      fontSize: 12,
                      padding: "2px 12px",
                    }}
                  >
                    Current Plan
                  </span>
                )}
              </div>
              <div className="flex-grow-1">
                <h4 className="text-base font-semibold text-dark mb-3">
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
              <div className="mt-4 pt-4">
                {plan.current ? (
                  <PrimaryButton
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    label={plan.button}
                    className="w-full border-primary bg-primary-color justify-content-center center-icon-btn text-white"
                  />
                ) : (
                  <OutlinedButton
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    label={plan.button}
                    className="text-primary-color justify-content-center center-icon-btn w-full"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="bg-white shadow-1 border-round-lg p-4">
        <div className="font-bold mb-3" style={{ fontSize: 18 }}>
          Billing History
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#F6F8F9" }}>
                <th className="py-2 px-3 text-left font-semibold text-sm">
                  Purchase Date
                </th>
                <th className="py-2 px-3 text-left font-semibold text-sm">
                  Valid Date
                </th>
                <th className="py-2 px-3 text-left font-semibold text-sm">
                  Subscription Plan
                </th>
                <th className="py-2 px-3 text-left font-semibold text-sm">
                  Amount
                </th>
                <th className="py-2 px-3 text-left font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td className="py-2 px-3 text-sm">{row.purchaseDate}</td>
                  <td className="py-2 px-3 text-sm">{row.validDate}</td>
                  <td className="py-2 px-3 text-sm">{row.plan}</td>
                  <td className="py-2 px-3 text-sm font-semibold">
                    {row.amount}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    <span
                      style={{
                        color: row.status === "Paid" ? "#1A7F5A" : "#E53935",
                        fontWeight: 600,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PrivateLayout>
  );
}
