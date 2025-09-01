// pages/auth/forgot-password.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/components";
import { useAppDispatch } from "@/hooks/hooks";
import { Formik, Form, FormikHelpers } from "formik";
import Toast from "@/components/Toast";
import { userForgetRequestAsync } from "@/services/auth/asyncThunk";
import { FormikInput, FormikSubmitButton } from "@/formik/component";
import * as Yup from "yup";

const ResetRequestSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
});

type Data = { email: string };

export default function ForgotPassword() {
  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: Data, helpers: FormikHelpers<Data>) => {
    try {
      const res = await dispatch(userForgetRequestAsync(values)).unwrap(); // typed by thunk

      Toast.fire({
        icon: "success",
        title: res.message ?? "Verification code sent",
        text: "Please check your email for the code",
      });

      helpers.setSubmitting(false);
      setAuthError("");
      router.push(`/auth/verify-otp?flow=reset&email=${encodeURIComponent(values.email)}`);
    } catch (err: unknown) {
      helpers.setSubmitting(false);

      const message =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message ?? "Failed to send reset code. Try again.";

      setAuthError(message);
    }
  };

  return (
    <PageContainer backgroundImage="/Frame.png">
      <div className="bg-white p-5">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Reset your password
        </h2>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {authError}
          </div>
        )}

        <Formik initialValues={{ email: "" }} validationSchema={ResetRequestSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormikInput label="Email Address" name="email" type="email" placeholder="Enter your email" />
              <FormikSubmitButton isSubmitting={isSubmitting} loadingText="Sending...">
                Verify Email
              </FormikSubmitButton>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remember your password?
          <button onClick={() => router.push("/auth/login")} className="text-blue-600 underline font-bold ml-1">
            Sign in here
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
