// src/hooks/useLoiDashboard.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFormikContext, type FormikContextType } from "formik";
import { useAppDispatch, useAppSelector } from "./hooks";
import { FormValues } from "@/types/loi";
import {
  getDraftLOIsAsync,
  submitLOIByFileAsync,
  submitLOIByFileAsyncNoId, // ⬅️ add this import
} from "@/services/loi/asyncThunk";
import { getloiDataAsync } from "@/services/dashboard/asyncThunk";

export function useLoiDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loiList, isLoading } = useAppSelector((s) => s.loi);
  const { myLOIs } = useAppSelector((s) => s.dashboard);

  const formik = useFormikContext<FormValues>() as FormikContextType<FormValues> | null;
  const setFieldValue = formik?.setFieldValue ?? (() => {});
  const values = (formik?.values ?? {}) as Partial<FormValues> | null;

  useEffect(() => { dispatch(getDraftLOIsAsync()); }, [dispatch]);
  useEffect(() => { dispatch(getloiDataAsync()); }, [dispatch]);

  const goCreate   = () => router.push("/dashboard/pages/createform");
  const openDetail = (id?: string) => id && router.push(`/dashboard/pages/loi/view/${id}`);
  const onSelectLoi = (id: string) => setFieldValue("leaseId", id);

  const submitFile = async (
    file: File,
    leaseId: string | undefined,
    setProgress: (n: number) => void
  ) => {
    setProgress(10);
    try {
      const trimmed = (leaseId ?? "").trim();

      // 👇 Branching logic:
      const res = trimmed
        ? await dispatch(submitLOIByFileAsync({ file, leaseId: trimmed })).unwrap()
        : await dispatch(submitLOIByFileAsyncNoId({ file })).unwrap();

      setProgress(100);
      if (res?.id) router.push(`/dashboard/pages/loi/view/${res.id}`);
    } finally {
      // no-op
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
