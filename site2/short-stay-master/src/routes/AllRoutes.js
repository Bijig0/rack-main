
import AccountSetting from "../Views/account-setting";
import ChangePassword from "../Views/account-setting/ChangePassword";
import EditProfile from "../Views/account-setting/EditProfile";
import AppraisalReport from "../Views/appraisal-report";
import GenerateAppraisal from "../Views/appraisal-report/GenerateAppraisal";
import Subscription from "../Views/appraisal-report/Subscription";
import ContactUs from "../Views/contact-us";
import Dashboard from "../Views/dashboard";
import MyProperties from "../Views/my-properties";
import CreateAddress from "../Views/my-properties/CreateAddress";
import PropertyEstimator from "../Views/pricelab/PropertyEstimator";
import PropertyList from "../Views/pricelab/PropertyList";
import PricingPlan from "../Views/pricing";
import Payment from "../Views/pricing/Payment";


export const PrivateRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    exact: true,
  },
  // {
  //   path: "/privacy-policy",
  //   name: "Privacy Policy",
  //   component: PrivacyPolicy,
  //   exact: true,
  // },
  // {
  //   path: "/terms-of-service",
  //   name: "Term Of service",
  //   component: TermsOfService,
  //   exact: true,
  // },
  {
    path: "/pricing-plan",
    name: "Pricing Plan",
    component: PricingPlan,
    exact: true,
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment,
    exact: true,
  },
  {
    path: "/properties",
    name: "Properties",
    component: MyProperties,
    exact: true,
  },
  {
    path: "/create-address",
    name: "Create Address",
    component: CreateAddress,
    exact: true,
  },
  {
    path: "/appraisal-report",
    name: "Appraisal Report",
    component: AppraisalReport,
    exact: true,
  },
  {
    path: "/generate-appraisal",
    name: "Appraisal Report",
    component: GenerateAppraisal,
    exact: true,
  },
  {
    path: "/subscription",
    name: "Subscription",
    component: Subscription,
    exact: true,
  },
  {
    path: "/account-setting",
    name: "Account Setting",
    component: AccountSetting,
    exact: true,
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: EditProfile,
    exact: true,
  },
  {
    path: "/change-password",
    name: "Change Password",
    component: ChangePassword,
    exact: true,
  },
  {
    path: "/contact-panel",
    name: "Contact Us",
    component: ContactUs,
    exact: true,
  },
   {
    path: "/pricelab-estimator/:id",
    name: "Pricalab Estimator",
    component: PropertyEstimator,
    exact: true,
  },
   {
    path: "/my-property",
    name: "Property Details",
    component: PropertyList,
    exact: true,
  },
];
