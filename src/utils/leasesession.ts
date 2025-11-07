// utils/loiSession.ts
export const LEASE_SESSION_KEY = "lease_id";

export const getLeaseIdFromSession = (): string | null => {
  if (typeof window === "undefined") return null;
  try { return sessionStorage.getItem(LEASE_SESSION_KEY); } catch { return null; }
};

export const setLeaseIdInSession = (id: string) => {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(LEASE_SESSION_KEY, id); } catch {}
};

export const clearLeaseIdInSession = () => {
  if (typeof window === "undefined") return;
  try { sessionStorage.removeItem(LEASE_SESSION_KEY); } catch {}
};
