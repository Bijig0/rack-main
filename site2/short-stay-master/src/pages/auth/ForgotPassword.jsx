import React, { useState } from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import { CustomInput } from "../../shared/components/allinput";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../shared/components/CustomButton";
import formValidation from "../../utils/validation";
import { showFormErrors } from "../../utils/commonFunctions";
import { useDispatch } from "react-redux";
import { loginAction, resetPasswordOtpAction } from "../../store/actions/userAction";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [data, setData] = useState({
    email: "",
  })
  const [loading, setLoading] = useState(false)



  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = () => {
    if (showFormErrors(data, setData)) {
      setLoading(true);
      dispatch(
        resetPasswordOtpAction(data, setLoading, (res) => {
          navigate("/otp-verification", {
            state: {
              formData: {
                email: data.email,
                action: "forgot",
              },
            },
          });
        })
      );
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        title="Forgot Password"
        description="Please enter the email address linked with your account."
      >
        <CustomInput label="Email Address" col={12} data={data} name="email" onChange={handleChange}/>
        <div className="col-12 mt-3">
          <PrimaryButton
            label="Send OTP"
            className="w-full"
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
        <p className="text-center text-dark">
          Remember Password?
          <Link to="/login" className="text-primary-color font-semibold ml-1">
            Sign In
          </Link>
        </p>
      </AuthContainer>
     </PublicLayout>
  );
}
