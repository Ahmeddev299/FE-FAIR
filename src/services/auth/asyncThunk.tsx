/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authBaseService } from "./endpoints"; // Import your authService

interface LoginUserData {
  email: string;
  password: string;
  // add other properties as needed
}

interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Throw on API-level failures even if HTTP 200
const unwrapAndGuard = (res: any, fallbackMsg: string) => {
  const body = res?.data ?? res;
  if (body?.success === false || (body?.status ?? 200) >= 400) {
    throw new Error(body?.message || fallbackMsg);
  }
  return body;
};


export const userSignUpAsync = createAsyncThunk(
  "/auth/sign-Up",
  async (data: UserData, { rejectWithValue }) => {
    try {
      const response = await authBaseService.signUp(data);
      console.log("response 26", response)
      // console.log("response.data[0].success", response.sucess[0].success)

      // Additional check for API-level errors
      if (response.success == false && response.status == 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.message) {
        return rejectWithValue(error.response.message);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const userSignInAsync = createAsyncThunk(
  "/auth/sign-in",
  async (data: LoginUserData, { rejectWithValue }) => {
    try {
      const res = await authBaseService.signIn(data);
      console.log(res)

      // If your service returns Axios' response, res.data is the body.
      // If it already returns the body, the ?? keeps it working.

      // Handle API-level errors even when HTTP status is 200
      if (res?.success === false) {
        console.log(res.message)
        return rejectWithValue(res?.message || "Sign in failed");
      }

      // Return only what reducers need (normalize shape)
      const { access_token, profile } = res?.data ?? {};
      return { access_token, profile };
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      return rejectWithValue(msg);
    }
  }
);


export const socialSignInAsync = createAsyncThunk(
  "auth/social-sign-in",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authBaseService.socialSignIn(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

/** 1) Send OTP to email (reset start) */
export const userForgetRequestAsync = createAsyncThunk(
  "/auth/reset-password/request",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      // const body = unwrapAndGuard(
      //   await authBaseService.requestPasswordReset({ email }),
      //   "Failed to send reset code"
      // );
      const res = await authBaseService.requestPasswordReset({ email });


      if (res?.success === false) {
        console.log(res.message)
        return rejectWithValue(res?.message || "Sign in failed");
      }

      return { message: res.message, email: res.data?.email ?? email };
    } catch (e: any) {
      return rejectWithValue(e?.message || "Failed to send reset code");
    }
  }
);

/** 2) Verify OTP */
export const userVerifyOTPAsync = createAsyncThunk<
  // Return type
  { message: string; email: string; otp: string },
  // Argument type
  { email: string; otp: string },
  // Rejected value type
  { rejectValue: string }
>(
  "/auth/reset-password/verify-otp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await authBaseService.verifyResetOtp({ email, OTP: otp });
      const body = res?.data ?? res;

      // Treat API-level failures as errors even if HTTP=200
      if (body?.success === false || (body?.status ?? 200) >= 400) {
        return rejectWithValue(body?.message ?? "Invalid code");
      }

      return { message: body?.message ?? "Code verified", email, otp };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        "Invalid code";
      return rejectWithValue(msg);
    }
  }
);

export const signupVerifyOtpAsync = createAsyncThunk(
  "/auth/signup/verify-otp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      // Backend expects { email, OTP }
      const body = unwrapAndGuard(
        await authBaseService.verifySignupOtp({ email, OTP: otp }),
        "Invalid or expired verification code"
      );

      // Normalize what reducers/components need
      return { message: body.message, email, otp };
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message ||
        e?.message ||
        "Invalid or expired verification code"
      );
    }
  }
);

export const userResetPasswordAsync = createAsyncThunk(
  "/auth/reset-password/change",
  async (
    { email, otp, newPassword, confirmPassword }: { email: string; otp: string; newPassword: string, confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const body = unwrapAndGuard(
        await authBaseService.setNewPassword({ email, OTP: otp, newPassword, confirmPassword }),
        "Could not reset password"
      );
      return { message: body.message };
    } catch (e: any) {
      return rejectWithValue(e?.message || "Could not reset password");
    }
  }
);
