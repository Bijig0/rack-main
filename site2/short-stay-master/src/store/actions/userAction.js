import api from "../../services/api";
import endPoints from "../../services/endpoints";
import { showToastAction } from "../slices/commonSlice";
import { setUserProfile } from "../slices/userSlice";

export const registerWithAction = (data, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const res = await api("post", endPoints.SIGNUP, data);
    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res?.message || "Registration successful",
        detail: "Your account has been created successfully"
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Registration failed",
        detail: "Please check your information and try again"
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: error.message || "Registration failed",
      detail: "An unexpected error occurred during registration"
    }));
  } finally {
    setLoading(false);
  }
};

export const verifyOtpAction = (data,formData, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const paylod ={
      otp:data?.otpCode,
      email:formData.email
    }
    const res = await api("post", endPoints.VERIFY_REGISTER_OTP, paylod);
    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "OTP sent successfully",
        detail: "Please check your email for the verification code"
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Failed to send OTP",
        detail: "Please try again or contact support"
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: "Failed to send OTP due to technical issues"
    }));
    console.error("Password reset error:", error);
  } finally {
    setLoading(false);
  }
};

export const verifyResetPasswordOtpAction = (data,formData, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const paylod ={
      otp:data?.otpCode,
      email:formData.email
    }
    const res = await api("post", endPoints.VERIFY_RESET_PASSWORD_OTP, paylod);
    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "OTP sent successfully",
        detail: "Please check your email for the verification code"
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Failed to send OTP",
        detail: "Please try again or contact support"
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: "Failed to send OTP due to technical issues"
    }));
    console.error("Password reset error:", error);
  } finally {
    setLoading(false);
  }
};

export const resendRegisterOtpAction = (formData, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const payload = { email: formData.email };

    const res = await api("post", endPoints.RESEND_REGISTER_OTP, payload);

    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "OTP resent successfully",
        detail: "A new OTP has been sent to your email."
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Failed to resend OTP",
        detail: "Please try again or contact support."
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: "Could not resend OTP due to technical issues."
    }));
    console.error("Resend OTP error:", error);
  } finally {
    setLoading(false);
  }
};

export const resendResetPasswordOtpAction = (formData, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const payload = { email: formData.email };
    const res = await api("post", endPoints.RESEND_RESET_PASSWORD_OTP, payload);
    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "OTP resent successfully",
        detail: "A new OTP has been sent to your email."
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Failed to resend OTP",
        detail: "Please try again or contact support."
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: "Could not resend OTP due to technical issues."
    }));
    console.error("Resend OTP error:", error);
  } finally {
    setLoading(false);
  }
};

export const loginAction = (data, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const res = await api("post", endPoints.LOGIN, {
      email: data.email,
      password: data.password
    });


    if (res.success) {
      dispatch(setUserProfile(res?.data))
      dispatch(showToastAction({ 
        type: "success", 
        title: res.message || "Login successful",
        detail: "You have successfully logged in" 
      }));
      onRes && onRes(res.data);
    } else {
      dispatch(showToastAction({ 
        type: "error", 
        title: res.message || "Login failed",
      }));
    }
  } catch (error) {
    dispatch(showToastAction({ 
      type: "error", 
      title: error.message || "Login failed",
      detail: "An unexpected error occurred"
    }));
  } finally {
    setLoading(false);
  }
};

export const resetPasswordOtpAction = (data, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const res = await api("post", endPoints.RESET_PASSWORD_OTP, data);
    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "OTP sent successfully",
        detail: "Please check your email for the verification code"
      }));
      onRes && onRes(res);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Failed to send OTP",
        detail: "Please try again or contact support"
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: "Failed to send OTP due to technical issues"
    }));
    console.error("Password reset error:", error);
  } finally {
    setLoading(false);
  }
};

export const resetPasswordAction = (data, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const res = await api("post", endPoints.RESET_PASSWORD, {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (res.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "Password reset successful",
        detail: "You can now log in with your new password"
      }));
      onRes && onRes(res.data);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Password reset failed",
        detail: "Please check your OTP and try again"
      }));
    }
  } catch (error) {
    dispatch(showToastAction({
      type: "error",
      title: "Something went wrong",
      detail: error.message || "Please try again later"
    }));
  } finally {
    setLoading(false);
  }
};

export const getUserProfileAction = (onRes) => async (dispatch) => {
  try {
    const res = await api("get", endPoints.USER_PROFILE);
    if (res?.data) {
      dispatch(setUserProfile(res.data));
      onRes?.(res.data);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res?.message || "Failed to load profile",
        detail: "Could not retrieve user profile. Please try again."
      }));
    }
  } catch (error) {
    console.error("User profile fetch error:", error);
    dispatch(showToastAction({
      type: "error",
      title: error?.message || "Error fetching profile",
      detail: "An unexpected error occurred. Please try again later."
    }));
  }
};

export const updateUserProfileAction = (formData, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    
    const res = await api(
      "put",
      endPoints.USER_PROFILE,
      formData,
      {},
      "multipart/form-data"
    );

    if (res?.success) {
      dispatch(showToastAction({
        type: "success",
        title: "Profile Updated",
        detail: "Your profile has been successfully updated.",
      }));
      onRes?.(res.data);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res?.message || "Failed to update profile",
        detail: "Could not update profile. Please try again.",
      }));
    }
  } catch (error) {
    console.error("User profile update error:", error);
    dispatch(showToastAction({
      type: "error",
      title: error?.message || "Error updating profile",
      detail: "An unexpected error occurred. Please try again later.",
    }));
  } finally {
    setLoading(false);
  }
};


export const resetUserPasswordAction = (data, setLoading, onRes) => async (dispatch) => {
  try {
    setLoading(true);
    const res = await api("post", endPoints.CHANGE_PASSWORD, data);

    if (res?.success) {
      dispatch(showToastAction({
        type: "success",
        title: res.message || "Password Reset Successful",
        detail: "Your password has been updated. You can now log in with your new password.",
      }));
      onRes?.(res.data);
    } else {
      dispatch(showToastAction({
        type: "error",
        title: res.message || "Password Reset Failed",
        detail: "Failed to reset your password. Please try again.",
      }));
    }
  } catch (error) {
    console.error("User password reset error:", error);
    dispatch(showToastAction({
      type: "error",
      title: error.message || "Error resetting password",
      detail: "An unexpected error occurred. Please try again later.",
    }));
  } finally {
    setLoading(false);
  }
};
