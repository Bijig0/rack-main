import React, { useEffect, useState } from "react";
import PublicLayout from "../../layout/Public";
import AuthContainer from "../../layout/auth";
import { CustomOtpInput } from "../../shared/components/allinput";
import PrimaryButton from "../shared/components/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resendRegisterOtpAction, resendResetPasswordOtpAction, verifyOtpAction, verifyResetPasswordOtpAction } from "../../store/actions/userAction";

export default function OtpVerification() {
  const { state } = useLocation();
  const formData = state?.formData || {};

  const [data, setData] = useState({
    otpCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(55);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const numericValue = e.value.replace(/\D/g, "");
    setData((prev) => ({ ...prev, otpCode: numericValue }));
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    if (formData?.action === "forgot") {
      dispatch(
        resendResetPasswordOtpAction(formData, setLoading, (res) => {
          setResendTimer(55);
          setData((prev) => ({ ...prev, otpCode: "" }));
        })
      );
    } else {
      dispatch(
        resendRegisterOtpAction(formData, setLoading, (res) => {
          setResendTimer(55);
          setData((prev) => ({ ...prev, otpCode: "" }));
        })
      );
    }

  };

  const handleSubmit = () => {
    if (formData?.action === "forgot") {
      dispatch(verifyResetPasswordOtpAction(data, formData, setLoading, (res) => {
        navigate("/reset-password", {
          state: {
            email: formData?.email
          }
        })
      }))
    } else {
      dispatch(verifyOtpAction(data, formData, setLoading, (res) => {
        navigate("/congrats",{ state: { isRegistration: true } })
      }))
    }

  };

  return (
    <PublicLayout showFooter={false}>
      <AuthContainer
        title="OTP Verification"
        description={`Enter the 6-digit verification code sent to ${formData?.email?.replace(
          /(\w{2})[\w.-]+@([\w.]+\w)/,
          "$1****@$2"
        )}`}
      >
        <CustomOtpInput
          col={12}
          value={data.otpCode}
          length={6}
          onChange={handleChange}
          data={data}
        />
        <div className="text-center flex align-items-center gap-2 justify-content-center text-dark  cursor-pointer">
          <span
            onClick={resendTimer > 0 ? null : handleResendOtp}
            className={`${resendTimer > 0
              ? "cursor-default"
              : "text-primary-color underline font-semibold cursor-pointer"
              }`}
          >
            {resendTimer > 0 ? (
              <>
                Resend code in{" "}
                <span className="text-primary-color underline font-semibold">
                  {resendTimer}s
                </span>
              </>
            ) : (
              "Resend code"
            )}
          </span>
        </div>

        <div className="col-12 mt-3">
          <PrimaryButton
            label="Continue"
            className="w-full"
            loading={loading}
            onClick={handleSubmit}
            disabled={!data.otpCode}
          />
        </div>
      </AuthContainer>
     </PublicLayout>
  );
}
