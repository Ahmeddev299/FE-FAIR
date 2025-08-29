'use client';

import { useEffect, useMemo, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, AlertTriangle, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DashboardLayout } from '@/components/layouts';
import ManagementProgress from '@/components/clauses/ManagementProgress';
import type { ClauseStatus, RiskLevel } from '@/types/loi';
import { selectLease } from '@/redux/slices/leaseSlice';
import { getallUserLeasesAsync } from '@/services/lease/asyncThunk';
import type { RootState, AppDispatch } from '@/redux/store';

/* ============================
   UI-Local Types (page only)
   ============================ */
type UIClause = {
  id: string;
  name: string;
  status: ClauseStatus;
  risk: RiskLevel;
  currentVersion: string;
  aiSuggestion: string;
  details: string;
};

type UILease = {
  id: string;
  title: string;
  property_address: string;
  startDate?: string;   // ISO
  endDate?: string;     // ISO
  updatedAt?: string;   // ISO
  clauses: UIClause[];
  approvedCount: number;
  totalCount: number;
  unresolvedCount: number;
};

/* ============================
   Helpers: pills/cards
   ============================ */
type PillTone = 'neutral' | 'green' | 'yellow' | 'red' | 'blue';
const toneClassMap: Record<PillTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
};

const Pill = ({ tone = 'neutral', children }: { tone?: PillTone; children: ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${toneClassMap[tone]}`}>
    {children}
  </span>
);

const Card = ({
  className = '',
  ...p
}: { className?: string } & HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`} {...p} />
);

/* ============================
   API → UI Normalizers
   ============================ */
type ApiClause = {
  status?: string;
  risk?: string;
  current_version?: string;
  ai_suggested_clause_details?: string;
  clause_details?: string;
};

type ApiLease = {
  id: string;
  title: string;
  property_address?: string;
  startDate?: string;      // ISO date string
  endDate?: string;        // ISO date string
  log_updated_at?: string; // ISO date string
  clauses?: Record<string, ApiClause | string | number | null | undefined>;
};

const riskFromApi = (apiRisk?: string): RiskLevel => {
  if (!apiRisk) return 'Low';
  const match = apiRisk.match(/\((\d+)\/10\)/);
  const n = parseInt(match?.[1] ?? '0', 10);
  if (n >= 7) return 'High';
  if (n >= 4) return 'Medium';
  return 'Low';
};

const statusFromApi = (apiStatus?: string): ClauseStatus => {
  const s = (apiStatus || '').toLowerCase();
  if (s === 'approved') return 'Approved';
  if (s === 'edited') return 'Edited';
  if (s === 'review') return 'Review';
  return 'Suggested';
};

const normalizeLease = (raw: ApiLease): UILease => {
  const obj = raw?.clauses ?? {};
  const clauses: UIClause[] = Object.entries(obj)
    .filter(([k]) => k !== '_clause_log_id')
    .map(([name, v], i) => {
      const val: ApiClause = (typeof v === 'object' && v !== null ? v : {}) as ApiClause;
      return {
        id: String(i + 1), // No id in API; stable index
        name,
        status: statusFromApi(val.status),
        risk: riskFromApi(val.risk),
        currentVersion: val.current_version ?? '',
        aiSuggestion: val.ai_suggested_clause_details ?? '',
        details: val.clause_details ?? '',
      };
    });

  const approvedCount = clauses.filter(c => c.status === 'Approved').length;
  const totalCount = clauses.length;
  const unresolvedCount = clauses.filter(c => c.status === 'Review' || c.risk === 'High').length;

  return {
    id: raw.id,
    title: raw.title,
    property_address: raw.property_address ?? '',
    startDate: raw.startDate,
    endDate: raw.endDate,
    updatedAt: raw.log_updated_at,
    clauses,
    approvedCount,
    totalCount,
    unresolvedCount,
  };
};

