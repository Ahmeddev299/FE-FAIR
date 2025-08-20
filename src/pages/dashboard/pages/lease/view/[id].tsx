// src/pages/dashboard/pages/lease/view/[id].tsx
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getLeaseDetailsById } from "@/services/lease/asyncThunk";
import { ArrowLeft } from "lucide-react";

/* -------------------- helpers -------------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const buildUrl = (u?: string) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
};
const getFileType = (u?: string) => {
  if (!u) return "other";
  const ext = u.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return "image";
  return "other";
};
const cleanId = (raw?: string | string[]) => {
  const s = Array.isArray(raw) ? raw[0] : raw || "";
  return s.trim().replace(/[{}]/g, ""); // strip stray braces
};

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

/* small inline viewer for a single file */
const DocumentViewer: React.FC<{ url?: string }> = ({ url }) => {
  const full = buildUrl(url);
  if (!full) return null;
  const kind = getFileType(full);

  if (kind === "pdf") {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Open PDF
          </a>
          <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Download
          </a>
        </div>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <iframe src={full} className="w-full" style={{ height: 600 }} title="Lease Document" />
        </div>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Open Image
          </a>
          <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Download
          </a>
        </div>
        <img src={full} alt="Lease Attachment" className="rounded-lg border max-h-[600px] object-contain" />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
        Open File
      </a>
      <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
        Download
      </a>
    </div>
  );
};

/* -------------------- page -------------------- */
export default function LeaseDetailPage() {
  const router = useRouter();
  const id = useMemo(() => cleanId(router.query.id), [router.query.id]);

  const dispatch = useAppDispatch();
  const { isLoading, leaseError, currentLease } = useAppSelector((s: any) => s.lease);

  useEffect(() => {
    if (id) dispatch(getLeaseDetailsById(id));
  }, [dispatch, id]);

  const title = currentLease?.lease_title || currentLease?.title || "Untitled Lease";
  const address = currentLease?.property_address || currentLease?.propertyAddress || "—";
  const updated = currentLease?.last_updated_date || currentLease?.updatedAt;
  const docUrl =
    currentLease?.url ||
    currentLease?.document_url ||
    (Array.isArray(currentLease?.documents) && currentLease.documents[0]?.url);

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
          <div className="bg-white rounded-xl p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
                <div className="mt-1 text-sm text-gray-500">{address}</div>
              </div>
              <StatusPill value={currentLease?.status} />
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Start Date</div>
                <div className="text-sm">
                  {currentLease?.startDate ? new Date(currentLease.startDate).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">End Date</div>
                <div className="text-sm">
                  {currentLease?.endDate ? new Date(currentLease.endDate).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm">{updated ? new Date(updated).toLocaleString() : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1">
                  <StatusPill value={currentLease?.status} />
                </div>
              </div>
            </div>

            {/* Notes */}
            {currentLease?.notes && (
              <div>
                <div className="text-sm font-medium mb-2">Notes</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">{currentLease.notes}</div>
              </div>
            )}

            {/* Document */}
            {docUrl && (
              <div>
                <div className="text-sm font-medium mb-2">Document</div>
                <DocumentViewer url={docUrl} />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
