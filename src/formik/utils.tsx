// formik/utils.js

// Common initial values for forms
export const authInitialValues = {
  login: {
    email: '',
    password: '',
    agreeToTerms: false
  },
  signup: {
    firstName: '',
    lastName:'',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    conditions: false,
  },
  resetRequest: {
    email: ''
  },
  changePassword: {
    password: '',
    confirm_password: ''
  }
};

export const profileInitialValues = {
  setup: {
    title: '',
    org: '',
    years_exp: '',
    area_interest: [],
    legislation: [],
    bio: '',
    campaign_type: [],
    strategy_goal: [],
    region: [],
    stakeholders: [],
    com_channel: [],
    collab_initiatives: false,
    network: []
  },
  edit: {
    fullname: '',
    avatar: '',
    only_avatar: false,
    role: '',
    country: '',
    sector: [],
    objective: '',
    bio: ''
  },
  updatePassword: {
    currentPassword: '',
    newPassword: ''
  },
  email: {
    email: ''
  }
};

// Helper functions for form handling
export const handleFormError = (error, setFieldError) => {
  if (error.response?.data?.errors) {
    // Handle validation errors from API
    Object.keys(error.response.data.errors).forEach(field => {
      setFieldError(field, error.response.data.errors[field][0]);
    });
  } else if (error.response?.data?.message) {
    // Handle general error messages
    setFieldError('general', error.response.data.message);
  } else {
    // Handle unknown errors
    setFieldError('general', 'An unexpected error occurred');
  }
};

export const formatFormData = (values, excludeFields = []) => {
  const formData = { ...values };

  // Remove excluded fields
  excludeFields.forEach(field => {
    delete formData[field];
  });

  // Remove empty strings and null values
  Object.keys(formData).forEach(key => {
    if (formData[key] === '' || formData[key] === null) {
      delete formData[key];
    }
  });

  return formData;
};

// Form validation helpers
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateEmailFormat = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

// Async validation function
export const validateEmailExists = async (email) => {
  try {
    // Replace with your actual API call
    // const response = await checkEmailExists(email);
    // return response.exists;
    return false; // Placeholder
  } catch (error) {
    console.error('Email validation error:', error);
    return false;
  }
};

// Form submission helpers
export const createFormSubmissionHandler = (
  apiCall,
  successCallback,
  errorCallback,
  options = {}
) => {
  return async (values, formikActions) => {
    const { setSubmitting, setFieldError, setStatus } = formikActions;

    console.log("values 129", values)
    try {
      setStatus(null);

      // Format form data if needed
      const formData = options.formatData ?
        formatFormData(values, options.excludeFields) :
        values;

      // Make API call
      const response = await apiCall(formData);

      // Handle success
      if (successCallback) {
        successCallback(response, formikActions);
      }

    } catch (error) {
      console.error('Form submission error:', error);

      // Handle errors
      if (errorCallback) {
        errorCallback(error, formikActions);
      } else {
        handleFormError(error, setFieldError);
      }
    } finally {
      setSubmitting(false);
    }
  };
};

// Form reset helpers
export const resetFormWithDelay = (resetForm, delay = 3000) => {
  setTimeout(() => {
    resetForm();
  }, delay);
};

// Field value transformers
export const transformers = {
  email: (value) => value.toLowerCase().trim(),
  phone: (value) => value.replace(/\D/g, ''),
  name: (value) => value.trim().replace(/\s+/g, ' '),
  capitalize: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
};