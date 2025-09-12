// pages/.../ClauseManagementPage.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

import Card from '@/components/ui/Card';
import Pill, { PillTone } from '@/components/ui/Pill';
import ClausesTable from '@/components/clauses/ClauseTable';
import ManagementProgress from '@/components/clauses/Sidebar/ManagementProgress';
import DocumentPreviewCard from '@/components/clauses/Sidebar/DocumentPreviewCard';
import ReadyToProceed from '@/components/clauses/Sidebar/ReadyToProceed';
import QuickStats from '@/components/clauses/Sidebar/QuickStats';
import { DashboardLayout } from '@/components/layouts';

import type { UIClause, ExtendedClause, ClauseStatus, RiskLevel } from '@/types/loi';

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { getLeaseDetailsById, acceptClauseSuggestionAsync } from '@/services/lease/asyncThunk';

import { extractOne, mapToUILease } from '@/utils/leasemappers';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import { commentOnClauseAsync } from '@/services/clause/asyncThunk';
import { DocumentPreviewModal } from '@/components/models/documentPreviewModel';

function firstString(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
}

/** API clause history shape (from data.clauses[<name>]) */
export type ClauseHistoryComment = {
  text: string;
  author?: string;
  created_at?: string;
};

export type ClauseHistoryEntry = {
  status?: string;
  clause_details?: string;
  current_version?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: ClauseHistoryComment[];
  risk?: string;
  risk_line?: string;
  Recommendation?: string;
  Analysis?: string;
  compare_loi_vs_lease?: string;
  accepted_ai?: boolean;
  created_at?: string;
  updated_at?: string;
};

type RawLeaseWithClauses = {
  url?: string;
  title?: string;
  property_address?: string;
  clauses?: Record<string, ClauseHistoryEntry>;
};

/** Map UIClause → ExtendedClause */
function mapUIClauseToExtended(c: UIClause): ExtendedClause {
  return {
    id: c.id,
    name: c.name ?? 'Clause',
    title: c.name ?? 'Clause',
    status: c.status as ClauseStatus,
    risk: c.risk as RiskLevel,
    originalText: c.currentVersion,
    aiSuggestion: c.aiSuggestion ?? '',
    currentVersion: c.currentVersion,
    lastEdited: undefined,
    editor: undefined,
  };
}

type HeaderChip = { text: string; tone: PillTone };
const headerChips: HeaderChip[] = [
  { text: 'AI analysis complete', tone: 'green' },
  { text: 'AI suggestions available', tone: 'blue' },
  { text: 'Ready for editing & approval', tone: 'yellow' },
];

