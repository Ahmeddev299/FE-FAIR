// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/router';

// import Card from '@/components/ui/Card';
// import Pill, { PillTone } from '@/components/ui/Pill';
// import ClausesTable from '@/components/clauses/ClauseTable';
// import ManagementProgress from '@/components/clauses/Sidebar/ManagementProgress';
// import DocumentPreviewCard from '@/components/clauses/Sidebar/DocumentPreviewCard';
// import ReadyToProceed from '@/components/clauses/Sidebar/ReadyToProceed';
// import QuickStats from '@/components/clauses/Sidebar/QuickStats';
// import { DashboardLayout } from '@/components/layouts';

// import type { UIClause, ExtendedClause, ClauseStatus, RiskLevel } from '@/types/loi';

// import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// import { getLeaseDetailsById, acceptClauseSuggestionAsync } from '@/services/lease/asyncThunk';

// import { ClauseComment, extractOne, mapToUILease } from '@/utils/leasemappers';
// import { LoadingOverlay } from '@/components/loaders/overlayloader';

// import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
// import AddCommentModal from '@/components/models/addClauseModel';
// import { commentOnClauseAsync } from '@/services/clause/asyncThunk';

// function firstString(v?: string | string[]): string | undefined {
//   return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
// }

// type ClauseHistoryComment = {
//   text: string;
//   author?: string;
//   created_at?: string;
// };

// type ClauseHistoryEntry = {
//   status?: string;
//   clause_details?: string;
//   current_version?: string;
//   ai_confidence_score?: number;
//   ai_suggested_clause_details?: string;
//   comment?: ClauseHistoryComment[];
//   risk?: string;
//   risk_line?: string;
//   Recommendation?: string;
//   Analysis?: string;
//   compare_loi_vs_lease?: string;
//   accepted_ai?: boolean;
//   created_at?: string;
//   updated_at?: string;
// };

// type RawLeaseWithHistory = {
//   history?: Record<string, ClauseHistoryEntry>;
// };

// /** Map UIClause → ExtendedClause (strict, no any) */
// function mapUIClauseToExtended(c: UIClause): ExtendedClause {
//   return {
//     id: c.id,
//     name: c.name ?? 'Clause',
//     title: c.name ?? 'Clause',
//     status: c.status as ClauseStatus,
//     risk: c.risk as RiskLevel,
//     originalText: c.currentVersion,
//     aiSuggestion: c.aiSuggestion ?? '',
//     currentVersion: c.currentVersion,
//     lastEdited: undefined,
//     editor: undefined,
//   };
// }

// /** Pill header chips (typed) */
// type HeaderChip = { text: string; tone: PillTone };
// const headerChips: HeaderChip[] = [
//   { text: 'AI analysis complete', tone: 'green' },
//   { text: 'AI suggestions available', tone: 'blue' },
//   { text: 'Ready for editing & approval', tone: 'yellow' },
// ];

// export default function ClauseManagementPage() {
//   const router = useRouter();
//   const q = (router.query ?? {}) as Record<string, string | string[]>;
//   const leaseId = firstString(q.lease) || firstString(q.leaseId) || firstString(q.id);
//   const clauseDocIdFromQuery = firstString(q.clauseDocId);

//   const dispatch = useAppDispatch();
//   const { currentLease, isLoading } = useAppSelector((s) => s.lease);

//   const SingleLeaseLoader = isLoading || currentLease == null;

//   const lease = useMemo(() => mapToUILease(extractOne(currentLease)), [currentLease]);

//   useEffect(() => {
//     if (!router.isReady || !leaseId) return;
//     void dispatch(getLeaseDetailsById(leaseId));
//   }, [router.isReady, leaseId, dispatch]);

//   const clauseDocId: string | undefined = clauseDocIdFromQuery || undefined;

//   const [filters, setFilters] = useState({
//     status: 'All Status',
//     risk: 'All Risk Levels',
//     category: 'Category',
//   });

//   // Details modal state
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [detailsClause, setDetailsClause] = useState<ExtendedClause | null>(null);
//   const [commentDraft, setCommentDraft] = useState('');

//   // Add Comment modal state
//   const [commentModalOpen, setCommentModalOpen] = useState(false);

//   return (
//     <DashboardLayout>
//       <div className="p-4 bg-white shadow-sm border border-gray-200 rounded mb-4">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="h-5 w-5" />
//             <span className="text-sm">Back to Review</span>
//           </button>
//         </div>

//         <div className="mt-3">
//           <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
//           <p className="text-sm text-gray-600">
//             Edit, review, and approve lease clauses before proceeding to signature.
//           </p>
//         </div>

//         <div className="mt-3 flex flex-wrap gap-2">
//           {headerChips.map((c) => (
//             <Pill key={c.text} tone={c.tone}>
//               {c.text}
//             </Pill>
//           ))}
//         </div>
//       </div>

