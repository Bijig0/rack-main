import React, { useState } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { PropertyCard } from "../../shared/components/CustomCard";
import EmptyState from "../../shared/components/EmptyScreen";
import EmptyImg from "../../assets/images/empty.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";

export default function MyProperties() {
  const [view, setView] = useState("block");
   const navigate = useNavigate(); 
  const property = {
    address: "12 Byron St, Newtown",
    lastAppraisalDate: "3 days ago",
    tags: ["High Risk Zone"],
    services: [
      { count: "14/20", label: "Building Inspection" },
      { count: "10/10", label: "Final Review" },
      { count: "8/10", label: "Plumbing Check" },
      { count: "7/7", label: "Fire Safety Audit" },
    ],
  };
  const properties = Array(5).fill(property);
  const actionsBodyTemplate = () => (
    <span>
      <i className="pi pi-eye mx-2 cursor-pointer" />
      <i className="pi pi-pencil mx-2 cursor-pointer" />
      <i className="pi pi-trash mx-2 cursor-pointer" />
    </span>
  );
  return (
    <PrivateLayout>
      <TitleContainer
        title="My Properties"
        filter
        view={view}
        setView={setView}
      />
      <EmptyState icon={EmptyImg} title="Can’t find your property?" description={`If your address isn’t listed, just click "Create {address}" at the bottom to quickly add it as a new property.`} buttonLabel="Create Address" />
       {properties.length === 0 ? (
        <EmptyState
          icon={EmptyImg}
          title="Can’t find your property?"
          description={`If your address isn’t listed, just click "Create Address" at the bottom to quickly add it as a new property.`}
          buttonLabel="Create Address"
          onAction={() => navigate("/create-address")}
        />
      ) :
      view === "block" ? (
        <div className="grid mt-4">
          <div className="md:col-4">
            <PropertyCard {...property} />
          </div>
        </div>
      ) : (
        <div className="mt-4 shadow-1 p-4 border-round-lg">
          <DataTable
            value={properties}
            className="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <Column field="address" header="Address" sortable  />
            <Column field="lastAppraisalDate" sortable  header="Last Appraisal Date" />
            <Column
              header="Actions"
              body={actionsBodyTemplate}
              style={{ width: 120 }}
            />
          </DataTable>
        </div>
      )}
    </PrivateLayout>
  );
}
