import React from "react";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { CustomDropDown, CustomInput } from "../../shared/components/allinput";

export default function AddAddress({onClick}) {
  return (
    <div className="add-address">
      <div className="shadow-1 mt-3 border-round-lg p-4">
        <div className="grid ">
          <CustomInput label="Street Address" col={4} />
          <CustomDropDown
            label="Country"
            col={4}
            dropDownClassName="bg-light-color"
          />
          <CustomDropDown
            label="State"
            col={4}
            dropDownClassName="bg-light-color"
          />
          <CustomDropDown
            label="City"
            col={4}
            dropDownClassName="bg-light-color"
          />
          <CustomInput label="Postcode" col={4} />
        </div>
      </div>
      <div className="flex justify-content-end mt-3">
        <PrimaryButton label="Save" onClick={onClick} />
      </div>
    </div>
  );
}