//       {SingleLeaseLoader && <LoadingOverlay isVisible />}
//       {!SingleLeaseLoader && !lease && (
//         <div className="py-16 text-center text-sm text-gray-500">Lease not found.</div>
//       )}

//       {lease && (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-8 space-y-3">
//             <Card className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-sm font-semibold text-gray-900">{lease.title}</div>
//                   <div className="text-xs text-gray-500">
//                     {(lease as { propertyAddress?: string }).propertyAddress ??
//                       (lease as { property_address?: string }).property_address ??
//                       ''}
//                   </div>
//                 </div>
//                 <button className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
//                   Send to Landlord
//                 </button>
//               </div>
//             </Card>

//             <ClausesTable
//               isLoading={SingleLeaseLoader}
//               clauses={lease.clauses}
//               filters={filters}
//               onChangeFilters={setFilters}
//               onApprove={async (c: UIClause) => {
//                 if (!clauseDocId) return;
//                 await dispatch(
//                   acceptClauseSuggestionAsync({
//                     clauseId: clauseDocId,
//                     clause_key: c.name,
//                     details: c.aiSuggestion ?? '',
//                   })
//                 ).unwrap();
//                 // optimistic update
//                 c.status = 'Approved';
//                 if (c.aiSuggestion) c.currentVersion = c.aiSuggestion;
//               }}
//               onEdit={(c: UIClause) => {
//                 setDetailsClause(mapUIClauseToExtended(c));
//                 setCommentDraft('');
//                 setDetailsOpen(true);
//               }}
//               onComment={(c: UIClause) => {
//                 setDetailsClause(mapUIClauseToExtended(c));
//                 setCommentModalOpen(true);
//               }}
//             />
//           </div>

//           <div className="lg:col-span-4 space-y-4">
//             <ManagementProgress
//               approved={lease.approvedCount ?? 0}
//               total={lease.totalCount ?? lease.clauses.length}
//               unresolved={lease.unresolvedCount ?? 0}
//             />
//             <DocumentPreviewCard onPreview={() => { /* noop */ }} />
//             <ReadyToProceed />
//             <QuickStats
//               total={lease.totalCount ?? lease.clauses.length}
//               completionRate={
//                 (lease.totalCount ?? lease.clauses.length)
//                   ? Math.round(
//                     ((lease.approvedCount ?? 0) /
//                       (lease.totalCount ?? lease.clauses.length)) *
//                     100
//                   )
//                   : 0
//               }
//               openComments={lease.clauses.filter((c) => (c.commentsUnresolved ?? 0) > 0).length}
//             />
//           </div>
//         </div>
//       )}

//       {detailsOpen && detailsClause && (
//         <ClauseDetailsModel
//           onClose={() => setDetailsOpen(false)}
//           clause={detailsClause}
//           onApprove={async () => { /* your existing approve logic */ }}
//           onReject={() => {
//             setDetailsOpen(false);
//             setDetailsClause(prev => (prev ? { ...prev, status: 'Needs Review' } : prev));
//           }}
//           onRequestReview={() => setDetailsOpen(false)}
//           onAddComment={async (text) => {
//             if (!clauseDocId || !detailsClause?.name) return;
//             const res = await dispatch(
//               commentOnClauseAsync({
//                 clauseDocId,
//                 clause_key: detailsClause.name,
//                 comment: text,
//               })
//             ).unwrap();

//             // Update modal locally so it’s instant
//             const appended = res.comment;
//             setDetailsClause(prev =>
//               prev ? { ...prev, comments: [...(prev.comments ?? []), appended] } : prev
//             );

//             // Optional: bump the row counter in the list
//             if (lease) {
//               const idx = lease.clauses.findIndex(x => x.name === detailsClause.name);
//               if (idx >= 0) {
//                 const row = lease.clauses[idx] as UIClause & { comments?: ClauseComment[] };
//                 lease.clauses[idx] = {
//                   ...row,
//                   commentsUnresolved: (row.commentsUnresolved ?? 0) + 1,
//                   comments: Array.isArray(row.comments) ? [...row.comments, appended] : [appended],
//                 };
//               }
//             }
//           }}
//         />
//       )}
//       {/* Add Comment Modal */}
//       <AddCommentModal
//         open={commentModalOpen}
//         onClose={() => setCommentModalOpen(false)}
//         clauseName={detailsClause?.name ?? 'Clause'}
//         onSubmit={async (commentText: string) => {
//           if (!clauseDocId || !detailsClause?.name) return;
//           await dispatch(
//             commentOnClauseAsync({
//               clauseDocId,
//               clause_key: detailsClause.name,
//               comment: commentText,
//             })
//           ).unwrap();

