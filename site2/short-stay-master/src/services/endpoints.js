const endPoints = {
  LOGIN: "user/login/",
  SIGNUP: "user/register",
  VERIFY_REGISTER_OTP: "user/veify-register-otp",
  VERIFY_RESET_PASSWORD_OTP: "user/verify-reset-password-otp",
  RESEND_REGISTER_OTP: "user/resend-register-otp",
  RESEND_RESET_PASSWORD_OTP: "user/resend-reset-password-otp",
  RESET_PASSWORD_OTP: "user/reset-password-otp",
  GET_PROFILE: "user/profile/",
  FORGOT_PASSWORD: "user/forgot-password/",
  VERIFY_OTP: "user/verify-otp/",
  RESET_PASSWORD: "user/reset-password",
  USER_PROFILE: "user/profile",
  CHANGE_PASSWORD: "user/profile/change-password",
  ESTIMATOR_PROPERTY: "user/pricelab-estimator",
  ESTIMATOR_PROPERTY_BY_ID: (id) => `user/pricelab-estimator/${id}`,
};
export default endPoints;
