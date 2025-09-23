import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  FileText,
  Upload as UploadIcon,
  FolderOpen,
  Signature,
  MinusCircle,
  CreditCard,
  Database,
  User,
  LogOut,
} from "lucide-react";
import { selectUser, userLogout } from "../../redux/slices/userSlice";
import { ProtectedRoute } from "../layouts/protectedRoutes";
import { LogoutModal } from "../models/logoutModel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV = [
  { name: "Dashboard", href: "/dashboard/pages/mainpage" },
  { name: "Start LOI", href: "/dashboard/pages/start" },
  { name: "Upload Lease", href: "/dashboard/pages/uploadLeaseform" },
  { name: "Leases", href: "/dashboard/pages/clauseManagement" },
  { name: "E-Signature", href: "/dashboard/pages/tenanteSignature" },
  { name: "Terminate Lease", href: "/dashboard/pages/terminateLease" },
  { name: "Billing & Plan", href: "/dashboard/pages/billings" },
  { name: "Storage", href: "/dashboard/pages/tenantStorage" },
];

const USER_MENU = [{ name: "Profile", href: "/dashboard/pages/profile" }];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector(selectUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const asPath = router.asPath;
  const isActive = (href: string) => asPath === href || asPath.startsWith(href + "/");

  const pageTitle = useMemo(() => {
    const m = NAV.find((n) => isActive(n.href));
    return m?.name ?? "Dashboard";
  }, [asPath]);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    dispatch(userLogout());
    setShowLogoutModal(false);
  };

  // map label -> icon component
  const getIcon = (label: string) => {
    switch (label) {
      case "Dashboard":
        return LayoutGrid;
      case "Start LOI":
        return FileText;
      case "Upload Lease":
        return UploadIcon;
      case "Leases":
        return FolderOpen;
      case "E-Signature":
        return Signature;
      case "Terminate Lease":
        return MinusCircle;
      case "Billing & Plan":
        return CreditCard;
      case "Storage":
        return Database;
      default:
        return LayoutGrid;
    }
  };

  return (
    <ProtectedRoute>
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
    fixed md:inset-y-0 md:left-0        /* <-- fix it on screen */
    md:w-64 md:flex-col
    bg-white border-r border-gray-200
  "
        >
          {/* Logo block */}
          <div className="flex items-center justify-center pt-4">
            {/* Logo block (desktop) */}
            <Link href="/dashboard/pages/mainpage" className="flex items-center gap-2">
              <div className="px-5 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Fair"
                  width={220}          // intrinsic resolution (keeps sharp)
                  height={80}
                  priority
                  className="h-[98px] w-auto object-contain"  // h-14 = 56px tall
                />
              </div>
            </Link>

          </div>
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 border-b ">
            <div className="space-y-2">
              {NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = getIcon(item.name);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex text-[#555555] font-semibold items-center gap-4  px-3 py-2.5 text-[14px] transition-colors
                      ${active ? "bg-[#2D8EEF] text-white font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Icon
                      className={`h-5 w-5 text-[#555555] ${active ? "text-white" : "text-gray-500"}`}
                      strokeWidth={2}   // thicker stroke
                    />


                    <span>{item.name}</span>
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
                    className="flex items-center gap-3 text-[#555555] font-semibold px-3 py-2.5 text-[16px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-500" strokeWidth={2} />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2.5 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 text-gray-500" strokeWidth={2} />
                  <span>Logout</span>
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
          <header className="h-[60px] sticky top-0 z-10 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 pt-3">
              <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
              <div className="flex items-center gap-4">
                <button className="relative rounded p-2 text-gray-600 hover:bg-gray-100" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#8B5A2B] text-white text-sm font-medium">
                    M
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.name || profile?.email || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
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
                  {NAV.map((item) => {
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

                {/* Mobile divider and user menu */}
                <div className=" border-gray-200 mt-6 pt-6">
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
                      <LogOut className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
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