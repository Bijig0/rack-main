import React from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import ShieldImg from "../../assets/images/icons/shieldimg.svg";
import PrimaryButton from "../shared/components/CustomButton";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Congrats() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegistration = location.state?.isRegistration || false;

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        src={ShieldImg}
        title={isRegistration ? "Your account has been created!" : "Congratulations"}
        description={isRegistration ? "" :"Your Password has been successfully reset.Click below to return to the login screen."}
      >
        <div className="col-12">
          <Link to="/login" className="no-underline">
            <PrimaryButton label="Go to Sign In" className="mx-auto block" />
          </Link>
        </div>
      </AuthContainer>
    </PublicLayout>
  );
}
