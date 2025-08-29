// src/pages/dashboard/pages/clauseManagement.tsx
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ChevronDown } from 'lucide-react';

import { DashboardLayout } from '@/components/layouts';
import { DocumentPreviewModal } from '@/components/models/documentPreviewModel';
import ClauseDetailsModel from '@/components/models/clauseDetailsModel';

import ClauseTable from '@/components/clauses/ClauseTable';
import ManagementProgress from '@/components/clauses/ManagementProgress';
import ClauseSidebar from '@/components/clauses/ClauseSideBar';

import type { Clause, ClauseStatus, Lease, RiskLevel } from '@/types/loi';
import { selectLease } from '@/redux/slices/leaseSlice';

// thunks
import { getallUserLeasesAsync } from '@/services/lease/asyncThunk';
import { updateClauseAsync } from '@/services/clause/asyncThunk';

// ⭐️ use your store types so dispatch/select are typed (adjust the path if your store file differs)
import type { RootState, AppDispatch } from '@/redux/store'

type StatusFilter = 'All Status' | ClauseStatus;
type RiskFilter = 'All Risk Levels' | RiskLevel;

// Local helper type to read an optional `unresolved` flag without `any`
type ClauseMaybeUnresolved = Clause & { unresolved?: boolean };

export default function ClauseManagement() {
  const dispatch = useDispatch<AppDispatch>();

  // pagination (static for now; wire to UI if you add controls)
  const [page] = useState(1);
  const [limit] = useState(5);

  // redux state (only pick what's used)
  const { leaseList } = useSelector((state: RootState) => selectLease(state));

  // local UI state
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All Status');
  const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('All Risk Levels');
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showClauseDetail, setShowClauseDetail] = useState(false);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [newComment, setNewComment] = useState('');

  // initial fetch
  useEffect(() => {
    dispatch(getallUserLeasesAsync({ page, limit }));
  }, [dispatch, page, limit]);

  // select the first lease when list updates
  useEffect(() => {
    if (leaseList && leaseList.length > 0) {
      setSelectedLease(leaseList[0] as Lease);
    } else {
      setSelectedLease(null);
    }
  }, [leaseList]);

  // filtered clauses
  const clauses = useMemo<Clause[]>(() => {
    const list = selectedLease?.clauses ?? [];
    return list.filter((c) => {
      const statusOk = selectedStatus === 'All Status' || c.status === selectedStatus;
      const riskOk = selectedRisk === 'All Risk Levels' || c.risk === selectedRisk;
      return statusOk && riskOk;
    });
  }, [selectedLease, selectedStatus, selectedRisk]);

  // progress numbers
  const approvedCount =
    selectedLease?.approvedCount ??
    (selectedLease?.clauses.filter((c) => c.status === 'Approved').length || 0);

  const totalCount = selectedLease?.totalCount ?? (selectedLease?.clauses.length || 0);

  const unresolvedCount =
    selectedLease?.unresolvedCount ??
    (((selectedLease?.clauses as ClauseMaybeUnresolved[] | undefined)?.filter(
      (c) => c.unresolved === true
    ).length) || 0);

  // optimistic helper (local update of selectedLease only)
  const optimisticallySetClauseStatus = useCallback(
    (clauseId: Clause['id'], status: ClauseStatus) => {
      setSelectedLease((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clauses: prev.clauses.map((c) => (c.id === clauseId ? { ...c, status } : c)),
        };
      });
    },
    []
  );

  const onApprove = async (clause: Clause) => {
    if (!selectedLease) return;
    optimisticallySetClauseStatus(clause.id, 'Approved');

    await dispatch(
      updateClauseAsync({
        leaseId: String(selectedLease.id),
        clauseId: String(clause.id),
        action: 'approve',
      })
    );

    dispatch(getallUserLeasesAsync({ page, limit }));
  };

  const onAcceptAI = async (clause: Clause) => {
    if (!selectedLease) return;
    optimisticallySetClauseStatus(clause.id, 'Approved');

    await dispatch(
      updateClauseAsync({
        leaseId: String(selectedLease.id),
        clauseId: String(clause.id),
        action: 'approve',
      })
    );

    dispatch(getallUserLeasesAsync({ page, limit }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // wire your comment API here if available
    setNewComment('');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
        <span className="text-sm text-gray-600">Back to Review</span>
      </div>

      {/* Lease card header */}
      <div className="p-4 bg-white shadow-sm border border-gray-200 rounded">
        <div className="flex items-center gap-3">
          <div className="text-white rounded-lg p-2">
            <Image alt="clause" src="/clause.png" height={50} width={50} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
            <p className="text-sm text-gray-600">
              {selectedLease?.title}
              {selectedLease?.property_address ? ` · ${selectedLease?.property_address}` : ''}
            </p>
          </div>
        </div>

        <div className="flex bg-[#EFF6FF] p-4 rounded items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">AI analysis complete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">AI suggestions available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm text-gray-600">Ready for editing & approval</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mt-4 mx-auto">
        <div className="hidden xl:block mb-6">
          <ManagementProgress approved={approvedCount} total={totalCount} unresolved={unresolvedCount} />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <h2 className="text-lg font-medium text-gray-900">Lease Clauses ({clauses.length})</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                      <select
                        className="appearance-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
                      >
                        <option>All Status</option>
                        <option value="Edited">Edited</option>
                        <option value="Suggested">AI Suggested</option>
                        <option value="Approved">Approved</option>
                        <option value="Review">Needs Review</option>
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <select
                        className="appearance-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedRisk}
                        onChange={(e) => setSelectedRisk(e.target.value as RiskFilter)}
                      >
                        <option>All Risk Levels</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <ClauseTable
              clauses={clauses}
              onViewDetails={(clause) => {
                setSelectedClause(clause);
                setShowClauseDetail(true);
              }}
              onApprove={onApprove}
              onAcceptAI={onAcceptAI}
            />
          </div>

          {/* Sidebar */}
          <ClauseSidebar
            approved={approvedCount}
            total={totalCount}
            unresolved={unresolvedCount}
            onPreview={() => setShowDocumentPreview(true)}
          />
        </div>
      </div>

      {showDocumentPreview && (
        <DocumentPreviewModal
          onClose={() => setShowDocumentPreview(false)}
          approved={(selectedLease?.clauses ?? []).filter((c) => c.status === 'Approved')}
          pending={(selectedLease?.clauses ?? []).filter(
            (c) => c.status !== 'Approved' && c.status !== 'Review'
          )}
          rejected={(selectedLease?.clauses ?? []).filter((c) => c.status === 'Review')}
        />
      )}

      {showClauseDetail && selectedClause && (
        <ClauseDetailsModel
          handleAddComment={handleAddComment}
          newComment={newComment}
          setNewComment={setNewComment}
          onClose={() => setShowClauseDetail(false)}
          clause={selectedClause}
        />
      )}
    </DashboardLayout>
  );
}
