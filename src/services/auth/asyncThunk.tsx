/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authBaseService } from "./endpoints"; // Import your authService
import { HttpService } from "../index";
import ls from "localstorage-slim";

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

interface ResetPasswordData {
  email: string;
}


export const userSignUpAsync = createAsyncThunk(
  "/auth/sign-Up",
  async (data : UserData, { rejectWithValue }) => {
    try {
      const response = await authBaseService.signUp(data);
      console.log("response 26",response)
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
  async (data : LoginUserData, { rejectWithValue }) => {
    try {
      const response = await authBaseService.signIn(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
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

export const userForgetRequestAsync = createAsyncThunk(
  "/auth/request-otp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authBaseService.forgetPassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userVerifyOTPAsync = createAsyncThunk(
  "/auth/verify-otp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authBaseService.verifyOTP(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userResetPasswordAsync = createAsyncThunk(
  "/auth/change-password",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await authBaseService.resetPassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
