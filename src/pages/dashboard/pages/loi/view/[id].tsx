import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, ExternalLink, Download, Edit3 } from "lucide-react";
import { getLOIDetailsById } from "@/services/loi/asyncThunk";
import { useAppDispatch } from "@/hooks/hooks";
import { useParams } from "next/navigation";

type LoiDetail = {
  id?: string;
  _id?: string;
  title?: string;
  propertyAddress?: string;
  status?: string;
  tenantName?: string;
  createdAt?: string;
  updatedAt?: string;
  terms?: string;
  documents?: { id?: string; _id?: string; name?: string; url?: string }[];
  // add any other fields your API returns
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

export default function SingleLoiPage() {
  const router = useRouter();

//   const id = useMemo(() => (Array.isArray(rawId) ? rawId[0] : rawId), [rawId]);
  const dispatch = useAppDispatch();
const params = useParams();
const loiId = params?.id as string;
console.log("loiId",)
  const [data, setData] = useState<LoiDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getLOIDetailsById(loiId))
  }, [loiId]);

  const downloadUrl = data?.documents?.[0]?.url; // customize if you have a specific field

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay isVisible message="Loading LOI..." size="large" />}

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

        {/* Error */}
        {err && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && !data && (
          <div className="text-sm text-gray-600 bg-white border rounded-lg p-6">
            LOI not found.
          </div>
        )}

        {/* Content */}
        {!loading && !err && data && (
          <div className="bg-white border rounded-xl p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {data.title || "Untitled LOI"}
                </h1>
                <div className="mt-1 text-sm text-gray-500">
                  {data.propertyAddress || "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill value={data.status} />
                <button
                  onClick={() => router.push(`/dashboard/pages/loi/edit/${data._id || data.id}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                  title="Edit LOI"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                    title="Open document"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Doc
                  </a>
                )}
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Tenant</div>
                <div className="text-sm text-gray-900">{data.tenantName || "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Created</div>
                <div className="text-sm text-gray-900">
                  {data.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1"><StatusPill value={data.status} /></div>
              </div>
            </div>

            {/* Terms / Notes */}
            {data.terms && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Key Terms</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                  {data.terms}
                </div>
              </div>
            )}

            {/* Documents */}
            {Array.isArray(data.documents) && data.documents.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Documents</div>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  {data.documents.map((doc) => (
                    <li key={doc._id || doc.id}>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="hover:underline">
                          {doc.name || "Document"}
                        </a>
                      ) : (
                        <span className="text-gray-500">{doc.name || "Document"}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
