import { Building2, Home, Calendar, MapPin, Ruler, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useReportData } from "../hooks/useReportData";
import { DataBindingReference } from "@/components/builder/DataBindingReference";

function PropertyDetailStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-[-0.547px]">
        <p className="text-[13px] font-medium text-[#62748E] font-['Inter'] leading-[19.5px] tracking-[-0.13px]">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-[#0F172B] font-['Inter'] leading-[19.5px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function HomeIconSVG() {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.729492 8.52149C0.729424 8.23817 0.791103 7.95823 0.910217 7.70123C1.02934 7.44424 1.20303 7.21635 1.41918 7.03346L8.22855 1.19047C8.5797 0.893357 9.02456 0.730347 9.4844 0.730347C9.94414 0.730347 10.3891 0.893357 10.7403 1.19047L17.5495 7.03346C17.7657 7.21635 17.9394 7.44424 18.0585 7.70123C18.1777 7.95823 18.2393 8.23817 18.2393 8.52149V17.2861C18.2393 17.8026 18.0343 18.2979 17.6694 18.6631C17.3045 19.0285 16.8097 19.2337 16.2938 19.2337H2.67502C2.15903 19.2337 1.66417 19.0285 1.29932 18.6631C0.934465 18.2979 0.729492 17.8026 0.729492 17.2861V8.52149Z" stroke="#793CF9" strokeWidth="1.45994" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIconSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2938 0.729248H2.67502C1.60053 0.729248 0.729492 1.59986 0.729492 2.67381V16.2856C0.729492 17.3596 1.60053 18.2302 2.67502 18.2302H16.2938C17.3682 18.2302 18.2393 17.3596 18.2393 16.2856V2.67381C18.2393 1.59986 17.3682 0.729248 16.2938 0.729248Z" stroke="#793CF9" strokeWidth="1.45877" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.729492 6.49121H18.2393" stroke="#793CF9" strokeWidth="1.27814" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.49219 0.729248V4.11981" stroke="#793CF9" strokeWidth="1.23886" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.4766 0.729248V4.11981" stroke="#793CF9" strokeWidth="1.23886" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RulerIconSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.5554 13.7039C19.7736 13.9214 19.9468 14.1797 20.0649 14.4642C20.183 14.7487 20.2438 15.0537 20.2438 15.3618C20.2438 15.6698 20.183 15.9749 20.0649 16.2594C19.9468 16.5439 19.7736 16.8023 19.5554 17.0197L17.0197 19.5554C16.8023 19.7736 16.5439 19.9468 16.2594 20.0649C15.9749 20.183 15.6698 20.2438 15.3618 20.2438C15.0537 20.2438 14.7487 20.183 14.4642 20.0649C14.1797 19.9468 13.9214 19.7736 13.7039 19.5554L1.41583 7.2673C0.977508 6.82686 0.731445 6.23076 0.731445 5.60939C0.731445 4.98801 0.977508 4.39191 1.41583 3.95147L3.95147 1.41583C4.39191 0.977508 4.98801 0.731445 5.60939 0.731445C6.23076 0.731445 6.82686 0.977508 7.2673 1.41583L19.5554 13.7039Z" stroke="#793CF9" strokeWidth="1.46286" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.71484 5.27002L5.47151 3.51335" stroke="#793CF9" strokeWidth="1.31717" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.43164 8.02734L8.18831 6.27067" stroke="#793CF9" strokeWidth="1.31717" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.14844 10.7441L10.9051 8.98743" stroke="#793CF9" strokeWidth="1.3062" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.9062 13.502L13.6629 11.7453" stroke="#793CF9" strokeWidth="1.31717" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SquareIconSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2938 0.729614H2.67502C1.60053 0.729614 0.729492 1.60065 0.729492 2.67514V16.2939C0.729492 17.3683 1.60053 18.2394 2.67502 18.2394H16.2938C17.3682 18.2394 18.2393 17.3683 18.2393 16.2939V2.67514C18.2393 1.60065 17.3682 0.729614 16.2938 0.729614Z" stroke="#793CF9" strokeWidth="1.45913" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MapPinIconSVG() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2431 8.52949C16.2431 13.3967 10.8719 18.4657 9.06814 20.0312C8.90014 20.1582 8.69558 20.2268 8.48539 20.2268C8.2751 20.2268 8.07063 20.1582 7.90253 20.0312C6.09886 18.4657 0.727539 13.3967 0.727539 8.52949C0.727539 6.46122 1.54488 4.47767 2.99975 3.01518C4.45462 1.5527 6.42786 0.731079 8.48539 0.731079C10.5428 0.731079 12.5161 1.5527 13.9709 3.01518C15.4259 4.47767 16.2431 6.46122 16.2431 8.52949Z" stroke="#793CF9" strokeWidth="1.45838" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.48539 10.5088C9.5891 10.5088 10.4825 9.61534 10.4825 8.51165C10.4825 7.40796 9.5891 6.51453 8.48539 6.51453C7.3817 6.51453 6.48828 7.40796 6.48828 8.51165C6.48828 9.61534 7.3817 10.5088 8.48539 10.5088Z" stroke="#793CF9" strokeWidth="1.40224" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BuildingIconSVG() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.1387 1.43701H10.3369C9.65454 1.43701 9.10059 1.99097 9.10059 2.67332V19.6641C9.10059 20.3465 9.65454 20.9004 10.3369 20.9004H17.1387C17.821 20.9004 18.375 20.3465 18.375 19.6641V2.67332C18.375 1.99097 17.821 1.43701 17.1387 1.43701Z" stroke="#793CF9" strokeWidth="1.4467" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.10059 6.14648H2.29883C1.61648 6.14648 1.0625 6.70043 1.0625 7.38278V19.6641C1.0625 20.3465 1.61648 20.9004 2.29883 20.9004H9.10059" stroke="#793CF9" strokeWidth="1.4467" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.8281 5.35254H14.6471" stroke="#793CF9" strokeWidth="1.20589" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.8281 8.76123H14.6471" stroke="#793CF9" strokeWidth="1.20589" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.8281 12.1699H14.6471" stroke="#793CF9" strokeWidth="1.20589" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.29688 10.1709H7.11592" stroke="#793CF9" strokeWidth="1.20589" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.29688 13.5791H7.11592" stroke="#793CF9" strokeWidth="1.20589" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BedroomIconSVG() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.9914 0.500122H1.99926C1.17124 0.500122 0.5 1.17181 0.5 2.00037V10.0017C0.5 10.8303 1.17124 11.502 1.99926 11.502H17.9914C18.8194 11.502 19.4907 10.8303 19.4907 10.0017V2.00037C19.4907 1.17181 18.8194 0.500122 17.9914 0.500122Z" stroke="#793CF9" strokeWidth="1.49976"/>
      <path d="M3.99805 6.00098H15.9922M3.99805 9.00148H15.9922" stroke="#793CF9" strokeWidth="1.49976" strokeLinecap="round"/>
    </svg>
  );
}

function BathroomIconSVG() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.99902 10.0017H17.9912M3.99804 10.0017V6.00103C3.99804 5.47051 4.20865 4.96172 4.58354 4.58658C4.95843 4.21145 5.46689 4.0007 5.99706 4.0007H13.9931C14.5233 4.0007 15.0318 4.21145 15.4067 4.58658C15.7816 4.96172 15.9922 5.47051 15.9922 6.00103V10.0017M9.9951 4.0007V2.00037" stroke="#793CF9" strokeWidth="1.49976" strokeLinecap="round"/>
    </svg>
  );
}

function CarSpaceIconSVG() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.99902 8.00135H17.9912M4.99755 8.00135V5.00085H14.9927V8.00135M2.99853 8.00135C2.73345 8.00135 2.47922 8.10673 2.29177 8.2943C2.10433 8.48186 1.99902 8.73626 1.99902 9.00152C1.99902 9.26678 2.10433 9.52118 2.29177 9.70875C2.47922 9.89631 2.73345 10.0017 2.99853 10.0017C3.26362 10.0017 3.51785 9.89631 3.70529 9.70875C3.89274 9.52118 3.99804 9.26678 3.99804 9.00152C3.99804 8.73626 3.89274 8.48186 3.70529 8.2943C3.51785 8.10673 3.26362 8.00135 2.99853 8.00135ZM16.9917 8.00135C16.7266 8.00135 16.4724 8.10673 16.2849 8.2943C16.0975 8.48186 15.9922 8.73626 15.9922 9.00152C15.9922 9.26678 16.0975 9.52118 16.2849 9.70875C16.4724 9.89631 16.7266 10.0017 16.9917 10.0017C17.2568 10.0017 17.511 9.89631 17.6984 9.70875C17.8859 9.52118 17.9912 9.26678 17.9912 9.00152C17.9912 8.73626 17.8859 8.48186 17.6984 8.2943C17.511 8.10673 17.2568 8.00135 16.9917 8.00135Z" stroke="#793CF9" strokeWidth="1.49976" strokeLinecap="round"/>
    </svg>
  );
}

