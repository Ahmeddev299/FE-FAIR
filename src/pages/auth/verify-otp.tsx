// pages/auth/verify-otp.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/ui/components";
import { useAppDispatch } from "@/hooks/hooks";
import { Formik, Form } from "formik";
import Toast from "@/components/Toast";
import {
  userVerifyOTPAsync,
  userForgetRequestAsync,
  signupVerifyOtpAsync,
} from "@/services/auth/asyncThunk";
import { FormikSubmitButton } from "@/formik/component";
import * as Yup from "yup";
import ls from "localstorage-slim";
import OTPInput from "@/components/otpInputs/OtpInputs";
import { isOtpExpiredMsg } from "@/components/otpInputs/authMessages";

const OtpSchema = Yup.object({
  otp: Yup.string().length(5, "Enter the 5-digit code").required("Required"),
});

const RESEND_COOLDOWN = 30; // seconds

type ResetCtx = { email: string; otp?: string; verifiedAt?: number } | null;
type SignupCtx = { email?: string; otp?: string; verifiedAt?: number } | null;

export default function VerifyOtp() {
  const [authError, setAuthError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useAppDispatch();

  const flow = (search.get("flow") ?? "reset") as "signup" | "reset";
  const isSignup = flow === "signup";
  const signupEmail = search.get("email") ?? "";

  // Reset-flow context from LS (set during forgot step)
  const resetCtx = useMemo<ResetCtx>(() => {
    return (ls.get("request", { decrypt: true }) as ResetCtx) ?? null;
  }, []);
  const resetEmail = resetCtx?.email ?? "";

  // Email to show on page
  const displayEmail = isSignup ? signupEmail : resetEmail;

  // guard: if we don't have an email for this flow, send user back
  useEffect(() => {
    if (!displayEmail) {
      router.push(isSignup ? "/auth/signup" : "/auth/forgot-password");
    }
  }, [displayEmail, isSignup, router]);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const submit = async (values: { otp: string }) => {
    try {
      // --- SIGNUP FLOW ---
      if (isSignup) {
        if (!signupEmail) throw new Error("Missing signup email. Start over.");

        const res: { message?: string } = await dispatch(
          signupVerifyOtpAsync({ email: signupEmail, otp: values.otp })
        ).unwrap();

        Toast.fire({ icon: "success", title: res?.message || "Email verified" });

        // persist signup verification context (optional)
        const ctx = (ls.get("signup_request", { decrypt: true }) as SignupCtx) ?? {};
        const next: Required<NonNullable<SignupCtx>> = {
          email: signupEmail,
          otp: values.otp,
          verifiedAt: Date.now(),
        };
        ls.set("signup_request", { ...ctx, ...next }, { encrypt: true });

        // proceed to the signup form step (or wherever you want)
        router.push("/auth/login"); // or /auth/signup?step=form
        return; // stop here
      }

      // --- RESET-PASSWORD FLOW ---
      if (!resetEmail) throw new Error("Missing email context. Start over.");

      const res: { message?: string } = await dispatch(
        userVerifyOTPAsync({ email: resetEmail, otp: values.otp })
      ).unwrap();

      Toast.fire({ icon: "success", title: res?.message || "Code verified" });

      // Save for reset page
      const req = (ls.get("request", { decrypt: true }) as ResetCtx) ?? { email: resetEmail };
      const nextReq = { ...req, otp: values.otp, verifiedAt: Date.now() };
      ls.set("request", nextReq, { encrypt: true });

      router.push("/auth/reset-password");
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Invalid code. Try again.";
      setAuthError(msg);
      if (isOtpExpiredMsg(msg)) {
        Toast.fire({ icon: "warning", title: "OTP expired. Please request a new one." });
      }
    }
  };

  const handleResend = async () => {
    if (!displayEmail || cooldown) return;
    try {
      // You can also branch resend by flow here if needed.
      const res: { message?: string } = await dispatch(
        userForgetRequestAsync({ email: isSignup ? signupEmail : resetEmail })
      ).unwrap();

      Toast.fire({ icon: "success", title: res?.message || "New code sent to your email" });
      setAuthError("");
      setCooldown(RESEND_COOLDOWN);
    } catch (e: unknown) {
      const msg =
        typeof e === "string"
          ? e
          : (e as { message?: string })?.message || "Could not resend code";
      Toast.fire({ icon: "error", title: msg });
    }
  };

  return (
    <PageContainer backgroundImage="/Frame.png">
      <div className="bg-white p-5 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Please verify your email address
        </h2>
        <p className="text-center text-gray-600 mb-4">
          We’ve sent a code to{" "}
          <span className="font-semibold">{displayEmail || "your email"}</span>
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {authError}
          </div>
        )}

        <Formik initialValues={{ otp: "" }} validationSchema={OtpSchema} onSubmit={submit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Enter Code</label>
              <OTPInput name="otp" length={5} autoFocus />

              <FormikSubmitButton isSubmitting={isSubmitting} loadingText="Verifying...">
                Next
              </FormikSubmitButton>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4 text-sm">
          Didn’t get email?{" "}
          <button
            onClick={handleResend}
            disabled={!!cooldown}
            className={`font-bold underline ${
              cooldown ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }`}
          >
            {cooldown ? `Resend in ${cooldown}s` : "Resend"}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
