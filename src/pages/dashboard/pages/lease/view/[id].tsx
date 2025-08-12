// src/pages/dashboard/pages/lease/view/[id].tsx
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getLeaseDetailsById, getClauseDetailsAsync } from "@/services/lease/asyncThunk";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    available: `${base} bg-green-100 text-green-800`,
    pending: `${base} bg-yellow-100 text-yellow-800`,
    active: `${base} bg-blue-100 text-blue-800`,
    "in review": `${base} bg-purple-100 text-purple-800`,
    terminated: `${base} bg-red-100 text-red-800`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "Active"}</span>;
};

export default function LeaseDetailPage() {
  const router = useRouter();
 const params = useParams();
 const id = params?.id as string;
console.log("id",id)
  const dispatch = useAppDispatch();
  const { isLoading, leaseError, currentLease, currentLeaseClauses } = useAppSelector((s: any) => s.lease);

  useEffect(() => {
    if (!id) return;
    dispatch(getLeaseDetailsById(id));
    // fetch clauses too (comment out if your single lease already includes clauses)
  }, [dispatch, id]);

  const title = currentLease?.lease_title || currentLease?.title || "Untitled Lease";
  const address = currentLease?.property_address || currentLease?.propertyAddress || "—";
  const updated = currentLease?.updatedAt || currentLease?.last_updated_date;

  // normalize clauses no matter how they come
  const clauses: string[] = Array.isArray(currentLeaseClauses)
    ? currentLeaseClauses.map((c: any) => (typeof c === "string" ? c : c?.text || JSON.stringify(c)))
    : Array.isArray(currentLease?.clauses)
    ? currentLease?.clauses
    : Object.keys(currentLease?.clauses || {}).map((k) => `${k}: ${(currentLease?.clauses || {})[k]}`);

  return (
    <DashboardLayout>
      {isLoading && <LoadingOverlay isVisible message="Loading lease..." size="large" />}

      <div className="p-4 sm:p-6">
        <button onClick={() => router.back()} className="text-blue-600 text-sm inline-flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {leaseError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
            {String(leaseError)}
          </div>
        )}

        {!isLoading && !leaseError && !currentLease && (
          <div className="text-sm text-gray-600 bg-white border rounded-lg p-6">Lease not found.</div>
        )}

        {!isLoading && !leaseError && currentLease && (
          <div className="bg-white border rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
                <div className="mt-1 text-sm text-gray-500">{address}</div>
              </div>
              <StatusPill value={currentLease?.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Start Date</div>
                <div className="text-sm">{currentLease?.startDate ? new Date(currentLease.startDate).toLocaleDateString() : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">End Date</div>
                <div className="text-sm">{currentLease?.endDate ? new Date(currentLease.endDate).toLocaleDateString() : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm">{updated ? new Date(updated).toLocaleString() : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1"><StatusPill value={currentLease?.status} /></div>
              </div>
            </div>

            {currentLease?.notes && (
              <div>
                <div className="text-sm font-medium mb-2">Notes</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">{currentLease.notes}</div>
              </div>
            )}

            {clauses?.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Clauses</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {clauses.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
