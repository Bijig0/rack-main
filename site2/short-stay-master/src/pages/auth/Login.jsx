import React, { useState } from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import {
  CustomCheckbox,
  CustomInput,
  CustomPassword,
} from "../../shared/components/allinput";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton, { GoogleButton } from "../shared/components/CustomButton";
import { Divider } from "primereact/divider";
import formValidation from "../../utils/validation";
import { useDispatch } from "react-redux";
import { loginAction } from "../../store/actions/userAction";
import { showFormErrors } from "../../utils/commonFunctions";
import { login } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  })

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = () => {
    if (showFormErrors(data, setData)) {
      setLoading(true);
      dispatch(
        loginAction(data, setLoading, (res) => {
          setLoading(false);
          login(res.token, () => navigate("/pricing-plan"));
        })
      );
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        title="Welcome Back"
        description="Please sign in to your account."
      >
        <CustomInput label="Email Address" col={12} onChange={handleChange} data={data} name="email" />
        <CustomPassword label="Password" col={12} onChange={handleChange} data={data} name="password" />
        <div className="flex col-12 justify-content-between align-items-center">
          <CustomCheckbox label="Remember Me" onChange={handleChange} data={data} name="rememberMe" />
          <Link
            to="/forgot-password"
            className="text-primary-color font-medium"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="col-12">
          <PrimaryButton label="Sign In" className="w-full" onClick={handleSubmit} loading={loading}
            disabled={loading} />
        </div>
        <Divider align="center">
          <span className="">Or</span>
        </Divider>
        <div className="col-12">
          <GoogleButton className="w-full" label="Sign In with Google" />
        </div>
        <p className="text-center text-dark">
          Don’t have an Account?{" "}
          <Link to="/register" className="text-primary-color font-semibold">
            Register
          </Link>
        </p>
      </AuthContainer>
    </PublicLayout>
  );
}
