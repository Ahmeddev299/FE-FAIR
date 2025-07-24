import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, userLogout } from '../../redux/slices/userSlice';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Bell, ChevronDown } from 'lucide-react';
import { ProtectedRoute } from '../layouts/protectedRoutes';
import { LogoutModal } from '../models/logoutModel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile } = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const backgroundImage = '/logo.png';

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(userLogout());
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/pages/mainpage', icon: '/mage_dashboard-2.png', current: router.pathname === '/dashboard' },
    { name: 'Start LOI', href: '/dashboard/pages/start', icon: '/f7_doc-text.png', current: router.pathname === '/profile' },
    { name: 'Upload Lease', href: '/dashboard/pages/uploadLeaseform', icon: '/upload.png', current: router.pathname === '/news-alerts' },
    { name: 'Clause Management', href: '/dashboard/pages/clauseManagement', icon: '/img4.png', current: router.pathname === '/bills' },
    { name: 'E-Signature', href: '/dashboard/pages/tenanteSignature', icon: '/img5.png', current: router.pathname === '/reports' },
    { name: 'Terminate Lease', href: '/dashboard/pages/terminateLease', icon: '/img7.png', current: router.pathname === '/settings' },
    { name: 'Storage', href: '/dashboard/pages/tenantStorage', icon: '/img8.png', current: router.pathname === '/settings' },
  ];

  const userSetting = [
    { name: 'Settings', href: '/dashboard/pages/setting', icon: '/img10.png', current: router.pathname === '/setting' },
    { name: 'Logout', href: '#', icon: '/img9.png', current: router.pathname === '/profile' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Logout Modal */}
        <LogoutModal
          isOpen={showLogoutModal}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />

        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
            <Image
              alt="Logo"
              src={backgroundImage}
              width={200}
              height={100}
            />
            <div className="mt-5 flex-grow flex flex-col">
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
                    <Image src={item.icon as string} alt={item.name} width={32} height={32} className="mr-3" />
                    {item.name}
                  </a>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {userSetting.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        if (item.name === 'Logout') {
                          e.preventDefault();
                          handleLogout();
                        }
                      }}
                      className={`${item.current
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer`}
                    >
                      <Image src={item.icon} alt={item.name} width={32} height={32} className="mr-3" />
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
                {/* Mobile Logo */}
                <div className="flex-shrink-0 flex items-center px-4 mb-5">
                  <Image
                    alt="Logo"
                    src={backgroundImage}
                    width={150}
                    height={75}
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${item.current
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Image src={item.icon} alt={item.name} width={40} height={40} className="mr-3" />
                      {item.name}
                    </a>
                  ))}

                  {/* Mobile User Settings */}
                  <div className="border-t border-gray-200 pt-2 mt-4">
                    {userSetting.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          if (item.name === 'Logout') {
                            e.preventDefault();
                            handleLogout();
                          }
                          setSidebarOpen(false);
                        }}
                        className={`${item.current
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 cursor-pointer`}
                      >
                        <Image src={item.icon} alt={item.name} width={40} height={30} className="mr-3" />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Mobile User Profile Section */}
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
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                {/* Left - Page Title */}
                <h1 className="text-xl font-bold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Dashboard'}
                </h1>

                {/* Right - Notifications + User */}
                <div className="flex items-center space-x-4">
                  {/* Notification Icon with Red Dot */}
                  <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Bell className="w-5 h-5" />
                    </button>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  </div>

                  {/* User Avatar & Dropdown */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/avatar.png"
                      alt="User Avatar"
                      width={40}
                      height={40}
                    />
                    <div className="text-sm text-gray-700 font-medium">
                      {profile?.name || profile?.email || 'John Doe'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
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