import { ProtectedRoute } from '../layouts/protectedRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, userLogout } from '../../redux/slices/userSlice';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile } = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const backgroundImage = '/logo.png'

  const handleLogout = () => {
    dispatch(userLogout());
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/pages/mainpage', icon: '/mage_dashboard-2.png', current: router.pathname === '/dashboard' },
    { name: 'Start LOI', href: '/dashboard/pages/start', icon: '/f7_doc-text.png', current: router.pathname === '/profile' },
    { name: 'Upload Lease', href: '/dashboard/pages/uploadLeaseform', icon: '/img3.png', current: router.pathname === '/news-alerts' },
    { name: 'Clause Management', href: '/dashboard/pages/clauseManagement', icon: '/img4.png', current: router.pathname === '/bills' },
    { name: 'E-Signature', href: '/reports', icon: '/img5.png', current: router.pathname === '/reports' },
    { name: 'Mailbox', href: '/settings', icon: '/img6.png', current: router.pathname === '/settings' },
    { name: 'Billing & Plan', href: '/reports', icon: '/img7.png', current: router.pathname === '/reports' },
    { name: 'Storage', href: '/settings', icon: '/img8.png', current: router.pathname === '/settings' },
  ];
  const userSetting = [
    { name: 'Setting', href: '/setting', icon: '/img10.png', current: router.pathname === '/setting' },
    { name: 'Logout', href: '/logout', icon: '/img9.png', current: router.pathname === '/profile' },
  ];
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
            <Image
              alt="Logo"
              src={backgroundImage}
              width={200} // Example width
              height={100} // Example height
            />            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${item.current
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                  >
                    <Image  src={item.icon as string} alt={item.name} width={30} height={30} className="mr-3" />
                    {item.name}
                  </a>
                ))}
                <div className="border-t border-gray-200">
                  {userSetting.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${item.current
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                    >
                      <Image src={item.icon} alt={item.name} width={30} height={30} className="mr-3" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <span className="text-white text-xl">✕</span>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-gray-900">Your App</h1>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${item.current
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-4 text-lg">{item.icon}</span>
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {profile?.name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile?.name || profile?.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile?.role || 'User'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 text-gray-400 hover:text-red-500 transition-colors duration-150"
                    title="Logout"
                  >
                    <span className="text-lg">🚪</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Mobile header */}
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="text-2xl">☰</span>
            </button>
          </div>

          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-2 sm:px-2 lg:px-4">
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    {navigation.find(item => item.current)?.name || 'Dashboard'}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