// Robustly unwrap a few common shapes coming from the store, without `any`.
type MaybeLeaseArrayShape =
  | ApiLease[]
  | { data?: { data?: unknown } | unknown[] }
  | Record<string, unknown>
  | undefined
  | null;

function isApiLeaseArray(a: unknown): a is ApiLease[] {
  return Array.isArray(a) && a.every(
    x => typeof x === 'object' && x !== null && 'id' in (x as object) && 'title' in (x as object)
  );
}

const extractLeasesArray = (leaseListFromStore: unknown): ApiLease[] => {
  if (isApiLeaseArray(leaseListFromStore)) return leaseListFromStore;

  const maybeObj = leaseListFromStore as MaybeLeaseArrayShape;
  if (!maybeObj || typeof maybeObj !== 'object') return [];

  const outerData = (maybeObj as { data?: unknown }).data;

  // Shape: { data: { data: ApiLease[] } }
  if (outerData && typeof outerData === 'object') {
    const innerMaybeArray = (outerData as { data?: unknown }).data;
    if (isApiLeaseArray(innerMaybeArray)) return innerMaybeArray;
  }

  // Shape: { data: ApiLease[] }
  if (isApiLeaseArray(outerData)) return outerData;

  return [];
};

/* ============================
   Component
   ============================ */
