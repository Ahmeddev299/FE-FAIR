import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const resetPassword = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'Lawyer',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const roles = [
        'Lawyer',
        'Property Manager',
        'Broker',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

    };

    const handleGoogleAuth = () => {
        console.log('Google authentication clicked');

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            {/* <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">Fair</span>
                </div>
            </div> */}

            <div className="bg-white shadow-2xl p-8 w-[473px] h-[361px]">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                     Reset your password
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[16px] font-bold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="xyz@email.com"
                            className="w-full px-3 py-2.5 text-[18px] font-bold border border-2  border-gray-200 focus:outline-none text-[#BABABA]"
                            required
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="text-[16px] w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                       Send Reset Link
                    </button>
                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Remember your password?
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="text-blue-600 underline font-bold"
                    >
                        Sign In here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default resetPassword