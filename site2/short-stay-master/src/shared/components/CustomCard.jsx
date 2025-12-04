
import React, { useRef } from "react";
import { Card } from "primereact/card";
import { OverlayPanel } from "primereact/overlaypanel";
import { Link } from "react-router-dom";
import BracketIcon from "../../assets/images/icons/bracketicon.svg";
import { OutlinedButton } from "../../pages/shared/components/CustomButton";

export default function OverviewCard({ src, title, count }) {
  return (
    <div className="flex align-items-center gap-3 shadow-1 p-3 border-round-lg">
      <div className="bg-light-color w-3rem h-3rem border-circle flex align-items-center justify-content-center">
        <img src={src} alt="" width={20} />
      </div>
      <div className="">
        <p className="text-gray text-sm m-0">{title}</p>
        {count && <h2 className="m-0 text-dark">{count}</h2>}
      </div>
    </div>
  );
}

export const PropertyCard = ({
  address,
  inspectionDate,
  lastAppraisalDate,
  tags,
  services = [],
}) => {
  const op = useRef(null);
  const header = (
    <div className="flex p-3 pb-0 justify-content-between align-items-center">
      <h3 className="text-lg font-semibold text-dark m-0">{address}</h3>
      <i
        className="pi pi-ellipsis-v cursor-pointer"
        onClick={(e) => op.current.toggle(e)}
      ></i>
      <OverlayPanel ref={op}>
        <ul className="m-0 p-0 list-none">
          <li>
            <Link to="" className="flex gap-3 text-dark no-underline">
              <i className="pi pi-eye"></i> View
            </Link>
          </li>
          <li>
            <Link to="" className="flex gap-3 text-dark no-underline">
              <i className="pi pi-pencil"></i> Edit
            </Link>
          </li>
          <li>
            <Link to="" className="flex gap-3 text-dark no-underline">
              <i className="pi pi-trash"></i> Delete
            </Link>
          </li>
        </ul>
      </OverlayPanel>
    </div>
  );
  return (
    <Card header={header} className="shadow-2 border-round-xl">
      <div className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          {/* <div className="flex text-sm align-items-center gap-2">
            <img src={BracketIcon} alt="" />
            {inspectionDate}
            <span className="ml-1 font-medium">{service}</span>
          </div> */}
          <div className="grid text-sm align-items-center">
            
            {services.map((service, idx) => (
              <div className="col-6 flex align-items-center gap-2" key={idx}>
                 <img src={BracketIcon} alt="" />
                <span>{service.count}</span>
                <span className="ml-1 text-sm font-medium">{service.label}</span>
              </div>
            ))}
          </div>

          <div className="grid text-base align-items-center mt-3">
            <div className="md:col-6">
              <span className="text-dark text-sm font-medium">
                📅 Last Appraisal Date
              </span>
            </div>
            <div className="md:col-6 text-sm">{lastAppraisalDate}</div>
          </div>
          <div className="grid text-base align-items-center">
            <div className="md:col-6">
              <span className="text-dark text-sm font-medium">📎 Tags</span>
            </div>
            <div className="md:col-6 text-sm">
              {tags.map((tag, index) => (
                <p className="text-sm m-0 ">{tag}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ReportCard = ({
  address,
  bedrooms,
  bathrooms,
  propertyType,
  maxGuests,
  reportDate,
  onDownload,
}) => (
  <Card className="shadow-2 border-round-xl report-card">
    <div className="flex justify-content-between align-items-center mb-2">
      <h3 className="text-lg font-semibold text-dark m-0">{address}</h3>
      <OutlinedButton
        label="Download"
        icon="pi pi-download"
        className="p-button-outlined border-primary p-button-sm"
        onClick={onDownload}
      />
    </div>
    <div>
      <div className="font-medium mb-2">Property Details</div>
      <div className="grid grid-cols-2">
        <div className="col-6">
          <span className="text-dark">Bedrooms</span>
          <span className="ml-2 text-gray">{bedrooms}</span>
        </div>
        <div className="col-6">
          <span className="text-dark">Bathrooms</span>
          <span className="ml-2 text-gray">{bathrooms}</span>
        </div>
        <div className="col-6">
          <span className="text-dark">Property Type</span>
          <span className="ml-2 text-gray">{propertyType}</span>
        </div>
        <div className="col-6">
          <span className="text-dark">Max Guests</span>
          <span className="ml-2 text-gray">{maxGuests}</span>
        </div>
      </div>
      <div className="flex gap-5 align-items-center mt-3">
        <span className="font-medium">Report Creation Date</span>
        <span className="text-gray">{reportDate}</span>
      </div>
    </div>
  </Card>
);
