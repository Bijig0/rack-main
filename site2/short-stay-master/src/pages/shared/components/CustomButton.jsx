import { Button } from "primereact/button";
import React from "react";
import GoogleIcon from "../../../assets/images/icons/googleicon.svg";

export default function PrimaryButton({ label, icon,onClick, className = '', loading, ...props }) {
  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      className={`p-button p-button-raised border-none ${className} ${className.includes('bg-') ? '' : 'bg-primary-color text-white '}`}
      loading={loading}
      {...props}
    />
  );
}

export const OutlinedButton = ({ label, icon, className = "", ...props }) => {
  return (
    <Button
      label={label}
      icon={icon}
      outlined
      className={`p-button-outlined border-primary text-primary-color font-medium ${className}`}
      {...props}
    />
  );
};

export const GoogleButton = ({ label, icon, className = "", ...props }) => {
  return (
    <Button
      icon={icon}
      outlined
      className={`p-button-outlined justify-content-center gap-2 border-black-alpha-20 text-dark font-normal ${className}`}
      {...props}
    ><img src={GoogleIcon} alt="" />{label}</Button>
  );
};
