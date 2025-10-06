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

  // const leases: UILeaseBriefRow[] = useMemo(() => {
  //   const data = leaseList?.data ?? null; 
  //   return mapLeaseListToUI({ data } as any);
  // }, [leaseList]);

  const leases: UILeaseBriefRow[] = useMemo(
    () => mapLeaseListToUI(leaseList as unknown as { data: ApiLeaseItem[] } | ApiLeaseListResponse | ApiLeaseItem[]),
    [leaseList]
  );

  const total = leaseList?.meta?.total ?? leases.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

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
          {/* Left: Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Review</span>
          </button>

          {/* Middle: Icon + Title + Subtitle */}
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

          {/* Right: Search input */}
          <div className="relative w-1/2">
            {/* <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            {/* <input
              type="text"
              placeholder="Search documents by title, clause or keyword..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            /> */}
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
          router.push(`/dashboard/pages/lease/clauses/${id}${clauseDocId ? `?clauseDocId=${clauseDocId}` : ""}`);
        }}
      />
    </DashboardLayout>
  );
}