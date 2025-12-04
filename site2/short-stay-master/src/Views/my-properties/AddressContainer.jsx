import React, { useState } from "react";
import PrimaryButton, {
  OutlinedButton,
} from "../../pages/shared/components/CustomButton";
import { CustomDropDown, CustomInput } from "../../shared/components/allinput";
import { FileUpload } from "primereact/fileupload";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const checklistTabs = [
  "Pest Inspection",
  "Roof Condition",
  "Utilities",
  "Amenities",
];

export default function AddressContainer() {
  const [images, setImages] = useState([]);
  const [selectedTab, setSelectedTab] = useState(checklistTabs[0]);
  const [showUpload, setShowUpload] = useState(true);
  const [checklistView, setChecklistView] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [checklist, setChecklist] = useState([
    { item: "Rodent Signs", type: "Number", value: "4" },
    { item: "Mould Inspection", type: "Text", value: "Yes" },
    // Add more items as needed
  ]);

  const checklistActions = (rowData, options) => (
    <span className="flex gap-2">
      <i className="pi pi-pencil text-primary-color cursor-pointer" />
      <i className="pi pi-trash text-red-color cursor-pointer" />
    </span>
  );
  const handleUpload = async (event) => {
    const files = event.files;
    const uploadedImages = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages([...images, ...uploadedImages]);
    setShowUpload(false);
    event.options.clear();
  };

  const handleRemoveImage = (removeIdx) => {
    setImages(images.filter((_, idx) => idx !== removeIdx));
  };
  const appraisals = [
    {
      date: "04 June 2025",
      status: "Generated",
      time: "2:15 PM",
      pdfUrl: "#",
    },
    {
      date: "15 May 2025",
      status: "Generated",
      time: "2:15 PM",
      pdfUrl: "#",
    },
  ];

  const appraisalDateBody = (rowData) => (
    <span className="bg-white px-3 py-1 border-round-xl text-dark">
      <a href={rowData.pdfUrl} className="text-primary-color underline">
        {rowData.date} – {rowData.status}
      </a>
    </span>
  );

  const viewPdfBody = () => (
    <i
      className="pi pi-eye text-dark"
      style={{ fontSize: "1rem", cursor: "pointer" }}
    />
  );
  return (
    <div className="address-container">
      <div className="shadow-1 mt-3 border-round-lg p-4">
        <div className="flex flex-column gap-3">
          <div className="flex justify-content-between align-items-center">
            {!editAddress && (
              <div className="flex align-items-center gap-2">
                <span className="font-medium text-dark text-lg">
                  12 Byron St, Newtown
                </span>
                <i
                  className="pi pi-pencil"
                  onClick={() => setEditAddress(true)}
                />
              </div>
            )}
            {editAddress && (
              <IconField iconPosition="right">
                <InputText placeholder="12 Byron St, Newtown" />
                <InputIcon className="pi pi-check-circle text-primary-color"></InputIcon>
              </IconField>
            )}
          </div>

          <div className="flex flex-column gap-2">
            <div className="flex align-items-center gap-2">
              <span className="text-dark font-medium">
                📅 Last Appraisal Date
              </span>
              <span className="text-gray-500">3 days ago</span>
            </div>
          </div>

          <div className="flex align-items-center gap-2">
            <span className="text-dark font-medium">📎 Tags</span>

            <p className="m-0">High Risk Zone</p>
          </div>
          {/* {!showUpload && ( */}
          <div className="bg-light-color p-4 border-round-lg images-container">
            <div className="flex align-items-center justify-content-between">
              <p className="font-semibold mt-0 text-dark">Images</p>
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
            </div>

            <div className="flex gap-3 flex-wrap">
              {images.length === 0 ? (
                <div className="text-gray-500 py-4 w-full text-center">
                  No Data
                </div>
              ) : (
                images.map((image, index) => (
                  <div
                    className="relative image-box border-round-lg"
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
                ))
              )}
            </div>
          </div>
          <p className="text-lg text-dark font-semibold">
            Checklist Management
          </p>
          <div className="bg-light-color p-4 border-round-lg images-container">
            <p className="font-semibold text-dark">Existing Checklist Items</p>
            <div className="flex gap-3 mb-4">
              {checklistTabs.map((tab) => (
                <PrimaryButton
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium border-none outline-none transition-colors
              ${
                selectedTab === tab
                  ? "bg-primary-color text-white"
                  : "bg-white text-dark"
              }`}
                  label={tab}
                />
              ))}
            </div>
            <div className="grid align-items-end">
              <CustomDropDown
                label="Checklist Item"
                col={3}
                dropDownClassName="bg-white"
              />
              <CustomDropDown
                label="Value Type"
                col={3}
                dropDownClassName="bg-white"
              />
              <CustomInput label="Add Value" inputClass="bg-white" col={3} />
              <OutlinedButton
                label="Add"
                onClick={() => setChecklistView(true)}
                className="mb-3 "
              />
              {/* {checklistView && ( */}
              <div className="col-12">
                <div className="bg-white border-round-lg">
                  <DataTable
                    value={checklist}
                    className="p-datatable-sm no-border-table"
                    emptyMessage="No Checklist Items"
                    showGridlines
                    responsiveLayout="scroll"
                  >
                    <Column field="item" header="Checklist Item" />
                    <Column field="type" header="Value Type" />
                    <Column field="value" header="Value" />
                    <Column
                      body={checklistActions}
                      header=""
                      style={{ width: 80 }}
                    />
                  </DataTable>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
          <div className="flex justify-content-center">
            <PrimaryButton label="Save" />
          </div>
          {/* )} */}
        </div>
      </div>
      <div className="shadow-1 mt-3 border-round-lg p-4">
        <p className="text-lg text-dark font-semibold">
          Linked Reports & Actions
        </p>
        <div className="bg-light-color p-4 border-round-lg">
          <DataTable
            value={appraisals}
            className="p-datatable-sm no-border-table"
            showGridlines={false}
            responsiveLayout="scroll"
          >
            <Column
              field="date"
              header="Appraisals:"
              body={appraisalDateBody}
              style={{ minWidth: 220 }}
            />
            <Column
              field="time"
              header="Local Time"
              style={{ minWidth: 120 }}
            />
            <Column
              header="View PDF"
              body={viewPdfBody}
              style={{ minWidth: 100 }}
            />
          </DataTable>
        </div>
        <div className="flex justify-content-start mt-3">
          <PrimaryButton label="Generate New Appraisal" />
        </div>
      </div>
    </div>
  );
}
