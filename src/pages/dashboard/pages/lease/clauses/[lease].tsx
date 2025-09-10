// // 'use client';
// // import { useEffect, useMemo, useState } from 'react';
// // import { ArrowLeft } from 'lucide-react';
// // import { useRouter } from 'next/router';           
// // import Card from '@/components/ui/Card';
// // import Pill from '@/components/ui/Pill';
// // import ClausesTable from '@/components/clauses/ClauseTable';
// // import ManagementProgress from '@/components/clauses/Sidebar/ManagementProgress';
// // import DocumentPreviewCard from '@/components/clauses/Sidebar/DocumentPreviewCard';
// // import ReadyToProceed from '@/components/clauses/Sidebar/ReadyToProceed';
// // import QuickStats from '@/components/clauses/Sidebar/QuickStats';
// // import { DashboardLayout } from '@/components/layouts';
// // import type { UIClause, ExtendedClause } from '@/types/loi';
// // import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// // import { getLeaseDetailsById, acceptClauseSuggestionAsync } from '@/services/lease/asyncThunk';
// // import { extractOne, mapToUILease } from '@/utils/leasemappers';
// // import { LoadingOverlay } from '@/components/loaders/overlayloader';

// // import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
// // import AddCommentModal from '@/components/models/addClauseModel';
// // import { commentOnClauseAsync } from '@/services/clause/asyncThunk'; // NEW

// // function firstString(v?: string | string[]): string | undefined {
// //     if (Array.isArray(v)) return v[0];
// //     return typeof v === 'string' ? v : undefined;
// // }

// // function mapUIClauseToExtended(c: UIClause): ExtendedClause {
// //     return {
// //         id: (c as any)?.id ?? (c as any)?._id ?? undefined,
// //         name: c.name ?? (c as any)?.title ?? 'Clause',
// //         title: c.name ?? (c as any)?.title ?? 'Clause',
// //         status: (c.status as any) ?? 'pending',
// //         risk: (c.risk as any) ?? 'Low',
// //         originalText: (c as any)?.originalText ?? (c as any)?.original ?? '',
// //         aiSuggestion: c.aiSuggestion ?? '',
// //         currentVersion: c.currentVersion ?? '',
// //         lastEdited: (c as any)?.lastEdited ?? undefined,
// //         editor: (c as any)?.editor ?? undefined,
// //     };
// // }

// // export default function ClauseManagementPage() {

// //     const [commentTarget, setCommentTarget] = useState<ExtendedClause | null>(null);

// //     const router = useRouter();

// //     const q = (router.query ?? {}) as Record<string, string | string[]>;
// //     const leaseId = firstString(q.lease) || firstString(q.leaseId) || firstString(q.id);
// //     const clauseDocIdFromQuery = firstString(q.clauseDocId) 

// //     const dispatch = useAppDispatch();
// //     const { currentLease, isLoading } = useAppSelector((s) => s.lease);

// //     const SingleLeaseLoader = isLoading || currentLease === null;

// //     const lease = useMemo(() => mapToUILease(extractOne(currentLease)), [currentLease]);
// //     useEffect(() => {
// //         if (!router.isReady || !leaseId) return;
// //         void dispatch(getLeaseDetailsById(leaseId));
// //     }, [router.isReady, leaseId, dispatch]);

// //     const clauseDocId =
// //         clauseDocIdFromQuery || ((lease as any)?._clauseDocId as string | undefined) || undefined;

// //     const [filters, setFilters] = useState({ status: 'All Status', risk: 'All Risk Levels', category: 'Category' });

// //     const [detailsOpen, setDetailsOpen] = useState(false);
// //     const [detailsClause, setDetailsClause] = useState<ExtendedClause | null>(null);
// //     const [commentDraft, setCommentDraft] = useState('');

// //     const [commentModalOpen, setCommentModalOpen] = useState(false);

// //     const headerChips = [
// //         { text: 'AI analysis complete', tone: 'green' as const },
// //         { text: 'AI suggestions available', tone: 'blue' as const },
// //         { text: 'Ready for editing & approval', tone: 'yellow' as const },
// //     ];

