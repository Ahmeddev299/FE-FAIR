// components/auth/Login.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import { useAppDispatch } from '@/hooks/hooks';
import { FormikHelpers } from 'formik';

// Import validation schemas
import { LoginSchema } from '../../validations/schemas';

// Import Formik components
import {
  FormikInput,
  FormikPasswordInput,
  FormikCheckbox,
  FormikSubmitButton
} from '../../formik/component';

// Import utilities
import {
  authInitialValues,
  createFormSubmissionHandler
} from '../../formik/utils';

// Import UI components
import {
  PageContainer,
  Card,
  AuthHeader,
  SocialAuthButton,
  GoogleIcon,
  Divider,
  AuthLink,
  Alert
} from '../../components/ui/components';
import { userSignInAsync } from '@/services/auth/asyncThunk';
import Toast from '@/components/Toast';
import { AuthLayout } from '@/components/layouts';

interface LoginUserData extends Record<string, unknown> {
  email: string;
  password: string;
  agreeToTerms: boolean;
}

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse {
  message: string;
  success: boolean;
  data?: {
    user: UserData;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
  };
}

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('Google authentication clicked');
    } catch (error) {
      console.error('Google auth error:', error)
      setAuthError('Google authentication failed. Please try again.');
    }
  };

  const loginUser = async (userData: Partial<LoginUserData>) => {
    if (!userData.email || !userData.password) {
      throw new Error("Email and password are required");
    }

    try {
      const result = await dispatch(userSignInAsync(userData as LoginUserData)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Success callback
  const handleLoginSuccess = (response: unknown, formikActions: FormikHelpers<LoginUserData>) => {
    // Type guard to ensure response is LoginResponse
    const loginResponse = response as LoginResponse;
    
    // Show success toast
    Toast.fire({
      icon: "success",
      title: loginResponse.message || 'Login successful',
      text: 'Welcome back User'
    });

    // Optional: Reset form if using Formik
    if (formikActions) {
      formikActions.setSubmitting(false);
      formikActions.resetForm();
    }

    router.push('/dashboard/pages/mainpage');
  };

  // Error callback
  const handleLoginError = (error: unknown) => {
    console.error('Login error:', error);

    if (error && typeof error === 'object' && 'message' in error) {
      setAuthError((error as { message: string }).message);
    } else {
      setAuthError('Login failed. Please check your credentials.');
    }
  };

  const handleSubmit = createFormSubmissionHandler<LoginUserData>(
    loginUser,
    handleLoginSuccess,
    handleLoginError,
  );

  return (
    <AuthLayout>
      <PageContainer
        backgroundImage='/Frame.png'
      >
        <Card>
          <AuthHeader
            title="Sign In"
          />

          {authError && (
            <Alert
              type="error"
              message={authError}
              className="mb-6"
            />
          )}

          <SocialAuthButton
            onClick={handleGoogleAuth}
            icon={GoogleIcon}
            className="mb-6"
          >
            Sign in with Google
          </SocialAuthButton>

          <Divider text="or continue with email" />

          <Formik
            initialValues={authInitialValues.login}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormikInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />

                <FormikPasswordInput
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  showPassword={showPassword}
                  onTogglePassword={togglePasswordVisibility}
                />

                <div className="text-right mb-4">
                  <Link
                    href="/auth/resetpassword"
                    className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <FormikCheckbox
                  label="Keep me signed in"
                  name="agreeToTerms"
                  className="mb-6"
                />

                <FormikSubmitButton
                  isSubmitting={isSubmitting}
                  loadingText="Signing In..."
                >
                  Login
                </FormikSubmitButton>
              </Form>
            )}
            
          </Formik>

          <div className="text-center mt-6 md:mt-8">
            <p className="text-gray-600 text-sm md:text-base">
              Don&apos;t have an account?{' '}
              <AuthLink onClick={() => router.push('/auth/signup')}>
                Sign Up
              </AuthLink>
            </p>
          </div>
        </Card>
      </PageContainer>
    </AuthLayout>
  );
};

export default Login;