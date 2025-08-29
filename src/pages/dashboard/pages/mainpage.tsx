import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { getDashboardStatsAsync } from '@/services/dashboard/asyncThunk';
import { clearErrors } from '@/redux/slices/dashboardSlice';
import { LoadingOverlay } from '@/components/loaders/overlayloader';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LOITable } from '@/components/dashboard/LOITable';
import { LeaseTable } from '@/components/dashboard/LeaseTable';
import { QuickActions } from '@/components/dashboard/QuickActions';

function MainPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { myLeases, myLOIs, isLoading, isLoadingLOIs, isLoadingLeases, loiError, leaseError } =
        useAppSelector((state) => state.dashboard);

    // helper at the top (inside the component file, outside JSX)
    const toErrorMessage = (err: unknown): string | null =>
        err == null ? null : typeof err === 'string' ? err : String(err);


    useEffect(() => {
        dispatch(getDashboardStatsAsync());
    }, [dispatch]);

    const handleStartNewLOI = () => {
        console.log("running");
        router.push('/dashboard/pages/createform');
    };

    const uploadLeaseNewLOI = () => {
        router.push('/dashboard/pages/uploadLeaseform');
    };

    const terminateLease = () => {
        router.push('/dashboard/pages/terminateLease');
    };

    return (
        <DashboardLayout>
            {isLoading ? (
                <LoadingOverlay isVisible />
            ) : (
                <div className="flex-1 overflow-auto">
                    <DashboardHeader userName="John" />

                    <div className="p-4 sm:p-6 lg:p-0 mt-4">
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                            <div className="xl:col-span-3 space-y-6">
                                <LOITable
                                    lois={myLOIs}
                                    isLoading={isLoading || isLoadingLOIs}
                                    error={toErrorMessage(loiError)}
                                    onViewAll={() => router.push(`/dashboard/pages/loi/view`)}

                                    onAddNew={handleStartNewLOI}
                                    onClearError={() => dispatch(clearErrors())}
                                />
                                <LeaseTable
                                    leases={myLeases}
                                    isLoading={isLoading || isLoadingLeases}
                                    error={toErrorMessage(leaseError)}
                                    onViewAll={() => router.push("/dashboard/pages/lease/view")}
                                    onAddNew={uploadLeaseNewLOI}
                                    onClearError={() => dispatch(clearErrors())}
                                />
                            </div>

                            <div className="xl:col-span-1 space-y-10">
                                <QuickActions
                                    onStartNewLOI={handleStartNewLOI}
                                    onUploadLease={uploadLeaseNewLOI}
                                    onTerminateLease={terminateLease}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default MainPage;