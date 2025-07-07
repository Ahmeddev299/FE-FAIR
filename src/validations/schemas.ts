import * as Yup from "yup";

// Global Password Schema
const globalPasswordSchema = Yup.string()
  .min(8, "Password should contain at least 8 characters")
  .required("Required")
  .matches(/[0-9]/, "Password must contain a number")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

// Authentication Schemas
export const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name Required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email")
    .required("Email Required"),
  password: globalPasswordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string()
    .required("Role is required")
    .notOneOf([""], "Please select a role"),
  conditions: Yup.boolean()
    .oneOf([true], 'You must accept the Terms & Conditions')
    .required('Required'),

});

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email")
    .required("Email Required"),
  password: globalPasswordSchema,
  agreeToTerms: Yup.boolean()
});

export const ResetRequestSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email")
    .email("Invalid email")
    .required("Email Required"),
});

export const ChangePasswordSchema = Yup.object().shape({
  password: globalPasswordSchema,
  confirm_password: globalPasswordSchema,
});

// Profile Schemas
export const ProfileSetupSchema = Yup.object().shape({
  title: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  org: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  years_exp: Yup.number()
    .min(0, "Experience should be a positive number")
    .max(99, "Max limit reached"),
  area_interest: Yup.array(),
  legislation: Yup.array(),
  bio: Yup.string()
    .min(20, "Bio should be contain at least 20 characters")
    .max(1000, "Bio should contain at most 1000 characters"),
  campaign_type: Yup.array(),
  strategy_goal: Yup.array(),
  region: Yup.array(),
  stakeholders: Yup.array(),
  com_channel: Yup.array(),
  collab_initiatives: Yup.boolean(),
  network: Yup.array(),
});

export const EditProfileSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  avatar: Yup.string(),
  only_avatar: Yup.boolean(),
  role: Yup.string(),
  country: Yup.string(),
  sector: Yup.array(),
  objective: Yup.string(),
  bio: Yup.string()
    .min(20, "Bio should be contain at least 20 characters")
    .max(1000, "Bio should contain at most 1000 characters"),
});

export const UpdatePasswordSchema = Yup.object().shape({
  currentPassword: globalPasswordSchema,
  newPassword: globalPasswordSchema,
});

export const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email")
    .required("Required"),
});

// Export the global password schema for reuse
export { globalPasswordSchema };