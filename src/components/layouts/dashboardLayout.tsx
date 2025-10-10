import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import dashboardIcon from '@/icons/dashboard-icon.svg'
import docIcon from '@/icons/doc-icon.svg'
import leaseIcon from '@/icons/leases.svg'
import uploadLeaseIcon from '@/icons/upload-lease-icon.svg'
import eSignIcon from '@/icons/e-sign.svg'
import terminateLeaseIcon from '@/icons/terminate-lease.svg'
import BillingIcon from '@/icons/billing.svg'
import StorageIcon from '@/icons/storage.svg'
import SettingIcon from '@/icons/setting.svg'
import LIcon from '@/icons/logout-icon.svg'

import { userLogout } from "../../redux/slices/userSlice";
import { ProtectedRoute } from "../layouts/protectedRoutes";
import { LogoutModal } from "../models/logoutModel";
import { LayoutGrid, User } from "lucide-react";
import { getLoggedInUserAsync, LoggedInUser } from "@/services/dashboard/asyncThunk";
import { RootState } from "@/redux/store";

type Role = "tenant" | "landlord";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type NavItem = { name: string; href: string };

const NAV_TENANT: NavItem[] = [
  { name: "Dashboard", href: "/dashboard/pages/mainpage" },
  { name: "Start LOI", href: "/dashboard/pages/start" },
  { name: "Upload Lease", href: "/dashboard/pages/uploadLeaseform" },
  { name: "Leases", href: "/dashboard/pages/clauseManagement" },
  { name: "E-Signature", href: "/dashboard/pages/tenanteSignature" },
  { name: "Terminate Lease", href: "/dashboard/pages/terminateLease" },
  { name: "Billing & Plan", href: "/dashboard/pages/billings" },
  { name: "Storage", href: "/dashboard/pages/tenantStorage" },
];

// Tweak these to your landlord URLs
const NAV_LANDLORD: NavItem[] = [
  { name: "Dashboard", href: "/dashboard/pages/mainpage" },
  { name: "Letter of Intents", href: "/landlordDashboard/pages/letterofIntent" },
  { name: "Leases", href: "/dashboard/landlord/tenants" },
  { name: "Upload Lease", href: "/dashboard/landlord/requests" },
  { name: "Legal Notices", href: "/dashboard/pages/billings" },
  { name: "Billing & Plan", href: "/dashboard/pages/tenantStorage" },
  { name: "Storage", href: "/dashboard/pages/tenantStorage" },

];

const USER_MENU = [{ name: "Settings", href: "/dashboard/pages/setting" }];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const loggedInUser = useSelector((s: RootState) => s.dashboard.loggedInUser) as LoggedInUser | null;

  useEffect(() => {
    dispatch(getLoggedInUserAsync());
  }, [dispatch, loggedInUser?.role]);

  const asPath = router.asPath;
  const isActive = (href: string) => asPath === href || asPath.startsWith(href + "/");

  const nav = useMemo<NavItem[]>(() => {
    return loggedInUser?.role === "landlord" ? NAV_LANDLORD : NAV_TENANT;
  }, [loggedInUser?.role]);

  const pageTitle = useMemo(() => {
    const m = nav.find((n) => isActive(n.href));
    return m?.name ?? "Dashboard";
  }, [asPath, nav]);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    dispatch(userLogout());
    setShowLogoutModal(false);
  };

  // map label -> icon component
  const getIcon = (label: string) => {
    switch (label) {
      case "Dashboard":
        return dashboardIcon;
      case "Start LOI ":
        return docIcon;
      case "Upload Lease":
        return uploadLeaseIcon;
      case "Leases":
        return leaseIcon;
      case "E-Signature":
        return eSignIcon;
      case "Terminate Lease":
        return terminateLeaseIcon;
      case "Billing & Plan":
        return BillingIcon;
      case "Storage":
        return StorageIcon;
      default:
        return LayoutGrid;
    }
  };

  return (
    <ProtectedRoute /* if your ProtectedRoute supports roles: allowedRoles={[role]} */>
      <div className="min-h-screen bg-gray-50 flex">
        <LogoutModal
          isOpen={showLogoutModal}
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />

        {/* SIDEBAR (desktop) */}
        <aside
          className="
            hidden md:flex
            fixed md:inset-y-0 md:left-0
            md:w-64 md:flex-col
            bg-[#FAFAFA] border-r border-gray-200
          "
        >
          {/* Logo block */}
          <div className="flex items-center justify-center pt-4">
            <Link href="/dashboard/pages/mainpage" className="flex items-center gap-2">
              <div className="px-5 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Fair"
                  width={220}
                  height={80}
                  priority
                  className="h-[98px] w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 border-b ">
            <div className="space-y-3">
              {nav.map((item) => {
                const active = isActive(item.href);
                const Icon = getIcon(item.name);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex text-[#555555] font-semibold items-center gap-3 px-3 text-[14px] transition-colors
                      ${active ? "bg-[#2D8EEF] text-white font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Icon
                      className={`h-9 w-9 mb-2 ${active ? "text-white" : "text-gray-500"}`}
                      strokeWidth={2}
                    />
                    <span className="mt-1 text-[14px]">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-[#989898] h-1 mt-6 pt-6">
              {/* Profile + Logout (below divider) */}
              <div className="space-y-1">
                {USER_MENU.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 text-[#555555] font-semibold px-3 py-1.5 text-[16px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <SettingIcon className="h-9 w-9 text-gray-500" strokeWidth={2} />
                    <span className="mt-3">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 font-semibold text-[14px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LIcon className="h-9 w-9 text-gray-500" strokeWidth={2} />
                  <span className="mt-3 text-[14px]">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* MAIN COLUMN */}
        <div className="lex-1 flex flex-col w-full md:ml-64">
          {/* Mobile open button */}
          <div className="sticky top-0 z-20 bg-gray-50 px-3 py-3 md:hidden">
            <button
              className="h-10 w-10 inline-flex items-center justify-center  text-gray-600 hover:bg-gray-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
          </div>

          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
            <div className="flex items-center justify-between px-5 h-[60px]">
              <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

              <div className="flex items-center gap-4">
                <span className="rounded-full text-xs px-2 py-1 bg-gray-100 text-gray-700 capitalize">
                  {loggedInUser?.role}
                </span>

                <button
                  className="relative rounded p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <SettingIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5A2B] text-white text-sm font-medium">
                    {String(loggedInUser?.role?.fullName || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {loggedInUser?.role?.fullName}
                  </span>
                  <SettingIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6">{children}</main>
        </div>

        {/* MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-50 w-72 bg-white border-r border-gray-200 h-full">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center justify-center">
                  <Image src="/logo.png" alt="Fair" width={100} height={60} className="object-contain" />
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded p-2 hover:bg-gray-100">
                  ✕
                </button>
              </div>
              <nav className="p-4 h-full overflow-y-auto">
                <div className="space-y-1">
                  {nav.map((item) => {
                    const active = isActive(item.href);
                    const Icon = getIcon(item.name);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#4F7EF7] text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-white" : "text-gray-500"}`} strokeWidth={1.5} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className=" mt-6 pt-6">
                  <div className="space-y-1">
                    {USER_MENU.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <LIcon className="h-9 w-9 text-gray-500" strokeWidth={2} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </nav>
            </aside>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
