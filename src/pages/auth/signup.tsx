import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

// Import validation schemas
import { SignupSchema } from '../../validations/schemas';

// Import Formik components
import {
    FormikInput,
    FormikPasswordInput,
    FormikCheckbox,
    FormikSubmitButton,
    FormikSelect
} from '../../formik/component';

// Import utilities
import {
    authInitialValues, createFormSubmissionHandler
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
import { userSignUpAsync } from '@/services/auth/asyncThunk';
import Toast from '@/components/Toast';
import { AuthLayout } from '@/components/layouts';

const SignUp = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authError, setAuthError] = useState('');

    const roles = [
        'Lawyer',
        'Property Manager',
        'Broker',
        'Other'
    ];

    const handleGoogleAuth = async () => {
        console.log('Google Auth clicked');
    };

    const registerUser = async (userData) => {
        console.log("userData 57", userData)
        try {
            const result = await dispatch(userSignUpAsync(userData)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const handleSuccess = (response) => {
        console.log("response", response)
        Toast.fire({
            icon: "success",
            title: response.message,
            text: `Regestration Success, ${response?.data?.user?.firstName || 'User'}!`
        }); router.push('/auth/login');
    };

    const handleError = (error) => {
        console.error('Signup error:', error);
        setAuthError(error.message || 'Signup failed. Try again.');
    };

    const handleSubmit = createFormSubmissionHandler(
        registerUser,
        handleSuccess,
        handleError,
        { formatData: true, excludeFields: ['agreeToTerms'] }
    );

    return (
        <AuthLayout>
            <PageContainer
                backgroundImage='/Frame.png'
            >
                <Card>
                    <AuthHeader
                        title="Sign Up"
                    />
                    {authError && <Alert type="error" message={authError} className="mb-6" />}

                    <SocialAuthButton
                        provider="google"
                        onClick={handleGoogleAuth}
                        icon={GoogleIcon}
                        className="mb-6"
                    >
                        Sign up with Google
                    </SocialAuthButton>

                    <Divider text="or sign up with email" />

                    <Formik
                        initialValues={authInitialValues.signup}
                        validationSchema={SignupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <FormikInput
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                />

                                <FormikInput
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                />

                                <FormikInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                />

                                <FormikSelect
                                    label="Role"
                                    name="role"
                                    options={roles.map(role => ({ label: role, value: role }))}
                                />

                                <FormikPasswordInput
                                    label="Password"
                                    name="password"
                                    placeholder="••••••••"
                                    showPassword={showPassword}
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                />

                                <FormikPasswordInput
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    showPassword={showConfirmPassword}
                                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                />

                                <FormikCheckbox
                                    label="I accept the Terms & Conditions and Privacy Policy"
                                    name="conditions"
                                />

                                <FormikSubmitButton
                                    isSubmitting={isSubmitting}
                                    loadingText="Signing Up..."
                                >
                                    Sign Up
                                </FormikSubmitButton>
                            </Form>
                        )}
                    </Formik>

                    <div className="text-center mt-6 md:mt-8">
                        <p className="text-gray-600 text-sm md:text-base">
                            Already have an account?{' '}
                            <AuthLink onClick={() => router.push('/auth/login')}>
                                Sign In
                            </AuthLink>
                        </p>
                    </div>
                </Card>
            </PageContainer>
        </AuthLayout>
    );
};

export default SignUp;
