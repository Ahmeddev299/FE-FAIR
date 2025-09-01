// pages/auth/reset-password.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/components";
import { useAppDispatch } from "@/hooks/hooks";
import { Formik, Form } from "formik";
import Toast from "@/components/Toast";
import { userResetPasswordAsync } from "@/services/auth/asyncThunk";
import { FormikPasswordInput, FormikSubmitButton } from "@/formik/component";
import * as Yup from "yup";
import ls from "localstorage-slim";
import { isOtpExpiredMsg } from "@/components/otpInputs/authMessages";

const NewPasswordSchema = Yup.object({
  password: Yup.string().min(8, "Min 8 characters").required("Required"),
  confirm: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Required"),
});

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

type ResetCtx = { email: string; otp: string; verifiedAt?: number } | null;

export default function ResetPassword() {
  const [authError, setAuthError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const req = useMemo<ResetCtx>(() => {
    return (ls.get("request", { decrypt: true }) as ResetCtx) ?? null;
  }, []);

  const email = req?.email ?? "";
  const otp = req?.otp ?? "";
  const verifiedAt = req?.verifiedAt;

  // Guard missing/expired verification
  useEffect(() => {
    if (!email || !otp) {
      router.push("/auth/forgot-password");
      return;
    }
    if (verifiedAt && Date.now() - verifiedAt > OTP_TTL_MS) {
      Toast.fire({ icon: "warning", title: "OTP expired. Please verify again." });
      router.push("/auth/verify-otp");
    }
  }, [email, otp, verifiedAt, router]);

  const submit = async (values: { password: string; confirm: string }) => {
    console.log("value", values)
    try {
      if (!email || !otp) throw new Error("Missing verification. Start over.");
      const res: { message?: string } = await dispatch(
        userResetPasswordAsync({ email, otp, newPassword: values.password, confirmPassword: values.confirm })
      ).unwrap();

      Toast.fire({ icon: "success", title: res?.message || "Password reset successfully" });
      ls.remove("request");
      router.push("/auth/login");
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Could not reset password";

      setAuthError(msg);

      if (isOtpExpiredMsg(msg)) {
        Toast.fire({ icon: "warning", title: "OTP expired. Please verify again." });
        router.push("/auth/verify-otp");
      }
    }
  };

  return (
    <PageContainer backgroundImage="/Frame.png">
      <div className="bg-white p-5 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Create a new password</h2>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {authError}
          </div>
        )}

        <Formik initialValues={{ password: "", confirm: "" }} validationSchema={NewPasswordSchema} onSubmit={submit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormikPasswordInput
                name="password"
                label="New Password"
                placeholder="••••••••"
                autoComplete="new-password"
                showPassword={showNew}
                onTogglePassword={() => setShowNew((v) => !v)}
              />

              <FormikPasswordInput
                name="confirm"
                label="Confirm Password"
                placeholder="••••••••"
                autoComplete="new-password"
                showPassword={showConfirm}
                onTogglePassword={() => setShowConfirm((v) => !v)}
              />

              <FormikSubmitButton isSubmitting={isSubmitting} loadingText="Updating...">
                Update Password
              </FormikSubmitButton>
            </Form>
          )}
        </Formik>
      </div>
    </PageContainer>
  );
}