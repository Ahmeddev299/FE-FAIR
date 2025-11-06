'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DashboardLayout } from '@/components/layouts';
import LeasesTable from '@/components/Leases/leaseTable';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { selectLease } from '@/redux/slices/leaseSlice';
import { getallUserLeasesAsync } from '@/services/lease/asyncThunk';

import type { UILeaseBrief } from '@/types/loi';
import { ApiLeaseItem, ApiLeaseListResponse, mapLeaseListToUI, type UILeaseBriefRow } from "@/utils/mappers/leases";

export default function LeasesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { leaseList, isLoading } = useAppSelector(selectLease);
  const showLoader = isLoading || leaseList === null;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    void dispatch(getallUserLeasesAsync({ page, limit }));
  }, [dispatch, page, limit]);


  const apiItems: ApiLeaseItem[] = useMemo(() => {
    if (!leaseList) return [];
    if (Array.isArray(leaseList)) return leaseList as ApiLeaseItem[];
    if ('leases' in leaseList) return (leaseList as ApiLeaseListResponse).leases;
    if ('data' in leaseList) return (leaseList as { data: ApiLeaseItem[] }).data ?? [];
    return [];
  }, [leaseList]);

  const leases: UILeaseBriefRow[] = useMemo(
    () => mapLeaseListToUI(apiItems),
    [apiItems]
  );

  const total = (leaseList as any)?.pagination?.total_items ?? leases.length;
  const totalPages =
    (leaseList as any)?.pagination?.total_pages ??
    Math.max(1, Math.ceil(total / limit));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <DashboardLayout>
      {isLoading && <LoadingOverlay visible />}

      <div className="p-4 bg-white shadow-sm border border-gray-200 rounded mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Review</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
              <span className="text-blue-600 font-semibold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-base font-medium text-gray-900">Leases</h1>
              <p className="text-xs text-gray-500">
                Edit, review, and approve lease clauses before proceeding to signature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <LeasesTable
        leases={leases}
        isLoading={showLoader}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onRowClick={(id) => {
          const row = leases.find(l => l.id === id) as UILeaseBrief & { _clauseDocId?: string };
          const clauseDocId = row?._clauseDocId;
          router.push(`/dashboard/pages/lease/view/${id}${clauseDocId ? `?clauseDocId=${clauseDocId}` : ""}`);
        }}
      />
    </DashboardLayout>
  );
}