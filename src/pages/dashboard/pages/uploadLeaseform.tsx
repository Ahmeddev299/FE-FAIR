import React, {  useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Upload, FileText, X, CheckCircle, AlertCircle, Bell, HelpCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { useRouter } from 'next/router';

// Validation schema using Yup
const validationSchema = Yup.object({
    leaseTitle: Yup.string()
        .min(3, 'Lease title must be at least 3 characters')
        .max(100, 'Lease title must be less than 100 characters')
        .required('Lease title is required'),
    startDate: Yup.date()
        .required('Start date is required')
        .typeError('Please enter a valid date'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date')
        .typeError('Please enter a valid date'),
    propertyAddress: Yup.string()
        .min(10, 'Property address must be at least 10 characters')
        .max(200, 'Property address must be less than 200 characters')
        .required('Property address is required'),
    notes: Yup.string()
        .max(500, 'Notes must be less than 500 characters'),
    document: Yup.mixed()
        .required('Please upload a lease document')
        .test('fileSize', 'File size must be less than 10MB', (value) => {
            if (!value) return false;
            return value.size <= 10 * 1024 * 1024; // 10MB
        })
        .test('fileType', 'Only PDF and DOCX files are supported', (value) => {
            if (!value) return false;
            return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(value.type);
        })
});

function UploadLeaseForm() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const router = useRouter()
    const [dragActive, setDragActive] = useState(false);

    const initialValues = {
        leaseTitle: '',
        startDate: '',
        endDate: '',
        propertyAddress: '',
        notes: '',
        document: null
    };

    const handleFileUpload = (file, setFieldValue) => {
        if (file) {
            const fileData = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                file: file
            };
            setUploadedFile(fileData);
            setFieldValue('document', file);
        }
    };

    const removeFile = (setFieldValue) => {
        setUploadedFile(null);
        setFieldValue('document', null);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e, setFieldValue) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0], setFieldValue);
        }
    };

    const handleSubmit = (values, { setSubmitting }) => {
        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted with values:', values);
            console.log('Uploaded file:', uploadedFile);
            alert('Lease document uploaded successfully!');
            setSubmitting(false);
        }, 2000);
    };

    const handleStartNewLOI = () => {
        router.push('/dashboard/pages/uploadLeaseReview');
    };

    const CustomField = ({ name, label, type = 'text', placeholder, as = 'input', rows, required = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                as={as}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <button className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
                            <span className="mr-2">←</span>
                            Back to Dashboard
                        </button>

                        <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Upload Lease Document</h1>
                        </div>
                        <p className="text-gray-600">Upload your lease document and let our AI analyze the terms and conditions automatically.</p>

                        <div className="flex items-center mt-4 space-x-4">
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-600">Supported formats: PDF, DOCX</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-600">AI-powered analysis included</span>
                            </div>
                        </div>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, errors, touched, isSubmitting }) =>
                            <Form>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Upload Section */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Document Upload */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <Upload className="w-5 h-5 mr-2" />
                                                Document Upload
                                                <span className="text-red-500 ml-1">*</span>
                                            </h2>

                                            <div
                                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                    ? 'border-blue-400 bg-blue-50'
                                                    : errors.document && touched.document
                                                        ? 'border-red-300 bg-red-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={(e) => handleDrop(e, setFieldValue)}
                                            >
                                                <input
                                                    type="file"
                                                    accept=".pdf,.docx,.doc"
                                                    onChange={(e) => handleFileUpload(e.target.files[0], setFieldValue)}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label htmlFor="file-upload" className="cursor-pointer">
                                                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-900 mb-2">Drag and drop your lease documents</p>
                                                    <p className="text-gray-500 mb-4">or click to browse and select files</p>
                                                    <div>
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                                                        >
                                                            Choose Files
                                                        </label>
                                                        <input
                                                            id="file-upload"
                                                            type="file"
                                                            className="hidden"
                                                            multiple
                                                            onChange={(e) => {
                                                                const files = e.target.files;
                                                                console.log(files);
                                                            }}
                                                        />
                                                    </div>

                                                </label>
                                            </div>

                                            {errors.document && touched.document && (
                                                <div className="mt-2 text-red-500 text-sm">{errors.document}</div>
                                            )}

                                            <div className="mt-4 text-sm text-gray-500">
                                                <p>Supported formats: PDF, DOCX</p>
                                                <p>Maximum file size: 10MB</p>
                                            </div>
                                        </div>

                                        {/* Uploaded Files */}
                                        {uploadedFile && (
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                                    Uploaded Files (1)
                                                </h3>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg gap-4">
                                                    <div className="flex items-start sm:items-center">
                                                        <FileText className="w-8 h-8 text-blue-600 mr-3 mt-1 sm:mt-0" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 break-all">{uploadedFile.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {uploadedFile.size} • {uploadedFile.type.includes('pdf') ? 'PDF' : 'DOCX'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(setFieldValue)}
                                                        className="text-red-500 hover:text-red-700 transition-colors self-end sm:self-auto"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Right Column - Context Information */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <AlertCircle className="w-5 h-5 mr-2" />
                                                    Context Information
                                                </span>
                                                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">Required</span>
                                            </h3>

                                            <div className="space-y-4">
                                                <CustomField
                                                    name="leaseTitle"
                                                    label="Lease Title"
                                                    placeholder="e.g., Downtown Office Lease Agreement"
                                                    required
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <CustomField
                                                        name="startDate"
                                                        label="Start Date"
                                                        type="date"
                                                        required
                                                    />
                                                    <CustomField
                                                        name="endDate"
                                                        label="End Date"
                                                        type="date"
                                                        required
                                                    />
                                                </div>

                                                <CustomField
                                                    name="propertyAddress"
                                                    label="Property Address"
                                                    placeholder="123 Main Street, City, State, ZIP"
                                                    required
                                                />

                                                <CustomField
                                                    name="notes"
                                                    label="Notes"
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Any additional notes or context about this lease"
                                                />
                                            </div>
                                        </div>

                                        {/* AI Processing Benefits */}
                                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                AI Processing Benefits
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex items-start">
                                                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800">Automatically extract key lease terms and dates</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800">Identify important clauses and potential issues</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800">Generate summary and recommendations</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <Bell className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800">Set up automated reminders and alerts</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Help Section */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <HelpCircle className="w-5 h-5 mr-2" />
                                                Need Help?
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-4">
                                                Having trouble uploading your lease document? Our support team is here to help.
                                            </p>

                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Common issues:</p>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• File size too large (max 10MB)</li>
                                                    <li>• Unsupported file format</li>
                                                    <li>• Scanned documents need OCR enabled</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleStartNewLOI}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Lease'
                                        )}
                                    </button>
                                </div>
                            </Form>
                        }
                    </Formik>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default UploadLeaseForm;