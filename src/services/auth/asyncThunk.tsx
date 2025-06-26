/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authBaseService } from "./endpoints"; // Import your authService
import { HttpService } from "../index";
import ls from "localstorage-slim";

export const userAuthAsync = createAsyncThunk(
  "/auth",
  async (data, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await authBaseService.auth(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userSignUpAsync = createAsyncThunk(
  "/auth/sign-Up",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authBaseService.signUp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userSignInAsync = createAsyncThunk(
  "/auth/sign-in",
  async (data, { rejectWithValue }) => {
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
  async (data, { rejectWithValue }) => {
    try {
      const response = await authBaseService.resetPassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