function BuildingSizeIconSVG() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.3037 0.731079H2.667C1.59586 0.731079 0.727539 1.60394 0.727539 2.68068V18.2775C0.727539 19.3542 1.59586 20.227 2.667 20.227H14.3037C15.3749 20.227 16.2431 19.3542 16.2431 18.2775V2.68068C16.2431 1.60394 15.3749 0.731079 14.3037 0.731079Z" stroke="#793CF9" strokeWidth="1.45838" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.01758 6.55127H6.49091" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.01758 9.9248H6.49091" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.01758 13.2979H6.49091" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.4805 6.55127H12.9538" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.4805 9.9248H12.9538" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.4805 13.2979H12.9538" stroke="#793CF9" strokeWidth="1.386" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ElevationIconSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.2274 18.2394H0.731445L6.58025 0.729614L10.4795 8.51172L15.3534 3.64791L20.2274 18.2394Z" stroke="#793CF9" strokeWidth="1.46067" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RoofHeightIconSVG() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.2627 6.31419L6.49223 0.701538L0.72168 6.31419" stroke="#793CF9" strokeWidth="1.42275" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.49219 0.724854V14.2564" stroke="#793CF9" strokeWidth="1.27405" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.724609 14.2563H12.2562" stroke="#793CF9" strokeWidth="1.27405" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Index() {
  const { data: reportData } = useReportData();

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      {/* Navigation Link to Builder Demo */}
      <div className="max-w-[210mm] mx-auto mb-4">
        <Link
          to="/builder-demo"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Building2 className="w-4 h-4" />
          View Builder.io Integration Demo
        </Link>
      </div>
      <div className="max-w-[210mm] mx-auto">
        {/* Page 1: Cover */}
        <A4Page>
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <header className="px-[76px] py-6 flex items-center gap-3">
              <div className="w-[50px] h-[50px] rounded-full bg-[#793CF9] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-[20px] text-[#793CF9] font-normal tracking-[0.2px]">Premium Realty</span>
            </header>

            {/* Decorative waves */}
            <div className="absolute right-0 top-[161px] w-[400px] h-[801px] pointer-events-none overflow-hidden">
              {/* Wave 1 - left: 193px */}
              <svg className="absolute left-[193px]" width="157" height="802" viewBox="0 0 157 802" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_327)">
                  <path opacity="0.3" d="M156.445 0.830173C56.957 67.4209 23.7944 134.011 56.957 200.602C90.1196 267.194 123.282 333.783 156.445 400.375C189.607 466.966 156.445 533.555 56.957 600.147C-42.5308 666.738 -9.36818 733.328 156.445 799.919" stroke="#793CF9" strokeWidth="1.99374"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_327">
                    <rect width="170.43" height="801.415" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* Wave 2 - left: 213px */}
              <svg className="absolute left-[213px]" width="137" height="802" viewBox="0 0 137 802" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_330)">
                  <path opacity="0.25" d="M156.445 0.779018C56.9569 80.688 23.7944 153.938 56.9569 220.529C90.1196 287.119 123.282 353.71 156.445 420.301C189.607 486.892 156.445 553.482 56.9569 620.073C-42.5308 686.664 -9.36823 746.596 156.445 799.868" stroke="#9B6DFF" strokeWidth="1.99374"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_330">
                    <rect width="170.43" height="801.415" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* Wave 3 - left: 173px, top: -1px */}
              <svg className="absolute left-[173px] -top-px" width="171" height="802" viewBox="0 0 171 802" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_333)">
                  <path opacity="0.2" d="M156.445 0.880503C56.9569 54.1557 23.7944 114.091 56.9569 180.684C90.1196 247.278 123.282 313.872 156.445 380.466C189.607 447.06 156.445 513.654 56.9569 580.248C-42.5308 646.842 -9.36823 720.095 156.445 800.008" stroke="#A78BFA" strokeWidth="1.99378"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_333">
                    <rect width="170.43" height="801.444" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* Wave 4 - left: 233px */}
              <svg className="absolute left-[233px]" width="117" height="801" viewBox="0 0 117 801" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_336)">
                  <path opacity="0.15" d="M155.849 0.545563C56.5834 93.7218 23.4946 173.588 56.5834 240.142C89.6721 306.696 122.762 373.251 155.849 439.805C188.938 506.36 155.849 572.914 56.5834 639.468C-42.6829 706.023 -9.59415 759.266 155.849 799.199" stroke="#C4B5FD" strokeWidth="1.49323"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_336">
                    <rect width="169.502" height="800.459" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* Wave 5 - left: 153px */}
              <svg className="absolute left-[153px]" width="170" height="801" viewBox="0 0 170 801" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_339)">
                  <path opacity="0.25" d="M155.777 0.693735C56.5568 40.6387 23.4833 93.8985 56.5568 160.473C89.6303 227.048 122.704 293.623 155.777 360.197C188.851 426.772 155.777 493.348 56.5568 559.922C-42.6639 626.497 -9.59034 706.387 155.777 799.591" stroke="#793CF9" strokeWidth="1.49312"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_339">
                    <rect width="169.463" height="800.625" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* Wave 6 - left: 203px */}
              <svg className="absolute left-[203px]" width="147" height="802" viewBox="0 0 147 802" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_96_342)">
                  <path opacity="0.2" d="M156.445 0.804541C56.957 74.0543 23.7944 143.975 56.957 210.565C90.1196 277.156 123.282 343.747 156.445 410.337C189.607 476.929 156.445 543.519 56.957 610.109C-42.5308 676.701 -9.36818 739.961 156.445 799.893" stroke="#9B6DFF" strokeWidth="1.99374"/>
                </g>
                <defs>
                  <clipPath id="clip0_96_342">
                    <rect width="170.43" height="801.415" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-[76px] pb-20">
              <div className="max-w-[500px]">
                <div className="space-y-[10px]">
                  <h1 className="text-[72px] font-bold leading-[72px] tracking-[1.44px] text-[#0F172B]">
                    PROPERTY
                  </h1>
                  <h1 className="text-[72px] font-bold leading-[72px] tracking-[1.44px] text-[#A684FF]">
                    REPORT
                  </h1>
                </div>
                <div className="mt-5">
                  <p className="text-[36px] font-bold leading-[54px] tracking-[0.36px] text-[#0F172B]">
                    2025
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Contact Info */}
            <div className="px-[76px] pb-[76px]">
              <div className="space-y-[1px] text-[14px] text-[#793CF9] leading-[25.2px]">
                <p>+1-555-REALTY</p>
                <p>www.premiumrealty.com</p>
                <p>info@premiumrealty.com</p>
              </div>
            </div>
          </div>
        </A4Page>

        {/* Page 2: Property Details */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b-[0.625px] border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center">
                <p className="text-[14px] font-medium text-[#6A7282] font-['DM_Sans'] leading-[21px] tracking-[-0.14px]">
                  Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210
                </p>
                <p className="text-[14px] font-medium text-[#6A7282] font-['DM_Sans'] leading-[21px] tracking-[-0.14px]">
                  Page 1 of 10
                </p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-[30px] flex items-start gap-[15px]">
            <div className="w-1 h-10 bg-[#793CF9] rounded-[2px]"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B] font-['Inter']">
              Property Details
            </h2>
          </div>

          {/* Property Image */}
          <div className="px-[76px] mt-[20px]">
            <div className="rounded-lg overflow-hidden h-[240px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/56388ca1c106e8a7aa4cc3820b420e2830e28f41?width=1285"
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Address */}
          <div className="px-[76px] mt-3 flex items-center gap-[10px]">
            <MapPin className="w-[22px] h-[31px] text-[#793CF9] flex-shrink-0" />
            <div className="flex flex-col gap-[-0.605px]">
              <p className="text-[16px] font-medium text-[#62748E] font-['DM_Sans'] leading-[25.6px] tracking-[-0.16px]">
                2847 Oakwood Boulevard, Beverly Hill
              </p>
              <p className="text-[16px] font-medium text-[#62748E] font-['DM_Sans'] leading-[25.6px] tracking-[-0.16px]">
                CA 90210
              </p>
            </div>
          </div>

          {/* Separator Line 1 */}
          <div className="px-[76px] mt-[24px]">
            <div className="w-[212px] h-px bg-[#0F172B] rounded-[1px]"></div>
          </div>

          {/* Property Stats Grid */}
          <div className="px-[76px] mt-4 grid grid-cols-3 gap-x-[20px] gap-y-[16px]">
            <PropertyDetailStat
              icon={<HomeIconSVG />}
              label="Property Type"
              value="House"
            />
            <PropertyDetailStat
              icon={<CalendarIconSVG />}
              label="Year Built"
              value={reportData?.propertyInfo.yearBuilt.toString() || "2015"}
            />
            <PropertyDetailStat
              icon={<RulerIconSVG />}
              label="Land Area"
              value="1700 m²"
            />

            <PropertyDetailStat
              icon={<SquareIconSVG />}
              label="Floor Area"
              value="650 m²"
            />
            <PropertyDetailStat
              icon={<MapPinIconSVG />}
              label="Distance to CBD"
              value="5.5 km"
            />
            <PropertyDetailStat
              icon={<BuildingIconSVG />}
              label="Council"
              value="City of Beverly Hills"
            />
          </div>

          {/* Separator Line 2 */}
          <div className="px-[76px] mt-[24px]">
            <div className="w-[212px] h-px bg-[#0F172B] rounded-[1px]"></div>
          </div>

          {/* Additional Stats Grid */}
          <div className="px-[76px] mt-4 grid grid-cols-3 gap-x-[81px] gap-y-4">
            <PropertyDetailStat
              icon={<BedroomIconSVG />}
              label="Bedrooms"
              value="4"
            />
            <PropertyDetailStat
              icon={<BathroomIconSVG />}
              label="Bathrooms"
              value="3"
            />
            <PropertyDetailStat
              icon={<CarSpaceIconSVG />}
              label="Car Spaces"
              value="2"
            />

            <PropertyDetailStat
              icon={<BuildingSizeIconSVG />}
              label="Building Size"
              value="148m²"
            />
            <PropertyDetailStat
              icon={<ElevationIconSVG />}
              label="Ground Elevation"
              value="53m"
            />
            <PropertyDetailStat
              icon={<RoofHeightIconSVG />}
              label="Roof Height"
              value="8m"
            />
          </div>

          {/* Estimated Value Range */}
          <div className="px-[76px] mt-[20px]">
            <div className="border-[1.875px] border-[#E2E8F0] rounded-[10px] bg-white overflow-visible">
              {/* Progress Bar */}
              <div className="px-[26px] pt-[20px]">
                <div className="flex h-1 rounded-[2px]">
                  <div className="bg-[#FF6900] flex-1"></div>
                  <div className="bg-[#793CF9] flex-1"></div>
                </div>
              </div>

              {/* Title */}
              <div className="px-[26px] mt-[20px]">
                <h3 className="text-[16px] font-medium text-[#0F172B] font-['Inter'] leading-[24px] tracking-[-0.32px]">
                  Estimated Value Range
                </h3>
              </div>

              {/* Values */}
              <div className="px-[26px] pt-[30px] pb-[26px] flex items-end">
                <div className="flex-1 flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#62748E] font-['Inter'] leading-[21px] tracking-[-0.14px]">
                    Low
                  </p>
                  <p className="text-[20px] font-semibold text-[#0F172B] font-['Inter'] leading-[28px] tracking-[-0.4px]">
                    $2,650,000
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] items-center">
                  <p className="text-[14px] font-normal text-[#62748E] font-['Inter'] leading-[21px] tracking-[-0.14px]">
                    Mid
                  </p>
                  <p className="text-[24px] font-semibold text-[#0F172B] font-['Inter'] leading-[33.6px] tracking-[-0.48px]">
                    $2,850,000
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] items-end">
                  <p className="text-[14px] font-normal text-[#62748E] font-['Inter'] leading-[21px] tracking-[-0.14px]">
                    High
                  </p>
                  <p className="text-[20px] font-semibold text-[#0F172B] font-['Inter'] leading-[28px] tracking-[-0.4px]">
                    $3,050,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </A4Page>

        {/* Page 3: School Catchments & Properties */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 2 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Property Details
            </h2>
          </div>

          {/* School Catchments */}
          <div className="px-[76px] mt-6">
            <h3 className="text-[16px] font-semibold text-[#0F172B] mb-4">School Catchments</h3>
            
            <div className="space-y-3">
              <SchoolCard 
                name="Beverly Hills High School 0.8km"
                type="Secondary | Public"
              />
              <SchoolCard 
                name="Hawthorne Elementary School 1.2km"
                type="Primary | Public"
              />
              <SchoolCard 
                name="Horace Mann School 1.5km"
                type="Primary | Private"
              />
            </div>
          </div>

          {/* Similar Properties for Rent */}
          <div className="px-[76px] mt-8">
            <h3 className="text-[16px] font-semibold text-[#0F172B] mb-3">Similar Properties for Rent</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/a48cd7be7113ad353c12bae9215d0ab0061a888a?width=405"
                address="987 Elm Drive"
                location="Beverly Hills"
                bedrooms={3}
                bathrooms={2}
                parking={2}
                price="$7,800/mo"
              />
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/8d3c993c651331d639a7feaa3cff5aad0943b5cd?width=405"
                address="456 Sunset Blvd"
                location="Beverly Hills"
                bedrooms={4}
                bathrooms={3}
                parking={2}
                price="$8,500/mo"
              />
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/8cdcae37b6e01d6158355dd653e5ff3c5d629fa6?width=405"
                address="789 Rodeo Drive"
                location="Beverly Hills"
                bedrooms={3}
                bathrooms={2}
                parking={2}
                price="$7,500/mo"
              />
            </div>
          </div>

          {/* Similar Properties for Sale */}
          <div className="px-[76px] mt-6">
            <h3 className="text-[16px] font-semibold text-[#0F172B] mb-3">Similar Properties for Sale</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/0abaa83ded209db7f4a61717aeb98153e1eab3da?width=405"
                address="123 Palm Drive"
                location="Beverly Hills"
                bedrooms={4}
                bathrooms={3}
                parking={2}
                badge="NEW"
                badgeColor="bg-[#00C950]"
              />
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/8d3c993c651331d639a7feaa3cff5aad0943b5cd?width=405"
                address="456 Sunset Blvd"
                location="Beverly Hills"
                bedrooms={5}
                bathrooms={4}
                parking={3}
                badge="Under Contract"
                badgeColor="bg-[#0F172B]"
              />
              <PropertyCard 
                image="https://api.builder.io/api/v1/image/assets/TEMP/8cdcae37b6e01d6158355dd653e5ff3c5d629fa6?width=405"
                address="789 Rodeo Drive"
                location="Beverly Hills"
                bedrooms={3}
                bathrooms={2}
                parking={2}
              />
            </div>
          </div>
        </A4Page>

        {/* Page 4: Property Information & History */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 3 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Property Information
            </h2>
          </div>

          {/* Property History Section */}
          <div className="px-[76px] mt-6">
            <h3 className="text-[16px] font-semibold text-[#0F172B] mb-4">Property History</h3>

            {/* Timeline */}
            <div className="space-y-4">
              <HistoryTimelineItem
                month="MAR"
                year="2023"
                status="SOLD"
                statusColor="bg-[#45556C]"
                price="$2,850,000"
                subtext="PRIVATE TREATY"
                soldBy="(Beverly Hills Realty)"
              />
              <HistoryTimelineItem
                month="JUL"
                year="2021"
                status="RENTED"
                statusColor="bg-[#793CF9]"
                price="$8,500"
                soldBy="(Premium Property Management)"
              />
              <HistoryTimelineItem
                month="NOV"
                year="2020"
                status="SOLD"
                statusColor="bg-[#45556C]"
                price="$2,450,000"
                subtext="AUCTION"
                soldBy="(Luxury Homes International)"
              />
              <HistoryTimelineItem
                month="MAY"
                year="2019"
                status="LISTED"
                statusColor="bg-[#FF6900]"
                price="$2,500,000"
                soldBy="(Beverly Hills Realty)"
              />
            </div>
          </div>

          {/* Appraisal Summary */}
          <div className="px-[76px] mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-7 bg-[#793CF9] rounded"></div>
              <h3 className="text-[16px] font-semibold text-[#0F172B]">Appraisal Summary</h3>
            </div>

            <div className="bg-[#FFF7ED] rounded-[10px] p-5 text-sm text-[#1A1A1A] leading-[22.4px]">
              <p>
                This premium property is located in one of Beverly Hills' most prestigious neighborhoods. The area features excellent schools, low crime rates, and strong property value appreciation. Recent market analysis shows consistent growth in property values, with strong demand for luxury single-family homes in this location.
              </p>
            </div>
          </div>
        </A4Page>

        {/* Page 5: Infrastructure */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 6 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Infrastructure
            </h2>
          </div>

          {/* Icon Row */}
          <div className="px-[76px] mt-6 flex items-center gap-3">
            <svg className="w-7 h-7" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.56481 20.8346C10.6165 20.8346 12.584 20.0567 14.0348 18.6718C15.4855 17.2868 16.3004 15.4086 16.3004 13.4501C16.3004 11.3402 15.1954 9.33592 12.9852 7.64804C10.7751 5.96015 9.11741 3.42833 8.56481 0.791016C8.01226 3.42833 6.35461 5.96015 4.14441 7.64804C1.9342 9.33592 0.829102 11.3402 0.829102 13.4501C0.829102 15.4086 1.64411 17.2868 3.09484 18.6718C4.54556 20.0567 6.51317 20.8346 8.56481 20.8346Z" stroke="#22C55E" strokeWidth="1.62" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="w-7 h-7" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.9859 1.75614C18.269 1.41396 18.6437 1.14307 19.0746 0.969175C19.5054 0.795292 19.9782 0.724171 20.448 0.76258C20.9178 0.800989 21.3688 0.947652 21.7585 1.18865C22.1481 1.42964 22.4634 1.75694 22.6743 2.13951C22.8853 2.52207 22.9849 2.94717 22.9636 3.37445C22.9425 3.80174 22.8012 4.21701 22.5532 4.58084C22.3053 4.94468 21.9589 5.245 21.5469 5.45328C21.1349 5.66156 20.6711 5.77089 20.1995 5.77089H0.831055" stroke="#22C55E" strokeWidth="1.58" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Sewage Summary 1 */}
          <div className="px-[76px] mt-8">
            <InfrastructureSection
              icon={<WaterDropIcon />}
              title="Sewage Summary"
              iconType="water"
            />
          </div>

          {/* Sewage Summary 2 */}
          <div className="px-[76px] mt-8">
            <InfrastructureSection
              icon={<LightningIcon />}
              title="Sewage Summary"
              iconType="lightning"
            />
          </div>

          {/* Sewage Summary 3 */}
          <div className="px-[76px] mt-8">
            <InfrastructureSection
              icon={<HomeUtilityIcon />}
              title="Sewage Summary"
              iconType="utility"
            />
          </div>
        </A4Page>

        {/* Page 6: Nearby Amenities */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 6 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Infrastructure
            </h2>
          </div>

          {/* Subsection Title */}
          <div className="px-[76px] mt-8 flex items-center gap-4">
            <div className="w-1 h-7 bg-[#FF6900] rounded"></div>
            <h3 className="text-[22px] font-semibold leading-[27px] tracking-[-0.22px] text-[#0F172B]">
              Nearby Amenities
            </h3>
          </div>

          {/* Amenities Sections */}
          <div className="px-[76px] mt-8 space-y-4">
            {/* Public Transport */}
            <AmenitySection
              icon={<PublicTransportIcon />}
              title="Public Transport"
              items={[
                {
                  distance: "Bus Stop 123 0.3km",
                  description: "Route 456 | Weekdays"
                },
                {
                  distance: "Train Station 0.8km",
                  description: "Metro Line | 24/7"
                }
              ]}
            />

            {/* Shopping Center */}
            <AmenitySection
              icon={<ShoppingCartIcon />}
              title="Shopping Center"
              items={[
                {
                  distance: "Westfield Mall 1.2km",
                  description: "Open Daily | 200+ Stores"
                },
                {
                  distance: "Local Grocery 0.5km",
                  description: "Open 7am-10pm"
                }
              ]}
            />

            {/* Park & Playground */}
            <AmenitySection
              icon={<ParkIcon />}
              title="Park & Playground"
              items={[
                {
                  distance: "Central Park 0.5km",
                  description: "Playground | Dog Park"
                },
                {
                  distance: "Riverside Reserve 1.0km",
                  description: "BBQ | Walking Trails"
                }
              ]}
            />

            {/* Emergency Services */}
            <AmenitySection
              icon={<EmergencyIcon />}
              title="Emergency Services"
              items={[
                {
                  distance: "Fire Station 1.2km",
                  description: "24/7 Emergency Response"
                },
                {
                  distance: "Hospital 2.5km",
                  description: "General Hospital | ER"
                }
              ]}
            />
          </div>
        </A4Page>

        {/* Page 7: Location & Suburb Data */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 7 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Location & Suburb Data
            </h2>
          </div>

          {/* Location Data Grid */}
          <div className="px-[76px] mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <LocationDataItem icon={<MapPin className="w-8 h-8 text-[#793CF9]" />} label="Suburb" value="Beverly Hills" />
            <LocationDataItem icon={<MapPin className="w-8 h-8 text-[#793CF9]" />} label="State" value="California" />
            <LocationDataItem icon={<MapPin className="w-8 h-8 text-[#793CF9]" />} label="Distance to CBD" value="5.5 km" />
            <LocationDataItem icon={<PopulationIcon />} label="Population" value="34,109" />
            <LocationDataItem icon={<TrendingUp className="w-8 h-8 text-[#793CF9]" />} label="Population Growth" value="1.8%" />
          </div>

          {/* Occupancy Distribution */}
          <div className="px-[76px] mt-10">
            <h3 className="text-[18px] font-semibold text-[#0F172B] mb-4 tracking-[-0.18px]">
              Occupancy Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <OccupancyCard value="72" label="Purchaser %" />
              <OccupancyCard value="24" label="Renting %" />
              <OccupancyCard value="4" label="Other %" />
            </div>
          </div>

          {/* Rental Yield Growth */}
          <div className="px-[76px] mt-8">
            <h3 className="text-[18px] font-semibold text-[#0F172B] mb-4 tracking-[-0.18px]">
              Rental Yield Growth (%)
            </h3>
            <div className="bg-[#F8FAFC] rounded-lg p-5 flex items-center justify-center gap-3">
              <span className="text-[20px] font-semibold text-[#0F172B]">3.5%</span>
              <span className="text-[20px] text-[#CAD5E2]">→</span>
              <span className="text-[20px] font-semibold text-[#0F172B]">3.8%</span>
              <span className="text-[20px] text-[#CAD5E2]">→</span>
              <span className="text-[20px] font-semibold text-[#0F172B]">4.1%</span>
              <span className="text-[20px] text-[#CAD5E2]">→</span>
              <span className="text-[20px] font-semibold text-[#0F172B]">4.5%</span>
              <span className="text-[20px] text-[#CAD5E2]">→</span>
              <span className="text-[20px] font-semibold text-[#0F172B]">4.8%</span>
            </div>
          </div>
        </A4Page>

        {/* Page 8: Rental Pricing Analysis */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 8 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Rental Pricing Analysis
            </h2>
          </div>

          {/* Annual Revenue Card */}
          <div className="px-[76px] mt-6">
            <div className="bg-[#F8FAFC] border-[1.875px] border-[#E2E8F0] rounded-xl p-8">
              {/* Progress Bar */}
              <div className="flex h-1 rounded-sm mb-6">
                <div className="bg-[#0F172B] h-full" style={{ width: '50%' }}></div>
                <div className="bg-[#FF6900] h-full" style={{ width: '50%' }}></div>
              </div>

              <p className="text-[14px] font-medium text-[#62748E] text-center tracking-[-0.14px] mb-4">
                Annual Revenue
              </p>
              <p className="text-[48px] font-bold text-[#0F172B] text-center leading-[48px]">
                $264,000
              </p>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="px-[76px] mt-10 grid grid-cols-2 gap-x-5 gap-y-4">
            <PricingDataItem icon={<DollarSignIcon />} label="Daily Rate" value="$850" />
            <PricingDataItem icon={<DollarSignIcon />} label="Weekly Rate" value="$5,500" />
            <PricingDataItem icon={<DollarSignIcon />} label="Monthly Rate" value="$22,000" />
            <PricingDataItem icon={<TrendingUp className="w-8 h-8 text-[#793CF9]" />} label="Occupancy Rate" value="88%" />
          </div>

          {/* Occupancy Rate Progress Bar */}
          <div className="px-[76px] mt-10">
            <h3 className="text-[14px] font-semibold text-[#0F172B] mb-3 tracking-[-0.14px]">
              Occupancy Rate
            </h3>
            <div className="relative bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl h-8">
              <div className="absolute left-0 top-0 h-full bg-[#793CF9] rounded-2xl flex items-center justify-end pr-4" style={{ width: '88%' }}>
                <span className="text-[14px] font-semibold text-white">88%</span>
              </div>
            </div>
          </div>
        </A4Page>

        {/* Page 9: Environmental Factors */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 9 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Environmental Factors
            </h2>
          </div>

          {/* Environmental Factors List */}
          <div className="px-[76px] mt-6 space-y-5">
            <EnvironmentalFactorItem
              icon={<FloodRiskIcon />}
              title="Flood Risk"
              description="Low risk - Property is well above flood plain with excellent drainage systems"
            />
            <EnvironmentalFactorItem
              icon={<BushfireRiskIcon />}
              title="Bushfire Risk"
              description="Low risk - Urban area with fire services within 2km radius"
            />
            <EnvironmentalFactorItem
              icon={<HeritageIcon />}
              title="Heritage"
              description="Property is located within Beverly Hills Historic District with architectural significance"
            />
            <EnvironmentalFactorItem
              icon={<NoisePollutionIcon />}
              title="Noise Pollution"
              description="Low - Residential area with minimal traffic noise"
            />
          </div>
        </A4Page>

        {/* Page 10: Planning & Zoning */}
        <A4Page>
          {/* Page Header */}
          <div className="px-[76px] pt-[76px] pb-4">
            <div className="border-b border-[#D1D5DC] pb-2">
              <div className="flex justify-between items-center text-[14px] font-['DM_Sans']">
                <p className="text-[#6A7282]">Property Report for 2847 Oakwood Boulevard, Beverly Hills, CA 90210</p>
                <p className="text-[#6A7282]">Page 6 of 10</p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-[76px] mt-6 flex items-center gap-4">
            <div className="w-1 h-10 bg-[#793CF9] rounded"></div>
            <h2 className="text-[32px] font-bold leading-[38.4px] tracking-[0.32px] text-[#0F172B]">
              Planning & Zoning
            </h2>
          </div>

          {/* Planning Grid */}
          <div className="px-[76px] mt-6">
            <div className="border border-[#E2E8F0] rounded-lg bg-[#E2E8F0] overflow-hidden">
              <div className="grid grid-cols-2 gap-px">
                <ZoningItem label="Zone" value="R-1 Single Family Residential" />
                <ZoningItem label="Zone Code" value="R1" />
                <ZoningItem label="Land Use" value="Residential" />
                <ZoningItem label="Regional Plan" value="Los Angeles Regional Plan 2040" />
                <ZoningItem label="Planning Scheme" value="Beverly Hills Planning Scheme" />
                <ZoningItem label="Zone Precinct" value="Precinct 1 - Character Housing" />
                <ZoningItem label="Local Plan" value="Beverly Hills Local Development Plan" />
                <ZoningItem label="Local Plan Precinct" value="Precinct A - Oakwood Boulevard" />
                <ZoningItem label="Local Plan Subprecinct" value="Subprecinct 1A - Historic Estates" span2cols={true} />
              </div>
            </div>
          </div>

          {/* Planning Overlays */}
          <div className="px-[76px] mt-8">
            <h3 className="text-[18px] font-semibold text-[#0F172B] mb-4 tracking-[-0.18px]">
              Planning Overlays
            </h3>
            <div className="space-y-4">
              <OverlayItem code="HD 5" description="Hillside Development Overlay - Regulates construction on slopes" />
              <OverlayItem code="VPO 2" description="Vegetation Protection Overlay - Preserves mature trees and landscaping" />
            </div>
          </div>

          {/* Heritage Overlays */}
          <div className="px-[76px] mt-8">
            <h3 className="text-[18px] font-semibold text-[#0F172B] mb-4 tracking-[-0.18px]">
              Heritage Overlays
            </h3>
            <div className="flex items-center gap-3">
              <HeritageIcon />
              <p className="text-[14px] text-[#45556C] leading-[21px]">Beverly Hills Historic District</p>
            </div>
          </div>
        </A4Page>
      </div>

      {/* Floating Live Demo Panel */}
      <div className="fixed bottom-6 right-6 w-[500px] max-h-[600px] bg-white rounded-lg shadow-2xl border-2 border-purple-300 overflow-hidden flex flex-col z-50">
        <div className="bg-white px-6 py-4 border-b-2 border-purple-300 flex-shrink-0">
          <h3 className="text-lg font-semibold text-purple-900">
            Live Demo (with sample data)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Below shows bindings used in your Builder.io content.
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="p-4">
            <DataBindingReference
              builderContent={{
                data: {
                  blocks: [
                    {
                      component: {
                        name: "Text",
                        options: {
                          text: "Property built in {{state.propertyInfo.yearBuilt}}"
                        }
                      }
                    },
                    {
                      component: {
                        name: "Text",
                        options: {
                          text: "Located in {{state.locationSuburbData.suburb}}, {{state.locationSuburbData.state}}"
                        }
                      }
                    },
                    {
                      component: {
                        name: "Text",
                        options: {
                          text: "Land area: {{state.propertyInfo.landArea.value}} {{state.propertyInfo.landArea.unit}}"
                        }
                      }
                    }
                  ]
                }
              }}
              position="fixed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoningItem({ label, value, span2cols = false }: { label: string; value: string; span2cols?: boolean }) {
  return (
    <div className={`bg-white p-4 ${span2cols ? 'col-span-2' : ''}`}>
      <p className="text-[11px] font-medium text-[#62748E] uppercase tracking-[0.55px] leading-[16.5px] mb-1">
        {label}
      </p>
      <p className="text-[14px] font-semibold text-[#0F172B] leading-[21px]">
        {value}
      </p>
    </div>
  );
}

function OverlayItem({ code, description }: { code: string; description: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-[#F0F4FF] rounded-md px-3 py-2">
        <p className="text-[13px] font-bold text-[#0F172B] leading-[19.5px]">{code}</p>
      </div>
      <p className="text-[14px] text-[#45556C] leading-[22.4px]">{description}</p>
    </div>
  );
}

function EnvironmentalFactorItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-5">
      <div className="w-8 h-8 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-[16px] font-semibold text-[#0F172B] leading-[24px] mb-2">{title}</h4>
        <p className="text-[14px] text-[#45556C] leading-[22.4px]">{description}</p>
      </div>
    </div>
  );
}

function FloodRiskIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_flood)">
        <path d="M10.1548 25.6593C12.5875 25.6593 14.9205 24.7011 16.6406 22.9956C18.3608 21.2901 19.3272 18.9769 19.3272 16.5649C19.3272 13.9666 18.0168 11.498 15.3962 9.41938C12.7755 7.34069 10.81 4.22259 10.1548 0.974609C9.49967 4.22259 7.53417 7.34069 4.9135 9.41938C2.29276 11.498 0.982422 13.9666 0.982422 16.5649C0.982422 18.9769 1.9488 21.2901 3.66895 22.9956C5.38907 24.7011 7.72211 25.6593 10.1548 25.6593Z" stroke="#793CF9" strokeWidth="1.95713" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_flood">
          <rect width="20.6543" height="27.3047" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function BushfireRiskIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_bushfire)">
        <path d="M10.1548 0.974609C11.0285 4.43912 12.7755 7.25404 15.3962 9.41938C18.0168 11.5847 19.3272 13.9666 19.3272 16.5649C19.3272 18.9769 18.3608 21.2901 16.6406 22.9956C14.9205 24.7011 12.5875 25.6593 10.1548 25.6593C7.72211 25.6593 5.38907 24.7011 3.66895 22.9956C1.9488 21.2901 0.982422 18.9769 0.982422 16.5649C0.982422 15.1594 1.44221 13.7918 2.29276 12.6673C2.29276 13.5287 2.6379 14.3549 3.25224 14.964C3.86658 15.5731 4.6998 15.9153 5.56866 15.9153C6.43743 15.9153 7.27063 15.5731 7.88499 14.964C8.49937 14.3549 8.8445 13.5287 8.8445 12.6673C8.8445 10.069 6.879 8.76979 6.879 6.17137C6.879 4.43912 7.97092 2.70687 10.1548 0.974609Z" stroke="#793CF9" strokeWidth="1.95713" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_bushfire">
          <rect width="20.6543" height="27.3047" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function HeritageIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_heritage)">
        <path d="M13.565 10.7387V0.942383" stroke="#793CF9" strokeWidth="1.94177" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.4343 1.21966C11.7868 1.04876 12.174 0.960592 12.5661 0.961929C12.9582 0.963266 13.3446 1.05405 13.6961 1.22736L23.8051 6.1602C24.4168 6.45897 24.2034 7.37707 23.5223 7.37707H1.60802C0.926894 7.37707 0.714841 6.45897 1.32529 6.1602L11.4343 1.21966Z" stroke="#793CF9" strokeWidth="1.92555" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.55957 10.7387V0.942383" stroke="#793CF9" strokeWidth="1.94177" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.5698 10.7387V0.942383" stroke="#793CF9" strokeWidth="1.94177" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.55273 22.9521H24.5767" stroke="#793CF9" strokeWidth="1.99848" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.55566 10.7387V0.942383" stroke="#793CF9" strokeWidth="1.94177" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_heritage">
          <rect width="26.0449" height="23.3203" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function NoisePollutionIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_noise)">
        <path d="M12.9845 1.88204C12.9842 1.70172 12.9289 1.52553 12.8258 1.37568C12.7226 1.22584 12.576 1.10906 12.4047 1.04009C12.2333 0.971135 12.0448 0.953062 11.8627 0.988168C11.6808 1.02328 11.5137 1.10998 11.3824 1.23736L6.87587 5.6168C6.70195 5.78685 6.49504 5.92174 6.26714 6.01351C6.03922 6.10528 5.79485 6.1521 5.54815 6.15142H2.33073C1.97754 6.15142 1.63881 6.28786 1.38906 6.53065C1.13933 6.77333 0.999023 7.10265 0.999023 7.44595V15.2133C0.999023 15.5566 1.13933 15.8859 1.38906 16.1287C1.63881 16.3713 1.97754 16.5078 2.33073 16.5078H5.54815C5.79485 16.5072 6.03922 16.554 6.26714 16.6458C6.49504 16.7376 6.70195 16.8723 6.87587 17.0424L11.381 21.4232C11.5124 21.5511 11.6797 21.6381 11.862 21.6735C12.0444 21.7089 12.2333 21.6908 12.405 21.6216C12.5767 21.5524 12.7235 21.4352 12.8266 21.2848C12.9298 21.1346 12.9847 20.9578 12.9845 20.7771V1.88204Z" stroke="#793CF9" strokeWidth="1.9695" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.832 5.99805C16.552 7.14999 16.9412 8.55105 16.9412 9.99095C16.9412 11.4308 16.552 12.8319 15.832 13.9838" stroke="#793CF9" strokeWidth="1.82251" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.919 2.99707C19.9428 5.80347 20.7551 8.02667 20.3091 11.0334C19.8633 14.582 18.9425 16.8034 17.919 18.9142" stroke="#793CF9" strokeWidth="1.91412" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_noise">
          <rect width="19.9941" height="23.3203" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function PricingDataItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-8 h-8 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-medium text-[#62748E] leading-[21px] tracking-[-0.14px]">{label}</p>
        <p className="text-[16px] font-semibold text-[#0F172B] leading-[20.8px]">{value}</p>
      </div>
    </div>
  );
}

function DollarSignIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_dollar)">
        <path d="M1 0.987305V27.3044" stroke="#793CF9" strokeWidth="1.98703" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.6355 0.982422H5.65546C4.42022 0.982422 3.23558 1.46562 2.36216 2.32569C1.48872 3.18577 0.998047 4.35227 0.998047 5.56863C0.998047 6.785 1.48872 7.95152 2.36216 8.81155C3.23558 9.67166 4.42022 10.1548 5.65546 10.1548H12.3088C13.544 10.1548 14.7287 10.638 15.6021 11.4981C16.4755 12.3582 16.9662 13.5247 16.9662 14.7409C16.9662 15.9574 16.4755 17.1238 15.6021 17.984C14.7287 18.8441 13.544 19.3273 12.3088 19.3273H0.998047" stroke="#793CF9" strokeWidth="1.98071" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_dollar">
          <rect width="17.9785" height="28.6426" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function LocationDataItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-8 h-8 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-medium text-[#62748E] leading-[21px] tracking-[-0.14px]">{label}</p>
        <p className="text-[16px] font-semibold text-[#0F172B] leading-[20.8px]">{value}</p>
      </div>
    </div>
  );
}

function OccupancyCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col items-center justify-center">
      <p className="text-[40px] font-bold text-[#0F172B] leading-[40px] mb-3">{value}</p>
      <p className="text-[13px] font-medium text-[#62748E] leading-[19.5px]">{label}</p>
    </div>
  );
}

function PopulationIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 21 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_population)">
        <path d="M19.3272 11.9927V9.32809C19.3272 7.91477 18.775 6.55932 17.7921 5.55987C16.8091 4.56052 15.476 3.99902 14.0858 3.99902H6.22379C4.83369 3.99902 3.50053 4.56052 2.51758 5.55987C1.53463 6.55932 0.982422 7.91477 0.982422 9.32809V11.9927" stroke="#793CF9" strokeWidth="1.98189" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.99707 3.9468C2.13724 4.22744 3.14697 4.85958 3.86784 5.744C4.58859 6.62842 4.97978 7.71506 4.97978 8.83335C4.97978 9.95166 4.58859 11.0383 3.86784 11.9227C3.14697 12.8071 2.13724 13.4393 0.99707 13.7199" stroke="#793CF9" strokeWidth="1.94279" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.9933 11.665V9.04728C19.9924 7.88719 19.5997 6.76038 18.8767 5.8436C18.1537 4.92682 17.1415 4.27201 15.999 3.98195" stroke="#793CF9" strokeWidth="1.98012" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.1608 11.349C12.8262 11.349 15.0 9.02621 15.0 6.16082C15.0 3.29548 12.8262 0.972656 10.1608 0.972656C7.49547 0.972656 5.32168 3.29548 5.32168 6.16082C5.32168 9.02621 7.49547 11.349 10.1608 11.349Z" stroke="#793CF9" strokeWidth="1.94557" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_population">
          <rect width="20.6543" height="13" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function AmenitySection({ icon, title, items }: { icon: React.ReactNode; title: string; items: Array<{ distance: string; description: string }> }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-[18px] h-[18px]">{icon}</div>
        <h4 className="text-[16px] font-semibold text-[#0F172B]">{title}</h4>
      </div>

      {/* Items */}
      <div className="space-y-5 pl-7">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <LocationPinIcon />
            <div>
              <p className="text-[14px] text-[#45556C] leading-[21px]">{item.distance}</p>
              <p className="text-[14px] font-medium text-[#0F172B] leading-[21px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationPinIcon() {
  return (
    <svg className="w-[14px] h-[14px] flex-shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_location" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14">
        <path d="M13.9785 0H0V13.9785H13.9785V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_location)">
        <path d="M11.6491 5.82455C11.6491 8.73268 8.42297 11.7613 7.33964 12.6968C7.23871 12.7726 7.11586 12.8137 6.98959 12.8137C6.86332 12.8137 6.74047 12.7726 6.63954 12.6968C5.55621 11.7613 2.33008 8.73268 2.33008 5.82455C2.33008 4.58877 2.82099 3.4036 3.69482 2.52978C4.56864 1.65595 5.75381 1.16504 6.98959 1.16504C8.22537 1.16504 9.41054 1.65595 10.2843 2.52978C11.1582 3.4036 11.6491 4.58877 11.6491 5.82455Z" stroke="#793CF9" strokeWidth="1.16488" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.98951 7.57179C7.95452 7.57179 8.73683 6.78949 8.73683 5.82447C8.73683 4.85946 7.95452 4.07715 6.98951 4.07715C6.02449 4.07715 5.24219 4.85946 5.24219 5.82447C5.24219 6.78949 6.02449 7.57179 6.98951 7.57179Z" stroke="#793CF9" strokeWidth="1.16488" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

function PublicTransportIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g clipPath="url(#clip0_public_transport)">
        <path d="M10.3593 0.526367H1.93107C1.15528 0.526367 0.526367 1.15481 0.526367 1.93003V10.352C0.526367 11.1272 1.15528 11.7556 1.93107 11.7556H10.3593C11.1351 11.7556 11.764 11.1272 11.764 10.352V1.93003C11.764 1.15481 11.1351 0.526367 10.3593 0.526367Z" stroke="#793CF9" strokeWidth="1.05314" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.526367 5.08594H11.764" stroke="#793CF9" strokeWidth="0.815656" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.14502 0.526367V5.77039" stroke="#793CF9" strokeWidth="0.794969" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.65527 9.9707L2.34766 11.5391" stroke="#793CF9" strokeWidth="0.968199" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.63477 11.5391L7.3125 9.9707" stroke="#793CF9" strokeWidth="0.973604" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.14258 8.39941H3.14692" stroke="#793CF9" strokeWidth="0.63423" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.14258 8.39941H9.14692" stroke="#793CF9" strokeWidth="0.63423" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_public_transport">
          <rect width="13.1152" height="13.1055" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function ShoppingCartIcon() {
  return (
    <svg viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g clipPath="url(#clip0_shopping)">
        <path d="M0.53418 0.543945H1.95802L3.85173 9.55402C3.9212 9.88398 4.10138 10.1789 4.36127 10.3882C4.62111 10.5974 4.94444 10.7077 5.27557 10.7003H12.2381C12.5622 10.6997 12.8763 10.5866 13.1287 10.3794C13.3812 10.1723 13.5567 9.88378 13.6264 9.56126L14.801 4.17119H2.71977" stroke="#793CF9" strokeWidth="1.07798" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.96484 13.3457C5.32612 13.3457 5.61905 13.0495 5.61905 12.6842C5.61905 12.3188 5.32612 12.0225 4.96484 12.0225C4.60357 12.0225 4.31055 12.3188 4.31055 12.6842C4.31055 13.0495 4.60357 13.3457 4.96484 13.3457Z" stroke="#793CF9" strokeWidth="0.986571" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.9648 13.3457C13.3261 13.3457 13.6191 13.0495 13.6191 12.6842C13.6191 12.3188 13.3261 12.0225 12.9648 12.0225C12.6036 12.0225 12.3105 12.3188 12.3105 12.6842C12.3105 13.0495 12.6036 13.3457 12.9648 13.3457Z" stroke="#793CF9" strokeWidth="0.986571" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_shopping">
          <rect width="16.1426" height="11.6113" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function ParkIcon() {
  return (
    <svg viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g clipPath="url(#clip0_park)">
        <path d="M6.14051 2.76293V2.91027C6.60466 3.09608 6.99145 3.4456 7.23341 3.89787C7.47536 4.35014 7.55713 4.87645 7.46447 5.38504C7.37182 5.89368 7.1106 6.35225 6.72635 6.68093C6.3421 7.00956 5.85926 7.18736 5.36197 7.18338H2.60171C2.11037 7.17067 1.63848 6.98087 1.26653 6.64644C0.894593 6.31195 0.645632 5.85356 0.562125 5.34939C0.478618 4.84518 0.56573 4.32648 0.808601 3.88167C1.05147 3.43687 1.43507 3.09354 1.89395 2.91027V2.76293C1.89395 2.17675 2.11766 1.6146 2.51584 1.20008C2.91404 0.785593 3.45409 0.552734 4.01722 0.552734C4.58037 0.552734 5.1204 0.785593 5.5186 1.20008C5.91677 1.6146 6.14051 2.17675 6.14051 2.76293Z" stroke="#793CF9" strokeWidth="1.08315" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.01758 2.91113V7.18512" stroke="#793CF9" strokeWidth="0.815957" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.03809 5.02637V7.18512" stroke="#793CF9" strokeWidth="0.774533" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_park">
          <rect width="8.49609" height="7.86133" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function EmergencyIcon() {
  return (
    <svg viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g clipPath="url(#clip0_emergency)">
        <path d="M11.7639 8.35041C11.7639 11.9036 9.30575 13.6801 6.38397 14.7105C6.23096 14.763 6.06478 14.7605 5.91341 14.7034C2.98459 13.6801 0.526367 11.9036 0.526367 8.35041V3.37604C0.526367 3.18757 0.600364 3.00681 0.732082 2.87355C0.863799 2.74028 1.04244 2.66541 1.22872 2.66541C2.63342 2.66541 4.38932 1.81266 5.61139 0.732503C5.76018 0.603877 5.94945 0.533203 6.14519 0.533203C6.34087 0.533203 6.53019 0.603877 6.67898 0.732503C7.90806 1.81976 9.65689 2.66541 11.0616 2.66541C11.2479 2.66541 11.4265 2.74028 11.5582 2.87355C11.69 3.00681 11.7639 3.18757 11.7639 3.37604V8.35041Z" stroke="#793CF9" strokeWidth="1.05972" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_emergency">
          <rect width="13.1152" height="16.1133" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function InfrastructureSection({ icon, title, iconType }: { icon: React.ReactNode; title: string; iconType: string }) {
  return (
    <div className="space-y-4">
      {/* Header with Icon, Title, and Confidence */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7">{icon}</div>
          <h3 className="text-[18px] font-semibold text-[#0F172B]">{title}</h3>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-[50px] h-[50px] rounded-full border-[2.5px] border-[#22C55E] flex items-center justify-center">
            <span className="text-[14px] font-bold text-[#22C55E]">95%</span>
          </div>
          <p className="text-[9px] text-[#62748E]">Confidence</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
        <p className="text-[13px]">
          <span className="font-medium text-[#0F172B]">Connection Status:</span>{' '}
          <span className="text-[#0F172B]">Connected</span>
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        <InfoCard
          icon={<WaterDropsIcon />}
          label="Connection Type"
          value="Direct Connection"
          bgColor="bg-green-50"
        />
        <InfoCard
          icon={<CompassIcon />}
          label="Distance to Pipeline"
          value="50m"
          bgColor="bg-purple-50"
        />
        <InfoCard
          icon={<PipelineIcon />}
          label="Pipeline Type"
          value="Main Sewer Line"
          subValue="(150mm)"
          bgColor="bg-gray-50"
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, subValue, bgColor }: { icon: React.ReactNode; label: string; value: string; subValue?: string; bgColor: string }) {
  return (
    <div className={`${bgColor} border border-[#E5E7EB] rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          {icon}
        </div>
        <p className="text-[9px] font-medium text-[#62748E]">{label}</p>
      </div>
      <p className="text-[11px] font-semibold text-[#0F172B]">
        {value} {subValue && <span className="text-[10px] font-normal text-[#62748E]">{subValue}</span>}
      </p>
    </div>
  );
}

function WaterDropIcon() {
  return (
    <svg viewBox="0 0 17 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8.44656 20.8346C10.4697 20.8346 12.4099 20.0567 13.8405 18.6718C15.2711 17.2868 16.0747 15.4086 16.0747 13.4501C16.0747 11.3402 14.985 9.33592 12.8055 7.64804C10.6261 5.96015 8.99147 3.42833 8.44656 0.791016C7.90168 3.42833 6.26707 5.96015 4.08759 7.64804C1.9081 9.33592 0.818359 11.3402 0.818359 13.4501C0.818359 15.4086 1.62204 17.2868 3.0526 18.6718C4.48317 20.0567 6.42343 20.8346 8.44656 20.8346Z" stroke="#22C55E" strokeWidth="1.62" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M1.86386 14.1147C1.66264 14.1154 1.46535 14.0567 1.29491 13.9453C1.12449 13.834 0.987899 13.6746 0.901039 13.4856C0.814179 13.2968 0.780606 13.0861 0.804226 12.878C0.827832 12.67 0.907661 12.4733 1.03444 12.3106L11.5617 1.0216C11.6407 0.926728 11.7483 0.862619 11.8669 0.839789C11.9855 0.816971 12.108 0.836787 12.2144 0.895982C12.3207 0.955189 12.4045 1.05026 12.4521 1.1656C12.4997 1.28094 12.5083 1.40969 12.4763 1.53073L10.4346 8.19348C10.3744 8.36119 10.3542 8.54157 10.3756 8.7192C10.3972 8.89682 10.4597 9.06638 10.558 9.2133C10.6564 9.36021 10.7874 9.48012 10.94 9.56273C11.0925 9.64535 11.2621 9.68821 11.4341 9.68762H18.8777C19.0789 9.68692 19.2762 9.74562 19.4466 9.85697C19.617 9.96832 19.7536 10.1277 19.8405 10.3166C19.9274 10.5056 19.9609 10.7163 19.9373 10.9243C19.9137 11.1323 19.8338 11.329 19.7071 11.4917L9.17983 22.7808C9.10085 22.8756 8.99324 22.9397 8.87466 22.9626C8.75607 22.9853 8.63354 22.9655 8.52721 22.9063C8.42086 22.8472 8.33702 22.7521 8.28943 22.6367C8.24185 22.5214 8.23335 22.3927 8.26533 22.2716L10.307 15.6089C10.3672 15.4411 10.3874 15.2608 10.3659 15.0831C10.3444 14.9055 10.2818 14.7359 10.1835 14.589C10.0853 14.4421 9.95419 14.3222 9.8016 14.2396C9.649 14.157 9.47943 14.1141 9.30743 14.1147H1.86386Z" stroke="#22C55E" strokeWidth="1.63" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HomeUtilityIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M9.99038 1.24902V13.7371M9.99038 1.24902L3.33008 6.24425M9.99038 1.24902L16.6507 6.24425M3.33008 13.7371H16.6507M4.99515 17.4835H14.9856" stroke="#793CF9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WaterDropsIcon() {
  return (
    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M4.17695 9.72709C5.48975 9.72709 6.56386 8.63508 6.56386 7.31035C6.56386 6.61814 6.22373 5.96174 5.54346 5.40678C4.86319 4.85183 4.35 4.02834 4.17695 3.16309C4.0039 4.02834 3.49668 4.85779 2.81044 5.40678C2.12421 5.95577 1.79004 6.62411 1.79004 7.31035C1.79004 8.63508 2.86415 9.72709 4.17695 9.72709Z" stroke="#22C55E" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.4923 3.9383C7.90266 3.28264 8.19356 2.55944 8.35149 1.80225C8.64982 3.2939 9.54482 4.7259 10.7381 5.68056C11.9315 6.63522 12.5281 7.76888 12.5281 8.96221C12.5315 9.78697 12.29 10.5942 11.8341 11.2815C11.3782 11.9688 10.7285 12.5053 9.96734 12.8229C9.20618 13.1405 8.36785 13.225 7.55863 13.0656C6.74941 12.9062 6.00573 12.5102 5.42188 11.9276" stroke="#22C55E" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M1.79004 6.56431L13.1266 1.19434L7.75667 12.5309L6.56335 7.75763L1.79004 6.56431Z" stroke="#793CF9" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M3.58203 1.79053V8.95127" stroke="#0F172B" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.7414 5.3709C11.73 5.3709 12.5315 4.5694 12.5315 3.58071C12.5315 2.59202 11.73 1.79053 10.7414 1.79053C9.75266 1.79053 8.95117 2.59202 8.95117 3.58071C8.95117 4.5694 9.75266 5.3709 10.7414 5.3709Z" stroke="#0F172B" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.58218 12.5311C4.57087 12.5311 5.37236 11.7296 5.37236 10.7409C5.37236 9.75218 4.57087 8.95068 3.58218 8.95068C2.59349 8.95068 1.79199 9.75218 1.79199 10.7409C1.79199 11.7296 2.59349 12.5311 3.58218 12.5311Z" stroke="#0F172B" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.7407 5.37012C10.7407 6.79448 10.1748 8.1605 9.16767 9.16767C8.1605 10.1748 6.79448 10.7407 5.37012 10.7407" stroke="#0F172B" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HistoryTimelineItem({
  month,
  year,
  status,
  statusColor,
  price,
  subtext,
  soldBy
}: {
  month: string;
  year: string;
  status: string;
  statusColor: string;
  price: string;
  subtext?: string;
  soldBy: string;
}) {
  return (
    <div className="flex gap-4 relative">
      {/* Timeline Marker */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-[60px] h-[60px] rounded-full bg-[#00C950] flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold text-white leading-none">{month}</p>
          <p className="text-[16px] font-bold text-white leading-none">{year}</p>
        </div>
        {/* Vertical line continues below */}
        <div className="w-0.5 h-8 bg-[#CAD5E2]"></div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 pt-1 pb-4">
        <div className="border border-[#E2E8F0] rounded-lg p-3 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <span className={`${statusColor} text-white px-2 py-0.5 rounded text-[10px] font-semibold`}>
              {status}
            </span>
            <p className="text-[14px] font-semibold text-[#0F172B]">{price}</p>
            {subtext && <p className="text-[11px] text-[#62748E] font-medium">{subtext}</p>}
          </div>
          <p className="text-[12px] text-[#45556C]">Sold by <span className="text-[#62748E]">{soldBy}</span></p>
        </div>
      </div>
    </div>
  );
}

// A4 Page Container Component
function A4Page({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="bg-white shadow-lg mx-auto mb-8 overflow-hidden"
      style={{
        width: '210mm',
        height: '297mm',
        pageBreakAfter: 'always',
      }}
    >
      {children}
    </div>
  );
}

function PropertyStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-[#62748E] leading-none">{label}</p>
        <p className="text-[12px] font-semibold text-[#0F172B] leading-none">{value}</p>
      </div>
    </div>
  );
}

function RoomStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-sm flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-[#62748E] leading-none">{label}</p>
        <p className="text-[12px] font-semibold text-[#0F172B] leading-none">{value}</p>
      </div>
    </div>
  );
}

function SchoolCard({ name, type }: { name: string; type: string }) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-3 bg-white">
      <div className="flex items-start gap-2">
        <Building2 className="w-4 h-4 text-[#793CF9] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[12px] text-[#45556C] leading-tight">{name}</p>
          <p className="text-[12px] font-medium text-[#0F172B] leading-tight">{type}</p>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ 
  image, 
  address, 
  location, 
  bedrooms, 
  bathrooms, 
  parking,
  price,
  badge,
  badgeColor = "bg-[#0F172B]"
}: { 
  image: string;
  address: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  price?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white h-full flex flex-col">
      <div className="relative h-[120px]">
        <img src={image} alt={address} className="w-full h-full object-cover" />
        {badge && (
          <div className={`absolute top-2 left-2 ${badgeColor} text-white px-2 py-0.5 rounded text-[9px] font-semibold`}>
            {badge}
          </div>
        )}
        {price && (
          <div className="absolute bottom-2 right-2 bg-[#0F172B]/90 text-white px-2 py-1 rounded text-[10px] font-semibold">
            {price}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-[12px] font-semibold text-[#0F172B] mb-0.5 leading-tight">{address}</h4>
        <p className="text-[10px] text-[#62748E] mb-2 leading-tight">{location}</p>
        <div className="flex items-center gap-2 text-[10px] font-medium text-[#0F172B] flex-wrap">
          <span className="flex items-center gap-0.5">
            <Home className="w-3 h-3 text-[#793CF9]" />
            {bedrooms}
          </span>
          <span className="flex items-center gap-0.5">
            🛁 {bathrooms}
          </span>
          <span className="flex items-center gap-0.5">
            🚗 {parking}
          </span>
        </div>
      </div>
    </div>
  );
}