export default function ClauseManagement() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [page] = useState(1);
  const [limit] = useState(5);

  const { leaseList } = useSelector((s: RootState) => selectLease(s));

  // Normalize server leases → UI leases
  const leases: UILease[] = useMemo(() => {
    const raw = extractLeasesArray(leaseList);
    return raw.map(normalizeLease);
  }, [leaseList]);

  // Filters for table
  const [search, setSearch] = useState('');
  const filteredLeases = useMemo(() => {
    if (!search) return leases;
    const q = search.toLowerCase();
    return leases.filter(
      (l) =>
        (l.title ?? '').toLowerCase().includes(q) ||
        (l.property_address ?? '').toLowerCase().includes(q)
    );
  }, [leases, search]);

  // Slide-over state
  const [openPanel, setOpenPanel] = useState(false);
  const [activeLease, setActiveLease] = useState<UILease | null>(null);
  const [selectedClause, setSelectedClause] = useState<UIClause | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  // page init
  useEffect(() => {
    void dispatch(getallUserLeasesAsync({ page, limit }));
  }, [dispatch, page, limit]);

  const onSaveEdit = async (clause: UIClause) => {
    setActiveLease(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clauses: prev.clauses.map(c =>
          c.id === clause.id ? { ...c, currentVersion: editedText, status: 'Edited' as ClauseStatus } : c
        ),
      };
    });
    setEditingId(null);
    setEditedText('');
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditedText('');
  };

  // UI helpers for risk/status
  const RiskPill = ({ risk }: { risk: RiskLevel }) => (
    <Pill tone={risk === 'High' ? 'red' : risk === 'Medium' ? 'yellow' : 'green'}>{risk}</Pill>
  );

  const StatusPill = ({ status }: { status: ClauseStatus }) => {
    const tone: PillTone =
      status === 'Approved' ? 'green' :
      status === 'Review' ? 'red' :
      status === 'Edited' ? 'yellow' :
      'blue';
    return <Pill tone={tone}>{status}</Pill>;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Review</span>
        </button>
      </div>

      {/* Page card header */}
      <div className="p-4 bg-white shadow-sm border border-gray-200 rounded">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2">
            <Image alt="clause" src="/clause.png" height={50} width={50} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
            <p className="text-sm text-gray-600">Manage AI-suggested clauses across your leases</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leases by title or address…"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-7xl mt-4 mx-auto">
        <div className="hidden xl:block mb-6">
          <ManagementProgress
            approved={leases.reduce((a, l) => a + (l.approvedCount ?? 0), 0)}
            total={leases.reduce((a, l) => a + (l.totalCount ?? 0), 0)}
            unresolved={leases.reduce((a, l) => a + (l.unresolvedCount ?? 0), 0)}
          />
        </div>

        {/* Lease table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-xs font-semibold text-gray-600">
                  <th className="px-4 py-3">Lease</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Clauses</th>
                  <th className="px-4 py-3">High Risk</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeases.map(lease => {
                  const highRisk = lease.clauses.filter(c => c.risk === 'High').length;

                  const dateParts = [
                    lease.startDate ? lease.startDate.slice(0, 10) : undefined,
                    lease.endDate ? lease.endDate.slice(0, 10) : undefined,
                  ].filter((s): s is string => Boolean(s));
                  const dates = dateParts.join(' → ');

                  return (
                    <tr key={lease.id} className="text-sm">
                      <td className="px-4 py-3 font-medium text-gray-900">{lease.title}</td>
                      <td className="px-4 py-3 text-gray-700">{lease.property_address || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{dates || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{lease.totalCount ?? lease.clauses.length}</td>
                      <td className="px-4 py-3">
                        {highRisk > 0 ? <Pill tone="red">{highRisk}</Pill> : <Pill tone="green">0</Pill>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {lease.updatedAt ? new Date(lease.updatedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setActiveLease(lease);
                              setSelectedClause(lease.clauses[0] ?? null);
                              setOpenPanel(true);
                            }}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Manage Clauses
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredLeases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                      No leases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Slide-over Panel: Manage clauses for a single lease */}
      {openPanel && activeLease && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenPanel(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[720px] bg-white shadow-xl border-l flex flex-col">
            {/* Panel header */}
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{activeLease.title}</h3>
                <p className="text-xs text-gray-500">{activeLease.property_address}</p>
              </div>
              <button onClick={() => setOpenPanel(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content: 2 columns on md+ */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                {/* Clause list */}
                <div className="border-b md:border-b-0 md:border-r overflow-y-auto">
                  <div className="p-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Clauses</h4>
                    <div className="space-y-2">
                      {activeLease.clauses.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedClause(c)}
                          className={`w-full text-left rounded-lg p-3 border transition ${
                            selectedClause?.id === c.id
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="truncate text-sm font-medium text-gray-900">{c.name}</div>
                            <StatusPill status={c.status} />
                          </div>
                          <div className="mt-1"><RiskPill risk={c.risk} /></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clause detail */}
                <div className="md:col-span-2 overflow-y-auto">
                  {selectedClause ? (
                    <div className="p-5 space-y-4">
                      {/* Title + actions */}
                      <Card className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="text-base font-semibold text-gray-900">{selectedClause.name}</h5>
                            <div className="mt-2 flex gap-2">
                              <RiskPill risk={selectedClause.risk} />
                              <StatusPill status={selectedClause.status} />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {editingId === selectedClause.id ? (
                              <>
                                <button
                                  onClick={() => onSaveEdit(selectedClause)}
                                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
                                >
                                  <Save className="h-4 w-4" /> Save
                                </button>
                                <button
                                  onClick={onCancelEdit}
                                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium hover:bg-gray-50"
                                >
                                  <X className="h-4 w-4" /> Cancel
                                </button>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </Card>

                      {/* Original + AI suggested */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <div className="mb-2 text-sm font-semibold text-gray-900">Original Clause</div>
                          {editingId === selectedClause.id ? (
                            <textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              rows={8}
                              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-700 whitespace-pre-line">{selectedClause.currentVersion}</p>
                          )}
                        </Card>

                        <Card className="p-4">
                          <div className="mb-2 text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                              AI
                            </span>
                            AI Suggested Clause
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{selectedClause.aiSuggestion}</p>
                        </Card>
                      </div>

                      {/* AI Analysis / Notes */}
                      {selectedClause.details && (
                        <Card className="p-4 border-yellow-200 bg-yellow-50">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">AI Analysis & Recommendations</span>
                          </div>
                          <p className="text-sm text-gray-800">{selectedClause.details}</p>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-sm text-gray-500">Select a clause to view details.</div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}
