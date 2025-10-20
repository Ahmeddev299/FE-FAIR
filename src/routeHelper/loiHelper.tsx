/* eslint-disable @typescript-eslint/no-explicit-any */

// routeHelpers/loiRoute.ts
export type LoiItem = {
  id?: string; _id?: string;
  Clauses?: unknown; clauses?: unknown;
  Clauses_id?: string; clauses_id?: string;
};

const normalizeClauses = (row: LoiItem) => {
  const id = row._id ?? row.id ?? "";
  const clausesId = String(row.Clauses_id ?? row.clauses_id ?? "").trim();

  let raw: any = row.Clauses ?? row.clauses;
  if (typeof raw === "string") { try { raw = JSON.parse(raw); } catch {} }

  const isObj = raw && typeof raw === "object" && !Array.isArray(raw);
  const obj = isObj ? (raw as Record<string, any>) : null;

  const hasObjContent =
    !!obj &&
    Object.keys(obj).length > 0 &&
    Object.values(obj).some(v => {
      if (v == null) return false;
      if (typeof v === "string") return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return true;
    });

  const hasClauses = clausesId.length > 0 || hasObjContent;
  return { id, hasClauses, clausesId, objKeys: obj ? Object.keys(obj) : [] };
};

export const getLoiRoute = (row: LoiItem) => {
  const n = normalizeClauses(row);

  // TEMP: debug to confirm both rows evaluate identical
  console.log("[LOI route debug]", {
    id: n.id,
    Clauses_id: n.clausesId,
    clausesObjKeys: n.objKeys,
    hasClauses: n.hasClauses,
  });

  if (!n.id) return null;
  return n.hasClauses
    ? `/dashboard/pages/loi/view/${n.id}`
    : `/landlordDashboard/view/${n.id}`;
};