export default function ClauseManagementPage() {
  const router = useRouter();
  const q = (router.query ?? {}) as Record<string, string | string[]>;
  const leaseId = firstString(q.lease) || firstString(q.leaseId) || firstString(q.id);
  const clauseDocIdFromQuery = firstString(q.clauseDocId);

  const dispatch = useAppDispatch();
  const { currentLease, isLoading } = useAppSelector((s) => s.lease);

  const SingleLeaseLoader = isLoading || currentLease == null;
  const lease = useMemo(() => mapToUILease(extractOne(currentLease)), [currentLease]);

  // Raw lease for pulling API "clauses" map
  const rawLease = useMemo(
    () => (currentLease ? (extractOne(currentLease) as unknown as RawLeaseWithClauses) : undefined),
    [currentLease]
  );

  useEffect(() => {
    if (!router.isReady || !leaseId) return;
    void dispatch(getLeaseDetailsById(leaseId));
  }, [router.isReady, leaseId, dispatch]);

  const clauseDocId: string | undefined = clauseDocIdFromQuery || undefined;

  const [filters, setFilters] = useState({
    status: 'All Status',
    risk: 'All Risk Levels',
    category: 'Category',
  });

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsClause, setDetailsClause] = useState<ExtendedClause | null>(null);
  const [detailsHistory, setDetailsHistory] = useState<ClauseHistoryEntry | undefined>(undefined);

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // Build preview buckets the modal expects
// Build preview buckets the modal expects
// Build preview buckets the modal expects
const { approvedBucket, pendingBucket, rejectedBucket } = useMemo(() => {
  type PreviewClauseArray =
    NonNullable<React.ComponentProps<typeof DocumentPreviewModal>['approved']>;
  type PreviewClauseItem = PreviewClauseArray[number];

  const approvedBucket: PreviewClauseArray = [];
  const pendingBucket: PreviewClauseArray = [];
  const rejectedBucket: PreviewClauseArray = [];

  if (lease?.clauses?.length) {
    lease.clauses.forEach((c, idx) => {
      const item: PreviewClauseItem = {
        id: c.id ?? idx,
        name: c.name,
        text: c.currentVersion,
        risk: c.risk,                           // ← add this to satisfy `Clause` requirements
      };

      const s = (c.status || '').toLowerCase();
      if (s.includes('approve')) approvedBucket.push(item);
      else if (s.includes('reject')) rejectedBucket.push(item);
      else pendingBucket.push(item);
    });
  }

  return { approvedBucket, pendingBucket, rejectedBucket };
}, [lease]);


  return (
    <DashboardLayout>
      <div className="p-4 bg-white shadow-sm border border-gray-200 rounded mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Review</span>
          </button>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
          <p className="text-sm text-gray-600">
            Edit, review, and approve lease clauses before proceeding to signature.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {headerChips.map((c) => (
            <Pill key={c.text} tone={c.tone}>
              {c.text}
            </Pill>
          ))}
        </div>
      </div>

      {SingleLeaseLoader && <LoadingOverlay isVisible />}
      {!SingleLeaseLoader && !lease && (
        <div className="py-16 text-center text-sm text-gray-500">Lease not found.</div>
      )}

      {lease && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{lease.title}</div>
                  <div className="text-xs text-gray-500">
                    {(lease as { propertyAddress?: string }).propertyAddress ??
                      (lease as { property_address?: string }).property_address ??
                      ''}
                  </div>
                </div>
                <button className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  Send to Landlord
                </button>
              </div>
            </Card>

            <ClausesTable
              isLoading={SingleLeaseLoader}
              clauses={lease.clauses}
              filters={filters}
              onChangeFilters={setFilters}
              onApprove={async (c: UIClause) => {
                if (!clauseDocId) return;
                await dispatch(
                  acceptClauseSuggestionAsync({
                    clauseId: clauseDocId,
                    clause_key: c.name,
                    details: c.aiSuggestion ?? '',
                  })
                ).unwrap();
                // optimistic update
                c.status = 'Approved';
                if (c.aiSuggestion) c.currentVersion = c.aiSuggestion;
              }}
              onEdit={(c: UIClause) => {
                setDetailsClause(mapUIClauseToExtended(c));
                // ⬅️ pull clause history from API "clauses" map
                const entry =
                  c.name && rawLease?.clauses ? rawLease.clauses[c.name] : undefined;
                setDetailsHistory(entry);
                setDetailsOpen(true);
              }}
              onComment={(c: UIClause) => {
                setDetailsClause(mapUIClauseToExtended(c));
                const entry =
                  c.name && rawLease?.clauses ? rawLease.clauses[c.name] : undefined;
                setDetailsHistory(entry);
                setDetailsOpen(true); // comment inside the same modal
              }}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <ManagementProgress
              approved={lease.approvedCount ?? 0}
              total={lease.totalCount ?? lease.clauses.length}
              unresolved={lease.unresolvedCount ?? 0}
            />
            <DocumentPreviewCard onPreview={() => setPreviewOpen(true)} />
            <ReadyToProceed />
            <QuickStats
              total={lease.totalCount ?? lease.clauses.length}
              completionRate={
                (lease.totalCount ?? lease.clauses.length)
                  ? Math.round(
                    ((lease.approvedCount ?? 0) /
                      (lease.totalCount ?? lease.clauses.length)) *
                    100
                  )
                  : 0
              }
              openComments={lease.clauses.filter((c) => (c.commentsUnresolved ?? 0) > 0).length}
            />
          </div>
        </div>
      )}

      {previewOpen && (
        <DocumentPreviewModal
          onClose={() => setPreviewOpen(false)}
          approved={approvedBucket}
          pending={pendingBucket}
          rejected={rejectedBucket}
          downloadUrl={(rawLease as { url?: string })?.url} // optional: if you have a server PDF
        />
      )}

      {/* Clause Details Modal */}
      {detailsOpen && detailsClause && (
        <ClauseDetailsModel
          onClose={() => setDetailsOpen(false)}
          clause={detailsClause}
          history={detailsHistory}
          onApprove={async () => {
            if (!clauseDocId || !detailsClause?.name) return;
            await dispatch(
              acceptClauseSuggestionAsync({
                clauseId: clauseDocId,
                clause_key: detailsClause.name,
                details: detailsClause.aiSuggestion ?? '',
              })
            ).unwrap();

            // optimistic update (modal/list)
            setDetailsClause((prev) =>
              prev
                ? {
                  ...prev,
                  currentVersion: prev.aiSuggestion ?? prev.currentVersion,
                  status: 'Approved',
                }
                : prev
            );

            if (lease) {
              const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
              if (idx >= 0) {
                lease.clauses[idx] = {
                  ...lease.clauses[idx],
                  currentVersion:
                    detailsClause.aiSuggestion ?? lease.clauses[idx].currentVersion,
                  status: 'Approved',
                };
              }
            }
          }}
          onReject={() => {
            setDetailsOpen(false);
            setDetailsClause((prev) => (prev ? { ...prev, status: 'Needs Review' } : prev));
          }}
          onRequestReview={() => setDetailsOpen(false)}
          onAddComment={async (text) => {
            if (!clauseDocId || !detailsClause?.name || !leaseId) return;

            // 1) post
            const res = await dispatch(
              commentOnClauseAsync({
                clauseDocId,
                clause_key: detailsClause.name,
                comment: text,
              })
            ).unwrap();

            // 2) refresh lease so next open shows latest comments
            await dispatch(getLeaseDetailsById(leaseId));

            // 3) toast + close modal
            setDetailsOpen(false);

            // 4) return created comment for instant append (defensive fallback)
            const created = (res?.comment && typeof res.comment === 'object'
              ? res.comment
              : undefined) as ClauseHistoryComment | undefined;
            return (
              created ?? {
                text,
                author: undefined,
                created_at: new Date().toISOString(),
              }
            );
          }}
        />
      )}
    </DashboardLayout>
  );
}
