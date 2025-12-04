import React, { useState } from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import { CustomPassword } from "../../shared/components/allinput";
import PrimaryButton from "../shared/components/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../../store/actions/userAction";
import formValidation from "../../utils/validation";
import { showFormErrors } from "../../utils/commonFunctions";

export default function ResetPassword() {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = () => {
    if (showFormErrors(data, setData)) {
      const formData = {
        email: location.state?.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      dispatch(
        resetPasswordAction(formData, setLoading, (res) => {
          navigate("/congrats");
        })
      );
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        title="Reset Password"
        description="Your new password must be unique from those previously used."
      >
        <CustomPassword
          label="New Password"
          name="password"
          onChange={handleChange}
          data={data}
        />
        <CustomPassword
          label="Confirm Password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          data={data}
        />
        <div className="col-12">
          <PrimaryButton
            label={loading ? "Processing..." : "Continue"}
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          />
        </div>
      </AuthContainer>
     </PublicLayout>
  );
}
