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

import { mapApiLeaseToUI, type UILeaseForPage } from '@/utils/leasemappers';

import { LoadingOverlay } from '@/components/loaders/overlayloader';

import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import { commentOnClauseAsync } from '@/services/clause/asyncThunk';
import { DocumentPreviewModal } from '@/components/models/documentPreviewModel';

function firstString(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
}

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
  _id?: string;
  submit_status?: string;
  file_url?: string | { pdf_url?: string };
  template_data?: {
    header?: {
      landlord_name?: string;
      landlord_email?: string;
      landlord_address_line1?: string;
      landlord_address_line2?: string;
      tenant_name?: string;
      tenant_email?: string;
      tenant_address_line1?: string;
      tenant_address_line2?: string;
      tenant_trade_name?: string;
      shopping_center?: string;
    };
    premises?: {
      description?: string;
      square_footage?: string;
      suite_number?: string;
      shopping_center_name?: string;
      street_address?: string;
      city_state_zip?: string;
    };
    lease_terms?: {
      base_rent_monthly?: string;
      rent_calculation_text?: string;
      term_months?: string;
      term_display?: string;
      percentage_rent?: string;
      tenant_pro_rata_share?: string;
      initial_monthly_cam?: string;
      initial_monthly_tax_insurance?: string;
      operating_hours?: string;
      rent_commencement_date?: string;
      termination_date?: string;
      security_deposit?: string;
      permitted_use?: string;
      late_fee_percentage?: string;
      late_fee_grace_days?: string;
    };
    clauses?: {
      data?: {
        [category: string]: {
          [key: string]: string;
        };
      };
    };
  };
  BASIC_INFORMATION?: {
    party_posture?: string;
    lease_type?: string;
    title?: string;
    landlord_legal_name?: string;
    tenant_legal_name?: string;
  };
  PREMISES_PROPERTY_DETAILS?: unknown;
  TERM_TIMING_TRIGGERS?: {
    initial_term_years?: number;
    delivery_condition?: string;
    commencement_trigger?: string;
    commencement_date_certain?: string;
  };
  RENT_ECONOMICS?: {
    security_deposit?: number;
    prepaid_rent?: number;
    rent_type?: string;
    monthly_rent?: number | null;
    percentage_lease_percent?: number;
  };
  OPERATIONS_MAINTENANCE?: unknown;
  RIGHTS_OPTIONS_CONDITIONS?: unknown;
  // NOTE: for this payload there is no rich per-clause history object;
  // keep this optional hook for future compatibility.
  clauses?: Record<string, ClauseHistoryEntry>;
  created_at?: string;
  updated_at?: string;
};

/** Map UIClause → ExtendedClause for the details modal */
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

  // Raw lease from store (single-lease payload)
  const rawLease = useMemo<RawLeaseWithClauses | undefined>(
    () => (currentLease ?? undefined) as RawLeaseWithClauses | undefined,
    [currentLease]
  );

  // UI-friendly lease object
  const lease = useMemo<UILeaseForPage | null>(() => mapApiLeaseToUI(rawLease as any), [rawLease]);

  const SingleLeaseLoader = isLoading || rawLease == null;

  useEffect(() => {
    if (!router.isReady || !leaseId) return;
    void dispatch(getLeaseDetailsById(leaseId));
  }, [router.isReady, leaseId, dispatch]);

  // Use lease id as clauseDocId (or query override)
  const clauseDocId: string | undefined = clauseDocIdFromQuery || lease?.id;

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

  // Buckets for preview modal
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
          risk: c.risk,
        };

        const s = (c.status || '').toLowerCase();
        if (s.includes('approve')) approvedBucket.push(item);
        else if (s.includes('reject')) rejectedBucket.push(item);
        else pendingBucket.push(item);
      });
    }

    return { approvedBucket, pendingBucket, rejectedBucket };
  }, [lease]);

  // PDF URL
  const pdfUrl = lease?.pdfUrl;

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

          {lease && (
            <Pill tone={lease.submitStatus === 'Submitted' ? 'green' : 'yellow'}>
              {lease.submitStatus}
            </Pill>
          )}
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

      {SingleLeaseLoader && <LoadingOverlay visible />}
      {!SingleLeaseLoader && !lease && (
        <div className="py-16 text-center text-sm text-gray-500">Lease not found.</div>
      )}

      {lease && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900">
                    {lease.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {lease.propertyAddress || 'No address provided'}
                  </div>
                </div>
                <button className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  Send to Landlord
                </button>
              </div>

              {/* Lease Summary Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500">Lease Type</div>
                  <div className="text-sm font-medium text-gray-900">{lease.leaseType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Square Footage</div>
                  <div className="text-sm font-medium text-gray-900">
                    {lease.squareFootage ? `${lease.squareFootage} SF` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Term</div>
                  <div className="text-sm font-medium text-gray-900">{lease.termDisplay ?? 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Commencement</div>
                  <div className="text-sm font-medium text-gray-900">
                    {lease.commencementDate
                      ? new Date(lease.commencementDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Party Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 mt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500">Landlord</div>
                  <div className="text-sm font-medium text-gray-900">{lease.landlordName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tenant</div>
                  <div className="text-sm font-medium text-gray-900">{lease.tenantName}</div>
                </div>
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
                    clause_key: c.name, // "<category> #<n>"
                    details: c.aiSuggestion ?? c.currentVersion ?? '',
                  })
                ).unwrap();
                c.status = 'Approved';
                if (c.aiSuggestion) c.currentVersion = c.aiSuggestion;
              }}
              onEdit={(c: UIClause) => {
                setDetailsClause(mapUIClauseToExtended(c));
                // No detailed history available in current payload; keep undefined
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
                setDetailsOpen(true);
              }}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <ManagementProgress
              approved={lease.approvedCount}
              total={lease.totalCount}
              unresolved={lease.unresolvedCount}
            />
            <DocumentPreviewCard onPreview={() => setPreviewOpen(true)} />
            <ReadyToProceed />
            <QuickStats
              total={lease.totalCount}
              completionRate={
                lease.totalCount
                  ? Math.round((lease.approvedCount / lease.totalCount) * 100)
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
          downloadUrl={pdfUrl}
        />
      )}

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
                details: detailsClause.aiSuggestion ?? detailsClause.currentVersion ?? '',
              })
            ).unwrap();

            setDetailsClause((prev) =>
              prev
                ? {
                    ...prev,
                    currentVersion: prev.aiSuggestion ?? prev.currentVersion,
                    status: 'Approved',
                  }
                : prev
            );
          }}
          onReject={() => {
            setDetailsOpen(false);
            setDetailsClause((prev) => (prev ? { ...prev, status: 'Needs Review' } : prev));
          }}
          onAddComment={async (text) => {
            if (!clauseDocId || !detailsClause?.name || !leaseId) return;

            const res = await dispatch(
              commentOnClauseAsync({
                clauseDocId,
                clause_key: detailsClause.name,
                comment: text,
              })
            ).unwrap();

            await dispatch(getLeaseDetailsById(leaseId));
            setDetailsOpen(false);

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
