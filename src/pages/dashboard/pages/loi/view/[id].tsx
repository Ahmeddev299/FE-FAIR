import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, Edit3 } from "lucide-react";
import { getLOIDetailsById } from "@/services/loi/asyncThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";

// -------------------- Types --------------------
type LeaseTerms = {
  leaseType?: string;
  leaseDuration?: number | string;
  startDate?: string;
  monthlyRent?: number | string;
  securityDeposit?: number | string;
  renewalYears?: number;
  renewalOptionsCount?: number;
  includeRenewalOption?: boolean;
  prepaidRent?: number;
  RentEscalation?: number;
};

type AdditionalDetails = {
  tenantImprovement?: string;
  specialConditions?: string;
  tenantImprovement_check?: boolean;
  Miscellaneous_items?: string[];
  contingencies?: string[];
};

type PropertyDetails = {
  propertyType?: string;
  propertySize?: number | string;
  intendedUse?: string;
  hasExtraSpace?: boolean;
  patio?: string;
  exclusiveUse?: string;
  amenities?: string[];
  utilities?: string[];
};

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
  leaseTerms?: LeaseTerms;
  additionalDetails?: AdditionalDetails;
  propertyDetails?: PropertyDetails;
};

// -------------------- Components --------------------
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
    submitted: `${base} bg-blue-100 text-blue-800`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "—"}</span>;
};

// -------------------- Shape Mapper --------------------
const shapeLoi = (raw: unknown): ShapedLoi | null => {
  if (!raw || typeof raw !== "object") return null;

  const r = raw as Partial<ShapedLoi> & {
    _id?: string;
    propertyAddress?: string;
    property_address?: string;
    submit_status?: string;
    status?: string;
    created_at?: string;
    createdAt?: string;
    updated_at?: string;
    updatedAt?: string;
    user_name?: string;
    partyInfo?: ShapedLoi["party"];
  };

  return {
    id: String(r.id ?? r._id ?? "").trim(),
    title: r.title ?? "",
    address: r.propertyAddress ?? r.property_address ?? "",
    status: r.submit_status ?? r.status ?? "",
    created: r.created_at ?? r.createdAt ?? null,
    updated: r.updated_at ?? r.updatedAt ?? null,
    userName: r.user_name ?? "",
    party: r.partyInfo ?? {},
    leaseTerms: r.leaseTerms,
    additionalDetails: r.additionalDetails,
    propertyDetails: r.propertyDetails,
  };
};


// -------------------- Page --------------------
export default function SingleLoiPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: queryId } = router.query;

  // redux state (adjust slice name if different)
  const { currentLOI, isLoading, loiError } = useAppSelector((state: RootState) => state.loi);
  const loi = useMemo(() => shapeLoi(currentLOI), [currentLOI]);

  // fetch on mount/id change
  useEffect(() => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) dispatch(getLOIDetailsById(String(id)));
  }, [dispatch, queryId]);

  return (
    <DashboardLayout>
      {isLoading && <LoadingOverlay visible />}

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
          <div className="bg-white rounded-xl p-6 space-y-6">
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
                <div className="text-sm text-gray-900">{loi.party?.landlord_name || "—"}</div>
                <div className="text-xs text-gray-500">{loi.party?.landlord_email || ""}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Tenant</div>
                <div className="text-sm text-gray-900">{loi.party?.tenant_name || "—"}</div>
                <div className="text-xs text-gray-500">{loi.party?.tenant_email || ""}</div>
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
                    <div className="text-xs text-gray-500">Duration </div>
                    <div>{loi.leaseTerms?.leaseDuration ? `${loi.leaseTerms.leaseDuration} months`: "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div>
                      {loi.leaseTerms?.startDate
                        ? new Date(loi.leaseTerms.startDate).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Monthly Rent </div>
                    <div>{loi.leaseTerms?.monthlyRent ? `$${Number(loi.leaseTerms.monthlyRent)}` : ''}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Security Deposit</div>
                    <div>{loi.leaseTerms?.securityDeposit ? `$${Number(loi.leaseTerms.securityDeposit)}` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Renewal Years</div>
                    <div>{loi.leaseTerms?.renewalYears ?? "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Renewal Options Count</div>
                    <div>{loi.leaseTerms?.renewalOptionsCount ?? "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Include Renewal Option</div>
                    <div>{loi.leaseTerms?.includeRenewalOption ? "Yes" : "No"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Prepaid Rent</div>
                    <div>{loi.leaseTerms?.prepaidRent ? `$${loi.leaseTerms.prepaidRent}` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Rent Escalation</div>
                    <div>{loi.leaseTerms?.RentEscalation ? `${loi.leaseTerms.RentEscalation} months` : "_"}</div>
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
                    <div>{loi.propertyDetails?.propertySize ?? "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Intended Use</div>
                    <div>{loi.propertyDetails?.intendedUse || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Has Extra Space</div>
                    <div>{loi.propertyDetails?.hasExtraSpace ? "Yes" : "No"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Patio</div>
                    <div>{loi.propertyDetails?.patio ?? "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Exclusive Use</div>
                    <div>{loi.propertyDetails?.exclusiveUse ?? "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Amenities</div>
                    <div>{loi.propertyDetails?.amenities?.join(", ") || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Utilities</div>
                    <div>{loi.propertyDetails?.utilities?.join(", ") || "—"}</div>
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
                    <div className="text-xs text-gray-500">Tenant Improvement</div>
                    <div>{loi.additionalDetails?.tenantImprovement || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Special Conditions</div>
                    <div>{loi.additionalDetails?.specialConditions || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Tenant Improvement Provided?</div>
                    <div>{loi.additionalDetails?.tenantImprovement_check ? "Yes" : "No"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Miscellaneous Items</div>
                    <div>{loi.additionalDetails?.Miscellaneous_items?.join(", ") || "—"}</div>
                  </div>
                  {/* <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Contingencies</div>
                    <div>{loi.additionalDetails?.contingencies?.join(", ") || "—"}</div>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