//           // optimistic bump for comment counters
//           if (lease) {
//             const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
//             if (idx >= 0) {
//               const prev = lease.clauses[idx];
//               lease.clauses[idx] = {
//                 ...prev,
//                 commentsUnresolved: (prev.commentsUnresolved ?? 0) + 1,
//               };
//             }
//           }
//         }}
//       />
//     </DashboardLayout>
//   );
// }

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

import {  extractOne, mapToUILease } from '@/utils/leasemappers';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import AddCommentModal from '@/components/models/addClauseModel';
import { commentOnClauseAsync } from '@/services/clause/asyncThunk';

function firstString(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
}

/* ---------- API history shapes (typed) ---------- */
type ClauseHistoryComment = {
  text: string;
  author?: string;
  created_at?: string;
};

type ClauseHistoryEntry = {
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

type RawLeaseWithHistory = {
  history?: Record<string, ClauseHistoryEntry>;
};

/** Map UIClause → ExtendedClause (no any) */
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
    // comments optional; ClauseDetailsModel safely handles absence
  };
}

/** Pill header chips */
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

  // ✅ compute raw lease (with history) only after currentLease exists
  const rawLease = useMemo(
    () => (currentLease ? (extractOne(currentLease) as unknown as RawLeaseWithHistory) : undefined),
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

  // (still available) separate add-comment modal
  const [commentModalOpen, setCommentModalOpen] = useState(false);

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
              /* ⛔️ removed `history` prop here – table doesn't use it */
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
                // set the clause for the modal
                setDetailsClause(mapUIClauseToExtended(c));

                // ✅ pick history for this clause name (if available)
                const entry = c.name && rawLease?.history ? rawLease.history[c.name] : undefined;
                setDetailsHistory(entry);

                setDetailsOpen(true);
              }}
              onComment={(c: UIClause) => {
                // If you still want the separate AddComment modal:
                setDetailsClause(mapUIClauseToExtended(c));
                setCommentModalOpen(true);
              }}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <ManagementProgress
              approved={lease.approvedCount ?? 0}
              total={lease.totalCount ?? lease.clauses.length}
              unresolved={lease.unresolvedCount ?? 0}
            />
            <DocumentPreviewCard onPreview={() => { /* noop */ }} />
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

      {/* Details Modal with history */}
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

            // optimistic update (modal)
            setDetailsClause((prev) =>
              prev
                ? {
                  ...prev,
                  currentVersion: prev.aiSuggestion ?? prev.currentVersion,
                  status: 'Approved',
                }
                : prev
            );

            // reflect in list as well
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
          }} onReject={() => {
            setDetailsOpen(false);
            setDetailsClause((prev) => (prev ? { ...prev, status: 'Needs Review' } : prev));
          }}
          onRequestReview={() => setDetailsOpen(false)}
          onAddComment={async (text) => {
            if (!clauseDocId || !detailsClause?.name) return undefined;

            await dispatch(
              commentOnClauseAsync({
                clauseDocId,
                clause_key: detailsClause.name,
                comment: text,
              })
            ).unwrap();

            // Try to extract the created comment from response
            // const created =
            //   (res?.data && Array.isArray(res.data.history..history.comment) && res.data.comment.slice(-1)[0]) ||
            //   (Array.isArray(res?.comment) && res.comment.slice(-1)[0]) ||
            //   (res?.comment && typeof res.comment === 'object' ? res.comment : undefined);

            // // bump counter in the list (no adding 'comments' prop to UIClause)
            // if (lease) {
            //   const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
            //   if (idx >= 0) {
            //     const prev = lease.clauses[idx];
            //     lease.clauses[idx] = {
            //       ...prev,
            //       commentsUnresolved: (prev.commentsUnresolved ?? 0) + 1,
            //     };
            //   }
            // }

            // Return a ClauseHistoryComment for the modal to append
            // return created ?? {
            //   text,
            //   author: undefined,
            //   created_at: new Date().toISOString(),
            // };
          }}
        />
      )}

      {/* Optional separate Add Comment modal (kept if you still use it elsewhere) */}
      <AddCommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        clauseName={detailsClause?.name ?? 'Clause'}
        onSubmit={async (commentText: string) => {
          if (!clauseDocId || !detailsClause?.name) return;
          await dispatch(
            commentOnClauseAsync({
              clauseDocId,
              clause_key: detailsClause.name,
              comment: commentText,
            })
          ).unwrap();

          // optimistic bump for comment counters in list
          if (lease) {
            const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
            if (idx >= 0) {
              const prev = lease.clauses[idx];
              lease.clauses[idx] = {
                ...prev,
                commentsUnresolved: (prev.commentsUnresolved ?? 0) + 1,
              };
            }
          }
        }}
      />
    </DashboardLayout>
  );
}

