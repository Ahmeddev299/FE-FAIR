// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ls from 'localstorage-slim';
import { userAuthAsync } from '@/services/auth/asyncThunk';
import { selectUser } from '@/redux/slices/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector(selectUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = ls.get('access_token', { decrypt: true });
        
        if (!token) {
          // No token found, redirect to login
          router.replace(redirectTo);
          return;
        }

        // If we have a token but no profile, verify the token
        if (!profile?.id) {
          await dispatch(userAuthAsync() as any);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace(redirectTo);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, profile, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no profile after auth check, don't render children
  if (!profile?.id) {
    return null;
  }

  return <>{children}</>;
};