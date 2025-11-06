// pages/lease/[id].tsx - DYNAMIC CLAUSE CATEGORIES
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { FileText, ChevronRight, Download, Upload, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { getLeaseDetailsById } from "@/services/lease/asyncThunk";

export default function LeaseDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentLease } = useAppSelector(selectLease);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const id = useMemo(() => {
    const raw = router.query.id;
    const s = Array.isArray(raw) ? raw[0] : raw || "";
    return s.trim().replace(/[{}]/g, "");
  }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady || !id) return;
    if (currentLease?._id === id || currentLease?.id === id) return;
    dispatch(getLeaseDetailsById(id));
  }, [dispatch, router.isReady, id, currentLease?._id, currentLease?.id]);

  const clausesData = useMemo(() => {
    if (!currentLease?.clauses?.history) {
      return { categories: {}, allCategories: [] };
    }

    const history = currentLease.clauses.history;
    const categories: Record<string, any[]> = {};
    const allCategories: string[] = [];

    Object.keys(history).forEach((categoryKey) => {
      const categoryData = history[categoryKey];
            if (typeof categoryData === 'object' && categoryData !== null) {
        const clauses = Object.entries(categoryData).map(([key, clause]: [string, any]) => ({
          id: key,
          title: `${categoryKey} - Clause ${key}`,
          category: categoryKey,
          status: clause.status || "pending",
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          details: clause.clause_details || "",
          ...clause
        }));

        categories[categoryKey] = clauses;
        allCategories.push(categoryKey);
      }
    });

    return { categories, allCategories };
  }, [currentLease]);

  const leaseInfo = useMemo(() => {
    if (!currentLease) return null;
    const basic = currentLease.lease_data?.BASIC_INFORMATION;
    const prem = currentLease.lease_data?.PREMISES_PROPERTY_DETAILS;
    const tpl = currentLease.lease_data?.template_data;

    return {
      title: basic?.title || "Untitled Lease",
      leaseType: basic?.lease_type || "N/A",
      propertyAddress:
        `${prem?.property_address_line1 || ""}, ${prem?.property_city || ""}, ${prem?.property_state || ""} ${
          prem?.property_zip || ""
        }`.trim() || "—",
      landlordName: tpl?.header?.landlord_name || basic?.landlord_legal_name || "N/A",
      tenantName: tpl?.header?.tenant_name || basic?.tenant_legal_name || "N/A",
    };
  }, [currentLease]);

  const handleSectionClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    router.push(`/dashboard/pages/lease/${id}/section/${encodedCategory}`);
  };

  const handleBack = () => router.push(`/dashboard/pages/lease/view${id}`);

  const handleExport = () => {
    console.log("Export lease");
  };

  const handleUpload = () => {
    console.log(router.push("/dashboard/pages/uploadLeaseform"))
  };

  if (!currentLease || !leaseInfo) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lease Not Found</h2>
            <p className="text-gray-600 mb-6">
              The lease you're looking for doesn't exist or you don't have access to it.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back to Leases
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review and manage lease agreements from tenants
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={handleUpload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Lease
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lease, LOI, or tenant name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>All Status</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>All Dates</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {clausesData.allCategories.map((categoryKey) => (
              <div
                key={categoryKey}
                onClick={() => handleSectionClick(categoryKey)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{categoryKey}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {clausesData.categories[categoryKey].length} clauses
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {clausesData.allCategories.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No clause categories found in this lease.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}