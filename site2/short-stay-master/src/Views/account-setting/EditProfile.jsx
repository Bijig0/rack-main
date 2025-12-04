import React, { use, useEffect, useState } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { Navigate, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { FileUpload } from "primereact/fileupload";
import AvatarImg from "../../assets/images/icons/avatar.svg";
import { CustomFileInput, CustomInput } from "../../shared/components/allinput";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction, updateUserProfileAction } from "../../store/actions/userAction";
import formValidation from "../../utils/validation";
import { showFormErrors } from "../../utils/commonFunctions";
import constants from "../../constant";

export default function EditProfile() {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    image: "",
    formErrors: {}
  });
  const { profile } = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);



  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        fullName: profile?.fullName || "",
        email: profile?.email || "",
      }));
      setImageSrc(profile?.image || null);
    }
  }, [profile]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({
      ...prev,
      [name]: value,
      formErrors: { ...prev.formErrors, ...formErrors }
    }));
  };


  const handleImageUpload = (e) => {
    const file = e.value;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
      setData((prev) => ({
        ...prev,
        image: file,
        formErrors: { ...prev.formErrors, image: "" }
      }));
    }
  };


  const getImageUrl = (src) => {
    if (!src) return profile?.image || AvatarImg;
    if (typeof src === "string" && (src.startsWith("http") || src.startsWith("data:"))) return src;
    const base = constants.baseUrl.endsWith("/") ? constants.baseUrl : `${constants.baseUrl}/`;
    return `${base}${src}`;
  };

  const handleSubmit = () => {
    if (showFormErrors(data, setData)) {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      dispatch(updateUserProfileAction(formData, setLoading, () => {
      }))

    }
  }

  const breadcrumbs = [
    { label: "Account Settings", command: () => navigate("/account-setting") },
    { label: "Edit Profile" },
  ];

  return (
    <PrivateLayout>
      <TitleContainer
        title="Edit Profile"
        breadcrumbs={breadcrumbs}
        searchinput={false}
      />
      <div className="mt-3 p-3 shadow-1 border-round-lg">
        <div className="flex align-items-center gap-3">
          <img
            src={getImageUrl(imageSrc)}
            alt="Profile"
            width={112}
            height={112}
            className="border border-gray-300 shadow-1"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <CustomFileInput
            name="image"
            label="Upload Photo"
            onChange={handleImageUpload}
            style="bg-green p-2 px-3 border-round-xl text-sm"
          />
        </div>
        <div className="grid mt-3">
          <CustomInput
            label="Full Name"
            name="fullName"
            onChange={handleChange}
            data={data}
            className="bg-cream-light w-full"
            col={4}
          />
          <CustomInput
            label="Email Address"
            data={data}
            name="email"
            disabled
            className="bg-cream-light w-full"
            col={4}
          />
        </div>
      </div>
      <div className="flex justify-content-end mt-3">
        <PrimaryButton
          label="Save Changes"
          loading={loading}
          onClick={handleSubmit} />
      </div>
    </PrivateLayout>
  );
}