// //     return (
// //         <DashboardLayout>
// //             <div className="p-4 bg-white shadow-sm border border-gray-200 rounded mb-4">
// //                 <div className="flex items-center justify-between">
// //                     <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
// //                         <ArrowLeft className="h-5 w-5" />
// //                         <span className="text-sm">Back to Review</span>
// //                     </button>
// //                 </div>
// //                 <div className="mt-3">
// //                     <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
// //                     <p className="text-sm text-gray-600">Edit, review, and approve lease clauses before proceeding to signature.</p>
// //                 </div>
// //                 <div className="mt-3 flex flex-wrap gap-2">
// //                     {headerChips.map((c, i) => (
// //                         <Pill key={i} tone={c.tone as any}>{c.text}</Pill>
// //                     ))}
// //                 </div>
// //             </div>

// //             {SingleLeaseLoader && <LoadingOverlay isVisible />}
// //             {!SingleLeaseLoader && !lease && <div className="py-16 text-center text-sm text-gray-500">Lease not found.</div>}

// //             {lease && (
// //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
// //                     <div className="lg:col-span-8 space-y-3">
// //                         <Card className="p-4">
// //                             <div className="flex items-center justify-between">
// //                                 <div>
// //                                     <div className="text-sm font-semibold text-gray-900">{lease.title}</div>
// //                                     <div className="text-xs text-gray-500">{lease.propertyAddress}</div>
// //                                 </div>
// //                                 <button className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
// //                                     Send to Landlord
// //                                 </button>
// //                             </div>
// //                         </Card>

// //                         <ClausesTable
// //                             isLoading={SingleLeaseLoader}
// //                             clauses={lease.clauses}
// //                             filters={filters}
// //                             onChangeFilters={setFilters}
// //                             onApprove={async (c) => {
// //                                 if (!clauseDocId) return;
// //                                 await dispatch(acceptClauseSuggestionAsync({
// //                                     clauseId: clauseDocId,
// //                                     clause_key: c.name,
// //                                     details: c.aiSuggestion ?? '',
// //                                 }));
// //                                 c.status = 'Approved'; 
// //                             }}
// //                             onEdit={(c) => {
// //                                 const ext = mapUIClauseToExtended(c);
// //                                 setDetailsClause(ext);
// //                                 setCommentDraft('');
// //                                 setDetailsOpen(true);
// //                             }}
// //                             onComment={(c) => {
// //                                 const ext = mapUIClauseToExtended(c);
// //                                 setCommentTarget(ext);
// //                                 setCommentModalOpen(true);
// //                             }} />
// //                     </div>

// //                     <div className="lg:col-span-4 space-y-4">
// //                         <ManagementProgress approved={lease.approvedCount} total={lease.totalCount} unresolved={lease.unresolvedCount} />
// //                         <DocumentPreviewCard onPreview={() => { }} />
// //                         <ReadyToProceed />
// //                         <QuickStats
// //                             total={lease.totalCount}
// //                             completionRate={lease.totalCount ? Math.round((lease.approvedCount / lease.totalCount) * 100) : 0}
// //                             openComments={lease.clauses.filter(c => (c.commentsUnresolved ?? 0) > 0).length}
// //                         />
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Clause Details Modal */}
// //             {detailsOpen && detailsClause && (
// //                 <ClauseDetailsModel
// //                     onClose={() => setDetailsOpen(false)}
// //                     clause={detailsClause}
// //                     newComment={commentDraft}
// //                     setNewComment={setCommentDraft}
// //                     handleAddComment={() => {
// //                         setCommentModalOpen(true);
// //                     }}
// //                     onApprove={async () => {
// //                         if (!clauseDocId || !detailsClause?.name) return;
// //                         await dispatch(acceptClauseSuggestionAsync({
// //                             clauseId: clauseDocId,
// //                             clause_key: detailsClause.name,
// //                             details: detailsClause.aiSuggestion ?? '',
// //                         }));

// //                         setDetailsClause(prev => prev ? {
// //                             ...prev,
// //                             currentVersion: prev.aiSuggestion ?? prev.currentVersion,
// //                             status: 'Approved' as any
// //                         } : prev);

