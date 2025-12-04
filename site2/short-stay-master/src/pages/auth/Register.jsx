import React, { useState } from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import { CustomInput, CustomPassword } from "../../shared/components/allinput";
import PrimaryButton, { GoogleButton } from "../shared/components/CustomButton";
import { Divider } from "primereact/divider";
import { Link, useNavigate } from "react-router-dom";

import formValidation from "../../utils/validation";
import { showFormErrors } from "../../utils/commonFunctions";
import { registerWithAction } from "../../store/actions/userAction";
import { useDispatch } from "react-redux";

export default function Register() {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        registerWithAction(data, setLoading, () => {
          navigate("/otp-verification", {
            state: { formData: data },
          })
          setData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",

          })
        })
      );
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        title="Register"
        description="Join us by creating your account."
      >
        <CustomInput
          label="Full Name"
          placeholder="Enter Your Full Name"
          col={12}
          name={"fullName"}
          data={data}
          onChange={handleChange}
        />
        <CustomInput
          label="Email Address"
          placeholder="Enter Email"
          col={12}
          name={"email"}
          data={data}
          onChange={handleChange}
        />
        <CustomPassword
          label="Password"
          placeholder="Enter password"
          name="password"
          data={data}
          onChange={handleChange}
        />
        <CustomPassword
          label="Confirm Password"
          placeholder="Enter Confirm password"
          name="confirmPassword"
          data={data}
          onChange={handleChange}
        />
        <div className="col-12">
          <PrimaryButton
            label="Continue"
            className="w-full"
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
        <Divider align="center">
          <span className="">Or</span>
        </Divider>
        <div className="col-12">
          <GoogleButton className="w-full" label="Register with Google" />
        </div>
        <p className="text-center text-dark">
          Already have an Account?
          <Link to="/login" className="text-primary-color font-semibold">
            Sign In
          </Link>
        </p>
      </AuthContainer>
    </PublicLayout>
  );
}
