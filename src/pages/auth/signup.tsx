import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { useAppDispatch } from '@/hooks/hooks';
import { FormikHelpers } from 'formik';

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

interface SignUpUserData extends Record<string, unknown> {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    conditions: boolean;
}

interface SignUpFormData extends Record<string, unknown> {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

interface UserData {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface SignUpResponse {
    message: string;
    success: boolean;
    data?: {
        user: UserData;
        token?: string;
        refreshToken?: string;
    };
}

const SignUp = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authError, setAuthError] = useState('');

    const roles = [
        'admin',
        'tenant',
        'landlord',
    ];

    const handleGoogleAuth = async () => {
        console.log('Google Auth clicked');
    };

    const registerUser = async (userData: Partial<SignUpUserData>) => {
        console.log("userData 57", userData);
        
        const formData: SignUpFormData = {
            fullName: `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName as string,
            lastName: userData.lastName as string,
            email: userData.email as string,
            password: userData.password as string,
            confirmPassword: userData.confirmPassword as string,
            role: userData.role as string,
        };

        try {
            const result = await dispatch(userSignUpAsync(formData)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const handleSuccess = (response: unknown, formikActions: FormikHelpers<SignUpUserData>) => {
        console.log("response", response);
        
        const signUpResponse = response as SignUpResponse;
        
        Toast.fire({
            icon: "success",
            title: signUpResponse.message || 'Registration successful',
            text: `Registration Success, ${signUpResponse?.data?.user?.firstName || 'User'}!`
        });
        
        // Reset form
        formikActions.setSubmitting(false);
        formikActions.resetForm();
        
        router.push('/auth/login');
    };

    const handleError = (error: unknown, formikActions: FormikHelpers<SignUpUserData>) => {
        console.error('Signup error:', error);
        
        if (error && typeof error === 'object' && 'message' in error) {
            setAuthError((error as { message: string }).message);
        } else {
            setAuthError('Signup failed. Try again.');
        }
        
        formikActions.setSubmitting(false);
    };

    const handleSubmit = createFormSubmissionHandler<SignUpUserData>(
        registerUser,
        handleSuccess,
        handleError,
        { formatData: true, excludeFields: ['conditions'] }
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