// //                         const idx = lease?.clauses?.findIndex((x) => x.name === detailsClause.name);
// //                         if (idx !== undefined && idx! >= 0) {
// //                             (lease!.clauses[idx!] as any).currentVersion =
// //                                 detailsClause.aiSuggestion ?? (lease!.clauses[idx!] as any).currentVersion;
// //                             (lease!.clauses[idx!] as any).status = 'Approved';
// //                         }
// //                     }}
// //                     onReject={() => {
// //                         setDetailsClause(prev => prev ? { ...prev, status: 'Rejected' as any } : prev);
// //                         setDetailsOpen(false);
// //                     }}
// //                     onRequestReview={() => {
// //                         setDetailsOpen(false);
// //                     }}
// //                 />
// //             )}

// //             <AddCommentModal
// //                 open={commentModalOpen}
// //                 onClose={() => setCommentModalOpen(false)}
// //                 clauseName={detailsClause?.name ?? 'Clause'}
// //                 onSubmit={async (commentText: string) => {
// //                     if (!clauseDocId || !detailsClause?.name) return;
// //                     await dispatch(commentOnClauseAsync({
// //                         clauseDocId,
// //                         clause_key: detailsClause.name,
// //                         comment: commentText,
// //                     }));

// //                     const idx = lease?.clauses?.findIndex((x) => x.name === detailsClause.name);
// //                     if (idx !== undefined && idx! >= 0) {
// //                         const lc: any = lease!.clauses[idx!];
// //                         lc.commentsUnresolved = (lc.commentsUnresolved ?? 0) + 1;
// //                     }
// //                 }}
// //             />
// //         </DashboardLayout>
// //     );
// // }

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/router'; // pages router

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
// import {
//     getLeaseDetailsById,
//     acceptClauseSuggestionAsync,
// } from '@/services/lease/asyncThunk';

// import { extractOne, mapToUILease } from '@/utils/leasemappers';
// import { LoadingOverlay } from '@/components/loaders/overlayloader';

// import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
// import AddCommentModal from '@/components/models/addClauseModel';
// import { commentOnClauseAsync } from '@/services/clause/asyncThunk';

// function firstString(v?: string | string[]): string | undefined {
//     return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
// }

// /** Map UIClause → ExtendedClause (strict, no any) */
// function mapUIClauseToExtended(c: UIClause): ExtendedClause {
//     return {
//         id: c.id,
//         name: c.name ?? 'Clause',
//         title: c.name ?? 'Clause',
//         status: c.status as ClauseStatus,
//         risk: c.risk as RiskLevel,
//         originalText: c.currentVersion,       // use currentVersion as “original” for modal context
//         aiSuggestion: c.aiSuggestion ?? '',
//         currentVersion: c.currentVersion,
//         lastEdited: undefined,
//         editor: undefined,
//     };
// }

// /** Pill header chips (typed) */
// type HeaderChip = { text: string; tone: PillTone };
// const headerChips: HeaderChip[] = [
//     { text: 'AI analysis complete', tone: 'green' },
//     { text: 'AI suggestions available', tone: 'blue' },
//     { text: 'Ready for editing & approval', tone: 'yellow' },
// ];

// export default function ClauseManagementPage() {
//     // AddComment modal state
//     const [commentTarget, setCommentTarget] = useState<ExtendedClause | null>(null); // kept for potential use

//     const router = useRouter();
//     const q = (router.query ?? {}) as Record<string, string | string[]>;
//     const leaseId = firstString(q.lease) || firstString(q.leaseId) || firstString(q.id);
//     const clauseDocIdFromQuery = firstString(q.clauseDocId);

//     const dispatch = useAppDispatch();
//     const { currentLease, isLoading } = useAppSelector((s) => s.lease);

//     const SingleLeaseLoader = isLoading || currentLease == null;

//     // If mapToUILease returns a strong type, you can annotate:
//     // const lease = useMemo<ReturnType<typeof mapToUILease>>(
//     const lease = useMemo(
//         () => mapToUILease(extractOne(currentLease)),
//         [currentLease]
//     );

//     useEffect(() => {
//         if (!router.isReady || !leaseId) return;
//         void dispatch(getLeaseDetailsById(leaseId));
//     }, [router.isReady, leaseId, dispatch]);

