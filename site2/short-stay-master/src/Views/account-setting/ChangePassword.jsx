
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { Navigate, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import AvatarImg from "../../assets/images/icons/avatar.svg";
import { CustomPassword } from "../../shared/components/allinput";
import { useState } from "react";
import { useDispatch } from "react-redux";
import formValidation from "../../utils/validation";
import { showFormErrors } from "../../utils/commonFunctions";
import { resetUserPasswordAction } from "../../store/actions/userAction";

export default function ChangePassword() {

  const [data, setData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = () => {
    if (showFormErrors(data, setData)) {
      dispatch(
        resetUserPasswordAction(data, setLoading, () => {
          setData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          })

        })
      );
    }
  }


  const breadcrumbs = [
    { label: "Account Settings", command: () => navigate("/account-setting") },
    { label: "Change Password" },
  ];
  return (
    <PrivateLayout>
      <TitleContainer
        title="Change Password"
        breadcrumbs={breadcrumbs}
        searchinput={false}
      />
      <div className="mt-3 p-3 shadow-1 border-round-lg">

        <div className="grid mt-3">
          <CustomPassword
            label="Old Password"
            name="oldPassword"
            data={data}
            onChange={handleChange}
            placeholder="********"
            col={4}

          />
          <CustomPassword
            label="New Password"
            placeholder="********"
            name="newPassword"
            data={data}
            onChange={handleChange}
            col={4}
          />
          <CustomPassword
            label="Confirm Password"
            name="confirmPassword"
            data={data}
            onChange={handleChange}
            placeholder="********"
            col={4}

          />
        </div>
      </div>
      <div className="flex justify-content-end mt-3">
        <PrimaryButton
          label="Update"
          onClick={handleSubmit}
          loading={loading}
        />
      </div>
    </PrivateLayout>
  );
}
