import React, { useState } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { Navigate } from "react-router-dom";
import { CustomDropDown, CustomInput } from "../../shared/components/allinput";
import { InputText } from "primereact/inputtext";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { FileUpload } from "primereact/fileupload";
import SheildImg from "../../assets/images/icons/shieldimg.svg";

export default function GenerateAppraisal() {
 const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const breadcrumbs = [
    { label: "Appraisal Reports", command: () => Navigate("/properties") },
    { label: "Generate Appraisal" },
  ];

  const handleGenerateReport = () => {
    setSuccess(true);
  };

  const handleUpload = (event) => {
    const files = event.files || [];
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...newImages]);
    event.options.clear && event.options.clear();
  };

  const handleRemoveImage = (removeIdx) => {
    setImages(images.filter((_, idx) => idx !== removeIdx));
  };
  if (success) {
    return (
      <PrivateLayout>
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
          <img
            src={SheildImg}
            alt="Success"
            style={{ width: 100, marginBottom: 24 }}
          />
          <div className="text-dark font-semibold mb-3" style={{ fontSize: 16 }}>
            Appraisal Generated Successfully!
          </div>
          <PrimaryButton label="Download PDF" icon="pi pi-download" />
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <TitleContainer
        title="Generate Appraisal"
        breadcrumbs={breadcrumbs}
        searchinput={false}
      />
      <div className="shadow-1 border-round-lg p-4 mt-3">
        <div className="flex gap-3 flex-wrap">
          {images.length > 0 &&
            images.map((image, index) => (
              <div
                className="relative image-box border-round-lg mb-3"
                key={index}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="border-round-xl w-full"
                />
                <div
                  className="bg-dark cross-icon cursor-pointer"
                  onClick={() => handleRemoveImage(index)}
                >
                  <i className="pi pi-times text-xs"></i>
                </div>
              </div>
            ))}
        </div>
        <FileUpload
          mode="basic"
          name="property[]"
          multiple
          url="/api/upload"
          accept="image/*"
          className="upload-btn"
          chooseLabel="Upload"
          maxFileSize={1000000}
          customUpload
          auto
          uploadHandler={handleUpload}
        />
        <div className="grid">
          <CustomInput label="Property" col={4} />
          <CustomDropDown label="Bedrooms" col={4} />
          <CustomDropDown label="Bathrooms" col={4} />
          <CustomInput label="Max Guest" col={4} />
          <div className="md:col-4">
            <label
              htmlFor=""
              className="mb-1 font-semibold text-black-alpha-90"
            >
              Cleaning Fee
            </label>
            <div className="p-inputgroup mt-3 flex-1">
              <span className="p-inputgroup-addon border-none">AUD</span>
              <InputText placeholder="Username" className="border-none" />
            </div>
          </div>
          <CustomDropDown label="Property Type" col={4} />
        </div>
      </div>
      <div className="flex justify-content-end mt-3">
        <PrimaryButton className="" label="Generate Report" onClick={handleGenerateReport} />
      </div>
      
    </PrivateLayout>
  );
}
