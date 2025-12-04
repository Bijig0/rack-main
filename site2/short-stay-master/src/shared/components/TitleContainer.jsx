import React from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import PrimaryButton, { OutlinedButton } from "../../pages/shared/components/CustomButton";
import { SelectButton } from "primereact/selectbutton";
import ListIcon from "../../assets/images/icons/list.svg";
import BlockIcon from "../../assets/images/icons/blockicon.svg";

export default function TitleContainer({
  title,
  model,
  home,
  searchinput = true,
  breadcrumbs,
  description,
  filter,
  view,
  setView,
  btnLabel,
  onClick,
  exportBtn,
  btnClass,
  btnIcon,
}) {


  

  const options = [
    { icon: BlockIcon, value: "block" },
    { icon: ListIcon, value: "list" },
  ];

  const justifyTemplate = (option) => {
    return <img src={option.icon} width={20} alt="view icon" />;
  };

  return (
    <div className="shadow-1 border-round-lg p-3 flex flex-wrap gap-3 justify-content-between align-items-center">
      {/* Left Section: Title + Breadcrumbs + Description */}
      <div>
        <h2 className="m-0 text-dark">{title}</h2>

        {breadcrumbs && (
          <BreadCrumb
            model={breadcrumbs}
            home={home}
            className="border-none p-0 surface-ground mt-2"
          />
        )}

        {description && <p className=" text-gray-600 m-0">{description}</p>}
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex align-items-center gap-2">
        {exportBtn && <PrimaryButton label="Export" icon="pi pi-download" onClick={onClick} className={`bg-gray  ${btnClass}`} />}
        {btnLabel && <PrimaryButton label={btnLabel} icon={btnIcon} onClick={onClick} className={btnClass} />}
      </div>

      {/* Search and Filter Section */}
      {searchinput && (
        <div className="flex w-full md:w-auto flex-wrap align-items-center gap-3">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" className="w-full" />
          </IconField>

          {filter && (
            <>
              <OutlinedButton label="Sort by" icon="pi pi-sort-amount-down" />
              <PrimaryButton label="Filter by" icon="pi pi-sliders-h" />

              <SelectButton
                value={view}
                className="flex view-change-btn"
                onChange={(e) => setView?.(e.value)}
                options={options}
                itemTemplate={justifyTemplate}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
