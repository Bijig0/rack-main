import React, { useEffect } from "react";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { Avatar } from "primereact/avatar";
import AvatarImg from "../../assets/images/icons/avatar.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../store/actions/userAction";

export default function AccountSetting() {
  const { profile } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(
      getUserProfileAction()
    );
  }, [dispatch]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };
  const handleChangePassword = () => {
    navigate("/change-password");
  };
  return (
    <PrivateLayout>
      <TitleContainer title="Account Settings" searchinput={false} />
      <div className="grid">
        <div className="col-12 md:col-6">
          <div className=" mt-3 p-3 shadow-1 border-round-lg h-full">
            <div className="flex justify-content-between align-items-center gap-3">
              <h2 className="text-dark m-0">My Profile</h2>
              <PrimaryButton
                label="Edit Profile"
                icon="pi pi-pencil"
                className="border-round-xl"
                onClick={handleEditProfile}
              />
            </div>
            <div className="mt-3 bg-light-color p-4 border-round-lg">
              <Avatar
                image={AvatarImg}
                shape="circle"
                style={{ width: "100px", height: "100px" }}
              />
              <ul className="p-0">
                <li className="flex justify-content-between align-items-center mb-2">
                  <span className="text-dark font-medium">Full Name:</span>
                  <span className="text-gray">{profile?.fullName}</span>
                </li>
                <li className="flex justify-content-between align-items-center">
                  <span className="text-dark font-medium">Email Address:</span>
                  <span className="text-gray">{profile?.email}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6">
          <div className="mt-3 p-3 shadow-1 border-round-lg h-full">
            <div className="flex justify-content-between align-items-center gap-3">
              <h2 className="text-dark m-0">Change Password</h2>
              <PrimaryButton
                label="Change Password"
                className="border-round-xl"
                onClick={handleChangePassword}
              />
            </div>
            <div className="mt-3 bg-light-color p-4 border-round-lg">
              <ul className="p-0">
                <li className="flex justify-content-between align-items-center mb-2">
                  <span className="text-dark font-medium">Password</span>
                  <span className="text-gray">********</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