//     // Prefer the typed field in UILease
//     const clauseDocId: string | undefined =
//         clauseDocIdFromQuery || undefined;

//     const [filters, setFilters] = useState({
//         status: 'All Status',
//         risk: 'All Risk Levels',
//         category: 'Category',
//     });

//     // Details modal state
//     const [detailsOpen, setDetailsOpen] = useState(false);
//     const [detailsClause, setDetailsClause] = useState<ExtendedClause | null>(null);
//     const [commentDraft, setCommentDraft] = useState('');

//     // Add Comment modal state
//     const [commentModalOpen, setCommentModalOpen] = useState(false);

//     return (
//         <DashboardLayout>
//             <div className="p-4 bg-white shadow-sm border border-gray-200 rounded mb-4">
//                 <div className="flex items-center justify-between">
//                     <button
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                         <span className="text-sm">Back to Review</span>
//                     </button>
//                 </div>

//                 <div className="mt-3">
//                     <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
//                     <p className="text-sm text-gray-600">
//                         Edit, review, and approve lease clauses before proceeding to signature.
//                     </p>
//                 </div>

//                 <div className="mt-3 flex flex-wrap gap-2">
//                     {headerChips.map((c) => (
//                         <Pill key={c.text} tone={c.tone}>{c.text}</Pill>
//                     ))}
//                 </div>
//             </div>

//             {SingleLeaseLoader && <LoadingOverlay isVisible />}
//             {!SingleLeaseLoader && !lease && (
//                 <div className="py-16 text-center text-sm text-gray-500">Lease not found.</div>
//             )}

//             {lease && (
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                     <div className="lg:col-span-8 space-y-3">
//                         <Card className="p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <div className="text-sm font-semibold text-gray-900">{lease.title}</div>
//                                     <div className="text-xs text-gray-500">
//                                         {/* Prefer whichever your mapper provides; if it’s property_address adjust accordingly */}
//                                         {(lease as { propertyAddress?: string }).propertyAddress ??
//                                             (lease as { property_address?: string }).property_address ??
//                                             ''}
//                                     </div>
//                                 </div>
//                                 <button className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
//                                     Send to Landlord
//                                 </button>
//                             </div>
//                         </Card>

//                         <ClausesTable
//                             isLoading={SingleLeaseLoader}
//                             clauses={lease.clauses}
//                             filters={filters}
//                             onChangeFilters={setFilters}
//                             onApprove={async (c: UIClause) => {
//                                 if (!clauseDocId) return;
//                                 await dispatch(
//                                     acceptClauseSuggestionAsync({
//                                         clauseId: clauseDocId,
//                                         clause_key: c.name,
//                                         details: c.aiSuggestion ?? '',
//                                     })
//                                 ).unwrap();
//                                 // optimistic update (type-safe)
//                                 c.status = 'Approved';
//                                 if (c.aiSuggestion) {
//                                     c.currentVersion = c.aiSuggestion;
//                                 }
//                             }}
//                             onEdit={(c: UIClause) => {
//                                 setDetailsClause(mapUIClauseToExtended(c));
//                                 setCommentDraft('');
//                                 setDetailsOpen(true);
//                             }}
//                             onComment={(c: UIClause) => {
//                                 setCommentTarget(mapUIClauseToExtended(c));
//                                 setCommentModalOpen(true);
//                             }}
//                         />
//                     </div>

//                     <div className="lg:col-span-4 space-y-4">
//                         <ManagementProgress
//                             approved={lease.approvedCount ?? 0}
//                             total={lease.totalCount ?? lease.clauses.length}
//                             unresolved={lease.unresolvedCount ?? 0}
//                         />
//                         <DocumentPreviewCard onPreview={() => { /* noop */ }} />
//                         <ReadyToProceed />
//                         <QuickStats
//                             total={lease.totalCount ?? lease.clauses.length}
//                             completionRate={
//                                 (lease.totalCount ?? lease.clauses.length)
//                                     ? Math.round(((lease.approvedCount ?? 0) / (lease.totalCount ?? lease.clauses.length)) * 100)
//                                     : 0
//                             }
//                             openComments={lease.clauses.filter(c => (c.commentsUnresolved ?? 0) > 0).length}
//                         />
//                     </div>

