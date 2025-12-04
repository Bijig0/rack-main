import React from "react";
import PublicLayout from "../../layout/Public";
import HeroImg from "../../assets/images/hero-img.svg";
import CustomContainer from "../shared/components/CustomContainer";
import PrimaryButton, {
  OutlinedButton,
} from "../shared/components/CustomButton";
import RevenueImg from "../../assets/images/revenue-img.svg";
import CheckIcon from "../../assets/images/icons/check-circle.svg";
import CoreLogicImg from "../../assets/images/corelogic.svg";
import AirDnaImg from "../../assets/images/airdna.svg";
import WheelHouseImg from "../../assets/images/wheelhouse.svg";
import ModernImg from "../../assets/images/modernimg.svg";
import CrossIcon from "../../assets/images/icons/crossicon.svg";
import Avatar1 from "../../assets/images/avatar.svg";
import Avatar2 from "../../assets/images/avatar1.svg";
import Avatar3 from "../../assets/images/avatar2.svg";
import { Carousel } from "primereact/carousel";
import { Avatar } from "primereact/avatar";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function Home() {
  const pricingfeatures = [
    {
      title: "Customizable Data-Driven Smart Pricing",
      description:
        "Intelligent price recommendations considering market trends like supply, demand, seasons, events, and holidays, with full control over the final prices",
    },
    {
      title: "Advanced Minimum Stay Intelligence",
      description:
        "Optimize booking duration with helpful recommendations specific to each property",
    },
    {
      title: "Time-Saving Workflows",
      description:
        "View and update multiple properties in bulk with MultiCalendar, CSVs or APIs to save valuable time",
    },
  ];
  const trustedindustries = [
    {
      img: CoreLogicImg,
    },
    {
      img: AirDnaImg,
    },
    {
      img: WheelHouseImg,
    },
  ];
  const toolFeatures = [
    {
      icon: "📋",
      title: "Structured Property Checklists",
      description:
        "Capture every detail during site visits, with customizable fields and mobile-friendly design.",
    },
    {
      icon: "📈",
      title: "Live Market Data Panel",
      description:
        "Visualize pricing trends, occupancy rates, and demand indicators from trusted APIs—right where you need them.",
    },
    {
      icon: "📄",
      title: "Automated Rental Appraisal Generator",
      description:
        "Produce sleek, data-backed reports in minutes—perfect for investor presentations or internal evaluations.",
    },
  ];
  const platformComparison = {
    withPlatform: [
      {
        text: "All your data, aggregated in one place",
      },
      {
        text: "Standardized reports ready for investors",
      },
      {
        text: "Instant alerts for planning & risk factors",
      },
      {
        text: "Make decisions backed by real-time analytics",
      },
    ],
    withoutPlatform: [
      {
        text: "Manually searching 5+ sites for data",
      },
      {
        text: "Inconsistent, unstructured appraisals",
      },
      {
        text: "Overlooking zoning and environmental risks",
      },
      {
        text: "Relying on gut feeling",
      },
    ],
  };
  const testimonials = [
    {
      name: "Mark McCarthy",
      avatar: Avatar1,
      rating: 5,
      comment:
        "This platform saves me hours every week. The generated reports are investor-ready and backed by real-time data.",
    },
    {
      name: "Robert Fox",
      avatar: Avatar2,
      rating: 5,
      comment:
        "As an investor, I need clarity. This tool gives me the confidence to act quickly on the right properties.",
    },
    {
      name: "James Wilson",
      avatar: Avatar3,
      rating: 5,
      comment:
        "This platform saves me hours every week. The appraisal reports are investor-ready and backed by real-time data.",
    },
    {
      name: "Mark McCarthy",
      avatar: Avatar1,
      rating: 5,
      comment:
        "This platform saves me hours every week. The generated reports are investor-ready and backed by real-time data.",
    },
  ];
  const pricingPlans = [
    {
      type: "STARTER PLAN",
      price: "$29",
      currency: "AUD",
      period: "/month",
      description: "Ideal For: New buyer agents or low-volume users",
      features: [
        "Create and manage up to 10 properties",
        "Access to 3 checklist templates",
        "Generate up to 10 rental appraisal reports/month",
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
        "Create and manage unlimited properties",
        "Access to all available checklist templates",
        "Generate unlimited appraisal reports",
        "Priority email support",
        "Early access to new features",
      ],
      buttonLabel: "Get Started",
      buttonVariant: "outlined",
    },
  ];
  const faqItems = [
    {
      question: "What types of properties are supported?",
      answer:
        "Residential properties, with support for short stay market analysis.",
    },
    {
      question: "Can I export or share reports?",
      answer:
        "Yes, all reports can be exported as PDFs and shared directly via email or download link.",
    },
    {
      question: "Is this platform only for buyer agents?",
      answer:
        "No, our platform is designed for buyer agents, property managers, and investors looking to analyze short-stay potential.",
    },
    {
      question: "What data sources are used?",
      answer:
        "We integrate with leading industry APIs including AirDNA, CoreLogic, and other trusted data providers for accurate market insights.",
    },
  ];
  return (
    <PublicLayout>
      {/* hero section */}
      <div className="bg-primary-color py-8">
        <CustomContainer>
          <div className="grid align-items-center">
            <div className="col-12 md:col-6">
              <p className="text-3xl lg:text-6xl font-bold text-white m-0 ">
                From front door to forecast – Your property investment journey
                starts here.
              </p>
              <p className="text-base md:text-xl text-white">
                Discover high-potential short stay properties with dynamic
                rental appraisals, on-site checklists, and integrated
                environmental risk data—powered by leading industry APIs.
              </p>
              <PrimaryButton
                className="bg-surface-card text-primary-color"
                label="Download Sample Report"
              />
            </div>
            <div className="col-12 md:col-6">
              <img src={HeroImg} alt="" className="w-full" />
            </div>
          </div>
        </CustomContainer>
      </div>
      {/* end hero section */}
      <div className="py-8">
        <CustomContainer>
          <div className="text-center w-full md:w-10 lg:w-8 mx-auto">
            <h1 className="text-5xl mb-2 text-dark">
              Increase Revenue With Data-Driven Pricing
            </h1>
            <p className="text-lg text-gray">
              From pinpointing a property to presenting investor-ready
              reports—our dashboard brings every step of the appraisal journey
              into one seamless workflow.
            </p>
          </div>
          <div className="grid align-items-center">
            <div className="col-12 md:col-6">
              <img src={RevenueImg} alt="" className="w-full" />
            </div>
            <div className="col-12 md:col-6">
              <h3 className="text-dark m-0   text-2xl">Dynamic Pricing</h3>
              <p className="text-gray m-0 mb-3">
                Now with Hyper Local Pulse (HLP), our smart pricing algorithm
                that uses hyper local market data to make accurate pricing
                decisions
              </p>
              <ul className="m-0 p-0">
                {pricingfeatures.map((feature, index) => (
                  <li key={index} className="flex align-items-start gap-3 mb-2">
                    <img src={CheckIcon} alt="" />
                    <div>
                      <h5 className="text-dark m-0 text-lg">{feature.title}</h5>
                      <p className="text-gray my-2">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CustomContainer>
      </div>
      <div className="py-8 bg-dark">
        <CustomContainer>
          <div className="grid align-items-center">
            <div className="col-12 lg:col-6">
              <h3 className="text-white text-center m-0 lg:text-left text-2xl">
                Powered by Trusted Industry Data Sources
              </h3>
            </div>
            <div className="col-12 lg:col-6">
              <div className="flex align-items-center justify-content-between gap-3 overflow-auto industry-img">
                {trustedindustries.map((feature, index) => (
                  <img src={feature.img} alt="" width={250} className="" />
                ))}
              </div>
            </div>
          </div>
        </CustomContainer>
      </div>
      <div className="py-8 bg-light-color">
        <CustomContainer>
          <div className="text-center w-full md:w-10 lg:w-8 mx-auto">
            <h1 className="text-5xl mb-2 text-dark">
              Powerful Tools. Clean, Modern Interface.
            </h1>
            <p className="text-lg text-gray">
              From pinpointing a property to presenting investor-ready
              reports—our dashboard brings every step of the appraisal journey
              into one seamless workflow.
            </p>
          </div>
          <div className="grid">
            <div className="col-12 lg:col-6 md:pr-4">
              <ul className="p-0 list-none">
                {toolFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="bg-white shadow-2 p-3 border-round-lg mb-4"
                  >
                    <div className="text-dark text-xl font-bold">
                      {feature.icon} {feature.title}
                    </div>
                    <p className="text-gray my-2">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-12 lg:col-6">
              <img src={ModernImg} alt="" className="w-full" />
            </div>
          </div>
        </CustomContainer>
      </div>
      <div className="py-8">
        <CustomContainer>
          <div className="text-center w-full md:w-10 lg:w-8 mx-auto">
            <h1 className="text-5xl mb-2 text-dark">Why Use Our Platform</h1>
          </div>
          <div className="w-full md:w-10 mx-auto grid mt-4">
            <div className="col-12 md:col-6">
              <div className="shadow-2 p-4 border-round-lg">
                <h3 className="text-xl text-primary-color font-semibold mt-0 mb-4">
                  With Our Platform
                </h3>
                <ul className="list-none p-0 m-0">
                  {platformComparison.withPlatform.map((item, index) => (
                    <li
                      key={index}
                      className="flex align-items-center gap-3 mb-3"
                    >
                      <img src={CheckIcon} alt="" />
                      <span className="text-dark">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="shadow-2 p-4 border-round-lg h-full">
                <h3 className="text-xl text-primary-color font-semibold mt-0 mb-4">
                  Without Our Platform
                </h3>
                <ul className="list-none p-0 m-0">
                  {platformComparison.withoutPlatform.map((item, index) => (
                    <li
                      key={index}
                      className="flex align-items-center gap-3 mb-3"
                    >
                      <img src={CrossIcon} alt="" />
                      <span className="text-dark">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CustomContainer>
      </div>
      <div className="pt-6 pb-8 bg-primary-color">
        <CustomContainer>
          <div className="text-center w-full md:w-10 lg:w-8 mx-auto">
            <h1 className="text-5xl mb-2 text-white">Testimonials</h1>
          </div>
          <Carousel
            value={testimonials}
            numVisible={3}
            numScroll={1}
            showIndicators={false}
            responsiveOptions={[
              {
                breakpoint: "1024px",
                numVisible: 2,
                numScroll: 1,
              },
              {
                breakpoint: "768px",
                numVisible: 1,
                numScroll: 1,
              },
            ]}
            prevIcon="pi pi-arrow-left"
            nextIcon="pi pi-arrow-right"
            className="custom-carousel mb-7 relative"
            pt={{
              previousButton: {
                className:
                  "prev-btn-arrow p-2 border-round-lg shadow-2",
              },
              nextButton: {
                className:
                  "cursor-pointer next-btn-arrow p-2 border-round-lg shadow-2",
              },
            }}
            itemTemplate={(testimonial) => (
              <div className="p-4">
                <div className="bg-white p-4 border-round-xl shadow-2">
                  <div className="flex align-items-center gap-3 mb-3">
                    <Avatar
                      image={testimonial.avatar}
                      size="large"
                      shape="circle"
                    />
                    <div>
                      <h3 className="text-base text-dark font-semibold m-0">
                        {testimonial.name}
                      </h3>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i
                          key={i}
                          className="pi pi-star-fill text-golden mr-1"
                        ></i>
                      ))}
                    </div>
                  </div>

                  <p className="m-0 line-height-3 text-gray-700">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            )}
          />
        </CustomContainer>
      </div>
      <div className="py-8" id="pricing">
        <CustomContainer>
          <div className="text-center w-full md:w-10 lg:w-8 mb-6 mx-auto">
            <h2 className="text-4xl font-bold text-dark mb-3">
              Simple Pricing for Powerful Insights.
            </h2>
            <p className="text-gray text-xl">
              Whether you're a solo agent or managing multiple clients, our
              plans scale with your needs.
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
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        label={plan.buttonLabel}
                        className={`w-full justify-content-center center-icon-btn border-primary ${
                          plan.isPopular
                            ? "bg-primary-color text-white"
                            : "bg-white text-primary-color"
                        }`}
                      />
                    )}
                    {!plan.isPopular && (
                      <OutlinedButton
                        iconPos="right"
                        icon="pi pi-arrow-right"
                        label={plan.buttonLabel}
                        className="text-primary-color w-full justify-content-center center-icon-btn"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CustomContainer>
      </div>
      <div className="py-8 bg-light-color">
        <CustomContainer>
          <div className="text-center  w-full md:w-10 lg:w-8 mb-6 mx-auto">
            <h2 className="text-4xl font-bold text-dark mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="w-full md:w-8 mx-auto">
            <Accordion className="faq-accordion-tab">
              {faqItems.map((item, index) => (
                <AccordionTab
                  key={index}
                  header={
                    <div className="flex align-items-center gap-2 p-3">
                      <span className="text-lg font-bold text-dark">
                        {item.question}
                      </span>
                    </div>
                  }
                >
                  <div className="p-3">
                    <p className="text-gray line-height-3 m-0">{item.answer}</p>
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </CustomContainer>
      </div>
    </PublicLayout>
  );
}
