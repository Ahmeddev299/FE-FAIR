/* eslint-disable @typescript-eslint/no-explicit-any */


// hooks/useSectionClauses.ts
import {  useMemo, useEffect } from "react";
import { NextRouter } from "next/router";
import { getLeaseDetailsById } from "@/services/lease/asyncThunk";
import { parseClausesData } from "@/components/dashboard/lease/utils/viewleaseSectionHelpers/clauseParser";

export const useSectionClauses = (
  router: NextRouter,
  dispatch: any,
  currentLease: any
) => {
  const leaseId = router.query.id;
  const sectionType = router.query.sectionType;

  const id = useMemo(() => {
    const raw = leaseId;
    const s = Array.isArray(raw) ? raw[0] : raw || "";
    return s.trim().replace(/[{}]/g, "");
  }, [leaseId]);

  const section = useMemo(() => {
    const raw = sectionType;
    const decoded = Array.isArray(raw) ? raw[0] : raw || "";
    return decodeURIComponent(decoded);
  }, [sectionType]);

  useEffect(() => {
    if (!router.isReady || !id) return;
    if (currentLease?._id === id || currentLease?.id === id) return;
    dispatch(getLeaseDetailsById(id));
  }, [dispatch, router.isReady, id, currentLease?._id, currentLease?.id]);

  const clausesData = useMemo(() => {
    return parseClausesData(currentLease);
  }, [currentLease]);

  const displayClauses = useMemo(() => {
    if (clausesData.categories[section]) {
      return clausesData.categories[section];
    }

    const matchedKey = clausesData.allCategories.find(
      key => key.toLowerCase() === section.toLowerCase()
    );

    return matchedKey ? clausesData.categories[matchedKey] : [];
  }, [clausesData, section]);

  const title = section || 'Lease Clauses';

  return { id, section, clausesData, displayClauses, title };
};