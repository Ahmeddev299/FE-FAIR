import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, Edit3 } from "lucide-react";
import { getLOIDetailsById } from "@/services/loi/asyncThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

type ShapedLoi = {
  id: string;
  title: string;
  address: string;
  status: string;            // from submit_status
  created: string | null;    // ISO
  updated: string | null;    // ISO
  userName: string;
  party: {
    landlord_name?: string;
    landlord_email?: string;
    tenant_name?: string;
    tenant_email?: string;
  };
  leaseTerms?: any;
  additionalDetails?: any;
  propertyDetails?: any;
};

const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    draft: `${base} bg-gray-100 text-gray-800`,
    available: `${base} bg-green-100 text-green-800`,
    pending: `${base} bg-yellow-100 text-yellow-800`,
    active: `${base} bg-blue-100 text-blue-800`,
    "in review": `${base} bg-purple-100 text-purple-800`,
    terminated: `${base} bg-red-100 text-red-800`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "—"}</span>;
};

const shapeLoi = (raw: any): ShapedLoi | null => {
  if (!raw) return null;
  return {
    id: String(raw.id ?? raw._id ?? "").trim(),
    title: raw.title ?? "",
    address: raw.propertyAddress ?? raw.property_address ?? "",
    status: raw.submit_status ?? raw.status ?? "",
    created: raw.created_at ?? raw.createdAt ?? null,
    updated: raw.updated_at ?? raw.updatedAt ?? null,
    userName: raw.user_name ?? "",
    party: raw.partyInfo ?? {},
    leaseTerms: raw.leaseTerms,
    additionalDetails: raw.additionalDetails,
    propertyDetails: raw.propertyDetails,
  };
};

export default function SingleLoiPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: queryId } = router.query;

  // redux state (adjust slice name if different)
  const { currentLOI, isLoading, loiError } = useAppSelector((s: any) => s.loi);
  const loi = useMemo(() => shapeLoi(currentLOI), [currentLOI]);

  // fetch on mount/id change
  useEffect(() => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) dispatch(getLOIDetailsById(String(id)));
  }, [dispatch, queryId]);

  return (
    <DashboardLayout>
      {isLoading && <LoadingOverlay isVisible message="Loading LOI..." size="large" />}

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {!isLoading && !loiError && loi && (
          <div className="bg-white  rounded-xl p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loi.title || "Untitled LOI"}
                </h1>
                <div className="mt-1 text-sm text-gray-500">
                  {loi.address || "—"}
                </div>
                {loi.userName && (
                  <div className="mt-1 text-xs text-gray-400">Owner: {loi.userName}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusPill value={loi.status} />
                <button
                  onClick={() => router.push(`/dashboard/pages/loi/edit/${loi.id}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                  title="Edit LOI"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Landlord</div>
                <div className="text-sm text-gray-900">
                  {loi.party?.landlord_name || "—"}
                </div>
                <div className="text-xs text-gray-500">
                  {loi.party?.landlord_email || ""}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Tenant</div>
                <div className="text-sm text-gray-900">
                  {loi.party?.tenant_name || "—"}
                </div>
                <div className="text-xs text-gray-500">
                  {loi.party?.tenant_email || ""}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Created</div>
                <div className="text-sm text-gray-900">
                  {loi.created ? new Date(loi.created).toLocaleString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {loi.updated ? new Date(loi.updated).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            {/* Lease Terms */}
            {loi.leaseTerms && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Lease Terms</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Lease Type</div>
                    <div>{loi.leaseTerms?.leaseType || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Duration</div>
                    <div>{loi.leaseTerms?.leaseDuration || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div>{loi.leaseTerms?.startDate ? new Date(loi.leaseTerms.startDate).toLocaleDateString() : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Monthly Rent</div>
                    <div>{loi.leaseTerms?.monthlyRent || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Security Deposit</div>
                    <div>{loi.leaseTerms?.securityDeposit || "—"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Details */}
            {loi.propertyDetails && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Property Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Type</div>
                    <div>{loi.propertyDetails?.propertyType || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Size</div>
                    <div>{loi.propertyDetails?.propertySize || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Intended Use</div>
                    <div>{loi.propertyDetails?.intendedUse || "—"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            {loi.additionalDetails && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Additional Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Renewal Option</div>
                    <div>{loi.additionalDetails?.renewalOption ? "Yes" : "No"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Tenant Improvement</div>
                    <div>{loi.additionalDetails?.tenantImprovement || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Special Conditions</div>
                    <div>{loi.additionalDetails?.specialConditions || "—"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
