// pages/lease/[id].tsx - REDESIGNED PAGE WITH CORRECT ROUTING
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

  // Parse clauses from API data structure
  const clausesData = useMemo(() => {
    if (!currentLease?.clauses?.history) {
      return { tenantAgreesTo: [], tenantNotAgreesTo: [] };
    }

    const history = currentLease.clauses.history;
    
    // Parse "Tenant agrees to"
    const tenantAgreesTo = history["Tenant agrees to"] 
      ? Object.entries(history["Tenant agrees to"]).map(([key, clause]: [string, any]) => ({
          id: key,
          title: `Tenant agrees to - Clause ${key}`,
          category: "Tenant agrees to",
          status: clause.status || "pending",
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          details: clause.clause_details || "",
          ...clause
        }))
      : [];

    // Parse "Tenant agrees not to"
    const tenantNotAgreesTo = history["Tenant agrees not to"]
      ? Object.entries(history["Tenant agrees not to"]).map(([key, clause]: [string, any]) => ({
          id: key,
          title: `Tenant agrees not to - Clause ${key}`,
          category: "Tenant agrees not to",
          status: clause.status || "pending",
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          details: clause.clause_details || "",
          ...clause
        }))
      : [];

    return { tenantAgreesTo, tenantNotAgreesTo };
  }, [currentLease]);

  // All clauses combined
  const allClauses = useMemo(() => {
    return [...clausesData.tenantAgreesTo, ...clausesData.tenantNotAgreesTo];
  }, [clausesData]);

  // Filter clauses based on search and status
  const filteredClauses = useMemo(() => {
    return allClauses.filter(clause => {
      const matchesStatus = filterStatus === "all" || 
        clause.status.toLowerCase() === filterStatus.toLowerCase();
      
      const matchesSearch = !searchQuery || 
        clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clause.details.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [allClauses, filterStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allClauses.length,
      approved: allClauses.filter(c => c.status.toLowerCase() === "approved").length,
      rejected: allClauses.filter(c => c.status.toLowerCase() === "rejected").length,
      pending: allClauses.filter(c => c.status.toLowerCase() === "pending").length,
    };
  }, [allClauses]);

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

  const handleSectionClick = (section: string) => {
    // Fixed routing - match your actual file structure
    router.push(`/dashboard/pages/lease/${id}/section/${section}`);
  };

  const handleBack = () => router.push(`/dashboard/pages/lease/view${id}`);

  const handleExport = () => {
    console.log("Export lease");
  };

  const handleUpload = () => {
    console.log("Upload lease");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

            {/* Search and Filters */}
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

          {/* Section Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div
              onClick={() => handleSectionClick("agrees")}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tenant Agrees To</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {clausesData.tenantAgreesTo.length} clauses
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            <div
              onClick={() => handleSectionClick("notAgrees")}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tenant Not Agrees To</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {clausesData.tenantNotAgreesTo.length} clauses
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}