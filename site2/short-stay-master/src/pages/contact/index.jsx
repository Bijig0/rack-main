import React from "react";
import {
  CustomInput,
  CustomInputTextArea,
} from "../../shared/components/allinput";
import PublicLayout from "../../layout/Public";
import PrimaryButton from "../shared/components/CustomButton";
import ContactImg from "../../assets/images/contactimg.svg";

export default function Contact() {
  return (
    <PublicLayout>
      <div className="grid m-0 p-0 contact-container">
        <div className="col-12 lg:col-6 p-0">
          <img
            src={ContactImg}
            alt="Contact"
            className="w-full object-cover"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
        <div className="col-12 flex flex-column justify-content-center lg:col-6 p-0">
          <div className="p-5 contact-form-box">
            <h1 className="text-4xl font-bold text-dark mt-0 mb-4">
              Contact Us
            </h1>
            <form className="flex flex-column gap-4">
              <CustomInput label="Full Name" col={12} />
              <CustomInput label="Email Address" col={12} />
              <CustomInput label="Subject" col={12} />
              <CustomInputTextArea label="Message" col={12} />
              <div className="flex">
                <PrimaryButton
                  label="Send Message"
                  className="mt-2"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