//                 </div>
//             )}

//             {/* Clause Details Modal */}
//             {detailsOpen && detailsClause && (
//                 <ClauseDetailsModel
//                     onClose={() => setDetailsOpen(false)}
//                     clause={detailsClause}
//                     newComment={commentDraft}
//                     setNewComment={setCommentDraft}
//                     handleAddComment={() => setCommentModalOpen(true)}
//                     onApprove={async () => {
//                         if (!clauseDocId || !detailsClause?.name) return;
//                         await dispatch(
//                             acceptClauseSuggestionAsync({
//                                 clauseId: clauseDocId,
//                                 clause_key: detailsClause.name,
//                                 details: detailsClause.aiSuggestion ?? '',
//                             })
//                         ).unwrap();

//                         // optimistic update (modal)
//                         setDetailsClause((prev) =>
//                             prev
//                                 ? {
//                                     ...prev,
//                                     currentVersion: prev.aiSuggestion ?? prev.currentVersion,
//                                     status: 'Approved',
//                                 }
//                                 : prev
//                         );

//                         // if you also want to reflect in the list (avoid `any`)
//                         if (lease) {
//                             const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
//                             if (idx >= 0) {
//                                 lease.clauses[idx] = {
//                                     ...lease.clauses[idx],
//                                     currentVersion:
//                                         detailsClause.aiSuggestion ?? lease.clauses[idx].currentVersion,
//                                     status: 'Approved',
//                                 };
//                             }
//                         }
//                     }}
//                     onReject={() => {
//                         // Not in ClauseStatus union: use 'Needs Review'
//                         setDetailsOpen(false);
//                         setDetailsClause((prev) =>
//                             prev ? { ...prev, status: 'Needs Review' } : prev
//                         );
//                     }}
//                     onRequestReview={() => {
//                         setDetailsOpen(false);
//                     }}
//                 />
//             )}

//             {/* Add Comment Modal */}
//             <AddCommentModal
//                 open={commentModalOpen}
//                 onClose={() => setCommentModalOpen(false)}
//                 clauseName={detailsClause?.name ?? 'Clause'}
//                 onSubmit={async (commentText: string) => {
//                     if (!clauseDocId || !detailsClause?.name) return;
//                     await dispatch(
//                         commentOnClauseAsync({
//                             clauseDocId,
//                             clause_key: detailsClause.name,
//                             comment: commentText,
//                         })
//                     ).unwrap();

//                     // optional optimistic bump for comment counters (type-safe)
//                     if (lease) {
//                         const idx = lease.clauses.findIndex((x) => x.name === detailsClause.name);
//                         if (idx >= 0) {
//                             const prev = lease.clauses[idx];
//                             lease.clauses[idx] = {
//                                 ...prev,
//                                 commentsUnresolved: (prev.commentsUnresolved ?? 0) + 1,
//                             };
//                         }
//                     }
//                 }}
//             />
//         </DashboardLayout>
//     );
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

import { extractOne, mapToUILease } from '@/utils/leasemappers';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import AddCommentModal from '@/components/models/addClauseModel';
import { commentOnClauseAsync } from '@/services/clause/asyncThunk';

function firstString(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
}

/** Map UIClause → ExtendedClause (strict, no any) */
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

/** Pill header chips (typed) */
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
  const [commentDraft, setCommentDraft] = useState('');

  // Add Comment modal state
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
                setCommentDraft('');
                setDetailsOpen(true);
              }}
              onComment={(c: UIClause) => {
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

      {/* Clause Details Modal */}
      {detailsOpen && detailsClause && (
        <ClauseDetailsModel
          onClose={() => setDetailsOpen(false)}
          clause={detailsClause}
          newComment={commentDraft}
          setNewComment={setCommentDraft}
          handleAddComment={() => setCommentModalOpen(true)}
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
          }}
          onReject={() => {
            setDetailsOpen(false);
            setDetailsClause((prev) => (prev ? { ...prev, status: 'Needs Review' } : prev));
          }}
          onRequestReview={() => {
            setDetailsOpen(false);
          }}
        />
      )}

      {/* Add Comment Modal */}
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

          // optimistic bump for comment counters
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
