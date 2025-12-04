import React from "react";
import PrimaryButton from "../../pages/shared/components/CustomButton";

export default function EmptyState({
  icon,
  title,
  description,
  buttonLabel,
  onAction,
}) {
  return (
    <div className="flex md:w-30rem m-auto flex-column align-items-center justify-content-center gap-3 p-6">
      <img src={icon} alt="No Properties" className="w-10rem mb-4" />
      <h3 className="text-xl font-medium text-dark m-0">{title}</h3>
      <p className="text-gray text-center m-0">{description}</p>
      <PrimaryButton label={buttonLabel} className="mt-3" onClick={onAction} />
    </div>
  );
}
