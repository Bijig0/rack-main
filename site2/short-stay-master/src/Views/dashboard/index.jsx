import React, { useState } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import OverviewCard, { PropertyCard } from "../../shared/components/CustomCard";
import TotalPropertiesImg from "../../assets/images/icons/total-properties.svg";
import ActiveListImg from "../../assets/images/icons/activites-list.svg";
import CompleteListImg from "../../assets/images/icons/complete-checklist.svg";
import AppraisalImg from "../../assets/images/icons/appraisal-report.svg";
import EmptyState from "../../shared/components/EmptyScreen";
import EmptyImg from "../../assets/images/empty-screen.svg"

export default function Dashboard() {
    const [properties] = useState([]);
  const overviewData = [
    {
      icon: TotalPropertiesImg,
      title: "Total Properties",
      // count: "35"
    },
    {
      icon: ActiveListImg,
      title: "Active Listings",
    },
    {
      icon: CompleteListImg,
      title: "Completed Checklists",
    },
    {
      icon: AppraisalImg,
      title: "Appraisal Reports Generated",
    },
  ];
  const property = {
    address: "12 Byron St, Newtown",
    inspectionDate: "14/10",
    reviewDate: "10/10",
    lastAppraisalDate: "3 days ago",
    tags: ["High Risk Zone"],
  };
  const handleView = () => {
    // Handle view action
  };

  const handleEdit = () => {
    // Handle edit action
  };

  const handleDelete = () => {
    // Handle delete action
  };
  return (
    <PrivateLayout>
      <TitleContainer title="Dashboard" />
      <div className="grid mt-3">
        {overviewData.map((item, index) => (
          <div key={index} className="col-12 sm:col-6 lg:col-3">
            <OverviewCard
              src={item.icon}
              title={item.title}
              count={item.count}
            />
          </div>
        ))}
      </div>
      <div className="">
        <h4 className="text-2xl text-dark">All Properties</h4>
        {properties.length === 0 ? (
          <EmptyState icon={EmptyImg} title="🏡 No properties yet" description="Start your property journey by adding your first address." buttonLabel="+ Add Property" />
        ) : (
          <div className="grid">
            <div className="md:col-4">
              <PropertyCard
                {...property}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}
