import React from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import {
  CustomInput,
  CustomInputTextArea,
} from "../../shared/components/allinput";
import PrimaryButton from "../../pages/shared/components/CustomButton";

export default function ContactUs() {
  return (
    <PrivateLayout>
      <TitleContainer
        title="Contact Us"
        description="Have a question or need support? We’re here to help."
        searchinput={false}
      />
      <div className="shadow-1 mt-3 p-4 border-round-lg">
        <div className="grid">
          <CustomInput label="Full Name" col={4} />
          <CustomInput label="Email Address" col={4} />
          <CustomInput label="Subject" col={4} />
          <CustomInputTextArea label="Message" col={12} />
        </div>
      </div>
      <div className="flex justify-content-end mt-3">
        <PrimaryButton label="Submit" />
      </div>
    </PrivateLayout>
  );
}
