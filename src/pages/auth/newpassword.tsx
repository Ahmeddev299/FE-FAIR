import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const newPassword = () => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            {/* <div className="absolute top-6 left-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">Fair</span>
                </div>
            </div> */}

            <div className="bg-white shadow-2xl p-8 w-[473px] h-[361px]">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Create New Password
                </h2>
                {/* <p>Reset your password to regain access to your account<p/> */}

                <div className="space-y-4">
                    <div>
                        <label className="block text-[16px] font-bold text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 text-[18px] font-bold border border-2  border-gray-200 focus:outline-none text-[#BABABA]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[16px] font-bold text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 text-[18px] font-bold border border-2  border-gray-200 focus:outline-none text-[#BABABA]"
                                required={!isLogin}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="text-[16px] w-full bg-blue-600 text-white py-3 px-4   font-medium hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default newPassword