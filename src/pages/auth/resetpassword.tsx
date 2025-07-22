import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/ui/components';

const ResetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can call your password reset API here
  };

  return (
    <PageContainer backgroundImage='/Frame.png'>
      <div className="bg-white shadow-2xl p-8 w-[473px] h-[361px]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Reset your password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              className="w-full px-3 py-2.5 text-[18px] font-bold border border-gray-200 focus:outline-none text-[#BABABA]"
              required
            />
          </div>

          <button
            type="submit"
            className="text-[16px] w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remember your password?
          <button
            onClick={() => router.push('/auth/login')}
            className="text-blue-600 underline font-bold ml-1"
          >
            Sign In here
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResetPassword;
