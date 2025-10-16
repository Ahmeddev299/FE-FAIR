// utils/loiSession.ts
export const LOI_SESSION_KEY = "loi_id";

export const getLoiIdFromSession = (): string | null => {
  if (typeof window === "undefined") return null;
  try { return sessionStorage.getItem(LOI_SESSION_KEY); } catch { return null; }
};

export const setLoiIdInSession = (id: string) => {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(LOI_SESSION_KEY, id); } catch {}
};

export const clearLoiIdInSession = () => {
  if (typeof window === "undefined") return;
  try { sessionStorage.removeItem(LOI_SESSION_KEY); } catch {}
};
