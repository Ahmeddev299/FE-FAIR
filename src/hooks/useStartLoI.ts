// src/hooks/useLoiDashboard.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFormikContext, type FormikContextType } from "formik";
import { useAppDispatch, useAppSelector } from "./hooks";
import { FormValues } from "@/types/loi";
import { getDraftLOIsAsync, submitLOIByFileAsync } from "@/services/loi/asyncThunk";
import { getloiDataAsync } from "@/services/dashboard/asyncThunk";

export function useLoiDashboard() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loiList, isLoading } = useAppSelector((s) => s.loi);
    const { myLOIs } = useAppSelector((s) => s.dashboard);
    console.log("myLi", myLOIs)

    const formik = useFormikContext<FormValues>() as FormikContextType<FormValues> | null;
    const setFieldValue =
        formik?.setFieldValue ?? ((/* _field: string, _val: unknown */) => { });
    const values = (formik?.values ?? {}) as Partial<FormValues> | null;

    useEffect(() => {
        dispatch(getDraftLOIsAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getloiDataAsync());
    }, [dispatch]);

    const goCreate = () => router.push("/dashboard/pages/createform");
    const openDetail = (id?: string) => id && router.push(`/dashboard/pages/loi/view/${id}`);
    const onSelectLoi = (id: string) => setFieldValue("leaseId", id);

    const submitFile = async (file: File,
        leaseId: string | undefined
        , setProgress: (n: number) => void) => {
        setProgress(10);
        try {

            const res = await dispatch(submitLOIByFileAsync({ file, leaseId })).unwrap();
            setProgress(100);

            if (res.id) router.push(`/dashboard/pages/loi/view/${res.id}`);
        } finally {
        }
    };

    return {
        router,
        loiList,
        isLoading,
        myLOIs,
        values,
        goCreate,
        openDetail,
        onSelectLoi,
        submitFile,
    };
}
