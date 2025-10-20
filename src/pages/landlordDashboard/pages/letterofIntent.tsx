"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAllLandlordLOIsAsync } from "@/services/loi/asyncThunk";
import { selectLOI } from "@/redux/slices/loiSlice";

/** -------------------------------- Types -------------------------------- */
export interface PartyInfo {
  tenant_name?: string;
}

export interface LeaseTerms {
  monthlyRent?: number | string;
}

export interface LandlordLOI {
  id: string | number;
  title: string;
  company?: string;
  property_address_S1?: string;
  property_city?: string;
  propertyAddress?: string;
  partyInfo?: PartyInfo;
  leaseTerms?: LeaseTerms;
  submit_status?: "New" | "In Review" | "Submitted" | "Finalized" | "Rejected" | string;
}

type StatusFilter = "All Status" | "New" | "In Review" | "Submitted" | "Finalized" | "Rejected";

/** -------------------------------- Component -------------------------------- */
export default function ModernLOIReview() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loiList } = useAppSelector(selectLOI);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [tenantFilter, setTenantFilter] = useState<string>("All Tenants");

  // Load all LOIs
  useEffect(() => {
    void dispatch(getAllLandlordLOIsAsync());
  }, [dispatch]);

  const openLOI = (loi: LandlordLOI) => {
    router.push(`/landlordDashboard/view/${loi.id}`);
  };


    const goCreate   = () => router.push("/dashboard/pages/start");

  const allLois: LandlordLOI[] = (loiList?.my_loi ?? []) as LandlordLOI[];

  const tenants = useMemo(() => {
    const set = new Set<string>();
    for (const l of allLois) {
      const t = l.partyInfo?.tenant_name ?? l.company;
      if (t) set.add(t);
    }
    return Array.from(set);
  }, [allLois]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allLois
      .filter((x) => {
        if (!q) return true;
        const title = x.title?.toLowerCase() ?? "";
        const company = (x.company ?? x.partyInfo?.tenant_name ?? "").toLowerCase();
        const addr =
          x.property_address_S1 && x.property_city
            ? `${x.property_address_S1}, ${x.property_city}`.toLowerCase()
            : (x.propertyAddress ?? "").toLowerCase();
        return title.includes(q) || company.includes(q) || addr.includes(q);
      })
      .filter((x) => (statusFilter === "All Status" ? true : (x.submit_status ?? "In Review") === statusFilter))
      .filter((x) => {
        if (tenantFilter === "All Tenants") return true;
        const name = x.partyInfo?.tenant_name ?? x.company ?? "";
        return name === tenantFilter;
      });
  }, [allLois, searchQuery, statusFilter, tenantFilter]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-3.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-800">Review LOIs</span>
            </div>
          </div>
        </div>

        {/* LOI List */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">LOIs</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {filtered.length}
                  </span>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={goCreate}>
                  Upload LOI
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search LOIs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Status</option>
                  <option>New</option>
                  <option>In Review</option>
                  <option>Submitted</option>
                  <option>Finalized</option>
                  <option>Rejected</option>
                </select>

                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Tenants</option>
                  {tenants.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOI Cards */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {filtered.map((loi) => (
                  <button
                    key={loi.id}
                    onClick={() => openLOI(loi)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{loi.title}</h3>
                        <p className="text-xs text-gray-600">{loi.partyInfo?.tenant_name || loi.company || "—"}</p>
                      </div>
                      {/* <span
                        className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ml-2 ${getStatusColor(
                          loi.submit_status || "In Review"
                        )}`}
                      >
                        {loi.submit_status || "In Review"}
                      </span> */}
                    </div>-

                    <p className="text-xs text-gray-500 mb-2.5">
                      {loi.property_address_S1 && loi.property_city
                        ? `${loi.property_address_S1}, ${loi.property_city}`
                        : loi.propertyAddress || "—"}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-600">
                        ${loi?.leaseTerms?.monthlyRent ?? "-"}/mo
                      </span>
                      <span className="text-gray-500"> {/* no created_at on this type; keep clean */}—</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
