import React, { useState } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { useNavigate } from "react-router-dom";
import AddAddress from "./AddAddress";
import AddressContainer from "./AddressContainer";

export default function CreateAddress() {
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "My Properties", command: () => navigate("/properties") },
    { label: "Add Address" },
  ];
  const [showAddressContainer, setShowAddressContainer] = useState(false);

  const handleSave = () => {
    setShowAddressContainer(true);
  };
  return (
    <PrivateLayout>
      <TitleContainer
        title="Create Address"
        breadcrumbs={breadcrumbs}
        searchinput={false}
        btnLabel={showAddressContainer && "Generate New Appraisal"}
      />
      {!showAddressContainer ? (
        <AddAddress onClick={handleSave} />
      ) : (
        <AddressContainer />
      )}
    </PrivateLayout>
  );
}
