import { useState } from "react";
import {
  loginUser,
  registerUser,
  forgotPassword as forgotPasswordApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
  resendOtp as resendOtpApi,
} from "../api/mobileAuth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Save JWT token
      await AsyncStorage.setItem("token", data.token);

      // Save logged-in user information
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      const data = await registerUser(userData);

      return {
        success: true,
        message: data.message,
        user: data.user,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const data = await forgotPasswordApi(email);

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const data = await verifyOtpApi(email, otp);

      return {
        success: true,
        message: data.message,
        resetToken: data.resetToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to verify OTP",
        errors: error.errors || {},
      };
    }
  };

  const resetPassword = async (resetToken, password, confirmPassword) => {
    try {
      const data = await resetPasswordApi(
        resetToken,
        password,
        confirmPassword,
      );

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to reset password",
        errors: error.errors || {},
      };
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const data = await resendOtpApi(email);

      return {
        success: true,
        message: data.message,
        errors: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        errors: error.errors || {},
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    loading,
  };
};

export default useAuth;
