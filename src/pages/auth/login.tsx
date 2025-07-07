// components/auth/Login.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

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

const Login = () => {
  const dispatch = useDispatch()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('Google authentication clicked');
      // Add your Google OAuth logic here
      // Example: await signInWithGoogle();
    } catch (error) {
      console.error('Google auth error:', error);
      setAuthError('Google authentication failed. Please try again.');
    }
  };

  const loginUser = async (userData) => {
    console.log("userData 57", userData)
    try {
      const result = await dispatch(userSignInAsync(userData)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Success callback
  const handleLoginSuccess = (response, formikActions) => {
    console.log('Login successful:', response[0]?.data?.user?.firstName);

    // Show success toast
    Toast.fire({
      icon: "success",
      title: response[0].message,
      text: `Welcome back, ${response[0]?.data?.user?.firstName || 'User'}!`
    });

    // Optional: Reset form if using Formik
    if (formikActions) {
      formikActions.setSubmitting(false);
      formikActions.resetForm();
    }

    // Redirect to home page
    router.push('/dashboard');
  };
  // Error callback
  const handleLoginError = (error, formikActions) => {
    console.error('Login error:', error);
    setAuthError(error.message || 'Login failed. Please check your credentials.');
  };

  const handleSubmit = createFormSubmissionHandler(
    loginUser,
    handleLoginSuccess,
    handleLoginError,
    { formatData: true, excludeFields: ['agreeToTerms'] }
  );

  return (
    <AuthLayout>
    <PageContainer>
      <Card>
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to your account"
        />

        {authError && (
          <Alert
            type="error"
            message={authError}
            className="mb-6"
          />
        )}

        <SocialAuthButton
          provider="google"
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
            Don't have an account?{' '}
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