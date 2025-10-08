/* eslint-disable @typescript-eslint/no-explicit-any */
import Toast from "@/components/Toast";
import {
  userForgetRequestAsync,
  userResetPasswordAsync,
  userSignInAsync,
  userSignUpAsync,
  userVerifyOTPAsync,
  socialSignInAsync,
  signupVerifyOtpAsync,
} from "@/services/auth/asyncThunk";
import { createSlice } from "@reduxjs/toolkit";
import ls from "localstorage-slim";
import Router from "next/router";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    signUpSuccess: false,
    resetSuccess: false,
    emailSent: false,
    loadMore: false,
    authError: "",
    otp: "",
    filters: {},
    profile: {},
    metaData: {},
    newsAlerts: {},
    bills: [],
    reports: [],
  },
  reducers: {
    setProfile: (state: any, action: any) => {
      state.profile = action.payload;
    },

    setReset: (state: any, action: any) => {
      state.resetSuccess = action.payload;
    },

    setEmail: (state: any, action: any) => {
      state.emailSent = action.payload;
    },

    setSignUp: (state: any, action: any) => {
      state.signUpSuccess = action.payload;
    },

    setOTP: (state: any, action: any) => {
      state.otp = action.payload;
    },

    setError: (state: any, action: any) => {
      state.userError = action.payload;
    },

    userLogout: (state: any) => {
      state.profile = {};
      ls.remove("access_token");
      window.location.href = "/auth/login";
    },

    setLoading: (state: any, action: any) => {
      state.isLoading = action.payload;
    },
    setMetaData: (state: any, action: any) => {
      state.metaData = action.payload;
    },

    setAlertsFilters: (state: any, action: any) => {
      state.filters = action.payload;
    },

    setLoadMore: (state: any, action: any) => {
      state.loadMore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignUpAsync.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(userSignUpAsync.fulfilled, (state: any,) => {
        state.isLoading = false;
        state.signUpSuccess = true;
      })
      .addCase(userSignUpAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.authError = action.payload;
        Toast.fire({ icon: "error", title: action.payload });
      })
      .addCase(userSignInAsync.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(userSignInAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        console.log("payload", action.payload)
        ls?.set("access_token", action.payload.access_token, {
          encrypt: true,
        });
        state.profile = action.payload.profile;
      })
      .addCase(userSignInAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.authError = action.payload;
        Toast.fire({ icon: "error", title: action.payload });
      })
      .addCase(socialSignInAsync.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(socialSignInAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        ls?.set("access_token", action.payload.access_token, {
          encrypt: true,
        });
        state.profile = action.payload.data.profile;
        window.location.href = "/home";
      })
      .addCase(socialSignInAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.authError = action.payload;
        Toast.fire({ icon: "error", title: action.payload });
      })
      .addCase(userForgetRequestAsync.pending, (state: any) => { state.isLoading = true; })
      .addCase(userForgetRequestAsync.fulfilled, (state: any, a: any) => {
        state.isLoading = false; state.emailSent = true;
        const obj = { email: a.payload.email };
        ls.set("request", obj, { encrypt: true });
      })
      .addCase(userForgetRequestAsync.rejected, (state: any, a: any) => {
        state.isLoading = false; state.authError = a.payload; Toast.fire({ icon: "error", title: a.payload });
      })

      .addCase(userVerifyOTPAsync.pending, (state: any) => { state.isLoading = true; })
      .addCase(userVerifyOTPAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        Toast.fire({ icon: "success", title: action.payload.message });
        const obj: any = ls.get("request", { decrypt: true }) || {};
        obj["otp"] = action.payload.otp;       
        obj["verifiedAt"] = Date.now();         
        ls.set("request", obj, { encrypt: true });
        state.otp = action.payload.otp;
        Router.push("/auth/reset-password");
      })
      .addCase(userVerifyOTPAsync.rejected, (state: any, a: any) => {
        state.isLoading = false; state.authError = a.payload; Toast.fire({ icon: "error", title: a.payload });
      })

      .addCase(userResetPasswordAsync.pending, (s: any) => { s.isLoading = true; })
      .addCase(userResetPasswordAsync.fulfilled, (s: any, a: any) => {
        s.isLoading = false; s.otp = ""; s.resetSuccess = true;
        ls.remove("request");
        Toast.fire({ icon: "success", title: a.payload?.message || "Password updated" });
        Router.push("/auth/login");
      })
      .addCase(userResetPasswordAsync.rejected, (s: any, a: any) => {
        s.isLoading = false; s.authError = a.payload; Toast.fire({ icon: "error", title: a.payload });
      })
      .addCase(signupVerifyOtpAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.signupEmailVerified = true;
        state.signupEmail = action.payload.email;
      })
    .addCase(signupVerifyOtpAsync.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.authError = action.payload;
    })
},
});

export const {
  setProfile,
  userLogout,
  setLoading,
  setError,
  setReset,
  setEmail,
  setSignUp,
  setOTP,
  setMetaData,
  setAlertsFilters,
  setLoadMore,
} = userSlice.actions;

export const selectUser = (state: any) => state.user;

export default userSlice.reducer;
